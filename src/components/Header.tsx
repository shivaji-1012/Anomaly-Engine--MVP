import React from 'react';
import { ShieldAlert, Compass, BookOpen, Database, FileCheck2, Play, Activity } from 'lucide-react';

export type ActiveTab = 'overview' | 'investigation' | 'caselets' | 'evidence' | 'report';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isLiveMode: boolean;
  onToggleLiveMode: () => void;
  isInvestigating: boolean;
  hasCompletedReport: boolean;
  onRunDemoQuick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isLiveMode,
  onToggleLiveMode,
  isInvestigating,
  hasCompletedReport,
  onRunDemoQuick
}) => {
  return (
    <header className="no-print bg-[#0a1120] border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Track Tag */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 shadow-md shadow-blue-900/40 border border-blue-500/30">
              <ShieldAlert className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-lg text-white font-mono">ANOMALY ENGINE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                  ATMOS 2026
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Track C: Consumer Retail & FMCG Discovery Agent
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onTabChange('overview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onTabChange('investigation')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all relative ${
                activeTab === 'investigation'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className={`w-4 h-4 ${isInvestigating ? 'text-amber-400 animate-spin' : ''}`} />
              <span>Investigation</span>
              {isInvestigating && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
              )}
            </button>

            <button
              onClick={() => onTabChange('caselets')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'caselets'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Caselet Library (8)</span>
            </button>

            <button
              onClick={() => onTabChange('evidence')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'evidence'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Evidence Ledger</span>
            </button>

            <button
              onClick={() => onTabChange('report')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all relative ${
                activeTab === 'report'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Final Discovery</span>
              {hasCompletedReport && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" />
              )}
            </button>
          </nav>

          {/* Right Mode Controls */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo CTA */}
            <button
              onClick={onRunDemoQuick}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1 text-xs rounded border border-amber-600/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 transition-colors"
              title="Loads fictional Company X with complete 15% revenue vs volume divergence"
            >
              <Play className="w-3 h-3 fill-amber-300" />
              <span>Load Company X Demo</span>
            </button>

            {/* Mode Switcher */}
            <button
              onClick={onToggleLiveMode}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                isLiveMode
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
              }`}
              title="Click to toggle between Live Grounded Research and Deterministic Offline Mode"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
              <span>{isLiveMode ? 'Live Research Grounding' : 'Deterministic Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-800/60 bg-[#080d19]">
        <button
          onClick={() => onTabChange('overview')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => onTabChange('investigation')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'investigation' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Investigation {isInvestigating && '●'}
        </button>
        <button
          onClick={() => onTabChange('caselets')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'caselets' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Caselets
        </button>
        <button
          onClick={() => onTabChange('evidence')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'evidence' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Evidence
        </button>
        <button
          onClick={() => onTabChange('report')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'report' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          Final Report {hasCompletedReport && '✓'}
        </button>
      </div>
    </header>
  );
};
