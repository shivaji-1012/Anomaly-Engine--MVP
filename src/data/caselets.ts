import { Caselet } from '../types/caselet';

export const CASELET_LIBRARY: Caselet[] = [
  // 1. Revenue Growth vs Volume Growth
  {
    id: 'CASELET-01-REV-VOL',
    title: 'Revenue Growth vs Volume Growth',
    sectorApplicability: ['FMCG', 'Consumer Retail', 'Paints & Decor'],
    businessProblem:
      'A consumer goods company reports resilient or accelerating headline revenue growth, but underlying unit volume growth is stagnant, negative, or significantly trailing revenue. This divergence exposes reliance on price increases, grammage reductions, or portfolio mix shifts that may conceal softening end-consumer demand and market-share erosion.',
    triggerConditions: [
      {
        id: 'TRIG-REV-VOL-01',
        metric: 'Revenue YoY% - Underlying Volume YoY%',
        conditionDescription: 'Revenue growth exceeds underlying volume growth by >= 5 percentage points over 2+ consecutive quarters',
        operator: '>',
        thresholdText: 'Delta >= +5.0% for >= 2 quarters',
        periodRequirement: '>= 2 quarters',
        severityWeight: 9
      },
      {
        id: 'TRIG-REV-VOL-02',
        metric: 'Underlying Volume Growth (UVG)',
        conditionDescription: 'Underlying volume growth turns negative (<= 0%) while reported revenue continues to grow',
        operator: '<',
        thresholdText: 'UVG <= 0.0% while Rev Growth > 0.0%',
        periodRequirement: '>= 1 quarter',
        severityWeight: 10
      },
      {
        id: 'TRIG-REV-VOL-03',
        metric: 'Price-Mix Contribution',
        conditionDescription: 'Pricing and mix account for > 80% of total revenue growth during high inflation or recovery periods',
        operator: '>',
        thresholdText: 'Price-Mix Contribution >= 80% of total growth',
        periodRequirement: 'Current fiscal year',
        severityWeight: 8
      }
    ],
    relevantMetrics: [
      {
        id: 'met-rev-growth',
        name: 'Reported Revenue Growth (YoY)',
        category: 'growth',
        standardUnit: '% YoY',
        description: 'Year-over-year percentage change in net sales from operations',
        mandatoryForCalculation: true
      },
      {
        id: 'met-uvg',
        name: 'Underlying Volume Growth (UVG)',
        category: 'growth',
        standardUnit: '% YoY',
        description: 'Percentage change in physical units/tonnage/cases sold excluding acquisitions and pricing impacts',
        mandatoryForCalculation: true
      },
      {
        id: 'met-price-realization',
        name: 'Price Realization & Mix Contribution',
        category: 'growth',
        standardUnit: '% YoY (bps)',
        description: 'Revenue growth mathematically attributable to MRP hikes, discount rollbacks, and premium pack mix',
        mandatoryForCalculation: false
      },
      {
        id: 'met-market-share-vol',
        name: 'Volume Market Share (Nielsen/Kantar)',
        category: 'growth',
        standardUnit: '% Share',
        description: 'Independent volume market share in core product categories',
        mandatoryForCalculation: false
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-RV-01',
      nodes: {
        'NODE-RV-01': {
          id: 'NODE-RV-01',
          question: 'Does the company report official Underlying Volume Growth (UVG) or physical tonnage in quarterly disclosures?',
          context: 'Consumer FMCG players typically disclose UVG in investor presentations or earnings conference calls.',
          evaluationLogic: 'Inspect Investor Presentation and Concall transcripts for UVG or tonnage tables.',
          evidenceCheck: 'Check investor deck slide on Domestic Consumer Growth or Segment Volumes.',
          actionDirective: 'If reported, proceed to calculate price-volume spread. If absent, check segment commentary or SKU disclosures.',
          yesBranchNodeId: 'NODE-RV-02',
          noBranchNodeId: 'NODE-RV-ALT-01'
        },
        'NODE-RV-02': {
          id: 'NODE-RV-02',
          question: 'Is UVG decelerating while revenue growth is maintained primarily through list price hikes?',
          context: 'Divergence indicates top-line resilience is inflation-induced rather than demand-driven.',
          evaluationLogic: 'Compare (Revenue Growth % - UVG %) across the trailing 4 quarters.',
          evidenceCheck: 'Extract quarterly table of Revenue YoY vs UVG YoY.',
          actionDirective: 'If spread is widening, evaluate consumer elasticity and down-trading risks.',
          yesBranchNodeId: 'NODE-RV-03',
          noBranchNodeId: 'NODE-RV-04'
        },
        'NODE-RV-03': {
          id: 'NODE-RV-03',
          question: 'Are regional/unorganised competitors gaining volume market share due to pricing gap?',
          context: 'When national FMCG majors hold high prices after commodity softening, regional players undercut prices and gain volume.',
          evaluationLogic: 'Cross-reference competitor earnings calls (e.g. local players in tea, detergent, biscuits) and Nielsen data.',
          evidenceCheck: 'Management commentary regarding "local competition" or "price rollback in mass packs".',
          actionDirective: 'Flag vulnerability to margin contraction when price cuts become unavoidable to defend market share.',
          terminalHypothesisId: 'HYP-RV-01'
        },
        'NODE-RV-04': {
          id: 'NODE-RV-04',
          question: 'Is the volume-revenue spread driven by genuine premiumisation (mix shift) rather than pure pricing?',
          context: 'Higher proportion of premium SKUs increases average realization per unit even if unit volume grows modestly.',
          evaluationLogic: 'Verify gross margin trajectory and premium portfolio growth rates vs mass portfolio.',
          evidenceCheck: 'Check disclosures on premium portfolio growth rate and average selling price index.',
          actionDirective: 'Confirm whether gross margins expanded in tandem with realization gains.',
          yesBranchNodeId: 'NODE-RV-PREM',
          noBranchNodeId: 'NODE-RV-03'
        },
        'NODE-RV-PREM': {
          id: 'NODE-RV-PREM',
          question: 'Does gross margin expansion corroborate high-margin premium mix adoption?',
          context: 'True premiumisation lifts gross margin percentages significantly.',
          evaluationLogic: 'Check Gross Margin Delta >= +150 bps YoY.',
          evidenceCheck: 'Gross profit line item / Net sales.',
          actionDirective: 'Conclude sustainable premiumisation hypothesis if confirmed; otherwise, revert to pricing elasticity headwind.',
          terminalHypothesisId: 'HYP-RV-02'
        },
        'NODE-RV-ALT-01': {
          id: 'NODE-RV-ALT-01',
          question: 'Can volume trajectory be inferred from segment disclosures, packaging input costs, or trade channel checks?',
          context: 'When volume is withheld, volume proxy must be constructed without speculative guessing.',
          evaluationLogic: 'Look for disclosures of case counts, packaging material expense changes, or industry volume indices.',
          evidenceCheck: 'Annual Report Notes on raw material consumption quantities and production units.',
          actionDirective: 'State explicit limitation if volume cannot be deterministically computed.',
          divergentBranchNodeId: 'NODE-RV-02'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-RV-01',
        evidenceType: 'investor_presentation',
        priority: 'primary',
        itemDescription: 'Quarterly Underlying Volume Growth (UVG) percentage or Domestic Consumer Volume growth',
        disclosureLocation: 'Investor Presentation - Quarterly Performance Highlights',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-RV-02',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Reported Net Revenue from Operations (Consolidated & Standalone)',
        disclosureLocation: 'Financial Results Statement - Line 1 (Revenue from Operations)',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-RV-03',
        evidenceType: 'earnings_concall',
        priority: 'secondary',
        itemDescription: 'Management remarks on price-volume decomposition, pricing actions, and rural demand volume trends',
        disclosureLocation: 'Earnings Call Transcript - CEO/CFO Opening Remarks & Q&A',
        extractionMethod: 'management_quote'
      },
      {
        id: 'EVID-RV-04',
        evidenceType: 'industry_benchmark',
        priority: 'secondary',
        itemDescription: 'Category-level volume growth data (NielsenIQ / Kantar Worldpanel FMCG Barometer)',
        disclosureLocation: 'Industry quarterly monitor or peer disclosures',
        extractionMethod: 'competitor_comparison'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-RV-01',
        procedureName: 'Price-Volume Spread & Realization Contribution',
        formula: 'Realization_Spread = Reported_Revenue_YoY_Percent - Underlying_Volume_YoY_Percent',
        inputVariables: [
          {
            variableName: 'Reported_Revenue_YoY_Percent',
            description: 'Year-over-year revenue growth in percentage',
            unit: '%',
            exampleSource: 'Quarterly financial results table'
          },
          {
            variableName: 'Underlying_Volume_YoY_Percent',
            description: 'Reported or verified underlying unit volume growth in percentage',
            unit: '%',
            exampleSource: 'Investor presentation volume breakdown'
          }
        ],
        deterministicSteps: [
          'Step 1: Validate both metrics correspond to the exact same reporting entity (Domestic Consumer vs Consolidated).',
          'Step 2: Compute Spread = Revenue_Growth - Volume_Growth.',
          'Step 3: If Revenue Growth > 0, compute Volume Contribution Ratio = Volume_Growth / Revenue_Growth.',
          'Step 4: Compute Price-Mix Contribution Ratio = 1 - Volume Contribution Ratio.'
        ],
        outputMetric: 'Price_Volume_Divergence_Spread',
        outputUnit: 'percentage points (pp)',
        missingDataHandling: 'If volume is not disclosed as a discrete percentage, do NOT guess. Mark calculation as INSUFFICIENT_DISCLOSURE and present qualitative proxy from concall.',
        assumptionDisclosures: [
          'Assumes UVG applies to the same geographic boundary as domestic revenue.',
          'Does not extrapolate volume growth to overseas subsidiaries unless disclosed.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-RV-01',
        name: 'Elasticity Cliff & Local Share Leakage',
        businessMechanism: 'Aggressive pricing protected top-line temporarily during inflationary input spikes, but created an affordability barrier that pushed mass consumers toward unorganised or aggressive regional brands.',
        likelihoodPreconditions: 'Commodity raw material costs peaking then softening, while company delayed consumer price cuts.',
        evidenceRequiredToConfirm: ['Negative or sub-2% UVG across 2+ quarters', 'Concall acknowledgement of local competitive intensity in mass SKUs', 'Price-volume spread > 6%'],
        evidenceRequiredToRefute: ['UVG rebounding above 6% without gross margin collapse', 'Peer volume growth also decelerating at same magnitude across sector']
      },
      {
        id: 'HYP-RV-02',
        name: 'Structural Premiumisation Mix Shift',
        businessMechanism: 'The company intentionally engineered a shift towards high-value premium SKUs (e.g. serums, liquid detergents, gourmet foods), increasing revenue per unit sold sustainably.',
        likelihoodPreconditions: 'Premium segment growing at 2x mass segment, accompanied by significant gross margin expansion.',
        evidenceRequiredToConfirm: ['Gross margin expansion >= 200 bps', 'Double-digit growth in premium tier disclosures'],
        evidenceRequiredToRefute: ['Gross margin flat or down despite high revenue realization', 'Mass brand marketing spend increased to counter volume drop']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-RV-01',
        checkTitle: 'Sector-Wide Inflation Pass-Through Test',
        adversarialQuestion: 'Is the volume stagnation isolated to this company, or are all FMCG peers experiencing identical volume contraction due to macro food inflation?',
        counterDataTarget: 'Peer average UVG in identical product segments over the same four quarters.',
        benignExplanation: 'If entire FMCG basket experienced -2% volume due to macro food inflation squeezing urban household budgets, the anomaly is macro-driven, not company-specific operational decay.',
        testAction: 'Compare target company UVG with top 3 sector competitors.'
      },
      {
        id: 'CHK-RV-02',
        checkTitle: 'Portfolio Pruning & SKU Rationalisation Test',
        adversarialQuestion: 'Did management deliberately discontinue low-margin wholesale packs or low-tonnage commoditised lines?',
        counterDataTarget: 'Annual report notes on product discontinuations or brand exits.',
        benignExplanation: 'Deliberate rationalisation of low-margin volume creates a non-recurring optical decline in UVG while boosting operating profit.',
        testAction: 'Search concalls for "portfolio rationalisation", "SKU reduction", or "tail-end SKU pruning".'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-RV-01',
        observableMetricOrEvent: 'Underlying Volume Growth (UVG) acceleration',
        thresholdOrCriterion: 'UVG recovers to >= 5.5% YoY for 2 consecutive quarters while retaining price realization',
        observationWindow: 'Subsequent 2 reporting quarters',
        reassessmentConsequence: 'Invalidates the structural demand exhaustion hypothesis; confirms pricing power and resilient brand equity.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Top-Line Quality Anomaly: Pricing Dependency vs Organic Demand Deficit',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Availability of audited or officially stated UVG', 'Granularity of price vs mix disclosures', 'Peer benchmarking availability'],
      requiredQuantitativeOutputs: ['Revenue YoY %', 'Volume YoY %', 'Price-Volume Spread (pp)', 'Estimated Price-Mix Contribution %']
    },
    limitations: [
      'Cannot be reliably computed if company bundles retail services with consumer goods without segment revenue breakdown.',
      'B2B commodity divisions (e.g. bulk palm oil or paperboards) distort consolidated tonnage metrics if not stripped out.'
    ],
    prerequisites: [
      'At least 4 consecutive quarters of standalone or domestic FMCG segment revenue disclosures.',
      'Consistent volume disclosure methodology between comparative periods.'
    ]
  },

  // 2. Profit Growth vs Operating Cash Flow
  {
    id: 'CASELET-02-PAT-OCF',
    title: 'Profit Growth vs Operating Cash Flow',
    sectorApplicability: ['FMCG', 'Consumer Retail', 'QSR', 'Apparel Retail', 'Footwear'],
    businessProblem:
      'A company reports healthy or surging Profit After Tax (PAT) / Operating Profit (EBITDA), but Cash Flow from Operations (CFO/OCF) stagnates, plummets, or turns negative. In consumer retail and FMCG—traditionally working-capital-light, high-cash-conversion businesses—a persistent earnings-cash divergence indicates working capital blockages, uncollected revenue, or non-cash accounting adjustments.',
    triggerConditions: [
      {
        id: 'TRIG-PAT-OCF-01',
        metric: 'Cash Conversion Ratio (OCF / EBITDA or OCF / PAT)',
        conditionDescription: 'Operating Cash Flow to PAT drops below 0.65x (or OCF / EBITDA < 0.50x) for full year or trailing 12 months',
        operator: '<',
        thresholdText: 'OCF / PAT < 0.65x or OCF / EBITDA < 0.50x',
        periodRequirement: '>= 1 full fiscal year or TTM',
        severityWeight: 9
      },
      {
        id: 'TRIG-PAT-OCF-02',
        metric: 'PAT Growth % vs OCF Growth % Spread',
        conditionDescription: 'Reported Net Profit grows by > 15% YoY while Operating Cash Flow declines by > 10% YoY',
        operator: 'divergence',
        thresholdText: 'PAT Growth > +15% AND OCF Growth < -10%',
        periodRequirement: 'Fiscal Year comparison',
        severityWeight: 10
      },
      {
        id: 'TRIG-PAT-OCF-03',
        metric: 'Working Capital Absorption',
        conditionDescription: 'Working capital drain absorbs > 40% of generated Operating Profit before working capital changes',
        operator: '>',
        thresholdText: 'Working Capital Outflow / Operating Profit before WC > 40%',
        periodRequirement: '>= 1 fiscal year',
        severityWeight: 8
      }
    ],
    relevantMetrics: [
      {
        id: 'met-pat',
        name: 'Profit After Tax (PAT)',
        category: 'profitability',
        standardUnit: 'INR Crores',
        description: 'Consolidated net profit attributable to shareholders',
        mandatoryForCalculation: true
      },
      {
        id: 'met-ocf',
        name: 'Operating Cash Flow (CFO / OCF)',
        category: 'cashflow',
        standardUnit: 'INR Crores',
        description: 'Net cash flows generated from operating activities after working capital adjustments and taxes paid',
        mandatoryForCalculation: true
      },
      {
        id: 'met-cash-conversion',
        name: 'Cash Conversion Ratio (OCF / PAT)',
        category: 'cashflow',
        standardUnit: 'ratio (x)',
        description: 'Proportion of reported net income converted into liquid operating cash',
        mandatoryForCalculation: true
      },
      {
        id: 'met-ebitda',
        name: 'EBITDA',
        category: 'profitability',
        standardUnit: 'INR Crores',
        description: 'Earnings before interest, taxes, depreciation, and amortization',
        mandatoryForCalculation: false
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-PO-01',
      nodes: {
        'NODE-PO-01': {
          id: 'NODE-PO-01',
          question: 'Is the Cash Flow Statement from the latest Annual Report or half-yearly results accessible?',
          context: 'Cash flow statements are mandatory in annual and half-yearly statutory filings.',
          evaluationLogic: 'Inspect Cash Flow Statement (Indirect Method) for Operating Cash Flow line.',
          evidenceCheck: 'Financial Statements - Cash Flow from Operating Activities.',
          actionDirective: 'Extract Net Cash from Operating Activities, Operating Profit before Working Capital Changes, and Working Capital adjustments.',
          yesBranchNodeId: 'NODE-PO-02',
          noBranchNodeId: 'NODE-PO-ALT'
        },
        'NODE-PO-02': {
          id: 'NODE-PO-02',
          question: 'Is the divergence caused by working capital absorption rather than non-operating/exceptional items?',
          context: 'Working capital drain points to operational asset inflation (inventory/receivables) rather than fair-value adjustments.',
          evaluationLogic: 'Compare Operating Profit before WC Changes with final Net Cash from Operations.',
          evidenceCheck: 'Look at line items: Increase in Inventories, Increase in Trade Receivables, Decrease in Trade Payables.',
          actionDirective: 'Identify whether the primary leakage is in Trade Receivables, Inventories, or Supplier Payables shrinkage.',
          yesBranchNodeId: 'NODE-PO-03',
          noBranchNodeId: 'NODE-PO-04'
        },
        'NODE-PO-03': {
          id: 'NODE-PO-03',
          question: 'Is Trade Receivables expansion the primary consumer of operating cash?',
          context: 'In FMCG, receivables surging disproportionately indicates channel extension or aggressive end-of-quarter push.',
          evaluationLogic: 'Inspect change in Trade Receivables line item on Cash Flow Statement.',
          evidenceCheck: 'Cash Flow line: (Increase)/Decrease in Trade Receivables.',
          actionDirective: 'Trigger cross-caselet analysis with CASELET-05-REC-REV.',
          terminalHypothesisId: 'HYP-PO-01'
        },
        'NODE-PO-04': {
          id: 'NODE-PO-04',
          question: 'Is the gap driven by strategic inventory buffer accumulation ahead of peak season or commodity hedging?',
          context: 'Retail and consumer companies occasionally build massive raw material inventory (e.g. agricultural harvest season).',
          evaluationLogic: 'Check Inventory additions in Cash Flow and management commentary on raw material procurement.',
          evidenceCheck: 'Examine Notes to Accounts on Inventories breakdown (Raw Material vs Finished Goods).',
          actionDirective: 'If Finished Goods inventory expanded, flag demand mismatch; if Raw Material, check seasonality.',
          terminalHypothesisId: 'HYP-PO-02'
        },
        'NODE-PO-ALT': {
          id: 'NODE-PO-ALT',
          question: 'Are half-yearly cash flow disclosures available on BSE/NSE filings?',
          context: 'Listed Indian entities file cash flow disclosures with H1 and FY audited results.',
          evaluationLogic: 'Check H1 results filings.',
          evidenceCheck: 'BSE corporate announcement search for Half-Yearly Financial Results.',
          actionDirective: 'Utilize H1 cash flow if full-year cash flow has not yet been filed.',
          divergentBranchNodeId: 'NODE-PO-02'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-PO-01',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Statement of Cash Flows (Audited Annual / Half-Yearly)',
        disclosureLocation: 'Financial Statements - Cash Flow from Operating Activities',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-PO-02',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Statement of Profit and Loss (Reported PAT and Operating Profit)',
        disclosureLocation: 'Financial Statements - Statement of Profit and Loss',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-PO-03',
        evidenceType: 'annual_report',
        priority: 'primary',
        itemDescription: 'Working Capital Notes (Trade Receivables, Inventory, Payables breakdown)',
        disclosureLocation: 'Notes to Financial Statements - Notes on Balance Sheet Assets and Liabilities',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-PO-04',
        evidenceType: 'earnings_concall',
        priority: 'secondary',
        itemDescription: 'CFO commentary on cash conversion cycle, distributor credit terms, and inventory days',
        disclosureLocation: 'Earnings Conference Call - CFO financial review',
        extractionMethod: 'management_quote'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-PO-01',
        procedureName: 'Cash Conversion Ratio & Divergence Metric',
        formula: 'Cash_Conversion_Ratio = Operating_Cash_Flow / Profit_After_Tax',
        inputVariables: [
          {
            variableName: 'Operating_Cash_Flow',
            description: 'Net cash flows from operating activities in Crores',
            unit: 'INR Crores',
            exampleSource: 'Cash Flow Statement'
          },
          {
            variableName: 'Profit_After_Tax',
            description: 'Net profit after tax attributable to owners in Crores',
            unit: 'INR Crores',
            exampleSource: 'Statement of Profit and Loss'
          }
        ],
        deterministicSteps: [
          'Step 1: Extract Operating Cash Flow and PAT for identical fiscal period.',
          'Step 2: Calculate Cash Conversion Ratio = OCF / PAT.',
          'Step 3: Compare with prior 3-year historical average cash conversion ratio.',
          'Step 4: Compute Divergence Gap = PAT - OCF in absolute Crores.'
        ],
        outputMetric: 'Cash_Conversion_Ratio',
        outputUnit: 'ratio (x)',
        missingDataHandling: 'If cash flow is only reported half-yearly, calculate for H1 and compare against H1 PAT; never annualize quarterly without explicit cash flow filing.',
        assumptionDisclosures: [
          'Calculated using reported statutory cash flows under Ind AS 7.',
          'Excludes lease liability principal payments which appear under Financing activities under Ind AS 116.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-PO-01',
        name: 'Channel Financing & Working Capital Blockage',
        businessMechanism: 'Reported profits are inflated by shipping goods to distributors on extended credit terms or absorbing distributor inventory onto company balance sheet, creating an optical earnings beat that fails to generate liquidity.',
        likelihoodPreconditions: 'Trade receivables surging > 25% YoY alongside weakening distributor sell-out reports.',
        evidenceRequiredToConfirm: ['OCF/PAT < 0.60x', 'Trade receivables days expanding by > 12 days', 'Operating cash flow down > 15% YoY'],
        evidenceRequiredToRefute: ['Quick reversal of receivables in subsequent semi-annual filing', 'Broad-based supply disruption explaining one-off buffer']
      },
      {
        id: 'HYP-PO-02',
        name: 'Pre-emptive Commodity Stocking & Seasonal Capex Shift',
        businessMechanism: 'Management deployed cash to secure low-cost agri-inputs (e.g. wheat, oilseeds, dairy, coffee) ahead of anticipated severe price hikes or crop failure.',
        likelihoodPreconditions: 'Commodity market price surge visible in public agricultural indices; inventory increase concentrated in raw materials.',
        evidenceRequiredToConfirm: ['Raw material inventory growth accounts for > 70% of inventory expansion', 'Concall disclosure of strategic advance purchasing'],
        evidenceRequiredToRefute: ['Finished goods inventory accumulating at warehouses while raw materials remain low']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-PO-01',
        checkTitle: 'Tax Timing & Dividend Outflow Separation Test',
        adversarialQuestion: 'Was the cash flow reduction merely an optical consequence of advance tax payment timing or exceptional statutory settlements?',
        counterDataTarget: 'Income Taxes Paid line in Operating Cash Flow.',
        benignExplanation: 'A lump-sum retrospective tax settlement or disputed tax deposit reduces OCF in a single year without reflecting core operational cash weakness.',
        testAction: 'Recalculate Pre-Tax Operating Cash Flow before Exceptional Tax Outflows.'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-PO-01',
        observableMetricOrEvent: 'Cash conversion normalization in subsequent audited filing',
        thresholdOrCriterion: 'OCF / PAT returns to >= 0.90x on a trailing 12-month basis',
        observationWindow: 'Next audited annual or half-yearly financial statement',
        reassessmentConsequence: 'Refutes structural channel blockage; validates transient seasonal inventory or timing divergence.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Earnings Quality Anomaly: Cash Flow Disconnect & Working Capital Drag',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Audited Cash Flow Statement availability', 'Traceability of working capital lines', 'Balance sheet note granularity'],
      requiredQuantitativeOutputs: ['PAT (INR Cr)', 'OCF (INR Cr)', 'Cash Conversion Ratio (x)', 'Working Capital Change (INR Cr)']
    },
    limitations: [
      'Quarterly cash flows are not mandatorily audited under Indian listing regulations (only H1 and FY are statutory).',
      'Ind AS 116 lease accounting reclassifies retail store rental cash outflows from operating to financing activities, mechanically boosting OCF.'
    ],
    prerequisites: [
      'Audited Cash Flow Statement for at least 2 comparative financial periods.'
    ]
  },

  // 3. Margin Improvement vs Input Costs
  {
    id: 'CASELET-03-MAR-INP',
    title: 'Margin Improvement vs Input Costs',
    sectorApplicability: ['FMCG', 'Consumer Retail', 'Paints & Decor', 'QSR'],
    businessProblem:
      'A consumer products manufacturer posts unexpected operating margin expansion or resilience during a period of acute raw material commodity inflation, or conversely, suffers sharp margin erosion despite commodity price deflation. This signals unexamined shifts in trade promotional intensity, aggressive A&P (advertising) cuts, quality re-engineering, or delayed inventory accounting impacts.',
    triggerConditions: [
      {
        id: 'TRIG-MAR-INP-01',
        metric: 'Gross Margin Delta vs Benchmark Commodity Basket',
        conditionDescription: 'Gross margin expands by >= 100 bps YoY while primary commodity index for key inputs increases by >= 12% YoY',
        operator: 'divergence',
        thresholdText: 'Gross Margin Delta >= +100 bps AND Key Input Basket Cost >= +12%',
        periodRequirement: '>= 2 quarters',
        severityWeight: 9
      },
      {
        id: 'TRIG-MAR-INP-02',
        metric: 'EBITDA Margin via Advertising & Promotion (A&P) Suppression',
        conditionDescription: 'EBITDA margin expands while A&P expense as % of sales drops by >= 150 bps YoY',
        operator: 'anomaly_present',
        thresholdText: 'EBITDA Margin up while A&P/Sales down >= 150 bps',
        periodRequirement: 'Trailing 2 quarters',
        severityWeight: 8
      }
    ],
    relevantMetrics: [
      {
        id: 'met-gross-margin',
        name: 'Gross Margin %',
        category: 'profitability',
        standardUnit: '% of Net Revenue',
        description: '(Revenue - Cost of Materials Consumed - Purchases of Stock-in-Trade - Changes in Inventories) / Revenue',
        mandatoryForCalculation: true
      },
      {
        id: 'met-ebitda-margin',
        name: 'EBITDA Margin %',
        category: 'profitability',
        standardUnit: '% of Net Revenue',
        description: 'Operating Profit before Interest, Tax, Depreciation, and Amortization / Net Revenue',
        mandatoryForCalculation: true
      },
      {
        id: 'met-ap-ratio',
        name: 'Advertising & Sales Promotion % of Revenue',
        category: 'profitability',
        standardUnit: '% of Net Revenue',
        description: 'A&P expenses / Net Revenue from Operations',
        mandatoryForCalculation: true
      },
      {
        id: 'met-commodity-index',
        name: 'Input Commodity Cost Index',
        category: 'profitability',
        standardUnit: 'Index / % Change YoY',
        description: 'Weighted price trend of core raw materials (e.g. crude derivatives, palm oil, wheat, milk, cocoa, TiO2)',
        mandatoryForCalculation: false
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-MI-01',
      nodes: {
        'NODE-MI-01': {
          id: 'NODE-MI-01',
          question: 'Did Gross Margin expand or hold steady in the selected period?',
          context: 'Gross margin directly tests the raw material pass-through equation before overheads.',
          evaluationLogic: 'Compute (Gross Profit / Net Revenue) for current vs prior year period.',
          evidenceCheck: 'Cost of Materials Consumed row in P&L.',
          actionDirective: 'Compare Gross Margin YoY change in basis points.',
          yesBranchNodeId: 'NODE-MI-02',
          noBranchNodeId: 'NODE-MI-03'
        },
        'NODE-MI-02': {
          id: 'NODE-MI-02',
          question: 'Did key commodity input prices rise significantly during the procurement window?',
          context: 'Check agricultural and industrial commodity prices (e.g., palm fatty acid, copra, crude packaging, milk powder).',
          evaluationLogic: 'Cross-reference commodity spot and import parity trends.',
          evidenceCheck: 'Check Investor Presentation commodity tracking slide.',
          actionDirective: 'If inputs rose, check whether margin expansion came from price hikes or inventory lag.',
          yesBranchNodeId: 'NODE-MI-LAG',
          noBranchNodeId: 'NODE-MI-NORM'
        },
        'NODE-MI-LAG': {
          id: 'NODE-MI-LAG',
          question: 'Is the gross margin resilience a temporary artifact of old low-cost inventory holding (FIFO lag)?',
          context: 'Companies with 60-90 days of inventory enjoy optical margin stability before high-cost inventory hits COGS.',
          evaluationLogic: 'Check Inventory Days and procurement commentary.',
          evidenceCheck: 'Notes on Inventory Valuation method and inventory turnover days.',
          actionDirective: 'Predict delayed margin compression in subsequent 2 quarters if FIFO lag.',
          terminalHypothesisId: 'HYP-MI-01'
        },
        'NODE-MI-03': {
          id: 'NODE-MI-03',
          question: 'Did EBITDA margin expand despite Gross Margin decline due to aggressive A&P cuts?',
          context: 'Cutting brand-building spend mechanically shields EBITDA in the short term while impairing long-term brand equity.',
          evaluationLogic: 'Check A&P expense line in Other Expenses.',
          evidenceCheck: 'Investor presentation breakdown of Other Expenses / Ad spend.',
          actionDirective: 'Calculate EBITDA without A&P suppression to uncover true operating leverage.',
          terminalHypothesisId: 'HYP-MI-02'
        },
        'NODE-MI-NORM': {
          id: 'NODE-MI-NORM',
          question: 'Did commodity deflation fail to be passed through to retail consumers due to disciplined oligopolistic pricing?',
          context: 'When raw materials fall, FMCG majors often retain consumer prices, pocketing massive gross margin expansion.',
          evaluationLogic: 'Evaluate if price rollback was delayed to recoup prior inflationary cycles.',
          evidenceCheck: 'Track MRP changes on core SKUs vs raw material cost index.',
          actionDirective: 'Identify sustainability of super-normal gross margins under threat of competitive undercutting.',
          terminalHypothesisId: 'HYP-MI-03'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-MI-01',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Line item cost breakdown: Cost of Materials Consumed, Purchases of Stock-in-Trade, Changes in Inventories',
        disclosureLocation: 'Financial Results Statement - Expenses Section',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-MI-02',
        evidenceType: 'investor_presentation',
        priority: 'primary',
        itemDescription: 'A&P Spend (% of sales) and key input cost index trends',
        disclosureLocation: 'Investor Presentation - Cost and Margin Drivers slide',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-MI-03',
        evidenceType: 'earnings_concall',
        priority: 'secondary',
        itemDescription: 'Management commentary on pricing interventions, grammage restorations, and commodity hedging cover',
        disclosureLocation: 'Earnings Call Transcript - Margin & Raw Material commentary',
        extractionMethod: 'management_quote'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-MI-01',
        procedureName: 'Gross Margin & EBITDA Margin Decomposition',
        formula: 'Gross_Profit = Net_Revenue - (Cost_of_Materials + Stock_in_Trade_Purchases + Change_in_Inventories); Gross_Margin_Percent = (Gross_Profit / Net_Revenue) * 100',
        inputVariables: [
          {
            variableName: 'Net_Revenue',
            description: 'Revenue from Operations in Crores',
            unit: 'INR Crores',
            exampleSource: 'Statement of Profit and Loss'
          },
          {
            variableName: 'Cost_of_Materials',
            description: 'Cost of materials consumed',
            unit: 'INR Crores',
            exampleSource: 'Statement of Profit and Loss'
          },
          {
            variableName: 'Stock_in_Trade_Purchases',
            description: 'Purchases of stock-in-trade',
            unit: 'INR Crores',
            exampleSource: 'Statement of Profit and Loss'
          },
          {
            variableName: 'Change_in_Inventories',
            description: 'Changes in inventories of finished goods, work-in-progress and stock-in-trade',
            unit: 'INR Crores',
            exampleSource: 'Statement of Profit and Loss'
          }
        ],
        deterministicSteps: [
          'Step 1: Compute total Cost of Goods Sold (COGS) = Cost of Materials + Purchases + Change in Inventories.',
          'Step 2: Calculate Gross Margin % = ((Net Revenue - COGS) / Net Revenue) * 100.',
          'Step 3: Calculate EBITDA Margin % = (EBITDA / Net Revenue) * 100.',
          'Step 4: Compute YoY Margin Delta in basis points = (Current_Margin % - Prior_Year_Margin %) * 100.'
        ],
        outputMetric: 'Gross_Margin_Delta_bps',
        outputUnit: 'basis points (bps)',
        missingDataHandling: 'If stock-in-trade purchases is zero or bundled, use the reported consumption aggregate without fabricating sub-components.',
        assumptionDisclosures: [
          'Calculated strictly from statutory P&L expense rows.',
          'Basis point changes represent 1/100th of 1%.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-MI-01',
        name: 'Inventory Valuation Lag Masking Imminent Margin Cliff',
        businessMechanism: 'The company consumed low-cost raw materials bought 3-4 months prior, creating an illusion of cost resilience that will collapse when high-cost replacement inventory enters COGS.',
        likelihoodPreconditions: 'Inventory turnover > 75 days; commodity prices spiking late in the reported quarter.',
        evidenceRequiredToConfirm: ['Gross margin stable in Q1 but dropping > 200 bps in Q2/Q3', 'Inventory value up while physical units flat'],
        evidenceRequiredToRefute: ['Forward hedging contracts covering 9+ months at locked rates']
      },
      {
        id: 'HYP-MI-02',
        name: 'Operating Margin Defense via Brand Under-investment',
        businessMechanism: 'To meet consensus quarterly EBITDA guidance despite gross margin compression, management drastically slashed advertising and promotional support.',
        likelihoodPreconditions: 'A&P-to-sales ratio down > 150 bps YoY while competitors sustained advertising.',
        evidenceRequiredToConfirm: ['A&P expense down in absolute Crores YoY', 'Volume share losses in media-intensive categories'],
        evidenceRequiredToRefute: ['Media efficiency gains evidenced by higher digital GRPs at lower rate cards']
      },
      {
        id: 'HYP-MI-03',
        name: 'Asymmetric Pricing Power & Input Deflation Windfall',
        businessMechanism: 'Input commodity deflation allowed the firm to retain consumer prices, delivering supernormal gross margins until competitive parity forces price rollbacks.',
        likelihoodPreconditions: 'Core commodity index down > 15% YoY while retail selling prices remain untouched.',
        evidenceRequiredToConfirm: ['Gross margin expanding > 300 bps YoY', 'Management deferring price cuts'],
        evidenceRequiredToRefute: ['Aggressive consumer promotions and grammage increases restoring unit value']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-MI-01',
        checkTitle: 'Value Engineering & Reformulation Verification',
        adversarialQuestion: 'Did the company sustainably re-engineer the product recipe (e.g. substituting cocoa butter equivalents or optimizing surfactant levels) rather than relying on accounting lag?',
        counterDataTarget: 'R&D patents, investor presentation disclosures on "cost-saving programs" or "Symphony/Project Leap".',
        benignExplanation: 'Structural reformulation reduces material costs permanently without degrading perceived brand quality.',
        testAction: 'Review disclosures on recurring cost-savings programs.'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-MI-01',
        observableMetricOrEvent: 'Gross margin trend upon commodity inventory replacement',
        thresholdOrCriterion: 'Gross margin compresses by > 200 bps in the subsequent two quarters when high-cost inventory cycle completes',
        observationWindow: 'Subsequent 2 quarterly disclosures',
        reassessmentConsequence: 'If gross margins remain elevated despite higher replacement costs, refutes the inventory-lag hypothesis and confirms structural pricing power.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Cost Structure & Margin Transmission Anomaly',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Granularity of P&L raw material disclosures', 'Independent commodity benchmark availability', 'A&P spend disclosure clarity'],
      requiredQuantitativeOutputs: ['Gross Margin %', 'Gross Margin Delta (bps)', 'EBITDA Margin %', 'A&P % of Sales']
    },
    limitations: [
      'Proprietary ingredient blends cannot always be mapped 1:1 to public commodity exchanges.',
      'Hedging gains embedded in Other Comprehensive Income (OCI) or foreign exchange adjustments can obscure pure procurement costs.'
    ],
    prerequisites: [
      'Line item disclosure of Cost of Materials Consumed in quarterly financial results.'
    ]
  },

  // 4. Inventory Growth vs Sales Growth
  {
    id: 'CASELET-04-INV-SALES',
    title: 'Inventory Growth vs Sales Growth',
    sectorApplicability: ['FMCG', 'Consumer Retail', 'Apparel Retail', 'Footwear', 'Paints & Decor'],
    businessProblem:
      'Inventory value grows significantly faster than net sales over multiple quarters. In consumer retail and FMCG, inventory accumulation ties up liquidity and introduces severe risks of markdown markdowns, obsolescence, channel clogging, and sudden gross margin write-downs, often pointing to unanticipated demand slowdowns or over-optimistic production forecasting.',
    triggerConditions: [
      {
        id: 'TRIG-INV-SALES-01',
        metric: 'Inventory Growth YoY % - Net Sales Growth YoY %',
        conditionDescription: 'Inventory growth outpaces net sales growth by >= 15 percentage points YoY',
        operator: '>',
        thresholdText: 'Inventory YoY% - Sales YoY% >= +15.0%',
        periodRequirement: '>= 2 consecutive quarters or annual comparison',
        severityWeight: 8
      },
      {
        id: 'TRIG-INV-SALES-02',
        metric: 'Finished Goods Inventory Expansion',
        conditionDescription: 'Finished goods inventory increases by > 25% while net sales grow at < 8%',
        operator: 'anomaly_present',
        thresholdText: 'Finished Goods YoY > +25% AND Sales YoY < +8%',
        periodRequirement: 'Annual or Semi-annual disclosure',
        severityWeight: 9
      },
      {
        id: 'TRIG-INV-SALES-03',
        metric: 'Days Sales of Inventory (DSI)',
        conditionDescription: 'Inventory days expand by >= 14 days compared to the 3-year historical median',
        operator: '>',
        thresholdText: 'DSI expands by >= 14 days vs historical median',
        periodRequirement: 'TTM or FY comparison',
        severityWeight: 8
      }
    ],
    relevantMetrics: [
      {
        id: 'met-inv-growth',
        name: 'Inventory YoY Growth %',
        category: 'working_capital',
        standardUnit: '% YoY',
        description: 'Percentage increase in total carrying value of inventories on the balance sheet',
        mandatoryForCalculation: true
      },
      {
        id: 'met-sales-growth',
        name: 'Net Sales YoY Growth %',
        category: 'growth',
        standardUnit: '% YoY',
        description: 'Percentage change in net revenue from operations',
        mandatoryForCalculation: true
      },
      {
        id: 'met-dsi',
        name: 'Days Sales of Inventory (DSI)',
        category: 'working_capital',
        standardUnit: 'Days',
        description: '(Average Inventory / Cost of Goods Sold) * 365 days',
        mandatoryForCalculation: true
      },
      {
        id: 'met-fg-ratio',
        name: 'Finished Goods as % of Total Inventory',
        category: 'working_capital',
        standardUnit: '% of Inventory',
        description: 'Carrying value of finished goods / Total inventory',
        mandatoryForCalculation: false
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-IS-01',
      nodes: {
        'NODE-IS-01': {
          id: 'NODE-IS-01',
          question: 'Is the inventory buildup concentrated in Finished Goods or Raw Materials/WIP?',
          context: 'Finished goods buildup indicates unsold stock and demand resistance; raw material buildup suggests procurement timing or anticipation of price hikes.',
          evaluationLogic: 'Inspect Notes to Financial Statements for Inventory Breakdown.',
          evidenceCheck: 'Notes on Balance Sheet: Inventories (Raw materials, WIP, Finished goods, Stock-in-trade).',
          actionDirective: 'If Finished Goods expanded disproportionately, proceed to demand-lag branch; if Raw Materials, check commodity cycles.',
          yesBranchNodeId: 'NODE-IS-FG',
          noBranchNodeId: 'NODE-IS-RM'
        },
        'NODE-IS-FG': {
          id: 'NODE-IS-FG',
          question: 'Are Days Sales of Inventory (DSI) rising in tandem with promotional discounting or markdown allowances?',
          context: 'Retailers and apparel FMCG often build inventory before forced end-of-season sales or distributor returns.',
          evaluationLogic: 'Calculate DSI and look for changes in gross margin or discount provisions in the concall.',
          evidenceCheck: 'Gross margin trend and concall commentary on "inventory liquidation" or "promotional intensity".',
          actionDirective: 'Flag imminent margin write-down and working capital impairment.',
          terminalHypothesisId: 'HYP-IS-01'
        },
        'NODE-IS-RM': {
          id: 'NODE-IS-RM',
          question: 'Was the raw material accumulation an intentional strategic hedge against anticipated supply shortages or price surges?',
          context: 'Agricultural and packaging input markets often prompt early seasonal crop procurement.',
          evaluationLogic: 'Check commodity price outlook and management statement on procurement strategy.',
          evidenceCheck: 'Management Discussion & Analysis section on supply chain and raw material risks.',
          actionDirective: 'Check if gross margin benefited in subsequent periods due to low-cost inventory.',
          terminalHypothesisId: 'HYP-IS-02'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-IS-01',
        evidenceType: 'annual_report',
        priority: 'primary',
        itemDescription: 'Balance Sheet Inventory line and Notes to Accounts detailing Finished Goods vs Raw Materials',
        disclosureLocation: 'Balance Sheet - Assets - Inventories Note',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-IS-02',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Quarterly Cost of Goods Sold and Revenue figures',
        disclosureLocation: 'Financial Results Statement',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-IS-03',
        evidenceType: 'earnings_concall',
        priority: 'secondary',
        itemDescription: 'Executive remarks regarding pipeline inventory in retail/distributor channels and seasonal stocking',
        disclosureLocation: 'Earnings Conference Call - Operations update',
        extractionMethod: 'management_quote'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-IS-01',
        procedureName: 'Days Sales of Inventory (DSI) & Inventory-Sales Growth Spread',
        formula: 'DSI = (Closing_Inventory / COGS_Annualized) * Days_in_Period; Spread = Inventory_Growth_YoY_Percent - Sales_Growth_YoY_Percent',
        inputVariables: [
          {
            variableName: 'Closing_Inventory',
            description: 'Total carrying value of inventory at period end in Crores',
            unit: 'INR Crores',
            exampleSource: 'Balance sheet asset note'
          },
          {
            variableName: 'COGS_Annualized',
            description: 'Annualized cost of goods sold (Cost of materials + Purchases + Change in inventory)',
            unit: 'INR Crores',
            exampleSource: 'Income statement expenses'
          },
          {
            variableName: 'Days_in_Period',
            description: 'Number of calendar days in the measurement period (e.g. 365 for FY, 180 for H1, 90 for Q)',
            unit: 'Days',
            exampleSource: 'Period definition'
          }
        ],
        deterministicSteps: [
          'Step 1: Compute COGS for the relevant period.',
          'Step 2: Calculate DSI = (Closing Inventory / COGS) * Days in Period.',
          'Step 3: Calculate Spread = ((Current Inv / Prior Inv) - 1)*100 - ((Current Sales / Prior Sales) - 1)*100.',
          'Step 4: Benchmark DSI against company 3-year historical average.'
        ],
        outputMetric: 'DSI_Days',
        outputUnit: 'Days',
        missingDataHandling: 'If quarterly COGS is not broken out from total expenses, estimate COGS strictly from Material Consumption + Inventory Change, disclosing the formula explicitly.',
        assumptionDisclosures: [
          'Calculated using period-end inventory balances.',
          'Assumes 365 days for full year calculations and 90 days for quarterly periods.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-IS-01',
        name: 'Unsold Stock Bottleneck & Demand Resistance',
        businessMechanism: 'Production schedules failed to adjust quickly enough to softening retail off-take, causing finished goods to pile up at distribution hubs and company warehouses.',
        likelihoodPreconditions: 'Finished goods inventory growing at > 2x sales growth; channel inventory reported high by distributors.',
        evidenceRequiredToConfirm: ['Finished goods inventory expansion > 20% YoY', 'DSI increase >= 15 days', 'Concall remarks on "channel inventory rationalisation"'],
        evidenceRequiredToRefute: ['Inventory rapidly liquidating in subsequent quarter with full gross margin intact']
      },
      {
        id: 'HYP-IS-02',
        name: 'Pre-Festival Channel Filling or Store Rollout Buffer',
        businessMechanism: 'Inventory was deliberately staged ahead of an early Diwali/festive season or to stock dozens of newly inaugurated retail outlets.',
        likelihoodPreconditions: 'Reporting period ends immediately prior to major festive shopping quarter (e.g. Q2 before Q3 festive spike).',
        evidenceRequiredToConfirm: ['Subsequent quarter revenue surge absorbing the inventory buffer', 'Store count increase requiring initial inventory fill'],
        evidenceRequiredToRefute: ['Inventory remaining elevated even after festive season concludes']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-IS-01',
        checkTitle: 'Seasonal Festive Staging Alignment Test',
        adversarialQuestion: 'Did the inventory spike occur in Q2 (September 30) ahead of the major Indian festive season (Diwali/Dussehra)?',
        counterDataTarget: 'Historical Q2 inventory levels over the past 5 years.',
        benignExplanation: 'FMCG and retail companies routinely increase inventory by 20-30% at the end of September to fulfill festive demand without stock-outs.',
        testAction: 'Verify whether Q2 inventory expansion is a normal recurring seasonal pattern.'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-IS-01',
        observableMetricOrEvent: 'Inventory liquidation and DSI normalization post-season',
        thresholdOrCriterion: 'DSI declines by >= 12 days in the following quarter without requiring gross margin write-downs > 50 bps',
        observationWindow: 'Following quarterly financial results',
        reassessmentConsequence: 'Proves the inventory buildup was deliberate and successfully monetized, disproving the demand destruction hypothesis.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Operational & Working Capital Anomaly: Inventory Disconnect',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Breakdown of finished goods vs raw materials', 'Historical seasonal inventory comparison', 'Distributor pipeline checks'],
      requiredQuantitativeOutputs: ['Inventory YoY %', 'Net Sales YoY %', 'DSI (Days)', 'Spread (pp)']
    },
    limitations: [
      'Quarterly disclosures often show consolidated inventory without detailed breakdown between raw materials and finished goods (only in Annual Report).',
      'Acquisitions closed during the year automatically inflate reported inventory value.'
    ],
    prerequisites: [
      'Balance sheet inventory balances for comparative periods.'
    ]
  },

  // 5. Distributor Receivables vs Revenue Growth
  {
    id: 'CASELET-05-REC-REV',
    title: 'Distributor Receivables vs Revenue Growth',
    sectorApplicability: ['FMCG', 'Consumer Retail', 'Paints & Decor', 'Apparel Retail'],
    businessProblem:
      'Trade receivables expand at a pace vastly outstripping revenue growth, or Days Sales Outstanding (DSO) escalates rapidly in businesses that traditionally operate on cash-and-carry or strict 7-to-15 day distributor credit. This anomaly frequently reveals "channel stuffing" (pushing excess inventory into trade partners on lenient credit terms to hit quarterly targets), distributor stress, or uncollected revenue.',
    triggerConditions: [
      {
        id: 'TRIG-REC-REV-01',
        metric: 'Trade Receivables YoY % - Revenue YoY % Spread',
        conditionDescription: 'Trade Receivables growth exceeds revenue growth by >= 20 percentage points YoY',
        operator: '>',
        thresholdText: 'Receivables YoY% - Revenue YoY% >= +20.0%',
        periodRequirement: '>= 2 quarters or annual audit',
        severityWeight: 10
      },
      {
        id: 'TRIG-REC-REV-02',
        metric: 'Days Sales Outstanding (DSO) Expansion',
        conditionDescription: 'Days Sales Outstanding increases by >= 10 days over the trailing 12 months',
        operator: '>',
        thresholdText: 'DSO delta >= +10 days',
        periodRequirement: 'TTM or FY comparison',
        severityWeight: 9
      },
      {
        id: 'TRIG-REC-REV-03',
        metric: 'Receivables Aging > 6 months',
        conditionDescription: 'Proportion of trade receivables overdue for > 180 days increases by > 50%',
        operator: '>',
        thresholdText: 'Overdue > 180 days receivables up > 50%',
        periodRequirement: 'Annual report disclosure',
        severityWeight: 8
      }
    ],
    relevantMetrics: [
      {
        id: 'met-rec-growth',
        name: 'Trade Receivables YoY Growth %',
        category: 'working_capital',
        standardUnit: '% YoY',
        description: 'Percentage change in trade receivables on the balance sheet',
        mandatoryForCalculation: true
      },
      {
        id: 'met-dso',
        name: 'Days Sales Outstanding (DSO)',
        category: 'working_capital',
        standardUnit: 'Days',
        description: '(Trade Receivables / Net Revenue) * Days in Period',
        mandatoryForCalculation: true
      },
      {
        id: 'met-credit-period',
        name: 'Contractual Distributor Credit Period',
        category: 'working_capital',
        standardUnit: 'Days',
        description: 'Standard contractual settlement period agreed with stockists and distributors',
        mandatoryForCalculation: false
      },
      {
        id: 'met-allowance-doubtful',
        name: 'Expected Credit Loss (ECL) Allowance %',
        category: 'working_capital',
        standardUnit: '% of Receivables',
        description: 'Allowance for credit-impaired trade balances under Ind AS 109',
        mandatoryForCalculation: false
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-RR-01',
      nodes: {
        'NODE-RR-01': {
          id: 'NODE-RR-01',
          question: 'Are Trade Receivables growing substantially faster than Net Revenue?',
          context: 'Consumer FMCG companies in India usually enjoy high trade velocity with minimal debtor balances.',
          evaluationLogic: 'Compare Receivables YoY % growth vs Revenue YoY % growth.',
          evidenceCheck: 'Balance Sheet: Current Assets - Trade Receivables.',
          actionDirective: 'Calculate DSO and compare against 5-year benchmark.',
          yesBranchNodeId: 'NODE-RR-02',
          noBranchNodeId: 'NODE-RR-03'
        },
        'NODE-RR-02': {
          id: 'NODE-RR-02',
          question: 'Is the receivables surge driven by Modern Trade / E-Commerce / Institutional accounts rather than General Trade (Kirana)?',
          context: 'Modern trade supermarket chains and quick-commerce platforms demand 30-60 day credit terms, whereas traditional kirana stockists operate on 7-10 days.',
          evaluationLogic: 'Check channel mix disclosures in Investor Presentation.',
          evidenceCheck: 'Investor Deck slide on Channel Mix (Modern Trade % vs General Trade % vs E-Com %).',
          actionDirective: 'If modern trade share expanded rapidly, the DSO increase is an expected channel mix consequence rather than channel stuffing.',
          yesBranchNodeId: 'NODE-RR-CHAN',
          noBranchNodeId: 'NODE-RR-STUFF'
        },
        'NODE-RR-STUFF': {
          id: 'NODE-RR-STUFF',
          question: 'Did the surge occur at the tail-end of Q4 / fiscal year end to satisfy executive bonus targets?',
          context: 'Channel stuffing typically involves booking shipments in the final 2 weeks of March with extended payment terms.',
          evaluationLogic: 'Compare Q4 receivables against Q3 and Q1 of subsequent year.',
          evidenceCheck: 'Quarterly sequential changes in trade receivables and subsequent sales returns.',
          actionDirective: 'Flag aggressive revenue recognition and risk of subsequent quarter destocking.',
          terminalHypothesisId: 'HYP-RR-01'
        },
        'NODE-RR-CHAN': {
          id: 'NODE-RR-CHAN',
          question: 'Are institutional receivables causing working capital drag despite creditworthiness?',
          context: 'Organised retail chains pose lower default risk but compress operating cash flow conversion.',
          evaluationLogic: 'Verify aging schedule in Annual Report Notes to Accounts (Ind AS Aging table).',
          evidenceCheck: 'Trade Receivables Aging Schedule in Annual Report Notes.',
          actionDirective: 'Attribute to structural channel evolution with working capital financing implications.',
          terminalHypothesisId: 'HYP-RR-02'
        },
        'NODE-RR-03': {
          id: 'NODE-RR-03',
          question: 'Did the company switch to bill discounting or non-recourse factoring to cosmetically depress receivables?',
          context: 'Factoring trade debts removes them from the balance sheet while incurring financing charges.',
          evaluationLogic: 'Check Contingent Liabilities notes for bills discounted with banks.',
          evidenceCheck: 'Notes on Contingent Liabilities and Commitments - Bills Discounted.',
          actionDirective: 'Add back factored receivables to calculate true operational DSO.',
          terminalHypothesisId: 'HYP-RR-03'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-RR-01',
        evidenceType: 'annual_report',
        priority: 'primary',
        itemDescription: 'Trade Receivables line item, Aging Schedule, and Expected Credit Loss (ECL) disclosures',
        disclosureLocation: 'Balance Sheet - Note on Trade Receivables',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-RR-02',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Quarterly and Annual Net Revenue from Operations',
        disclosureLocation: 'Statement of Profit and Loss',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-RR-03',
        evidenceType: 'investor_presentation',
        priority: 'secondary',
        itemDescription: 'Channel mix breakdown (General Trade vs Modern Trade vs E-Commerce / Quick Commerce)',
        disclosureLocation: 'Investor Presentation - Go-To-Market distribution slide',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-RR-04',
        evidenceType: 'channel_check',
        priority: 'secondary',
        itemDescription: 'Distributor association feedback (e.g. AICPDF - All India Consumer Products Distributors Federation statements)',
        disclosureLocation: 'Trade association press releases and news coverage',
        extractionMethod: 'management_quote'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-RR-01',
        procedureName: 'Days Sales Outstanding (DSO) & Receivables Elasticity',
        formula: 'DSO = (Trade_Receivables / Net_Revenue) * Days_in_Period; Elasticity = Receivables_Growth_YoY_Percent / Revenue_Growth_YoY_Percent',
        inputVariables: [
          {
            variableName: 'Trade_Receivables',
            description: 'Carrying value of trade receivables at period end in Crores',
            unit: 'INR Crores',
            exampleSource: 'Balance sheet current assets'
          },
          {
            variableName: 'Net_Revenue',
            description: 'Revenue from operations over the measurement period in Crores',
            unit: 'INR Crores',
            exampleSource: 'Statement of profit and loss'
          },
          {
            variableName: 'Days_in_Period',
            description: 'Number of calendar days in the measurement period (365 for FY, 90 for Q)',
            unit: 'Days',
            exampleSource: 'Period definition'
          }
        ],
        deterministicSteps: [
          'Step 1: Extract Trade Receivables and Net Revenue for corresponding period.',
          'Step 2: Calculate DSO = (Trade Receivables / Net Revenue) * Days in Period.',
          'Step 3: Calculate Receivables Elasticity = Receivables Growth % / Revenue Growth %.',
          'Step 4: Compute DSO Delta = Current DSO - Benchmark DSO.'
        ],
        outputMetric: 'DSO_Days',
        outputUnit: 'Days',
        missingDataHandling: 'If receivables are only published semi-annually (H1 and FY), compute DSO for those exact periods; never fabricate interim quarter receivables balances.',
        assumptionDisclosures: [
          'Assumes net revenue is distributed evenly across the period unless monthly data is provided.',
          'Uses gross trade receivables before ECL allowance when measuring channel credit exposure.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-RR-01',
        name: 'End-of-Period Channel Stuffing',
        businessMechanism: 'The company extended extraordinary 45-to-60 day credit lines to stockists to push inventory off its own balance sheet before period-end, leading to an optical sales beat that will depress subsequent orders.',
        likelihoodPreconditions: 'DSO jumping by > 12 days; General Trade still representing > 70% of business; sales decelerating sharply in next quarter.',
        evidenceRequiredToConfirm: ['Receivables YoY growth > 30% while sales growth < 10%', 'Subsequent quarter revenue deceleration', 'Distributor pushback reported in trade press'],
        evidenceRequiredToRefute: ['Normal collection within 30 days of period close with cash confirmed in bank balances']
      },
      {
        id: 'HYP-RR-02',
        name: 'Structural Modern Trade & Quick-Commerce Mix Dilution',
        businessMechanism: 'The company has successfully expanded in Modern Retail chains and Quick-Commerce dark store networks, which contractually operate on longer credit cycles (30-45 days) compared to cash kiranas.',
        likelihoodPreconditions: 'Modern trade and E-Commerce contribution rising from < 15% to > 25% of total business.',
        evidenceRequiredToConfirm: ['Disclosed modern trade growth outpacing general trade by 2x', 'Negligible bad debt provisions (< 0.5% of sales)'],
        evidenceRequiredToRefute: ['Receivables ballooning inside traditional general trade distribution channels']
      },
      {
        id: 'HYP-RR-03',
        name: 'Off-Balance-Sheet Receivables Factoring',
        businessMechanism: 'Reported receivables appear low because the company entered into vendor financing or receivable discounting agreements with commercial banks.',
        likelihoodPreconditions: 'Finance costs rising unexpectedly despite stable reported debt levels.',
        evidenceRequiredToConfirm: ['Disclosures on non-recourse discounting in notes to accounts', 'Higher other financial charges'],
        evidenceRequiredToRefute: ['Absence of any bill discounting lines in contingent liabilities']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-RR-01',
        checkTitle: 'Credit Quality & Default Impairment Check',
        adversarialQuestion: 'Are the expanded receivables actually turning into bad debts, or are they being paid reliably by creditworthy blue-chip modern retailers?',
        counterDataTarget: 'Expected Credit Loss (ECL) allowance and bad debts written off in the P&L.',
        benignExplanation: 'If bad debts remain near zero and customers are established retail chains (e.g. DMart, Reliance Retail, Amazon), the credit expansion represents normal working capital terms of modern commerce, not uncollectible phantom sales.',
        testAction: 'Evaluate ECL allowance as % of gross trade receivables across 3 years.'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-RR-01',
        observableMetricOrEvent: 'Cash collections and DSO reversion',
        thresholdOrCriterion: 'DSO normalizes back to within 3 days of historical median in the subsequent reporting period',
        observationWindow: 'Subsequent half-yearly or annual audited results',
        reassessmentConsequence: 'Invalidates persistent channel stuffing; confirms temporary quarter-end shipment timing cluster.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Revenue Quality & Channel Credit Risk Anomaly',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Audited Balance Sheet receivables disclosure', 'Channel mix granularity', 'ECL aging schedule disclosure'],
      requiredQuantitativeOutputs: ['Trade Receivables (INR Cr)', 'Revenue (INR Cr)', 'DSO (Days)', 'Receivables YoY %', 'DSO Delta (Days)']
    },
    limitations: [
      'Disclosures of receivables breakdown by channel (General Trade vs Modern Trade) are typically voluntary rather than statutory.',
      'Export receivables often carry letter of credit backing which mitigates credit risk regardless of DSO elongation.'
    ],
    prerequisites: [
      'Reported Trade Receivables figure from audited Balance Sheet or half-yearly review.'
    ]
  },

  // 6. Store Expansion vs Store Productivity
  {
    id: 'CASELET-06-STORE-PROD',
    title: 'Store Expansion vs Store Productivity',
    sectorApplicability: ['Consumer Retail', 'Apparel Retail', 'Footwear', 'QSR'],
    businessProblem:
      'A retail chain or quick-service restaurant operator aggressively adds new store footprint, driving top-line revenue growth, but revenue per square foot, sales per store, or Same-Store Sales Growth (SSSG / LFL) stagnates or declines. This reveals footprint cannibalisation, diminishing returns from secondary town expansion, or new stores failing to reach maturity economics.',
    triggerConditions: [
      {
        id: 'TRIG-STORE-PROD-01',
        metric: 'Store Count YoY % vs Like-for-Like (SSSG) Growth %',
        conditionDescription: 'Total retail stores or square footage expands by >= 20% YoY while SSSG turns negative or drops below inflation (< 3%)',
        operator: 'divergence',
        thresholdText: 'Store Count YoY >= +20% AND SSSG < +3.0%',
        periodRequirement: '>= 2 quarters',
        severityWeight: 9
      },
      {
        id: 'TRIG-STORE-PROD-02',
        metric: 'Revenue per Square Foot YoY Delta',
        conditionDescription: 'Revenue per operating square foot declines by >= 6% YoY',
        operator: '<',
        thresholdText: 'Sales per Sq Ft YoY <= -6.0%',
        periodRequirement: '>= 2 consecutive quarters',
        severityWeight: 8
      },
      {
        id: 'TRIG-STORE-PROD-03',
        metric: 'Store-Level EBITDA vs Corporate Lease Liabilities',
        conditionDescription: 'Ind AS 116 Lease liabilities grow by > 35% while store-level operating profit grows by < 15%',
        operator: 'divergence',
        thresholdText: 'Lease Liabilities Growth > +35% AND Store EBITDA Growth < +15%',
        periodRequirement: 'Fiscal Year comparison',
        severityWeight: 9
      }
    ],
    relevantMetrics: [
      {
        id: 'met-store-count',
        name: 'Total Store Count / Retail Area (Sq Ft)',
        category: 'productivity',
        standardUnit: 'Stores / Lakh Sq Ft',
        description: 'Total number of operating retail stores and cumulative retail area',
        mandatoryForCalculation: true
      },
      {
        id: 'met-sssg',
        name: 'Same-Store Sales Growth (SSSG / LFL)',
        category: 'productivity',
        standardUnit: '% YoY',
        description: 'Year-over-year revenue growth generated by stores open for at least 12 or 24 full months',
        mandatoryForCalculation: true
      },
      {
        id: 'met-sales-sqft',
        name: 'Revenue per Square Foot',
        category: 'productivity',
        standardUnit: 'INR / Sq Ft / Month',
        description: 'Retail revenue divided by total weighted average operating retail area',
        mandatoryForCalculation: true
      },
      {
        id: 'met-lease-liability',
        name: 'Lease Liabilities (Ind AS 116)',
        category: 'working_capital',
        standardUnit: 'INR Crores',
        description: 'Present value of future operating lease commitments for retail stores',
        mandatoryForCalculation: false
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-SP-01',
      nodes: {
        'NODE-SP-01': {
          id: 'NODE-SP-01',
          question: 'Does the company report SSSG / Like-for-Like (LFL) growth or square footage metrics in quarterly updates?',
          context: 'Retailers like Trent (Zudio, Westside), Avenue Supermarts (DMart), Titan (Tanishq), and Jubilant FoodWorks report store counts and SSSG.',
          evaluationLogic: 'Inspect Investor Presentations and quarterly operational disclosures.',
          evidenceCheck: 'Investor Presentation - Store Network and SSSG Slide.',
          actionDirective: 'If SSSG is disclosed, evaluate LFL trend; if not disclosed, compute Revenue per Average Store.',
          yesBranchNodeId: 'NODE-SP-02',
          noBranchNodeId: 'NODE-SP-CALC'
        },
        'NODE-SP-02': {
          id: 'NODE-SP-02',
          question: 'Is SSSG turning negative or lagging consumer price inflation despite heavy new store openings?',
          context: 'Top-line growth masks store-level demand exhaustion when mature stores stop growing.',
          evaluationLogic: 'Compare SSSG % with Consumer CPI inflation and aggregate sales growth.',
          evidenceCheck: 'Track SSSG % across last 4 quarters.',
          actionDirective: 'Distinguish between mature store cannibalisation and store vintage maturation lag.',
          yesBranchNodeId: 'NODE-SP-03',
          noBranchNodeId: 'NODE-SP-04'
        },
        'NODE-SP-03': {
          id: 'NODE-SP-03',
          question: 'Is store cannibalisation occurring due to clustering multiple outlets within the same catchment?',
          context: 'Fast-growing retail concepts often open sister stores within 2-3 km, stealing footfalls from flagship stores.',
          evaluationLogic: 'Inspect geographic store addition patterns and city penetration depth in disclosures.',
          evidenceCheck: 'Check disclosures on store density in Top 10 cities vs Tier-2/3 expansion.',
          actionDirective: 'Flag risk of operating deleverage when new store ramp-up fails to offset fixed rent/staff costs.',
          terminalHypothesisId: 'HYP-SP-01'
        },
        'NODE-SP-04': {
          id: 'NODE-SP-04',
          question: 'Is the sales-per-sqft dilution an optical effect of expanding into lower-rent Tier-2/3/4 towns with smaller revenue but higher ROCE?',
          context: 'Tier 3 stores have lower absolute sales per sq ft, but much lower occupancy costs and Capex, resulting in equal or higher store return on capital.',
          evaluationLogic: 'Compare store-level occupancy cost % and store payback periods in non-metro towns.',
          evidenceCheck: 'Management remarks on Tier-2/3 store payback economics.',
          actionDirective: 'Validate unit economics before assuming destructive productivity loss.',
          terminalHypothesisId: 'HYP-SP-02'
        },
        'NODE-SP-CALC': {
          id: 'NODE-SP-CALC',
          question: 'Can average revenue per store be deterministically calculated from store count and segment revenue?',
          context: 'Average Revenue per Store = Segment Retail Revenue / Average Operating Stores during the period.',
          evaluationLogic: 'Compute (Revenue / ((Start Stores + End Stores) / 2)).',
          evidenceCheck: 'Segment revenue and start/end store count numbers.',
          actionDirective: 'Proceed with calculated store density metric and state limitation regarding new store maturation lag.',
          divergentBranchNodeId: 'NODE-SP-02'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-SP-01',
        evidenceType: 'investor_presentation',
        priority: 'primary',
        itemDescription: 'Quarterly store additions, total retail space in sq ft, and disclosed SSSG / LFL growth %',
        disclosureLocation: 'Investor Presentation - Store Network and Key Operational Metrics',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-SP-02',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Retail Segment Revenue from Operations',
        disclosureLocation: 'Segment Reporting Note in Financial Results',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-SP-03',
        evidenceType: 'annual_report',
        priority: 'secondary',
        itemDescription: 'Ind AS 116 Lease liabilities schedule and store closure disclosures',
        disclosureLocation: 'Notes on Leases and Property, Plant and Equipment additions',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-SP-04',
        evidenceType: 'earnings_concall',
        priority: 'secondary',
        itemDescription: 'Management commentary on new store payback periods, Tier 2/3 performance, and mature store footfalls',
        disclosureLocation: 'Earnings Conference Call Transcript',
        extractionMethod: 'management_quote'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-SP-01',
        procedureName: 'Revenue per Store & Productivity Dilution Calculation',
        formula: 'Avg_Stores = (Beginning_Stores + Ending_Stores) / 2; Rev_Per_Store = Retail_Revenue / Avg_Stores; Sales_SqFt = Retail_Revenue / Weighted_SqFt',
        inputVariables: [
          {
            variableName: 'Retail_Revenue',
            description: 'Segment net sales from retail store operations in Crores',
            unit: 'INR Crores',
            exampleSource: 'Segment financial disclosures'
          },
          {
            variableName: 'Beginning_Stores',
            description: 'Number of operating stores at start of period',
            unit: 'Stores',
            exampleSource: 'Quarterly investor presentation'
          },
          {
            variableName: 'Ending_Stores',
            description: 'Number of operating stores at end of period',
            unit: 'Stores',
            exampleSource: 'Quarterly investor presentation'
          }
        ],
        deterministicSteps: [
          'Step 1: Compute Average Store Count = (Beginning Stores + Ending Stores) / 2.',
          'Step 2: Calculate Average Revenue per Store = Retail Revenue / Average Store Count.',
          'Step 3: Calculate YoY Change in Average Revenue per Store = ((Current Rev per Store / Prior Rev per Store) - 1) * 100.',
          'Step 4: Contrast YoY Change in Average Revenue per Store against headline retail revenue growth.'
        ],
        outputMetric: 'Revenue_Per_Store_YoY_Delta_Percent',
        outputUnit: '% YoY',
        missingDataHandling: 'If new store additions are heavily backloaded in the final month of the quarter, note the distortion in average store count and disclose assumption.',
        assumptionDisclosures: [
          'Assumes uniform store opening timing across the quarter when exact opening dates are not disclosed.',
          'Excludes franchise stores if revenues reflect wholesale supply rather than retail customer throughput.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-SP-01',
        name: 'Footprint Cannibalisation & Premature Saturation',
        businessMechanism: 'The chain expanded beyond core metropolitan demand into marginal catchment areas or opened stores too close to existing outlets, diluting footfalls and pushing existing stores below break-even EBITDA.',
        likelihoodPreconditions: 'Store count growing > 25% while SSSG turns negative; rent-to-sales ratio increasing.',
        evidenceRequiredToConfirm: ['SSSG negative for 2+ consecutive quarters', 'Store closures rising in mature locations', 'Revenue per sq ft declining > 8% YoY'],
        evidenceRequiredToRefute: ['SSSG recovering to double digits as new stores ramp up beyond month 12']
      },
      {
        id: 'HYP-SP-02',
        name: 'Deliberate Tier 2/3 Value-Store Unit Economics',
        businessMechanism: 'The retailer intentionally targeted lower-cost micro-markets with smaller revenue potential per store but dramatically lower occupancy and employee costs, preserving or expanding store ROCE.',
        likelihoodPreconditions: 'Rental cost per square foot dropping faster than revenue per square foot; store Capex per store declining.',
        evidenceRequiredToConfirm: ['Store-level EBITDA margins stable despite lower revenue density', 'Lower payback period (< 24 months) disclosed in concalls'],
        evidenceRequiredToRefute: ['Corporate EBITDA margins compressing rapidly under unabsorbed lease liabilities']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-SP-01',
        checkTitle: 'Vintage Curve Maturation Lag Test',
        adversarialQuestion: 'Are the newly opened stores simply in their early 6-to-12 month vintage ramp-up phase before reaching full mature sales density?',
        counterDataTarget: 'Historical store vintage ramp-up curve disclosures.',
        benignExplanation: 'A retail concept like Zudio or DMart typically takes 9 to 18 months for a newly opened store to reach steady-state throughput. High opening velocity creates a transient optical dip in average store productivity.',
        testAction: 'Analyze store vintage cohort performance if disclosed in investor presentations.'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-SP-01',
        observableMetricOrEvent: 'Same-Store Sales Growth (SSSG) inflection in mature cohorts',
        thresholdOrCriterion: 'SSSG in stores older than 18 months reaches >= 8% YoY alongside positive store-level EBITDA expansion',
        observationWindow: 'Subsequent 2 quarters',
        reassessmentConsequence: 'Disproves cannibalisation; demonstrates that productivity moderation was an optical artifact of rapid rollout.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Retail Economics & Network Productivity Anomaly',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Availability of audited retail segment figures', 'Disclosed SSSG vs inferred store density', 'Store vintage disclosure clarity'],
      requiredQuantitativeOutputs: ['Store Count', 'Store Growth % YoY', 'SSSG %', 'Revenue per Store (INR Cr)', 'Sales per Sq Ft (INR)']
    },
    limitations: [
      'Pure-play FMCG distributors without company-owned retail outlets are not applicable for store productivity playbooks.',
      'Franchise-operated stores (FOFO) obscure retail sales if company only records wholesale royalty.'
    ],
    prerequisites: [
      'Reported retail store count or square footage disclosures across at least 2 comparable fiscal periods.'
    ]
  },

  // 7. Management Narrative vs Independent Evidence
  {
    id: 'CASELET-07-NARR-EVID',
    title: 'Management Narrative vs Independent Evidence',
    sectorApplicability: ['FMCG', 'Consumer Retail', 'Paints & Decor', 'QSR', 'Apparel Retail', 'Footwear'],
    businessProblem:
      'Executive commentary in press releases, annual report letters, and media interviews paints a bullish narrative of "broad-based rural recovery", "premiumisation tailwinds", or "unprecedented market share gains", while disclosed statutory segment results, tax payments, volume trends, or independent market data (NielsenIQ, Kantar, GST collections, registrar filings) show stagnation, contraction, or competitive erosion.',
    triggerConditions: [
      {
        id: 'TRIG-NARR-EVID-01',
        metric: 'Narrative Tone vs Volume / Segment Reality',
        conditionDescription: 'Executive leadership claims "strong demand / market share surge" while volume growth is <= 2% or segment EBIT declines',
        operator: 'mismatch',
        thresholdText: 'Bullish qualitative guidance alongside UVG <= 2.0% or Segment EBIT drop',
        periodRequirement: 'Current reporting period',
        severityWeight: 9
      },
      {
        id: 'TRIG-NARR-EVID-02',
        metric: 'Rural Demand Claim vs Independent Consumer Indices',
        conditionDescription: 'Company claims "rural recovery leading growth" while FMCG rural volume indices (Nielsen/Kantar) or agricultural wage growth report contraction',
        operator: 'divergence',
        thresholdText: 'Company rural claim positive vs independent FMCG rural barometer negative',
        periodRequirement: '>= 2 quarters',
        severityWeight: 8
      }
    ],
    relevantMetrics: [
      {
        id: 'met-narrative-sentiment',
        name: 'Qualitative Claim Classification',
        category: 'narrative',
        standardUnit: 'Categorical Claim',
        description: 'Verbatim quotes from MD&A, CEO Letter, or Concall regarding demand, rural recovery, and market share',
        mandatoryForCalculation: false
      },
      {
        id: 'met-statutory-segment-ebit',
        name: 'Reported Segment Revenue & EBIT Growth %',
        category: 'profitability',
        standardUnit: '% YoY',
        description: 'Audited statutory segment revenue and operating profit',
        mandatoryForCalculation: true
      },
      {
        id: 'met-independent-market-share',
        name: 'Independent Market Share & Category Volume (Nielsen/Kantar)',
        category: 'growth',
        standardUnit: '% Share / % YoY Volume',
        description: 'Third-party audited off-take data from retail scanning panels',
        mandatoryForCalculation: false
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-NE-01',
      nodes: {
        'NODE-NE-01': {
          id: 'NODE-NE-01',
          question: 'What specific measurable claim did executive management assert in the earnings release or concall?',
          context: 'Identify exact claims: e.g. "gained market share in 80% of portfolio", "rural demand growing faster than urban", "premium segment growing at 30%".',
          evaluationLogic: 'Extract verbatim statement from MD&A or earnings transcript.',
          evidenceCheck: 'Investor Deck Slide 2 or CEO Opening Remarks.',
          actionDirective: 'Select the primary testable claim and cross-reference with audited note disclosures.',
          yesBranchNodeId: 'NODE-NE-02',
          noBranchNodeId: 'NODE-NE-NULL'
        },
        'NODE-NE-02': {
          id: 'NODE-NE-02',
          question: 'Do the audited statutory numbers (segment P&L, balance sheet) substantiate or contradict the verbal claim?',
          context: 'Statements of "broad-based growth" are frequently undermined by a single segment carrying the company while core segments decline.',
          evaluationLogic: 'Check individual segment revenue and EBIT lines in Ind AS 108 Segment Reporting note.',
          evidenceCheck: 'Segment Reporting Note in Financial Results.',
          actionDirective: 'If only 1 out of 4 segments grew, flag claim as selective disclosure / narrative spin.',
          yesBranchNodeId: 'NODE-NE-03',
          noBranchNodeId: 'NODE-NE-04'
        },
        'NODE-NE-03': {
          id: 'NODE-NE-03',
          question: 'Does independent category data (NielsenIQ/Kantar/Competitor Filings) support the company\'s market share assertion?',
          context: 'When an FMCG firm claims share gains while reporting flat volume, it implies the entire category collapsed by more, or the share definition is cherry-picked.',
          evaluationLogic: 'Compare target company growth with direct listed competitors in the same segment.',
          evidenceCheck: 'Competitor results for the identical quarter and public Nielsen summary reports.',
          actionDirective: 'Flag divergence between self-reported narrative and external peer data.',
          terminalHypothesisId: 'HYP-NE-01'
        },
        'NODE-NE-04': {
          id: 'NODE-NE-04',
          question: 'Is the discrepancy explained by geographic or channel definitions (e.g. urban vs rural, direct vs wholesale)?',
          context: 'Management claims may refer strictly to direct coverage outlets rather than national wholesale pipelines.',
          evaluationLogic: 'Check footnotes in presentation on definition of "coverage" or "market".',
          evidenceCheck: 'Presentation footnote defining sample size or channel coverage.',
          actionDirective: 'Note channel definition mismatch as an explanatory factor.',
          terminalHypothesisId: 'HYP-NE-02'
        },
        'NODE-NE-NULL': {
          id: 'NODE-NE-NULL',
          question: 'Are there verifiable forward-looking management guidance statements on record?',
          context: 'Track prior period guidance against actual delivered results.',
          evaluationLogic: 'Compare guidance given 2 quarters ago against today\'s audited results.',
          evidenceCheck: 'Previous quarter concall transcript guidance section.',
          actionDirective: 'Calculate guidance execution variance.',
          divergentBranchNodeId: 'NODE-NE-02'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-NE-01',
        evidenceType: 'earnings_concall',
        priority: 'primary',
        itemDescription: 'Verbatim quotes from Managing Director / CEO on demand strength and category leadership',
        disclosureLocation: 'Quarterly Earnings Call Transcript - Management Address',
        extractionMethod: 'management_quote'
      },
      {
        id: 'EVID-NE-02',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Segment-wise Revenue and Segment Results (EBIT) as per Ind AS 108',
        disclosureLocation: 'Financial Results - Segment Information Note',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-NE-03',
        evidenceType: 'industry_benchmark',
        priority: 'secondary',
        itemDescription: 'NielsenIQ FMCG category growth tracker and competitor financial releases',
        disclosureLocation: 'Industry publications, competitor quarterly investor decks',
        extractionMethod: 'competitor_comparison'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-NE-01',
        procedureName: 'Narrative-Fact Divergence Matrix & Guidance Execution Index',
        formula: 'Segment_Breadth_Ratio = Number_of_Growing_Segments / Total_Reporting_Segments; Guidance_Variance = Actual_Delivered_Growth - Prior_Guidance_Midpoint',
        inputVariables: [
          {
            variableName: 'Growing_Segments',
            description: 'Count of business segments displaying positive YoY volume or EBIT growth',
            unit: 'Count',
            exampleSource: 'Segment reporting note'
          },
          {
            variableName: 'Total_Segments',
            description: 'Total number of reportable business segments',
            unit: 'Count',
            exampleSource: 'Segment reporting note'
          }
        ],
        deterministicSteps: [
          'Step 1: Tally total reported business segments.',
          'Step 2: Calculate how many segments achieved revenue growth > inflation and positive EBIT delta.',
          'Step 3: Compute Segment Breadth Ratio = Growing Segments / Total Segments.',
          'Step 4: If Breadth Ratio < 0.50 while management claims "broad-based growth", score contradiction as HIGH.'
        ],
        outputMetric: 'Segment_Breadth_Ratio',
        outputUnit: 'Ratio (0.0 - 1.0)',
        missingDataHandling: 'If company only operates in a single statutory segment, analyze product brand commentary and regional disclosures.',
        assumptionDisclosures: [
          'Based strictly on statutory operating segment definitions approved by company auditors.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-NE-01',
        name: 'Selective Disclosure & Narrative Over-Optimism',
        businessMechanism: 'Leadership highlighted fast-growing premium or niche categories (representing < 15% of business) to distract from broad-based volume declines in core legacy portfolios.',
        likelihoodPreconditions: 'Core mass brands declining in volume; executive presentation disproportionately showcasing premium new launches.',
        evidenceRequiredToConfirm: ['Segment Breadth Ratio < 0.50', 'Disclosed core category volumes flat/negative', 'Concall questions questioning gap between narrative and P&L'],
        evidenceRequiredToRefute: ['Subsequent quarter confirming broad-based volume acceleration across mass brands']
      },
      {
        id: 'HYP-NE-02',
        name: 'Lagging Official Data vs Leading Direct Distributor Visibility',
        businessMechanism: 'Management remarks reflect live, real-time primary billing data from their direct distributor management system (DMS), which has not yet surfaced in quarterly reporting due to channel transit times.',
        likelihoodPreconditions: 'DMS automated network connecting > 1 million retail kiranas directly.',
        evidenceRequiredToConfirm: ['Next quarter results decisively confirming the predicted recovery', 'DMS primary off-take verified by auditors'],
        evidenceRequiredToRefute: ['Next quarter delivering another growth miss and narrative pivot']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-NE-01',
        checkTitle: 'Metric Definition Semantic Alignment Check',
        adversarialQuestion: 'Was management referring to "value market share" while the analyst was evaluating "volume market share"?',
        counterDataTarget: 'Presentation footnotes on value vs volume market share definitions.',
        benignExplanation: 'A premiumising company can legitimately gain value market share while losing volume market share if its realization per unit expands faster than competitors.',
        testAction: 'Verify whether the claimed metric is value-based or unit-volume-based.'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-NE-01',
        observableMetricOrEvent: 'Broad-based segment turnaround in following audited period',
        thresholdOrCriterion: 'At least 75% of reportable segments deliver positive volume and EBIT growth in the next statutory filing',
        observationWindow: 'Next quarterly results',
        reassessmentConsequence: 'Validates management foresight; disproves narrative spin.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Governance & Narrative-Reality Divergence Anomaly',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Exact verbatim quote citation', 'Statutory segment evidence clarity', 'Third-party market share panel corroboration'],
      requiredQuantitativeOutputs: ['Claimed Trend', 'Actual Segment Growth %', 'Segment Breadth Ratio', 'Volume Trend %']
    },
    limitations: [
      'Qualitative sentiment analysis requires rigorous verbatim context to avoid mischaracterizing executive statements.',
      'Third-party retail audit panels (Nielsen/Kantar) have coverage gaps in rural traditional trade and quick-commerce.'
    ],
    prerequisites: [
      'Official investor presentation or audited concall transcript containing verifiable executive statements.'
    ]
  },

  // 8. Company Performance vs Industry Performance
  {
    id: 'CASELET-08-COMP-IND',
    title: 'Company Performance vs Industry Performance',
    sectorApplicability: ['FMCG', 'Consumer Retail', 'Paints & Decor', 'QSR', 'Apparel Retail'],
    businessProblem:
      'A company\'s financial results diverge sharply from the broader industry or its direct peer cohort. When a company underperforms or overperforms its competitors by a wide margin in identical macroeconomic and raw material conditions, the variance cannot be explained by general sector headwinds or tailwinds, uncovering firm-specific operational vulnerabilities, strategic missteps, or unique competitive moats.',
    triggerConditions: [
      {
        id: 'TRIG-COMP-IND-01',
        metric: 'Revenue Growth vs Peer Cohort Benchmark',
        conditionDescription: 'Revenue growth lags peer median growth by >= 8 percentage points for 2+ consecutive quarters',
        operator: '<',
        thresholdText: 'Company Rev Growth - Peer Median Rev Growth <= -8.0%',
        periodRequirement: '>= 2 quarters',
        severityWeight: 9
      },
      {
        id: 'TRIG-COMP-IND-02',
        metric: 'Operating Margin Divergence from Sector Trend',
        conditionDescription: 'Operating margin contracts by >= 200 bps while peer group average margin expands or remains stable',
        operator: 'divergence',
        thresholdText: 'Company Margin Delta <= -200 bps while Peer Margin Delta >= 0 bps',
        periodRequirement: '>= 2 quarters',
        severityWeight: 8
      }
    ],
    relevantMetrics: [
      {
        id: 'met-target-rev-growth',
        name: 'Target Company Revenue Growth %',
        category: 'growth',
        standardUnit: '% YoY',
        description: 'Reported net sales growth of the target company',
        mandatoryForCalculation: true
      },
      {
        id: 'met-peer-median-growth',
        name: 'Peer Cohort Median Revenue Growth %',
        category: 'growth',
        standardUnit: '% YoY',
        description: 'Median revenue growth across top 3-4 direct listed peers in the same product category',
        mandatoryForCalculation: true
      },
      {
        id: 'met-margin-spread',
        name: 'Operating Margin Differential',
        category: 'profitability',
        standardUnit: 'basis points (bps)',
        description: 'Company EBITDA margin minus Peer median EBITDA margin',
        mandatoryForCalculation: true
      }
    ],
    diagnosticQuestionTree: {
      rootNodeId: 'NODE-CI-01',
      nodes: {
        'NODE-CI-01': {
          id: 'NODE-CI-01',
          question: 'Are there at least 2 comparable listed peers with matching reporting periods?',
          context: 'Select direct competitors: e.g. Asian Paints vs Berger / Kansai Nerolac; HUL vs ITC / Dabur / Marico; Trent vs DMart / Shoppers Stop.',
          evaluationLogic: 'Verify peer reporting periods align within the same quarter.',
          evidenceCheck: 'Peer quarterly results statements.',
          actionDirective: 'Compile peer comparison table for Revenue YoY % and EBITDA Margin %.',
          yesBranchNodeId: 'NODE-CI-02',
          noBranchNodeId: 'NODE-CI-SEC'
        },
        'NODE-CI-02': {
          id: 'NODE-CI-02',
          question: 'Is the company lagging the peer group in both revenue growth and operating margin?',
          context: 'Dual lag signals competitive share loss rather than a deliberate trade-off between price and volume.',
          evaluationLogic: 'Check if (Company Rev < Peer Median) AND (Company Margin Delta < Peer Margin Delta).',
          evidenceCheck: 'Peer comparative financial matrix.',
          actionDirective: 'Investigate category mix differences, pricing missteps, or channel disruption.',
          yesBranchNodeId: 'NODE-CI-03',
          noBranchNodeId: 'NODE-CI-04'
        },
        'NODE-CI-03': {
          id: 'NODE-CI-03',
          question: 'Did a new entrant or aggressive challenger target the target company\'s core category specifically?',
          context: 'Example: Grasim (Birla Opus) entering decorative paints challenging Asian Paints, or new direct-to-consumer / quick commerce disruptors.',
          evaluationLogic: 'Inspect competitor concall remarks and market entry pricing promotional schemes.',
          evidenceCheck: 'Industry news and competitor capacity additions.',
          actionDirective: 'Attribute divergence to competitive moat erosion and pricing scheme retaliation.',
          terminalHypothesisId: 'HYP-CI-01'
        },
        'NODE-CI-04': {
          id: 'NODE-CI-04',
          question: 'Is the divergence caused by differences in product mix exposure (e.g. urban vs rural, premium vs mass)?',
          context: 'A peer focused on premium personal care may outperform an FMCG peer with 60% exposure to inflation-impacted rural mass foods.',
          evaluationLogic: 'Break down peer revenue by product category and geographic exposure.',
          evidenceCheck: 'Segment disclosures of target company vs peer.',
          actionDirective: 'Disclose category exposure variance as the dominant structural driver.',
          terminalHypothesisId: 'HYP-CI-02'
        },
        'NODE-CI-SEC': {
          id: 'NODE-CI-SEC',
          question: 'Can FMCG sector index (NIFTY FMCG Index or Kantar National FMCG Barometer) be used as proxy benchmark?',
          context: 'Benchmark against NIFTY FMCG aggregate index revenue growth.',
          evaluationLogic: 'Compare company revenue with NIFTY FMCG index revenue aggregate.',
          evidenceCheck: 'NSE India NIFTY FMCG Index quarterly performance report.',
          actionDirective: 'Utilize sectoral index as benchmark with explicit methodology note.',
          divergentBranchNodeId: 'NODE-CI-02'
        }
      }
    },
    requiredEvidence: [
      {
        id: 'EVID-CI-01',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Target company quarterly financial results statement',
        disclosureLocation: 'Financial Results Statement',
        extractionMethod: 'reported_value'
      },
      {
        id: 'EVID-CI-02',
        evidenceType: 'statutory_result',
        priority: 'primary',
        itemDescription: 'Comparative quarterly financial results of 2-3 listed sector peers',
        disclosureLocation: 'Peer BSE/NSE Financial Results Filings',
        extractionMethod: 'competitor_comparison'
      },
      {
        id: 'EVID-CI-03',
        evidenceType: 'earnings_concall',
        priority: 'secondary',
        itemDescription: 'Target and peer concall commentary regarding category pricing battles, dealer schemes, and market share movements',
        disclosureLocation: 'Earnings Call Transcripts across peer group',
        extractionMethod: 'management_quote'
      }
    ],
    calculationProcedures: [
      {
        id: 'CALC-CI-01',
        procedureName: 'Peer Growth Spread & Relative Alpha Calculation',
        formula: 'Peer_Median_Growth = Median(Peer_1_Growth, Peer_2_Growth, Peer_3_Growth); Growth_Alpha = Company_Growth - Peer_Median_Growth',
        inputVariables: [
          {
            variableName: 'Company_Growth',
            description: 'Target company revenue growth percentage YoY',
            unit: '%',
            exampleSource: 'Quarterly financial results'
          },
          {
            variableName: 'Peer_1_Growth',
            description: 'Direct competitor 1 revenue growth YoY',
            unit: '%',
            exampleSource: 'Competitor quarterly results'
          },
          {
            variableName: 'Peer_2_Growth',
            description: 'Direct competitor 2 revenue growth YoY',
            unit: '%',
            exampleSource: 'Competitor quarterly results'
          }
        ],
        deterministicSteps: [
          'Step 1: Verify all peer results cover the identical quarterly calendar window.',
          'Step 2: Calculate median peer revenue growth.',
          'Step 3: Calculate Growth Alpha = Company Growth - Peer Median Growth.',
          'Step 4: Compute Margin Spread Delta = Company Margin YoY bps - Peer Average Margin YoY bps.'
        ],
        outputMetric: 'Relative_Growth_Alpha_pp',
        outputUnit: 'percentage points (pp)',
        missingDataHandling: 'If fewer than 2 direct peers exist, utilize the NIFTY FMCG sectoral aggregate and disclose benchmark limitation.',
        assumptionDisclosures: [
          'Calculated using reported standalone or relevant domestic business segment where possible to ensure apples-to-apples comparison.'
        ]
      }
    ],
    alternativeHypotheses: [
      {
        id: 'HYP-CI-01',
        name: 'Competitive Share Erosion & Price Warfare',
        businessMechanism: 'Aggressive competitive entry or aggressive trade discount schemes by peers caught the company flat-footed, eroding both market share and margin defense.',
        likelihoodPreconditions: 'Company growth lagging peers by > 6 pp; gross margins compressing faster than peer group.',
        evidenceRequiredToConfirm: ['Underperformance across multiple quarters', 'Dealer scheme rebates increased in concall disclosures'],
        evidenceRequiredToRefute: ['Deliberate shedding of unprofitable institutional business']
      },
      {
        id: 'HYP-CI-02',
        name: 'Asymmetric Portfolio Exposure (Mass vs Premium / Urban vs Rural)',
        businessMechanism: 'The company is not losing share within its categories; rather, its specific product categories (e.g. mass detergents or rural commodities) experienced macro headwind while peers benefited from urban luxury or premium segments.',
        likelihoodPreconditions: 'Category-level Kantar data showing mass segment down while premium is up.',
        evidenceRequiredToConfirm: ['Company market share within its specific categories holding flat or growing', 'Peer outperformance driven exclusively by non-overlapping segments'],
        evidenceRequiredToRefute: ['Target company losing share in direct head-to-head identical product categories']
      }
    ],
    counterevidenceChecks: [
      {
        id: 'CHK-CI-01',
        checkTitle: 'Base Effect & Acquisition Distortion Test',
        adversarialQuestion: 'Did peer growth surge purely due to an inorganic acquisition consolidation or an artificially low prior-year base?',
        counterDataTarget: 'Peer M&A disclosures and prior-year quarterly growth figures.',
        benignExplanation: 'A competitor consolidating an acquisition or recovering from a factory shutdown in the base quarter will post optical 25% growth that does not represent true competitive superiority.',
        testAction: 'Normalize peer growth rates for inorganic acquisitions.'
      }
    ],
    falsificationConditions: [
      {
        id: 'FALS-CI-01',
        observableMetricOrEvent: 'Convergence with peer cohort growth rates',
        thresholdOrCriterion: 'Growth gap with peer median narrows to within +/- 2.5 percentage points over the next 2 quarters',
        observationWindow: 'Subsequent 2 quarters',
        reassessmentConsequence: 'Refutes persistent structural uncompetitiveness; confirms transient operational or base-effect anomaly.'
      }
    ],
    expectedOutputSchema: {
      primaryAnomalyClassification: 'Competitive Dynamics & Relative Performance Anomaly',
      requiredReportSections: ['Track and Company', 'The Discovery', 'Why It Matters', 'Evidence', 'Timeline', 'Numbers', 'Counterargument', 'Falsification Condition', 'Evidence Strength'],
      confidenceGradingFactors: ['Peer selection relevance', 'Reporting period alignment', 'Category overlap degree'],
      requiredQuantitativeOutputs: ['Company Growth %', 'Peer Median Growth %', 'Growth Alpha (pp)', 'Margin Delta Spread (bps)']
    },
    limitations: [
      'Multi-category conglomerates (e.g. ITC, Tata Consumer) have diversified revenue streams that cannot be compared to pure-play peers without segment unbundling.',
      'Unlisted competitors (e.g. Amul, Haldirams, regional players) do not publish quarterly filings.'
    ],
    prerequisites: [
      'Quarterly disclosures from target company and at least 2 comparable sector peers.'
    ]
  }
];

export function getCaseletById(id: string): Caselet | undefined {
  return CASELET_LIBRARY.find((c) => c.id === id);
}
