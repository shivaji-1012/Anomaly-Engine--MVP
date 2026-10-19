import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { LiveInvestigationView } from './components/LiveInvestigationView';
import { CaseletLibraryView } from './components/CaseletLibraryView';
import { EvidenceExplorerView } from './components/EvidenceExplorerView';
import { FinalDiscoveryView } from './components/FinalDiscoveryView';
import { InvestigationTraceModal } from './components/InvestigationTraceModal';
import { NIFTY_COMPANIES, Company } from './data/companies';
import { CASELET_LIBRARY } from './data/caselets';
import {
  InvestigationStage,
  ActivityLogEvent,
  FinalDiscoveryReport,
  STAGES_CONFIG,
  runInvestigationPipeline
} from './services/investigationPipeline';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  // Default to Fictional Company X to demonstrate Section 8 Demo Mode out of the box
  const [selectedCompany, setSelectedCompany] = useState<Company>(NIFTY_COMPANIES[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(NIFTY_COMPANIES[0].reportingPeriods[0]);
  const [selectedAngleId, setSelectedAngleId] = useState<string>('auto');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);

  // 12 Pipeline stages state
  const [stages, setStages] = useState<InvestigationStage[]>(() =>
    STAGES_CONFIG.map((cfg) => ({
      ...cfg,
      status: 'pending',
      completedActions: []
    }))
  );
  const [logs, setLogs] = useState<ActivityLogEvent[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [finalReport, setFinalReport] = useState<FinalDiscoveryReport | null>(null);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState<boolean>(false);

  // Handle start investigation
  const handleStartInvestigation = async () => {
    if (isInvestigating) return;

    setIsInvestigating(true);
    setFinalReport(null);
    setActiveTab('investigation');

    try {
      const report = await runInvestigationPipeline(
        selectedCompany,
        selectedPeriod,
        selectedAngleId,
        isLiveMode,
        (updatedStages, updatedLogs, stageIdx) => {
          setStages(updatedStages);
          setLogs(updatedLogs);
          setCurrentStageIndex(stageIdx);
        }
      );

      setFinalReport(report);
      setIsInvestigating(false);
    } catch (error) {
      console.error('Investigation error:', error);
      setIsInvestigating(false);
    }
  };

  // Quick run Company X Demo
  const handleRunDemoQuick = () => {
    const demoCompany = NIFTY_COMPANIES.find((c) => c.isFictionalDemo) || NIFTY_COMPANIES[0];
    setSelectedCompany(demoCompany);
    setSelectedPeriod(demoCompany.reportingPeriods[0]);
    setSelectedAngleId('angle-rev-vol');
    setActiveTab('overview');
  };

  const selectedCaselet = CASELET_LIBRARY[0];

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLiveMode={isLiveMode}
        onToggleLiveMode={() => setIsLiveMode(!isLiveMode)}
        isInvestigating={isInvestigating}
        hasCompletedReport={!!finalReport}
        onRunDemoQuick={handleRunDemoQuick}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
            selectedAngleId={selectedAngleId}
            onSelectAngleId={setSelectedAngleId}
            onStartInvestigation={handleStartInvestigation}
            isInvestigating={isInvestigating}
            isLiveMode={isLiveMode}
          />
        )}

        {activeTab === 'investigation' && (
          <LiveInvestigationView
            stages={stages}
            logs={logs}
            currentStageIndex={currentStageIndex}
            isInvestigating={isInvestigating}
            finalReport={finalReport}
            onViewFinalReport={() => setActiveTab('report')}
            selectedCaselet={selectedCaselet}
          />
        )}

        {activeTab === 'caselets' && <CaseletLibraryView />}

        {activeTab === 'evidence' && (
          <EvidenceExplorerView
            evidenceList={finalReport ? finalReport.evidence : []}
            companyName={selectedCompany.name}
          />
        )}

        {activeTab === 'report' && (
          <>
            {finalReport ? (
              <FinalDiscoveryView
                report={finalReport}
                onOpenTraceModal={() => setIsTraceModalOpen(true)}
              />
            ) : (
              <div className="text-center py-16 bg-[#0b1324] border border-slate-800 rounded-2xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-700/60 flex items-center justify-center mx-auto text-blue-300">
                  <span className="font-mono text-lg font-bold">!</span>
                </div>
                <h3 className="text-base font-bold text-white">No Final Discovery Report Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Select a company from the Overview tab and launch an investigation to execute the 12-stage pipeline and generate the 9-part discovery report.
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Go to Overview & Start
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Investigation Trace Modal */}
      {isTraceModalOpen && finalReport && (
        <InvestigationTraceModal
          report={finalReport}
          onClose={() => setIsTraceModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-[#070d18] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ANOMALY ENGINE • ATMOS 2026 (Track C: Consumer Retail & FMCG)</span>
          <span className="font-mono text-[11px] text-slate-400">
            Adaptive Analytical Caselet Library • Deterministic Numerical Verification
          </span>
        </div>
      </footer>
    </div>
  );
}
