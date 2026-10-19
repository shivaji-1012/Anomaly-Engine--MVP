import React from 'react';
import { FinalDiscoveryReport } from '../services/investigationPipeline';
import { X, Sparkles, Terminal, GitBranch, Cpu, Clock, CheckCircle } from 'lucide-react';

interface InvestigationTraceModalProps {
  report: FinalDiscoveryReport;
  onClose: () => void;
}

export const InvestigationTraceModal: React.FC<InvestigationTraceModalProps> = ({
  report,
  onClose
}) => {
  const trace = report.investigationTrace;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0a1120] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-900/50 border border-indigo-700/60 text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">Investigation Process & Provenance Trace</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  AUDIT LOG
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent trace exposing research questions, playbook traversal, tool actions, and hypothesis decisions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trace Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Analytical Playbook</span>
            <span className="font-bold text-white mt-0.5 block">{trace.caseletUsed.title}</span>
            <span className="text-[10px] text-blue-400 font-mono">Score: {trace.caseletUsed.score}/100</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Deterministic Calculations</span>
            <span className="font-bold text-white mt-0.5 block">{trace.calculationTraceCount} Mathematical Routines</span>
            <span className="text-[10px] text-emerald-400 font-mono">Verified Zero-LLM Arithmetic</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Audit Timestamp</span>
            <span className="font-mono text-white mt-0.5 block truncate">{trace.timestamp}</span>
            <span className="text-[10px] text-slate-400 font-mono">SEBI LODR Perimeter</span>
          </div>
        </div>

        {/* Diagnostic Question Tree Traversal */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-blue-400" />
            <span>Diagnostic Question Tree Traversal</span>
          </h4>
          <div className="space-y-2 text-xs">
            {trace.questionTreePath.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Node {step.nodeId}: {step.question}</span>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-900">
                    Step {idx + 1}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 pt-1">
                  <span className="text-slate-500 font-mono">Decision:</span> {step.answerDecision}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Actions Executed */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autonomous Tool Actions Executed</span>
          </h4>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 font-mono text-[11px] space-y-1.5 text-slate-300">
            {trace.toolActionsRun.map((action, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="text-emerald-400">❯</span>
                <span className="text-blue-300">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Angles Considered */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Alternative Angles Evaluated</span>
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {trace.alternativeAnglesConsidered.map((angle, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                • {angle}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
          >
            Close Audit Trace
          </button>
        </div>
      </div>
    </div>
  );
};
