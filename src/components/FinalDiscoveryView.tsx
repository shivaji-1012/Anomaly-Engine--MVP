import React, { useState } from 'react';
import {
  FinalDiscoveryReport,
  StructuredEvidence,
  TimelineEvent
} from '../services/investigationPipeline';
import { DeterministicCalculationResult } from '../services/numericalEngine';
import {
  Award,
  ExternalLink,
  Printer,
  FileCheck2,
  AlertTriangle,
  Clock,
  Calculator,
  ShieldAlert,
  HelpCircle,
  TrendingDown,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';

interface FinalDiscoveryViewProps {
  report: FinalDiscoveryReport;
  onOpenTraceModal: () => void;
}

export const FinalDiscoveryView: React.FC<FinalDiscoveryViewProps> = ({
  report,
  onOpenTraceModal
}) => {
  // Modal states for interactive inspectability
  const [activeInspectItem, setActiveInspectItem] = useState<{
    type: 'evidence' | 'number' | 'timeline' | 'counterargument' | 'falsification' | 'strength';
    title: string;
    data: any;
  } | null>(null);

  const handlePrintExport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="no-print flex items-center justify-between p-4 rounded-xl bg-[#0b1324] border border-slate-800">
        <div>
          <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest">
            Discovery Intelligence Briefing
          </span>
          <h2 className="text-base font-extrabold text-white mt-0.5">
            {report.trackAndCompany.companyName} ({report.trackAndCompany.ticker})
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenTraceModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/60 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Investigation Trace</span>
          </button>

          <button
            onClick={handlePrintExport}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold shadow-md shadow-blue-900/40 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Report (HTML / PDF)</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">ANOMALY ENGINE — Discovery Intelligence Report</h1>
        <p className="text-sm text-slate-600">Track C: Consumer Retail & FMCG | ATMOS 2026</p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION A: TRACK AND COMPANY */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-3">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Section A • Track and Company</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {report.trackAndCompany.track}
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>{report.trackAndCompany.companyName}</span>
              <span className="text-sm font-mono px-2.5 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50">
                {report.trackAndCompany.ticker} : {report.trackAndCompany.exchange}
              </span>
              {report.trackAndCompany.isDemo && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded font-mono">
                  FICTIONAL DEMO
                </span>
              )}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Segment</span>
              <span className="font-bold text-white">{report.trackAndCompany.relevantSegment}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Reporting Period</span>
              <span className="font-bold text-blue-400">{report.trackAndCompany.reportingPeriod}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION B: THE DISCOVERY */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-gradient-to-br from-blue-950/60 via-[#0b1324] to-[#0b1324] border border-blue-800/80 p-6 space-y-3 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold font-mono tracking-widest uppercase">
          <Award className="w-4 h-4 text-blue-400" />
          <span>Section B • The Discovery</span>
        </div>

        <blockquote className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight border-l-4 border-blue-500 pl-4 py-1">
          "{report.theDiscovery}"
        </blockquote>

        <div className="text-[11px] text-blue-300/80 pl-4">
          Non-obvious discovery synthesized from statutory disclosures, deterministic volume-price spreads, and channel credit analysis.
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION C: WHY IT MATTERS */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Section C • Why It Matters</span>
        </div>

        <div className="space-y-2.5">
          {report.whyItMatters.map((bullet, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start space-x-3 text-xs leading-relaxed"
            >
              <div className="w-5 h-5 rounded-full bg-blue-900/40 border border-blue-700/60 text-blue-300 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-200">{bullet}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION D: EVIDENCE */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Section D • Evidence Ledger</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {report.evidence.length} Primary & Secondary Disclosures
          </span>
        </div>

        <div className="space-y-3">
          {report.evidence.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setActiveInspectItem({ type: 'evidence', title: ev.claimOrMetric, data: ev })}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-blue-400 font-bold">{ev.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    ev.isPrimary
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  }`}>
                    {ev.isPrimary ? 'PRIMARY DISCLOSURE' : 'SECONDARY COMMENTARY'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {ev.verificationStatus.toUpperCase()}
                  </span>
                </div>

                <a
                  href={ev.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono"
                >
                  <span>{ev.sourcePublisher}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                {ev.claimOrMetric}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-300 italic font-serif text-[11px]">
                "{ev.relevantExcerpt}"
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Source: <strong className="text-slate-400">{ev.sourceTitle}</strong> ({ev.reportingPeriod})</span>
                <span className="text-blue-400 flex items-center gap-1 font-mono text-[10px]">
                  Inspect Provenance <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION E: TIMELINE */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold font-mono tracking-widest uppercase">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Section E • Chronological Timeline</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {report.timeline.length} Milestones Plotted
          </span>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
          {report.timeline.map((event, idx) => (
            <div
              key={event.id}
              onClick={() => setActiveInspectItem({ type: 'timeline', title: event.eventTitle, data: event })}
              className="relative cursor-pointer group"
            >
              {/* Dot on line */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-[#0b1324] ring-2 ring-blue-500/30 group-hover:bg-blue-400 transition-colors" />

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-400 text-xs">{event.dateOrPeriod}</span>
                  {event.metricDelta && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {event.metricDelta}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                  {event.eventTitle}
                </h4>

                <p className="text-slate-300 text-[11px]">{event.description}</p>

                <div className="pt-1 text-[10px] text-slate-500 font-mono">
                  Source: {event.sourceTitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION F: NUMBERS (Deterministic Calculations) */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold font-mono tracking-widest uppercase">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>Section F • Deterministic Financial Calculations</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Verified Zero-LLM Arithmetic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.numbers.map((num) => (
            <div
              key={num.id}
              onClick={() => setActiveInspectItem({ type: 'number', title: num.name, data: num })}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                  {num.name}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  num.isAnomaly
                    ? 'bg-amber-950 text-amber-300 border-amber-700/60 font-bold'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                }`}>
                  {num.isAnomaly ? 'ANOMALY CONFIRMED' : 'NORMAL RANGE'}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white font-mono">{num.outputValue}</span>
                <span className="text-xs text-slate-400 font-mono">{num.outputUnit}</span>
              </div>

              <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-300 truncate">
                Formula: {num.formula}
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                {num.interpretation}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{num.inputs.length} Input Variables</span>
                <span className="text-blue-400 flex items-center gap-1">
                  Inspect Calculation <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION G: COUNTERARGUMENT */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold font-mono tracking-widest uppercase">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Section G • Strongest Substantive Counterargument</span>
        </div>

        <div
          onClick={() => setActiveInspectItem({ type: 'counterargument', title: report.counterargument.title, data: report.counterargument })}
          className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 hover:border-amber-700/50 transition-all cursor-pointer space-y-2 text-xs"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-amber-200 text-sm">
              {report.counterargument.title}
            </h4>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              Adversarial Check
            </span>
          </div>

          <p className="text-slate-200 leading-relaxed">
            {report.counterargument.substantiveExplanation}
          </p>

          <div className="pt-2 border-t border-amber-900/40 text-[11px] text-slate-300 space-y-1">
            <div className="font-semibold text-amber-300">Why It Could Change Interpretation:</div>
            <p className="text-slate-400">{report.counterargument.whyItCouldChangeInterpretation}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION H: FALSIFICATION CONDITION */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono tracking-widest uppercase">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Section H • Observable Falsification Condition</span>
        </div>

        <div
          onClick={() => setActiveInspectItem({ type: 'falsification', title: 'Falsification Condition', data: report.falsificationCondition })}
          className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-700/50 transition-all cursor-pointer space-y-3 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">
              {report.falsificationCondition.observableCondition}
            </span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Observation Window: {report.falsificationCondition.observationWindow}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
            Measurable Threshold: {report.falsificationCondition.measurableThreshold}
          </div>

          <div className="text-[11px] text-slate-300">
            <span className="font-semibold text-white">Reassessment Directive:</span> {report.falsificationCondition.reassessmentAction}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION I: EVIDENCE STRENGTH */}
      {/* ------------------------------------------------------------- */}
      <section className="print-card rounded-xl bg-[#0b1324] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold font-mono tracking-widest uppercase">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Section I • Evidence Strength Classification</span>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-blue-600 text-white shadow-sm">
            Grade: {report.evidenceStrength.grade}
          </span>
        </div>

        <div
          onClick={() => setActiveInspectItem({ type: 'strength', title: 'Evidence Strength Factors', data: report.evidenceStrength })}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3 text-xs"
        >
          <p className="text-slate-200 leading-relaxed font-medium">
            {report.evidenceStrength.basisExplanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
            {report.evidenceStrength.gradingFactors.map((gf, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{gf.factor}</span>
                  <span className={`text-[10px] font-mono font-bold ${
                    gf.status === 'High' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {gf.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">{gf.notes}</div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-right pt-1">
            Click to inspect full audit criteria and grading factors
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* REUSABLE INSPECTION MODAL FOR ANY COMPONENT */}
      {/* ------------------------------------------------------------- */}
      {activeInspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b1324] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                  Inspectable Component Trace [{activeInspectItem.type.toUpperCase()}]
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{activeInspectItem.title}</h3>
              </div>
              <button
                onClick={() => setActiveInspectItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type-specific modal contents */}
            {activeInspectItem.type === 'number' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-300">
                  Formula: {activeInspectItem.data.formula}
                </div>

                <div>
                  <h5 className="font-bold text-white mb-1.5">Input Variables & Sources:</h5>
                  <div className="space-y-1.5">
                    {activeInspectItem.data.inputs.map((inp: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white font-mono">{inp.name}: </span>
                          <span className="text-slate-300">{inp.value} {inp.unit}</span>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{inp.sourceDescription} ({inp.period})</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-white mb-1.5">Deterministic Calculation Steps:</h5>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-slate-300">
                    {activeInspectItem.data.steps.map((st: string, idx: number) => (
                      <div key={idx}>{st}</div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-blue-200">
                  <span className="font-bold text-blue-300 block mb-0.5">Assumptions & Disclosures:</span>
                  {activeInspectItem.data.assumptionsDisclosed.join('; ')}
                </div>
              </div>
            )}

            {activeInspectItem.type === 'evidence' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-serif italic text-slate-200 leading-relaxed">
                  "{activeInspectItem.data.relevantExcerpt}"
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Publisher</span>
                    <span className="text-white">{activeInspectItem.data.sourcePublisher}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Reporting Period</span>
                    <span className="text-white">{activeInspectItem.data.reportingPeriod}</span>
                  </div>
                </div>

                <a
                  href={activeInspectItem.data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs"
                >
                  <span>Open Official Filing URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {activeInspectItem.type === 'timeline' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-blue-300">
                  Milestone Date: {activeInspectItem.data.dateOrPeriod}
                </div>
                <p className="text-slate-200 leading-relaxed">{activeInspectItem.data.description}</p>
                <div className="text-slate-400">
                  Source: <strong className="text-white">{activeInspectItem.data.sourceTitle}</strong>
                </div>
              </div>
            )}

            {activeInspectItem.type === 'counterargument' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-200 leading-relaxed">{activeInspectItem.data.substantiveExplanation}</p>
                <div>
                  <h5 className="font-bold text-white mb-1">Supporting Counter-Evidence:</h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {activeInspectItem.data.supportingCounterEvidence.map((ce: string, idx: number) => (
                      <li key={idx}>{ce}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeInspectItem.type === 'falsification' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-300">
                  Threshold: {activeInspectItem.data.measurableThreshold}
                </div>
                <p className="text-slate-300">Window: {activeInspectItem.data.observationWindow}</p>
                <p className="text-slate-300 leading-relaxed">{activeInspectItem.data.reassessmentAction}</p>
              </div>
            )}

            {activeInspectItem.type === 'strength' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-200 leading-relaxed">{activeInspectItem.data.basisExplanation}</p>
                <div className="space-y-1.5">
                  {activeInspectItem.data.gradingFactors.map((gf: any, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                      <span className="font-bold text-white">{gf.factor}</span>
                      <span className="text-emerald-400 font-mono">{gf.status}: {gf.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveInspectItem(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
