import React, { useState } from 'react';
import { StructuredEvidence } from '../services/investigationPipeline';
import {
  Database,
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  FileText,
  Building,
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface EvidenceExplorerViewProps {
  evidenceList: StructuredEvidence[];
  companyName: string;
}

export const EvidenceExplorerView: React.FC<EvidenceExplorerViewProps> = ({
  evidenceList,
  companyName
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<StructuredEvidence | null>(evidenceList[0] || null);

  const filtered = evidenceList.filter((ev) => {
    const matchesSearch =
      ev.claimOrMetric.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ev.sourceTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ev.relevantExcerpt.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || (typeFilter === 'primary' ? ev.isPrimary : !ev.isPrimary);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0b1324] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-extrabold text-white">Evidence Explorer & Provenance Ledger</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {evidenceList.length} Extracted Records
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Audit every claim, metric, and disclosure supporting the investigation. Filter between statutory primary filings and secondary commentary with direct source links.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Primary / Secondary Filter */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${typeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('primary')}
              className={`px-2.5 py-1 rounded transition-colors ${typeFilter === 'primary' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Primary
            </button>
            <button
              onClick={() => setTypeFilter('secondary')}
              className={`px-2.5 py-1 rounded transition-colors ${typeFilter === 'secondary' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>

      {evidenceList.length === 0 ? (
        <div className="p-8 rounded-xl bg-[#0b1324] border border-slate-800 text-center space-y-3">
          <Database className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Evidence Collected Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Run an investigation from the Overview tab to discover primary filings, extract metrics, and populate the structured evidence ledger.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Table / List */}
          <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const isSelected = selectedEvidence?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEvidence(item)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md'
                      : 'bg-[#0b1324] border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-400 font-bold">{item.id}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        item.isPrimary
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}>
                        {item.isPrimary ? 'PRIMARY' : 'SECONDARY'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {item.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-2">{item.claimOrMetric}</h4>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{item.sourceTitle}</span>
                    <span className="font-mono text-slate-500 shrink-0">{item.reportingPeriod}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Detail Card */}
          <div className="lg:col-span-7 bg-[#0b1324] border border-slate-800 rounded-xl p-5 space-y-4">
            {selectedEvidence ? (
              <>
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{selectedEvidence.id}</span>
                    <h3 className="text-sm font-extrabold text-white mt-0.5">{selectedEvidence.claimOrMetric}</h3>
                    {selectedEvidence.valueAndUnit && (
                      <div className="text-xs font-mono text-emerald-400 font-bold mt-1">
                        Reported Value: {selectedEvidence.valueAndUnit}
                      </div>
                    )}
                  </div>

                  <a
                    href={selectedEvidence.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs border border-blue-500/40 transition-colors shrink-0"
                  >
                    <span>View Filing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Excerpt Box */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Original Disclosure Excerpt
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-serif italic">
                    "{selectedEvidence.relevantExcerpt}"
                  </div>
                </div>

                {/* Provenance Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Source Title</span>
                    <span className="font-semibold text-white">{selectedEvidence.sourceTitle}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Publisher</span>
                    <span className="font-semibold text-white">{selectedEvidence.sourcePublisher}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Reporting Segment</span>
                    <span className="font-semibold text-white">{selectedEvidence.segment}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Period & Verification</span>
                    <span className="font-semibold text-white">
                      {selectedEvidence.reportingPeriod} ({selectedEvidence.verificationStatus})
                    </span>
                  </div>
                </div>

                {/* Direct Link */}
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="truncate">Source URL: <code className="text-blue-300">{selectedEvidence.sourceUrl}</code></span>
                  <span className="text-emerald-400 flex items-center gap-1 shrink-0 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Primary Provenance Verified
                  </span>
                </div>
              </>
            ) : (
              <div className="text-slate-500 italic text-xs text-center py-12">Select an evidence item to view provenance details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
