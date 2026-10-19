import React, { useState } from 'react';
import { Company, NIFTY_COMPANIES } from '../data/companies';
import {
  Search,
  Building2,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Info,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

interface OverviewViewProps {
  selectedCompany: Company;
  onSelectCompany: (company: Company) => void;
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  selectedAngleId: string;
  onSelectAngleId: (angleId: string) => void;
  onStartInvestigation: () => void;
  isInvestigating: boolean;
  isLiveMode: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  selectedCompany,
  onSelectCompany,
  selectedPeriod,
  onSelectPeriod,
  selectedAngleId,
  onSelectAngleId,
  onStartInvestigation,
  isInvestigating,
  isLiveMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  const filteredCompanies = NIFTY_COMPANIES.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === 'all' || comp.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const latestFin =
    selectedCompany.historicalFinancials[selectedCompany.historicalFinancials.length - 1] ||
    selectedCompany.historicalFinancials[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Context & Mode Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-900/40 border border-blue-700/40 text-blue-300 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Adaptive Business Intelligence & Discovery Agent
              {selectedCompany.isFictionalDemo ? (
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                  FICTIONAL DEMO MODE ACTIVE
                </span>
              ) : (
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  NIFTY 50 CONSTITUENT
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl">
              ANOMALY ENGINE investigates consumer retail and FMCG enterprises using the Adaptive Analytical Caselet Library. It uncovers non-obvious operational anomalies backed by verified statutory disclosures, deterministic calculations, and observable falsification conditions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onStartInvestigation}
            disabled={isInvestigating}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-all ${
              isInvestigating
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 hover:shadow-blue-700/50 cursor-pointer'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>{isInvestigating ? 'Investigation Running...' : 'Start Investigation'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Column (Company Selection) & Right Column (Company Snapshot & Angles) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Company Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Select Company</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{filteredCompanies.length} available</span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search company or ticker (e.g., HUL, Trent, Titan, DMart)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Sector Filter Tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {['all', 'FMCG', 'Consumer Retail', 'Paints & Decor'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSectorFilter(sec)}
                  className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                    sectorFilter === sec
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sec === 'all' ? 'All Sectors' : sec}
                </button>
              ))}
            </div>

            {/* Companies List */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredCompanies.map((comp) => {
                const isSelected = comp.id === selectedCompany.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onSelectCompany(comp);
                      onSelectPeriod(comp.reportingPeriods[0]);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white">{comp.name}</span>
                        {comp.isFictionalDemo && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-mono">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800/40">
                        {comp.ticker}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                      <span>{comp.sector}</span>
                      <span className="text-slate-500">
                        {comp.businessSegments.length} Segments • {comp.historicalFinancials.length} Quarters
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Selected Company Details & Config */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header Card for Selected Company */}
          <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-white">{selectedCompany.name}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50">
                    {selectedCompany.ticker} : {selectedCompany.exchange}
                  </span>
                  {selectedCompany.isFictionalDemo && (
                    <span className="text-xs bg-amber-950 text-amber-300 border border-amber-600/50 px-2 py-0.5 rounded font-mono">
                      SYNTHETIC DATASET
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">{selectedCompany.description}</p>
              </div>

              {/* Reporting Period Selector */}
              <div className="shrink-0 flex items-center space-x-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => onSelectPeriod(e.target.value)}
                  className="bg-transparent text-xs text-white font-mono font-medium focus:outline-none cursor-pointer"
                >
                  {selectedCompany.reportingPeriods.map((period) => (
                    <option key={period} value={period} className="bg-slate-900 text-white">
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Business Segment Breakdown */}
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>Business Segments & Perimeter</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {selectedCompany.businessSegments.map((seg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs ${
                      seg.isRetailOrFMCG
                        ? 'bg-blue-950/20 border-blue-800/40 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between font-medium">
                      <span>{seg.name}</span>
                      <span className="font-mono text-blue-400 font-bold">{seg.shareOfRevenuePercent}%</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{seg.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Financial Snapshot */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Reported Baseline Financials ({latestFin.period})</span>
                </span>
                <span className="text-[11px] text-slate-400">Verified Disclosures</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Revenue</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {latestFin.revenueCrores} <span className="text-[10px] text-slate-400 font-normal">Cr</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    {latestFin.revenueGrowthYoY >= 0 ? '+' : ''}{latestFin.revenueGrowthYoY}% YoY
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Volume Growth (UVG)</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {latestFin.volumeGrowthYoY !== undefined ? `${latestFin.volumeGrowthYoY}%` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {latestFin.volumeGrowthYoY !== undefined ? 'Underlying Units' : 'Undisclosed'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Operating EBITDA</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {latestFin.ebitdaMarginPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Gross Margin: {latestFin.grossMarginPercent}%
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Receivable Cycle (DSO)</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {latestFin.dsoDays ? `${latestFin.dsoDays} days` : '20-25 days'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {latestFin.receivablesCrores ? `${latestFin.receivablesCrores} Cr` : 'Statutory Terms'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Observable Anomalies Detected */}
          <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Observable Anomalies Detected</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Signals triggering caselet retrieval</span>
            </div>

            <div className="space-y-2">
              {selectedCompany.keyAnomalies.map((anom, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-200">{anom.metric}</div>
                      <div className="text-xs text-slate-300 mt-0.5">{anom.description}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50 shrink-0">
                    {anom.observedValue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Investigation Angles Selection */}
          <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Investigation Angles</h3>
              </div>
              <span className="text-[11px] text-slate-400">Ranked by diagnostic significance</span>
            </div>

            <div className="space-y-2.5">
              {/* Option to let agent discover automatically */}
              <div
                onClick={() => onSelectAngleId('auto')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedAngleId === 'auto'
                    ? 'bg-blue-950/50 border-blue-500 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedAngleId === 'auto' ? 'border-blue-400 bg-blue-500' : 'border-slate-600'}`}>
                      {selectedAngleId === 'auto' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs font-bold text-white">Auto-Discover Most Promising Angle</span>
                  </div>
                  <span className="text-[10px] text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/60">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-5.5">
                  Let the Caselet Retrieval Engine score all 8 analytical playbooks against detected anomalies and select the highest-conviction inquiry.
                </p>
              </div>

              {/* Specific suggested angles */}
              {selectedCompany.suggestedAngles.map((angle) => {
                const isSelected = selectedAngleId === angle.id;
                return (
                  <div
                    key={angle.id}
                    onClick={() => onSelectAngleId(angle.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/50 border-blue-500 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-white">{angle.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        Priority {angle.priorityScore}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-5.5">{angle.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Button */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onStartInvestigation}
                disabled={isInvestigating}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Begin 12-Stage Investigation on {selectedCompany.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
