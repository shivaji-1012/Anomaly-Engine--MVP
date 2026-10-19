import { Caselet, CaseletMatchResult } from '../types/caselet';
import { CASELET_LIBRARY } from '../data/caselets';

export interface AnomalySignal {
  metric: string;
  description: string;
  observedValue?: string | number;
  severity: 'high' | 'medium' | 'low';
  period: string;
}

export interface CompanyRetrievalContext {
  id: string;
  name: string;
  ticker: string;
  sector: 'FMCG' | 'Consumer Retail' | 'QSR' | 'Apparel Retail' | 'Footwear' | 'Paints & Decor';
  businessModel: 'manufacturing_fmcg' | 'retail_chain' | 'conglomerate' | 'franchise_qsr';
  availableMetricIds: string[];
  detectedAnomalies: AnomalySignal[];
  userPreferredAngleId?: string;
  metricsSnapshot?: Record<string, number | string>;
}

export function rankAndSelectCaselets(context: CompanyRetrievalContext): CaseletMatchResult {
  const scoredCaselets = CASELET_LIBRARY.map((caselet) => {
    let score = 0;
    const matchNotes: string[] = [];
    const matchedTriggers: CaseletMatchResult['matchedTriggers'] = [];

    // 1. Sector & Business Model Suitability (0 - 20 pts)
    const isSectorMatch = caselet.sectorApplicability.includes(context.sector);
    if (isSectorMatch) {
      score += 20;
      matchNotes.push(`Compatible with sector: ${context.sector}`);
    } else {
      score -= 30; // Strong penalty if completely inapplicable (e.g. store expansion for pure FMCG)
      matchNotes.push(`Sector mismatch (Applicable to: ${caselet.sectorApplicability.join(', ')})`);
    }

    // 2. User Preferred Angle Boost (0 - 20 pts)
    if (context.userPreferredAngleId) {
      if (
        (context.userPreferredAngleId === 'angle-rev-vol' && caselet.id === 'CASELET-01-REV-VOL') ||
        (context.userPreferredAngleId === 'angle-pat-ocf' && caselet.id === 'CASELET-02-PAT-OCF') ||
        (context.userPreferredAngleId === 'angle-margin-input' && caselet.id === 'CASELET-03-MAR-INP') ||
        (context.userPreferredAngleId === 'angle-inventory-sales' && caselet.id === 'CASELET-04-INV-SALES') ||
        (context.userPreferredAngleId === 'angle-receivables-rev' && caselet.id === 'CASELET-05-REC-REV') ||
        (context.userPreferredAngleId === 'angle-store-productivity' && caselet.id === 'CASELET-06-STORE-PROD') ||
        (context.userPreferredAngleId === 'angle-narrative-evidence' && caselet.id === 'CASELET-07-NARR-EVID') ||
        (context.userPreferredAngleId === 'angle-company-industry' && caselet.id === 'CASELET-08-COMP-IND')
      ) {
        score += 25;
        matchNotes.push(`Direct alignment with selected investigation angle`);
      }
    }

    // 3. Trigger Condition Evaluation against Detected Anomalies & Metrics (0 - 40 pts)
    let triggerMatchCount = 0;
    for (const trigger of caselet.triggerConditions) {
      let isTriggered = false;
      let observedText = '';

      // Check against explicit detected anomalies
      for (const anomaly of context.detectedAnomalies) {
        const anomalyText = `${anomaly.metric} ${anomaly.description}`.toLowerCase();
        const triggerKeywords = trigger.conditionDescription.toLowerCase().split(' ');

        // Check if anomaly text matches key trigger concepts
        const hasKeywordMatch = triggerKeywords.filter((kw) => kw.length > 4 && anomalyText.includes(kw)).length >= 2;
        if (hasKeywordMatch || anomalyText.includes(trigger.metric.toLowerCase())) {
          isTriggered = true;
          observedText = `${anomaly.metric}: ${anomaly.observedValue || anomaly.description}`;
          break;
        }
      }

      // Check against metrics snapshot if available
      if (!isTriggered && context.metricsSnapshot) {
        if (trigger.id === 'TRIG-REV-VOL-01' || trigger.id === 'TRIG-REV-VOL-02') {
          const rev = Number(context.metricsSnapshot['revenueGrowthYoY']);
          const vol = Number(context.metricsSnapshot['volumeGrowthYoY']);
          if (!isNaN(rev) && !isNaN(vol)) {
            if ((rev - vol) >= 4 || vol <= 1) {
              isTriggered = true;
              observedText = `Revenue Growth ${rev}% vs Volume Growth ${vol}% (Spread: ${(rev - vol).toFixed(1)} pp)`;
            }
          }
        } else if (trigger.id === 'TRIG-PAT-OCF-01' || trigger.id === 'TRIG-PAT-OCF-02') {
          const pat = Number(context.metricsSnapshot['patCrores']);
          const ocf = Number(context.metricsSnapshot['ocfCrores']);
          if (!isNaN(pat) && !isNaN(ocf) && pat > 0) {
            const ratio = ocf / pat;
            if (ratio < 0.65) {
              isTriggered = true;
              observedText = `OCF/PAT Ratio is ${ratio.toFixed(2)}x (Threshold: < 0.65x)`;
            }
          }
        } else if (trigger.id === 'TRIG-REC-REV-01' || trigger.id === 'TRIG-REC-REV-02') {
          const dso = Number(context.metricsSnapshot['dsoDays']);
          const dsoDelta = Number(context.metricsSnapshot['dsoDeltaDays']);
          if (!isNaN(dsoDelta) && dsoDelta >= 8) {
            isTriggered = true;
            observedText = `DSO expanded by +${dsoDelta} days (Current DSO: ${dso} days)`;
          }
        } else if (trigger.id === 'TRIG-INV-SALES-01') {
          const invGrowth = Number(context.metricsSnapshot['inventoryGrowthYoY']);
          const salesGrowth = Number(context.metricsSnapshot['revenueGrowthYoY']);
          if (!isNaN(invGrowth) && !isNaN(salesGrowth) && (invGrowth - salesGrowth) >= 12) {
            isTriggered = true;
            observedText = `Inventory Growth ${invGrowth}% vs Sales Growth ${salesGrowth}% (Spread: ${(invGrowth - salesGrowth).toFixed(1)} pp)`;
          }
        } else if (trigger.id === 'TRIG-STORE-PROD-01') {
          const storeGrowth = Number(context.metricsSnapshot['storeGrowthYoY']);
          const sssg = Number(context.metricsSnapshot['sssgGrowthYoY']);
          if (!isNaN(storeGrowth) && storeGrowth >= 15 && (!isNaN(sssg) && sssg < 4)) {
            isTriggered = true;
            observedText = `Store Growth ${storeGrowth}% vs SSSG ${sssg}%`;
          }
        }
      }

      matchedTriggers.push({
        triggerId: trigger.id,
        description: trigger.conditionDescription,
        observedValue: observedText || undefined,
        matched: isTriggered
      });

      if (isTriggered) {
        triggerMatchCount++;
        score += trigger.severityWeight * 2.5; // up to 25 pts per trigger
      }
    }

    // 4. Metric Availability Check (0 - 15 pts)
    const mandatoryMetrics = caselet.relevantMetrics.filter((m) => m.mandatoryForCalculation);
    const availableMandatory = mandatoryMetrics.filter((m) => context.availableMetricIds.includes(m.id));
    const availabilityRatio = mandatoryMetrics.length > 0 ? availableMandatory.length / mandatoryMetrics.length : 1;
    score += Math.round(availabilityRatio * 15);
    matchNotes.push(`Data availability: ${availableMandatory.length}/${mandatoryMetrics.length} required metrics`);

    // Normalize score to 0-100 range
    const finalScore = Math.min(100, Math.max(5, Math.round(score)));

    return {
      caselet,
      score: finalScore,
      matchedTriggers,
      matchNotes,
      triggerMatchCount
    };
  });

  // Sort descending by score
  scoredCaselets.sort((a, b) => b.score - a.score);

  const bestMatch = scoredCaselets[0];

  // Build plain language explanation for why chosen
  const matchedTriggerCount = bestMatch.matchedTriggers.filter((t) => t.matched).length;
  const triggerSummary = bestMatch.matchedTriggers
    .filter((t) => t.matched)
    .map((t) => `• ${t.description}${t.observedValue ? ` [Observed: ${t.observedValue}]` : ''}`)
    .join('\n');

  const selectionRationale = `Selected "${bestMatch.caselet.title}" (Relevance Score: ${bestMatch.score}/100) as the primary investigative playbook.
Trigger Analysis: ${matchedTriggerCount} active diagnostic trigger(s) matched company anomalies in ${context.name} (${context.sector}).
${triggerSummary ? `\nActive Triggers:\n${triggerSummary}\n` : ''}
Data Feasibility: Required metrics are available in audited statutory filings and investor disclosures.`;

  // Build alternatives list
  const alternativeRankings = scoredCaselets.slice(1).map((item) => {
    let reasonOmitted = 'Lower trigger alignment with observed anomalies.';
    if (!item.caselet.sectorApplicability.includes(context.sector)) {
      reasonOmitted = `Inapplicable to sector ${context.sector} (playbook designed for: ${item.caselet.sectorApplicability.join(', ')}).`;
    } else if (item.triggerMatchCount === 0) {
      reasonOmitted = 'No active trigger conditions observed in current reporting disclosures.';
    } else {
      reasonOmitted = `Secondary priority: matched ${item.triggerMatchCount} trigger(s), but scored ${item.score}/100 vs primary score ${bestMatch.score}/100.`;
    }

    return {
      caseletId: item.caselet.id,
      title: item.caselet.title,
      score: item.score,
      reasonOmitted
    };
  });

  return {
    caselet: bestMatch.caselet,
    relevanceScore: bestMatch.score,
    matchedTriggers: bestMatch.matchedTriggers,
    selectionRationale,
    alternativeRankings
  };
}
