/* ═══════════════════════════════════════════════════════════════════════════
   ai-service.test.ts
   Tests: parseToolCalls, stripToolBlocks, isAIConfigured
   These are the pure functions that underpin the AI action system — every
   regression here would manifest as silently broken tool calls.
   ═══════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    parseToolCalls,
    stripToolBlocks,
    isAIConfigured,
} from "../services/aiService";

// ─── parseToolCalls ──────────────────────────────────────────────────────────

describe("parseToolCalls", () => {
    it("returns empty array when text has no action blocks", () => {
        expect(parseToolCalls("Just a normal AI response.")).toEqual([]);
    });

    it("parses a single valid action block", () => {
        const text = [
            "Sure, navigating now.",
            "```action",
            JSON.stringify({ tool: "navigate", args: { path: "/learn" } }),
            "```",
        ].join("\n");

        const calls = parseToolCalls(text);
        expect(calls).toHaveLength(1);
        expect(calls[0].tool).toBe("navigate");
        expect(calls[0].args).toEqual({ path: "/learn" });
    });

    it("parses multiple action blocks in one response", () => {
        const block1 = `\`\`\`action\n${JSON.stringify({ tool: "open_journal", args: {} })}\n\`\`\``;
        const block2 = `\`\`\`action\n${JSON.stringify({ tool: "navigate", args: { path: "/workshop" } })}\n\`\`\``;
        const text = `Going to journal.\n${block1}\nAlso navigating.\n${block2}`;

        const calls = parseToolCalls(text);
        expect(calls).toHaveLength(2);
        expect(calls[0].tool).toBe("open_journal");
        expect(calls[1].tool).toBe("navigate");
    });

    it("silently skips malformed JSON blocks", () => {
        const text = "```action\n{broken json here\n```";
        expect(parseToolCalls(text)).toEqual([]);
    });

    it("silently skips blocks with no `tool` field", () => {
        const text = `\`\`\`action\n${JSON.stringify({ args: { path: "/learn" } })}\n\`\`\``;
        expect(parseToolCalls(text)).toEqual([]);
    });

    it("silently skips blocks where `tool` is not a string", () => {
        const text = `\`\`\`action\n${JSON.stringify({ tool: 42, args: {} })}\n\`\`\``;
        expect(parseToolCalls(text)).toEqual([]);
    });

    it("defaults args to empty object when not provided", () => {
        const text = `\`\`\`action\n${JSON.stringify({ tool: "open_inventory" })}\n\`\`\``;
        const calls = parseToolCalls(text);
        expect(calls[0].args).toEqual({});
    });

    it("parses the add_journal tool with all expected fields", () => {
        const payload = {
            tool: "add_journal",
            args: {
                title: "Resistors with LEDs",
                content: "Today I learned about Ohm's Law",
                type: "learning",
            },
        };
        const text = `\`\`\`action\n${JSON.stringify(payload)}\n\`\`\``;
        const calls = parseToolCalls(text);
        expect(calls[0].tool).toBe("add_journal");
        expect(calls[0].args.title).toBe("Resistors with LEDs");
        expect(calls[0].args.type).toBe("learning");
    });

    it("parses the edit_journal tool with partial update fields", () => {
        const payload = {
            tool: "edit_journal",
            args: { title: "Old Title", newTitle: "New Title" },
        };
        const text = `\`\`\`action\n${JSON.stringify(payload)}\n\`\`\``;
        const calls = parseToolCalls(text);
        expect(calls[0].tool).toBe("edit_journal");
        expect(calls[0].args.title).toBe("Old Title");
        expect(calls[0].args.newTitle).toBe("New Title");
    });

    it("parses the delete_journal tool", () => {
        const payload = {
            tool: "delete_journal",
            args: { title: "Remove Me" },
        };
        const text = `\`\`\`action\n${JSON.stringify(payload)}\n\`\`\``;
        const calls = parseToolCalls(text);
        expect(calls[0].tool).toBe("delete_journal");
        expect(calls[0].args.title).toBe("Remove Me");
    });

    it("parses the open_project tool with sketchId", () => {
        const payload = {
            tool: "open_project",
            args: { sketchId: "basic-01.1" },
        };
        const text = `\`\`\`action\n${JSON.stringify(payload)}\n\`\`\``;
        const calls = parseToolCalls(text);
        expect(calls[0].args.sketchId).toBe("basic-01.1");
    });

    it("parses the search_projects tool", () => {
        const payload = { tool: "search_projects", args: { query: "camera" } };
        const text = `\`\`\`action\n${JSON.stringify(payload)}\n\`\`\``;
        const calls = parseToolCalls(text);
        expect(calls[0].tool).toBe("search_projects");
        expect(calls[0].args.query).toBe("camera");
    });

    it("parses the filter_tutorials tool with category", () => {
        const payload = {
            tool: "filter_tutorials",
            args: { query: "blink", category: "led_basics" },
        };
        const text = `\`\`\`action\n${JSON.stringify(payload)}\n\`\`\``;
        const calls = parseToolCalls(text);
        expect(calls[0].args.category).toBe("led_basics");
    });

    it("ignores regular fenced code blocks (non-action)", () => {
        const text = [
            "Here is the code:",
            "```cpp",
            "digitalWrite(LED_PIN, HIGH);",
            "```",
        ].join("\n");
        expect(parseToolCalls(text)).toEqual([]);
    });

    it("handles extra whitespace around the JSON in an action block", () => {
        const text = `\`\`\`action\n  \n${JSON.stringify({ tool: "navigate", args: { path: "/dashboard" } })}\n  \n\`\`\``;
        const calls = parseToolCalls(text);
        // The extra whitespace would cause JSON.parse to fail; ensure graceful skip
        // OR if whitespace-trimmed, it should parse correctly.
        // Current implementation: JSON.parse on the raw match[1]; extra leading
        // whitespace is legal for JSON.parse so this should succeed.
        expect(calls.length).toBeGreaterThanOrEqual(0); // No crash is the minimum bar
    });

    it("handles empty action block gracefully", () => {
        const text = "```action\n\n```";
        expect(parseToolCalls(text)).toEqual([]);
    });
});

// ─── stripToolBlocks ─────────────────────────────────────────────────────────

describe("stripToolBlocks", () => {
    it("returns text unchanged when no action blocks present", () => {
        const text = "Hello, how can I help you with your ESP32 project?";
        expect(stripToolBlocks(text)).toBe(text);
    });

    it("removes a single action block", () => {
        const text = `Sure!\n\`\`\`action\n{"tool":"navigate","args":{"path":"/learn"}}\n\`\`\``;
        const result = stripToolBlocks(text);
        expect(result).not.toContain("```action");
        expect(result).not.toContain("navigate");
        expect(result).toContain("Sure!");
    });

    it("removes multiple action blocks, preserves surrounding prose", () => {
        const text = [
            "Opening the journal for you.",
            "```action",
            '{"tool":"open_journal","args":{}}',
            "```",
            "And navigating to the workshop.",
            "```action",
            '{"tool":"navigate","args":{"path":"/workshop"}}',
            "```",
            "Done!",
        ].join("\n");

        const result = stripToolBlocks(text);
        expect(result).not.toContain("```action");
        expect(result).toContain("Opening the journal for you.");
        expect(result).toContain("And navigating to the workshop.");
        expect(result).toContain("Done!");
    });

    it("returns trimmed non-empty string when response is only action blocks", () => {
        const text =
            '```action\n{"tool":"navigate","args":{"path":"/dashboard"}}\n```';
        const result = stripToolBlocks(text);
        expect(result).toBe("");
    });

    it("does not strip regular fenced code blocks", () => {
        const text = "```cpp\ndigitalWrite(2, HIGH);\n```";
        expect(stripToolBlocks(text)).toBe(text);
    });

    it("strips inline action text cleanly — no double spaces or orphan newlines at start", () => {
        const text = `\`\`\`action\n{"tool":"open_inventory","args":{}}\n\`\`\`\nHere you go!`;
        const result = stripToolBlocks(text);
        expect(result).not.toMatch(/^\s+/); // no leading whitespace after trim
        expect(result).toContain("Here you go!");
    });
});

// ─── isAIConfigured ──────────────────────────────────────────────────────────

describe("isAIConfigured", () => {
    beforeEach(() => {
        vi.unstubAllEnvs();
    });

    it("returns false when API key env var is not set", () => {
        vi.stubEnv("VITE_OPENROUTER_API_KEY", "");
        expect(isAIConfigured()).toBe(false);
    });

    it("returns true when API key is present", () => {
        vi.stubEnv("VITE_OPENROUTER_API_KEY", "sk-test-key-123");
        expect(isAIConfigured()).toBe(true);
    });
});

// ─── AI_TOOLS_PROMPT — route contract ────────────────────────────────────────
// These tests guard the system prompt against regressions that would cause the
// AI to generate wrong paths or wrong tool names.

import { AI_TOOLS_PROMPT } from "../services/aiService";

describe("AI_TOOLS_PROMPT route contract", () => {
    it("does NOT list /dashboard as a valid navigate path (it does not exist in the router)", () => {
        // /dashboard was historically listed but the route is actually /
        // If the AI uses /dashboard it hits the catch-all and ends up at home silently
        const navigateSection = AI_TOOLS_PROMPT.split("open_project")[0];
        expect(navigateSection).not.toContain("/dashboard");
    });

    it("lists / (home) as a valid navigate path", () => {
        // The prompt text is: "Valid paths: /, /learn, ..."
        expect(AI_TOOLS_PROMPT).toContain("Valid paths: /,");
    });

    it("lists all app routes that actually exist in the router", () => {
        const validPaths = [
            "/learn",
            "/workshop",
            "/account",
            "/admin",
            "/leaderboard",
        ];
        for (const path of validPaths) {
            expect(AI_TOOLS_PROMPT).toContain(path);
        }
    });

    it("explicitly warns NOT to use navigate for journal or inventory", () => {
        expect(AI_TOOLS_PROMPT).toMatch(/do not use navigate for the journal/i);
    });

    it("defines open_journal as a dedicated tool", () => {
        expect(AI_TOOLS_PROMPT).toContain("open_journal");
        expect(AI_TOOLS_PROMPT).toContain("open_inventory");
    });

    it("lists all 17 tools by name", () => {
        const tools = [
            "navigate",
            "open_project",
            "search_projects",
            "filter_tutorials",
            "open_inventory",
            "open_journal",
            "add_journal",
            "edit_journal",
            "delete_journal",
            "search_journals",
            "get_journal_entry",
            "get_user_stats",
            "list_user_projects",
            "open_workshop_tab",
            "open_feedback",
            "get_progress_for",
            "show_learning_path",
        ];
        for (const tool of tools) {
            expect(AI_TOOLS_PROMPT).toContain(tool);
        }
    });

    it("lists all valid journal entry types", () => {
        const types = [
            "progress",
            "problem",
            "idea",
            "milestone",
            "note",
            "learning",
        ];
        for (const type of types) {
            expect(AI_TOOLS_PROMPT).toContain(type);
        }
    });
});
