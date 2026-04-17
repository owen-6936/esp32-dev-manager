import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    resetKey?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    lastResetKey?: string;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    // Reset when the parent passes a new resetKey (e.g. route change)
    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
        if (props.resetKey !== undefined && props.resetKey !== state.lastResetKey) {
            return { hasError: false, error: null, lastResetKey: props.resetKey };
        }
        return null;
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex min-h-[60vh] items-center justify-center p-8">
                    <div className="glass-card max-w-lg rounded-2xl p-8 text-center">
                        <div className="mb-4 text-4xl">⚠️</div>
                        <h2 className="mb-2 text-xl font-semibold text-white">
                            Something went wrong
                        </h2>
                        <p className="mb-6 text-sm text-white/60">
                            {this.state.error?.message ?? "An unexpected error occurred."}
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="glass-badge cursor-pointer rounded-lg px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
