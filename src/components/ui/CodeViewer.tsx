import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check, FileCode } from "lucide-react";
import { cn } from "../../utils/utils";

interface CodeViewerProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    maxHeight?: string;
    className?: string;
}

export default function CodeViewer({
    code,
    language = "cpp",
    title,
    showLineNumbers = true,
    maxHeight = "500px",
    className,
}: CodeViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("rounded-2xl overflow-hidden border border-white/8", className)}>
            {/* Header */}
            {title && (
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/8">
                    <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white/80">{title}</span>
                        <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-md ml-2">
                            {language}
                        </span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 transition-all cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-green-400" />
                                <span className="text-green-400">Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Code */}
            <Highlight
                theme={themes.nightOwl}
                code={code.trim()}
                language={language}
            >
                {({ className: hlClassName, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={cn(hlClassName, "bg-black/40! m-0! p-4 overflow-auto")}
                        style={{ ...style, maxHeight, background: "transparent" }}
                    >
                        {tokens.map((line, i) => {
                            const lineProps = getLineProps({ line });
                            return (
                                <div key={i} {...lineProps} className={cn(lineProps.className, "table-row")}>
                                    {showLineNumbers && (
                                        <span className="table-cell text-right pr-4 select-none opacity-30 text-xs w-8">
                                            {i + 1}
                                        </span>
                                    )}
                                    <span className="table-cell text-sm font-mono">
                                        {line.map((token, key) => (
                                            <span key={key} {...getTokenProps({ token })} />
                                        ))}
                                    </span>
                                </div>
                            );
                        })}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}
