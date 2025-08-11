import { Code, X } from "lucide-react";
import { useProjectStore } from "../../../store/project/project";

export default function CodeEditor({
  projectId,
  setShowCodeEditor,
}: {
  projectId?: string;
  setShowCodeEditor: (show: boolean) => void;
}) {
  const projects = Array(
    useProjectStore.getState().getProjectById(projectId || "")
  );
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Code Snippets Library
          </h3>
          <button
            onClick={() => setShowCodeEditor(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Code Snippets List */}
          {(projects?.flatMap((project) => project?.codeSnippets).length ?? 0) >
          0 ? (
            projects?.flatMap((project) =>
              project?.codeSnippets?.map((snippet) => (
                <div
                  key={snippet.title}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">
                      {snippet.title}
                    </h4>
                    <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs">
                      {snippet.language}
                    </span>
                  </div>

                  <p className="text-blue-200 text-sm mb-3">
                    {"No description provided."}
                  </p>

                  <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                      {snippet.code}
                    </pre>
                  </div>

                  {snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {snippet.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )
          ) : (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">
                No Code Snippets Yet
              </h4>
              <p className="text-blue-200 mb-6">
                Start adding code snippets to your projects to build your
                library.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
