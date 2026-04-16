/* ═══════════════════════════════════════════════════════════════════════════════
   AI Service — OpenRouter API integration for ESP32 dev assistant
   ═══════════════════════════════════════════════════════════════════════════════ */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free models in priority order (OpenRouter fallback routing)
// Use `models` array only — do NOT add a `model` field alongside it
export const AI_MODELS = [
    "qwen/qwen3-14b:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "openai/gpt-oss-120b:free",
] as const;

function getApiKey(): string | null {
    return import.meta.env.VITE_OPENROUTER_API_KEY ?? null;
}

export function isAIConfigured(): boolean {
    return !!getApiKey();
}

export interface AIMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface AIStreamCallbacks {
    onToken: (token: string) => void;
    onReasoning?: (token: string) => void;
    onDone: () => void;
    onError: (error: string) => void;
}

const SYSTEM_PROMPT_BASE = `You are an ESP32-S3 development assistant built into an embedded systems project manager. You help with:
- ESP32-S3 programming (Arduino C++ and MicroPython)
- Circuit design and pin configurations
- Component selection and wiring
- Debugging embedded systems issues
- Explaining Freenove tutorial projects
- Suggesting project ideas based on available components
- Navigating the app and taking actions on behalf of the user

Keep responses concise and practical. Use code blocks for code snippets. When suggesting pin connections, use a table format.`;

function getSystemPrompt(): string {
    return SYSTEM_PROMPT_BASE + AI_TOOLS_PROMPT;
}

// ─── Streaming chat completion ───────────────────────────────────────────────

export interface AIStreamOptions {
    toolsEnabled?: boolean;
}

export async function streamChat(
    messages: AIMessage[],
    callbacks: AIStreamCallbacks,
    signal?: AbortSignal,
    options?: AIStreamOptions,
): Promise<void> {
    const apiKey = getApiKey();
    if (!apiKey) {
        callbacks.onError(
            "OpenRouter API key not configured. Add VITE_OPENROUTER_API_KEY to .env",
        );
        return;
    }

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "ESP32 Dev Manager",
            },
            body: JSON.stringify({
                models: [...AI_MODELS],
                route: "fallback",
                messages: [
                    {
                        role: "system",
                        content:
                            options?.toolsEnabled === false
                                ? SYSTEM_PROMPT_BASE
                                : getSystemPrompt(),
                    },
                    ...messages,
                ],
                stream: true,
                max_tokens: 8192,
            }),
            signal,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            callbacks.onError(`API error ${response.status}: ${errorBody}`);
            return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            callbacks.onError("No response stream available");
            return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data: ")) continue;
                const data = trimmed.slice(6);
                if (data === "[DONE]") continue;

                try {
                    const parsed = JSON.parse(data);
                    const choice = parsed.choices?.[0]?.delta;
                    if (choice?.content) callbacks.onToken(choice.content);
                    if (choice?.reasoning && callbacks.onReasoning) {
                        callbacks.onReasoning(choice.reasoning);
                    }
                } catch {
                    // Skip malformed JSON chunks
                }
            }
        }

        callbacks.onDone();
    } catch (err) {
        if (signal?.aborted) return;
        callbacks.onError(err instanceof Error ? err.message : "Unknown error");
    }
}

// ─── One-shot completion (non-streaming) ─────────────────────────────────────

export async function chatCompletion(messages: AIMessage[]): Promise<string> {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("OpenRouter API key not configured");

    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "ESP32 Dev Manager",
        },
        body: JSON.stringify({
            models: [...AI_MODELS],
            route: "fallback",
            messages: [
                { role: "system", content: getSystemPrompt() },
                ...messages,
            ],
            max_tokens: 8192,
        }),
    });

    if (!response.ok) {
        throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
}

// ─── Quick prompts ───────────────────────────────────────────────────────────

export const AI_QUICK_PROMPTS = [
    {
        label: "Project Idea",
        prompt: "Suggest a creative ESP32-S3 project idea with components needed, difficulty level, and estimated time.",
    },
    {
        label: "Explain Code",
        prompt: "I'm going to paste some Arduino/MicroPython code. Please explain what it does step by step.",
    },
    {
        label: "Debug Help",
        prompt: "Help me debug an ESP32-S3 issue. I'll describe the problem.",
    },
    {
        label: "Pin Config",
        prompt: "Help me figure out the best pin configuration for my ESP32-S3 project. I'll describe what peripherals I'm using.",
    },
    {
        label: "Component Guide",
        prompt: "Recommend components I should get for my ESP32-S3 development kit.",
    },
];

