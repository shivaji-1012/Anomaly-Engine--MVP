import React, { useState } from 'react';
import {
  InvestigationStage,
  ActivityLogEvent,
  FinalDiscoveryReport
} from '../services/investigationPipeline';
import { Caselet } from '../types/caselet';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  Terminal,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileSearch,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';

interface LiveInvestigationViewProps {
  stages: InvestigationStage[];
  logs: ActivityLogEvent[];
  currentStageIndex: number;
  isInvestigating: boolean;
  finalReport: FinalDiscoveryReport | null;
  onViewFinalReport: () => void;
  selectedCaselet?: Caselet;
}

export const LiveInvestigationView: React.FC<LiveInvestigationViewProps> = ({
  stages,
  logs,
  currentStageIndex,
  isInvestigating,
  finalReport,
  onViewFinalReport,
  selectedCaselet
}) => {
  const [selectedStageKey, setSelectedStageKey] = useState<string>(
    stages[currentStageIndex]?.key || stages[0]?.key || 'stage-company-analysis'
  );

  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  const activeStage = stages.find((s) => s.key === selectedStageKey) || stages[currentStageIndex] || stages[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Progress Bar and Current Status */}
      <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                12-Stage Investigation Controller
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                isInvestigating
                  ? 'bg-amber-950 text-amber-300 border border-amber-600/50 animate-pulse'
                  : completedCount === 12
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {isInvestigating ? 'INVESTIGATION IN PROGRESS' : completedCount === 12 ? 'ALL STAGES COMPLETE' : 'READY'}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white mt-1">
              {stages[currentStageIndex]?.name || 'Investigation State'}
            </h3>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-mono text-slate-400">Progress</div>
              <div className="text-sm font-bold text-white font-mono">{progressPercent}% ({completedCount}/12)</div>
            </div>
            {finalReport && (
              <button
                onClick={onViewFinalReport}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-900/40 transition-all cursor-pointer"
              >
                <span>Inspect Final Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Stepper (Left) & Active Stage Detail / Activity Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 12-Stage Stepper */}
        <div className="lg:col-span-5 bg-[#0b1324] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Investigation Pipeline</h4>
            <span className="text-[11px] text-slate-400">Click any stage to inspect</span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {stages.map((stg, idx) => {
              const isSelected = stg.key === selectedStageKey;
              const isCurrent = idx === currentStageIndex && isInvestigating;

              return (
                <div
                  key={stg.key}
                  onClick={() => setSelectedStageKey(stg.key)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                      : isCurrent
                      ? 'bg-amber-950/20 border-amber-500/60'
                      : stg.status === 'completed'
                      ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/50'
                      : 'bg-slate-900/20 border-slate-800/40 text-slate-500'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {stg.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : stg.status === 'running' ? (
                      <Activity className="w-4 h-4 text-amber-400 animate-spin" />
                    ) : stg.status === 'failed' ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-mono text-slate-400">
                        {stg.id}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                        {stg.id}. {stg.name}
                      </span>
                      {stg.status === 'completed' && (
                        <span className="text-[10px] text-emerald-400 font-mono">Done</span>
                      )}
                      {stg.status === 'running' && (
                        <span className="text-[10px] text-amber-400 font-mono animate-pulse">Running</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{stg.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Stage Inspector & Live Activity Terminal */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Stage Inspector Card */}
          <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div>
                <span className="text-[11px] font-mono text-blue-400 font-bold uppercase">
                  Stage {activeStage.id} of 12
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{activeStage.name}</h3>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                activeStage.status === 'completed'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : activeStage.status === 'running'
                  ? 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {activeStage.status.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">{activeStage.description}</p>

            {/* Findings Summary Pill */}
            {activeStage.findingsSummary && (
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/50 mb-4 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider font-mono">Stage Outcome</div>
                  <div className="text-xs text-slate-200 mt-0.5">{activeStage.findingsSummary}</div>
                </div>
              </div>
            )}

            {/* Completed Actions List */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Executed Operations ({activeStage.completedActions.length})
              </div>
              {activeStage.completedActions.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                  {activeStage.status === 'running' ? 'Executing research steps...' : 'Stage pending execution in pipeline.'}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {activeStage.completedActions.map((action, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start space-x-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* If this is the Caselet Retrieval Stage, show caselet breakdown */}
            {activeStage.key === 'stage-caselet-retrieval' && selectedCaselet && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Selected Analytical Playbook: {selectedCaselet.title}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 text-xs">
                  <div className="font-bold text-white mb-1">Business Problem:</div>
                  <p className="text-slate-300 leading-relaxed">{selectedCaselet.businessProblem}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>ID: <code className="text-blue-300">{selectedCaselet.id}</code></span>
                    <span>{selectedCaselet.triggerConditions.length} Triggers • {selectedCaselet.calculationProcedures.length} Procedures</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Activity Event Log Terminal */}
          <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Live Activity Event Log</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{logs.length} events recorded</span>
            </div>

            <div className="bg-[#050912] rounded-lg p-3 font-mono text-[11px] max-h-56 overflow-y-auto space-y-1.5 border border-slate-900">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic">No activity events recorded yet. Click 'Start Investigation' to initiate pipeline.</div>
              ) : (
                logs.map((log) => {
                  const colorClass =
                    log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'success'
                      ? 'text-emerald-400'
                      : log.level === 'action'
                      ? 'text-blue-400'
                      : 'text-slate-300';

                  return (
                    <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className="text-slate-500 uppercase shrink-0 text-[10px]">[{log.stageKey.replace('stage-', '')}]</span>
                      <span className={colorClass}>{log.message}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
