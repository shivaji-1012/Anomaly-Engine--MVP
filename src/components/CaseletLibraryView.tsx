import React, { useState } from 'react';
import { CASELET_LIBRARY } from '../data/caselets';
import { Caselet, DiagnosticTreeNode } from '../types/caselet';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  GitBranch,
  Calculator,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

export const CaseletLibraryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseletId, setSelectedCaseletId] = useState<string>(CASELET_LIBRARY[0].id);
  const [activeTab, setActiveTab] = useState<'problem' | 'tree' | 'triggers' | 'calculations' | 'counter' | 'falsification'>('tree');
  const [selectedTreeNodeId, setSelectedTreeNodeId] = useState<string | null>(null);

  const filteredCaselets = CASELET_LIBRARY.filter((c) => {
    return (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const currentCaselet = CASELET_LIBRARY.find((c) => c.id === selectedCaseletId) || CASELET_LIBRARY[0];
  const treeNodes = currentCaselet.diagnosticQuestionTree.nodes;
  const rootNode = treeNodes[currentCaselet.diagnosticQuestionTree.rootNodeId];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-extrabold text-white">Adaptive Analytical Caselet Library</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              8 Standard Playbooks
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            The core investigative engine of ANOMALY ENGINE. These reusable playbooks guide what to investigate, which diagnostic questions to ask, what evidence to extract, which deterministic calculations to perform, and how to rigorously test falsification conditions.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search playbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Grid: Left Caselet List & Right Caselet Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 8 Caselet Cards */}
        <div className="lg:col-span-4 space-y-2 max-h-[720px] overflow-y-auto pr-1">
          {filteredCaselets.map((caselet, idx) => {
            const isSelected = caselet.id === currentCaselet.id;
            return (
              <div
                key={caselet.id}
                onClick={() => {
                  setSelectedCaseletId(caselet.id);
                  setSelectedTreeNodeId(null);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 shadow-md'
                    : 'bg-[#0b1324] border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900">
                    {caselet.id}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                </div>

                <h4 className={`text-xs font-bold mt-1.5 line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {caselet.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{caselet.businessProblem}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span>{caselet.triggerConditions.length} Triggers</span>
                  <span>{Object.keys(caselet.diagnosticQuestionTree.nodes).length} Tree Nodes</span>
                  <span>{caselet.calculationProcedures.length} Formulas</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Caselet Inspector */}
        <div className="lg:col-span-8 bg-[#0b1324] border border-slate-800 rounded-xl p-5 space-y-5">
          {/* Header of selected caselet */}
          <div className="pb-4 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{currentCaselet.id}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{currentCaselet.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentCaselet.sectorApplicability.map((sec) => (
                  <span key={sec} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-slate-800/80">
              {[
                { id: 'tree', label: 'Diagnostic Question Tree', icon: GitBranch },
                { id: 'problem', label: 'Problem & Limitations', icon: FileText },
                { id: 'triggers', label: 'Trigger Conditions', icon: AlertTriangle },
                { id: 'calculations', label: 'Deterministic Calculations', icon: Calculator },
                { id: 'counter', label: 'Alternative Hypotheses & Checks', icon: ShieldAlert },
                { id: 'falsification', label: 'Falsification Rules', icon: CheckCircle2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: DIAGNOSTIC QUESTION TREE */}
          {activeTab === 'tree' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Branching Decision Graph</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click any decision node to inspect its evaluation logic, evidence requirements, and branching directives.
                  </p>
                </div>
              </div>

              {/* Interactive Node Tree Cards */}
              <div className="space-y-3">
                {Object.values(treeNodes).map((node, i) => {
                  const isRoot = node.id === currentCaselet.diagnosticQuestionTree.rootNodeId;
                  const isNodeSelected = selectedTreeNodeId === node.id || (!selectedTreeNodeId && isRoot);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedTreeNodeId(node.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isNodeSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                          : 'bg-slate-900/40 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                            {node.id}
                          </span>
                          {isRoot && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                              ROOT ENTRY
                            </span>
                          )}
                          {node.terminalHypothesisId && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                              TERMINAL HYPOTHESIS: {node.terminalHypothesisId}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs font-bold text-white mt-2">
                        {node.question}
                      </div>

                      {isNodeSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="p-2 rounded bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-500 font-mono uppercase block">Evaluation Logic</span>
                              <span className="text-slate-300">{node.evaluationLogic}</span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-500 font-mono uppercase block">Evidence Check</span>
                              <span className="text-slate-300">{node.evidenceCheck}</span>
                            </div>
                          </div>

                          <div className="p-2 rounded bg-blue-950/30 border border-blue-900/40">
                            <span className="text-[10px] text-blue-400 font-mono uppercase block">Action Directive</span>
                            <span className="text-blue-200">{node.actionDirective}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                            {node.yesBranchNodeId && (
                              <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                [YES] → {node.yesBranchNodeId}
                              </span>
                            )}
                            {node.noBranchNodeId && (
                              <span className="text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                                [NO] → {node.noBranchNodeId}
                              </span>
                            )}
                            {node.divergentBranchNodeId && (
                              <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                                [DIVERGENT] → {node.divergentBranchNodeId}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROBLEM & LIMITATIONS */}
          {activeTab === 'problem' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Business Problem</h4>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 leading-relaxed">
                  {currentCaselet.businessProblem}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Sector Applicability & Prerequisites</h4>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="font-semibold text-white">Applicable Sectors: {currentCaselet.sectorApplicability.join(', ')}</div>
                  <div className="text-slate-400">
                    <span className="font-medium text-slate-300">Prerequisites:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      {currentCaselet.prerequisites.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Playbook Limitations</h4>
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200 space-y-1">
                  {currentCaselet.limitations.map((lim, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{lim}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRIGGER CONDITIONS */}
          {activeTab === 'triggers' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Trigger Thresholds ({currentCaselet.triggerConditions.length})
              </h4>
              {currentCaselet.triggerConditions.map((trig) => (
                <div key={trig.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-400 font-bold">{trig.id}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      Severity Weight: {trig.severityWeight}/10
                    </span>
                  </div>
                  <div className="text-white font-semibold">{trig.conditionDescription}</div>
                  <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>Threshold: <code className="text-slate-200 font-mono">{trig.thresholdText}</code></span>
                    <span>Requirement: <code className="text-slate-200 font-mono">{trig.periodRequirement}</code></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: DETERMINISTIC CALCULATIONS */}
          {activeTab === 'calculations' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Deterministic Calculation Procedures ({currentCaselet.calculationProcedures.length})
              </h4>
              {currentCaselet.calculationProcedures.map((proc) => (
                <div key={proc.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{proc.procedureName}</span>
                    <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                      {proc.id}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300">
                    Formula: {proc.formula}
                  </div>

                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">Calculation Steps:</span>
                    <div className="space-y-1 text-slate-400">
                      {proc.deterministicSteps.map((step, i) => (
                        <div key={i} className="flex items-start space-x-1.5">
                          <span className="text-blue-400 shrink-0 font-mono">{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-300">Missing Data Protocol:</span> {proc.missingDataHandling}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: ALTERNATIVE HYPOTHESES & COUNTER CHECKS */}
          {activeTab === 'counter' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Alternative Hypotheses
                </h4>
                <div className="space-y-2">
                  {currentCaselet.alternativeHypotheses.map((hyp) => (
                    <div key={hyp.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{hyp.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{hyp.id}</span>
                      </div>
                      <p className="text-slate-300">{hyp.businessMechanism}</p>
                      <div className="pt-1.5 text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-medium">To Confirm:</span> {hyp.evidenceRequiredToConfirm.join('; ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Counterevidence Checks (Adversarial Tests)
                </h4>
                <div className="space-y-2">
                  {currentCaselet.counterevidenceChecks.map((chk) => (
                    <div key={chk.id} className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-200">{chk.checkTitle}</span>
                        <span className="font-mono text-[10px] text-indigo-400">{chk.id}</span>
                      </div>
                      <p className="text-slate-200 font-medium">{chk.adversarialQuestion}</p>
                      <p className="text-slate-400 text-[11px]"><span className="text-slate-300 font-semibold">Benign Explanation:</span> {chk.benignExplanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FALSIFICATION RULES */}
          {activeTab === 'falsification' && (
            <div className="space-y-3 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Falsification Conditions (Future Reassessment Criteria)
              </h4>
              {currentCaselet.falsificationConditions.map((fals) => (
                <div key={fals.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{fals.observableMetricOrEvent}</span>
                    <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">{fals.id}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Measurable Threshold</span>
                    <span className="text-emerald-300 font-mono">{fals.thresholdOrCriterion}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400">Observation Window:</span> <span className="text-slate-200 font-mono">{fals.observationWindow}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Action upon Falsification:</span> <span className="text-slate-200">{fals.reassessmentConsequence}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