// ─── AI Action Tools ─────────────────────────────────────────────────────────
// These define actions the AI can request. The frontend processes them.

export interface AIToolCall {
    tool: string;
    args: Record<string, unknown>;
}

/** Parse structured tool calls from AI response text.
 *  The AI prefixes actions with a fenced block: ```action\n{...}\n```
 */
export function parseToolCalls(text: string): AIToolCall[] {
    const calls: AIToolCall[] = [];
    const regex = /```action\s*\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        try {
            const parsed = JSON.parse(match[1]);
            if (parsed.tool && typeof parsed.tool === "string") {
                calls.push({ tool: parsed.tool, args: parsed.args ?? {} });
            }
        } catch {
            // Malformed action block — skip
        }
    }
    return calls;
}

/** Tool descriptions appended to the system prompt so the AI knows what actions are available */
export const AI_TOOLS_PROMPT = `

You can perform actions in the app by including an action block in your response:

\`\`\`action
{"tool": "navigate", "args": {"path": "/learn"}}
\`\`\`

Available tools:
1. **navigate** — Navigate to a top-level page. Args: \`{"path": "/learn"}\`
   Valid paths: /, /learn, /workshop, /account, /admin, /leaderboard
   NOTE: Do NOT use navigate for the journal or inventory — use open_journal / open_inventory instead.
2. **open_project** — Open a tutorial project detail page. Args: \`{"sketchId": "basic-01.1"}\`
   The sketchId is the kit-prefixed ID, e.g. "basic-01.1", "ultimate-05.1".
3. **search_projects** — Navigate to the tutorials page with a search query pre-filled. Args: \`{"query": "camera"}\`
4. **filter_tutorials** — Navigate to tutorials filtered by category or kit tier. Args: \`{"query": "LED", "category": "led_basics"}\`
   Categories: led_basics, audio, serial_communication, analog_sensors, touch_sensing, displays, motors_actuators, environmental_sensors, motion_detection, bluetooth, wifi_networking, camera
5. **open_inventory** — Open the workshop components/inventory tab. No args needed.
6. **open_journal** — Open the workshop journal tab. No args needed.
7. **add_journal** — Create a journal entry. Args: \`{"title": "My Entry", "content": "Today I learned...", "type": "note"}\`
   Types: progress, problem, idea, milestone, note, learning
8. **edit_journal** — Edit an existing journal entry by its exact title. Args: \`{"title": "existing title", "newTitle": "...", "newContent": "...", "newType": "..."}\`
   All fields except \`title\` (to find the entry) are optional.
9. **delete_journal** — Delete a journal entry by its exact title. Args: \`{"title": "entry title"}\`
10. **search_journals** — Search the user's journal entries and return a summary list. Args: \`{"query": "LED", "type": "problem"}\`
    Both fields are optional but at least one should be provided. Searches titles, content, and tags.
11. **get_journal_entry** — Retrieve the full content of a specific journal entry by title. Args: \`{"title": "entry title"}\`
12. **get_user_stats** — Return a summary of the user's progress, XP, and level. No args needed.
13. **list_user_projects** — List the user's tracked projects. No args needed.
14. **open_workshop_tab** — Open the workshop to a specific tab. Args: \`{"tab": "projects"}\`
    Tabs: projects, components, journal, analytics, pins
15. **open_feedback** — Open the feedback / bug report form. No args needed.
16. **get_progress_for** — Get progress status for a specific tutorial. Args: \`{"sketchId": "basic-01.1"}\`
17. **show_learning_path** — Navigate to the learning roadmap. No args needed.

When the user asks you to do something actionable (e.g. "take me to the camera project", "open my inventory", "search for LED projects", "add a journal entry", "show my stats"), include the appropriate action block along with your text response. Do NOT use action blocks for informational responses.`;

/** Strip action blocks from the displayed text so users see clean messages */
export function stripToolBlocks(text: string): string {
    return text.replace(/```action\s*\n[\s\S]*?```\s*/g, "").trim();
}
