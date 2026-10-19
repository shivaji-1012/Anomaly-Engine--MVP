/**
 * Adaptive Analytical Caselet Library Types
 * ATMOS 2026 - Track C: Consumer Retail & FMCG
 */

export interface MetricDefinition {
  id: string;
  name: string;
  category: 'growth' | 'profitability' | 'cashflow' | 'working_capital' | 'productivity' | 'narrative';
  standardUnit: string;
  description: string;
  mandatoryForCalculation: boolean;
}

export interface TriggerCondition {
  id: string;
  metric: string;
  conditionDescription: string;
  operator: '>' | '<' | 'divergence' | 'mismatch' | 'trend_reversal' | 'anomaly_present';
  thresholdText: string;
  periodRequirement: string; // e.g. ">= 2 consecutive quarters"
  severityWeight: number; // 1 to 10
}

export interface DiagnosticTreeNode {
  id: string;
  question: string;
  context: string;
  evaluationLogic: string;
  evidenceCheck: string;
  actionDirective: string;
  yesBranchNodeId?: string;
  noBranchNodeId?: string;
  divergentBranchNodeId?: string;
  terminalHypothesisId?: string;
}

export interface DiagnosticQuestionTree {
  rootNodeId: string;
  nodes: Record<string, DiagnosticTreeNode>;
}

export interface RequiredEvidenceItem {
  id: string;
  evidenceType: 'statutory_result' | 'investor_presentation' | 'earnings_concall' | 'annual_report' | 'industry_benchmark' | 'channel_check' | 'exchange_filing';
  priority: 'primary' | 'secondary';
  itemDescription: string;
  disclosureLocation: string; // e.g. "Segment Results, Note 4, Investor Deck Slide 12"
  extractionMethod: 'reported_value' | 'calculated_metric' | 'management_quote' | 'competitor_comparison';
}

export interface CalculationVariable {
  variableName: string;
  description: string;
  unit: string;
  exampleSource: string;
}

export interface CalculationProcedure {
  id: string;
  procedureName: string;
  formula: string;
  inputVariables: CalculationVariable[];
  deterministicSteps: string[];
  outputMetric: string;
  outputUnit: string;
  missingDataHandling: string;
  assumptionDisclosures: string[];
}

export interface AlternativeHypothesis {
  id: string;
  name: string;
  businessMechanism: string;
  likelihoodPreconditions: string;
  evidenceRequiredToConfirm: string[];
  evidenceRequiredToRefute: string[];
}

export interface CounterevidenceCheck {
  id: string;
  checkTitle: string;
  adversarialQuestion: string;
  counterDataTarget: string;
  benignExplanation: string;
  testAction: string;
}

export interface FalsificationCondition {
  id: string;
  observableMetricOrEvent: string;
  thresholdOrCriterion: string;
  observationWindow: string;
  reassessmentConsequence: string;
}

export interface ExpectedOutputSchema {
  primaryAnomalyClassification: string;
  requiredReportSections: string[];
  confidenceGradingFactors: string[];
  requiredQuantitativeOutputs: string[];
}

export interface Caselet {
  id: string;
  title: string;
  sectorApplicability: ('FMCG' | 'Consumer Retail' | 'QSR' | 'Apparel Retail' | 'Footwear' | 'Paints & Decor')[];
  businessProblem: string;
  triggerConditions: TriggerCondition[];
  relevantMetrics: MetricDefinition[];
  diagnosticQuestionTree: DiagnosticQuestionTree;
  requiredEvidence: RequiredEvidenceItem[];
  calculationProcedures: CalculationProcedure[];
  alternativeHypotheses: AlternativeHypothesis[];
  counterevidenceChecks: CounterevidenceCheck[];
  falsificationConditions: FalsificationCondition[];
  expectedOutputSchema: ExpectedOutputSchema;
  limitations: string[];
  prerequisites: string[];
}

export interface CaseletMatchResult {
  caselet: Caselet;
  relevanceScore: number; // 0 to 100
  matchedTriggers: {
    triggerId: string;
    description: string;
    observedValue?: string;
    matched: boolean;
  }[];
  selectionRationale: string;
  alternativeRankings: {
    caseletId: string;
    title: string;
    score: number;
    reasonOmitted: string;
  }[];
}
