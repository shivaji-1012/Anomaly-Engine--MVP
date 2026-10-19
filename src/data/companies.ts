export interface BusinessSegment {
  name: string;
  shareOfRevenuePercent: number;
  description: string;
  isRetailOrFMCG: boolean;
}

export interface HistoricalQuarter {
  period: string; // e.g. "Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY24"
  revenueCrores: number;
  revenueGrowthYoY: number;
  volumeGrowthYoY?: number;
  grossMarginPercent: number;
  ebitdaMarginPercent: number;
  patCrores: number;
  ocfCrores?: number;
  receivablesCrores?: number;
  dsoDays?: number;
  inventoryCrores?: number;
  dsiDays?: number;
  storeCount?: number;
  sssgPercent?: number;
}

export interface SuggestedAngle {
  id: string;
  title: string;
  description: string;
  anomalyHypothesis: string;
  associatedCaseletId: string;
  priorityScore: number;
}

export interface Company {
  id: string;
  name: string;
  ticker: string;
  exchange: 'NSE' | 'BSE';
  sector: 'FMCG' | 'Consumer Retail' | 'QSR' | 'Apparel Retail' | 'Footwear' | 'Paints & Decor';
  businessModel: 'manufacturing_fmcg' | 'retail_chain' | 'conglomerate' | 'franchise_qsr';
  isFictionalDemo?: boolean;
  businessSegments: BusinessSegment[];
  description: string;
  reportingPeriods: string[];
  suggestedAngles: SuggestedAngle[];
  availableMetricIds: string[];
  historicalFinancials: HistoricalQuarter[];
  keyAnomalies: {
    metric: string;
    description: string;
    observedValue: string | number;
    severity: 'high' | 'medium' | 'low';
    period: string;
  }[];
  sourcesSample: {
    title: string;
    publisher: string;
    url: string;
    period: string;
    type: 'statutory_result' | 'investor_presentation' | 'earnings_concall' | 'industry_benchmark';
  }[];
}

export const NIFTY_COMPANIES: Company[] = [
  // Fictional Demo: Company X
  {
    id: 'comp-fictional-x',
    name: 'Company X (Fictional FMCG Demo)',
    ticker: 'COMPX',
    exchange: 'NSE',
    sector: 'FMCG',
    businessModel: 'manufacturing_fmcg',
    isFictionalDemo: true,
    description:
      'A fictional, simulated mid-to-large Indian FMCG packaged goods manufacturer used for deterministic acceptance testing and demonstration. All figures are synthetic.',
    businessSegments: [
      { name: 'Packaged Foods & Snacks', shareOfRevenuePercent: 58, description: 'Biscuits, noodles, and extruded savory snacks', isRetailOrFMCG: true },
      { name: 'Personal Wash & Grooming', shareOfRevenuePercent: 32, description: 'Soaps, shampoos, and skin creams', isRetailOrFMCG: true },
      { name: 'Wholesale & Commodity Ingredients', shareOfRevenuePercent: 10, description: 'Bulk edible oils and bakery flour', isRetailOrFMCG: false }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Full Year)'],
    suggestedAngles: [
      {
        id: 'angle-rev-vol',
        title: 'Revenue Growth (+15%) vs Volume Stagnation (-1%)',
        description: 'Investigate whether 15% revenue growth is sustainable when unit sales are declining across 3 straight quarters.',
        anomalyHypothesis: 'Headline top-line growth is being buoyed by aggressive price hikes that are eroding underlying consumer demand.',
        associatedCaseletId: 'CASELET-01-REV-VOL',
        priorityScore: 98
      },
      {
        id: 'angle-receivables-rev',
        title: 'Distributor Receivable Days Expansion (28 to 46 Days)',
        description: 'Examine trade receivables growth (+48%) outpacing sales (+15%), indicating channel inventory buildup.',
        anomalyHypothesis: 'Stockists are absorbing excess inventory on relaxed payment terms to meet quarterly management targets.',
        associatedCaseletId: 'CASELET-05-REC-REV',
        priorityScore: 92
      },
      {
        id: 'angle-pat-ocf',
        title: 'PAT Growth (+18%) vs Operating Cash Flow (-14%)',
        description: 'Evaluate why strong reported net profit failed to translate into liquid operating cash flows.',
        anomalyHypothesis: 'Working capital absorption in trade receivables and finished goods is starving the company of operating cash.',
        associatedCaseletId: 'CASELET-02-PAT-OCF',
        priorityScore: 84
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-uvg',
      'met-price-realization',
      'met-pat',
      'met-ocf',
      'met-cash-conversion',
      'met-rec-growth',
      'met-dso',
      'met-inv-growth',
      'met-dsi'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 1210, revenueGrowthYoY: 15.2, volumeGrowthYoY: 0.8, grossMarginPercent: 44.5, ebitdaMarginPercent: 18.2, patCrores: 142, ocfCrores: 110, receivablesCrores: 122, dsoDays: 31, inventoryCrores: 240, dsiDays: 62 },
      { period: 'Q2 FY25', revenueCrores: 1280, revenueGrowthYoY: 14.8, volumeGrowthYoY: -0.5, grossMarginPercent: 45.1, ebitdaMarginPercent: 18.5, patCrores: 155, ocfCrores: 95, receivablesCrores: 168, dsoDays: 38, inventoryCrores: 285, dsiDays: 71 },
      { period: 'Q3 FY25', revenueCrores: 1350, revenueGrowthYoY: 15.0, volumeGrowthYoY: -1.2, grossMarginPercent: 45.8, ebitdaMarginPercent: 18.8, patCrores: 168, ocfCrores: 78, receivablesCrores: 220, dsoDays: 46, inventoryCrores: 330, dsiDays: 82 }
    ],
    keyAnomalies: [
      { metric: 'Revenue Growth vs UVG', description: 'Revenue grew 15.0% YoY while volume contracted -1.2% YoY in Q3', observedValue: '+16.2 pp divergence', severity: 'high', period: 'FY2024-25 Q3' },
      { metric: 'Distributor Receivable Days', description: 'DSO escalated from 28 days to 46 days (+18 days) over 3 quarters', observedValue: '46 days', severity: 'high', period: 'FY2024-25 Q3' },
      { metric: 'Cash Flow Conversion', description: 'Operating Cash Flow declined -14% YoY despite PAT growing +18% YoY', observedValue: 'OCF/PAT 0.46x', severity: 'high', period: 'FY2024-25 Q3' }
    ],
    sourcesSample: [
      { title: 'Company X Q3 FY25 Statutory Financial Results', publisher: 'BSE India Corporate Filings (Simulated)', url: 'https://bseindia.com/corporates/results/compx_q3_fy25.pdf', period: 'Q3 FY25', type: 'statutory_result' },
      { title: 'Company X Q3 FY25 Investor Deck: Realization and Volume Trajectory', publisher: 'Company X Investor Relations (Simulated)', url: 'https://investor.companyx-fmcg.example/presentations/q3-fy25.pdf', period: 'Q3 FY25', type: 'investor_presentation' },
      { title: 'Company X Q3 FY25 Earnings Call Transcript: Channel Inventory Discussion', publisher: 'Research Transcripts India (Simulated)', url: 'https://transcripts.research-india.example/compx-q3-2025.html', period: 'Q3 FY25', type: 'earnings_concall' }
    ]
  },

  // 1. Hindustan Unilever Limited (HINDUNILVR)
  {
    id: 'comp-hindunilvr',
    name: 'Hindustan Unilever Limited',
    ticker: 'HINDUNILVR',
    exchange: 'NSE',
    sector: 'FMCG',
    businessModel: 'manufacturing_fmcg',
    description:
      'India\'s largest FMCG company with brands in Beauty & Personal Care (Dove, Lifebuoy, Glow & Lovely), Home Care (Surf Excel, Rin, Vim), and Foods & Refreshment (Horlicks, Knorr, Bru).',
    businessSegments: [
      { name: 'Home Care', shareOfRevenuePercent: 36, description: 'Fabric wash, household care, and water purifiers', isRetailOrFMCG: true },
      { name: 'Beauty & Wellbeing / Personal Care', shareOfRevenuePercent: 37, description: 'Skin care, hair care, deodorants, oral care', isRetailOrFMCG: true },
      { name: 'Foods & Refreshment', shareOfRevenuePercent: 27, description: 'Health food drinks, tea, coffee, culinary products', isRetailOrFMCG: true }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-rev-vol',
        title: 'Underlying Volume Growth (2-3% UVG) vs Revenue Moderation',
        description: 'Examine gradual volume recovery accompanied by negative price growth as commodity price cuts were passed on to consumers.',
        anomalyHypothesis: 'Price rollbacks in mass detergents and soaps created headline revenue stagnation despite modest volume pickup.',
        associatedCaseletId: 'CASELET-01-REV-VOL',
        priorityScore: 94
      },
      {
        id: 'angle-company-industry',
        title: 'Local and Regional Competitor Resurgence vs National Brands',
        description: 'Investigate volume share leakage in mass tea and laundry to regional unorganised manufacturers following crude/palm oil deflation.',
        anomalyHypothesis: 'Regional competitors capitalized on commodity deflation to undercut national brand pricing by 15-20%.',
        associatedCaseletId: 'CASELET-08-COMP-IND',
        priorityScore: 89
      },
      {
        id: 'angle-margin-input',
        title: 'Gross Margin Expansion (+220 bps) vs A&P Re-investment',
        description: 'Analyze whether gross margin gains from raw materials were reinvested into advertising rather than dropping to net profit.',
        anomalyHypothesis: 'EBITDA margins remained capped at 23-24% because advertising spend was ramped up to defend market share.',
        associatedCaseletId: 'CASELET-03-MAR-INP',
        priorityScore: 81
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-uvg',
      'met-price-realization',
      'met-pat',
      'met-ocf',
      'met-cash-conversion',
      'met-gross-margin',
      'met-ebitda-margin',
      'met-ap-ratio'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 15333, revenueGrowthYoY: 1.5, volumeGrowthYoY: 4.0, grossMarginPercent: 51.2, ebitdaMarginPercent: 23.8, patCrores: 2538, ocfCrores: 2840, receivablesCrores: 2980, dsoDays: 17, inventoryCrores: 4320, dsiDays: 52 },
      { period: 'Q2 FY25', revenueCrores: 15508, revenueGrowthYoY: 1.9, volumeGrowthYoY: 3.0, grossMarginPercent: 50.8, ebitdaMarginPercent: 23.5, patCrores: 2612, ocfCrores: 2710, receivablesCrores: 3120, dsoDays: 18, inventoryCrores: 4450, dsiDays: 53 },
      { period: 'Q3 FY25', revenueCrores: 15725, revenueGrowthYoY: 1.8, volumeGrowthYoY: 2.5, grossMarginPercent: 50.4, ebitdaMarginPercent: 23.3, patCrores: 2511, ocfCrores: 2650, receivablesCrores: 3250, dsoDays: 18, inventoryCrores: 4610, dsiDays: 55 }
    ],
    keyAnomalies: [
      { metric: 'Price vs Volume Spread', description: 'Negative pricing growth (-0.7%) offsetting 2.5% UVG; headline revenue growth constrained below 2%', observedValue: 'UVG 2.5%, Rev 1.8%', severity: 'medium', period: 'FY2024-25 Q3' },
      { metric: 'Regional Competitor Pressure', description: 'Local tea and detergent brands regaining retail shelf space post-commodity softening', observedValue: 'Tea & Laundry share loss', severity: 'high', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'HUL Q3 FY25 Results Presentation', publisher: 'Hindustan Unilever Limited IR', url: 'https://www.hul.co.in/investor-relations/quarterly-results/q3-2024-25/', period: 'Q3 FY25', type: 'investor_presentation' },
      { title: 'HUL Unaudited Financial Results for Q3 FY25', publisher: 'NSE India Filings', url: 'https://nsetools.in/filings/HINDUNILVR_Q3_2025.pdf', period: 'Q3 FY25', type: 'statutory_result' },
      { title: 'HUL Q3 FY25 Earnings Call Transcript: Urban Demand & Pricing Action', publisher: 'Bloomberg / FactSet', url: 'https://research.bloomberg.com/transcripts/HUL-IN-Q3FY25', period: 'Q3 FY25', type: 'earnings_concall' }
    ]
  },

  // 2. Trent Limited (TRENT)
  {
    id: 'comp-trent',
    name: 'Trent Limited',
    ticker: 'TRENT',
    exchange: 'NSE',
    sector: 'Consumer Retail',
    businessModel: 'retail_chain',
    description:
      'Tata Group\'s flagship apparel and lifestyle retail company, operating hyper-growth value fashion format Zudio, department store Westside, and supermarket Star Bazaar.',
    businessSegments: [
      { name: 'Zudio (Value Apparel)', shareOfRevenuePercent: 54, description: 'Fast fashion retailing at sharp price points under INR 999', isRetailOrFMCG: true },
      { name: 'Westside (Lifestyle Fashion)', shareOfRevenuePercent: 36, description: 'Full-price departmental fashion and home decor', isRetailOrFMCG: true },
      { name: 'Star Bazaar & Food Joint Ventures', shareOfRevenuePercent: 10, description: 'Grocery supermarket format with Tesco partnership', isRetailOrFMCG: true }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-store-productivity',
        title: 'Hyper-Accelerated Store Expansion (+45% YoY) vs Store Sales Density',
        description: 'Examine Zudio\'s rapid rollout pace (> 550 stores) and test whether new store additions are causing catchment cannibalization in Tier-1 cities.',
        anomalyHypothesis: 'Rapid store openings across proximate catchments may dilute average sales per store as network density approaches saturation.',
        associatedCaseletId: 'CASELET-06-STORE-PROD',
        priorityScore: 96
      },
      {
        id: 'angle-inventory-sales',
        title: 'Inventory Turnover Velocity vs Supply Chain Working Capital',
        description: 'Evaluate whether Trent\'s fast-fashion 12-day inventory design-to-shelf cycle is maintaining high turns amidst rapid store expansion.',
        anomalyHypothesis: 'Pipeline inventory required to fill 150+ new stores per year increases total inventory carrying balance.',
        associatedCaseletId: 'CASELET-04-INV-SALES',
        priorityScore: 85
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-store-count',
      'met-sssg',
      'met-sales-sqft',
      'met-lease-liability',
      'met-pat',
      'met-ebitda-margin',
      'met-inv-growth',
      'met-dsi'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 4104, revenueGrowthYoY: 56.2, volumeGrowthYoY: 42.0, grossMarginPercent: 44.8, ebitdaMarginPercent: 15.3, patCrores: 423, ocfCrores: 510, storeCount: 811, sssgPercent: 10.5, inventoryCrores: 1980, dsiDays: 80 },
      { period: 'Q2 FY25', revenueCrores: 4157, revenueGrowthYoY: 39.4, volumeGrowthYoY: 31.0, grossMarginPercent: 45.2, ebitdaMarginPercent: 15.8, patCrores: 423, ocfCrores: 480, storeCount: 885, sssgPercent: 8.2, inventoryCrores: 2310, dsiDays: 88 },
      { period: 'Q3 FY25', revenueCrores: 4620, revenueGrowthYoY: 35.8, volumeGrowthYoY: 28.0, grossMarginPercent: 45.0, ebitdaMarginPercent: 15.6, patCrores: 498, ocfCrores: 550, storeCount: 960, sssgPercent: 6.8, inventoryCrores: 2680, dsiDays: 92 }
    ],
    keyAnomalies: [
      { metric: 'SSSG Moderation vs Store Count', description: 'SSSG moderated from 10.5% in Q1 to 6.8% in Q3 while store count surged +44% YoY', observedValue: 'SSSG 6.8%, Store Growth +44%', severity: 'high', period: 'FY2024-25 Q3' },
      { metric: 'Lease Liabilities Growth', description: 'Ind AS 116 lease commitments expanded > 42% YoY to support store footprint expansion', observedValue: '+42% Lease Debt', severity: 'medium', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'Trent Limited Q3 FY25 Performance Update & Store Additions', publisher: 'Trent Limited IR', url: 'https://www.trentlimited.com/investor-relations/q3-results-2025/', period: 'Q3 FY25', type: 'investor_presentation' },
      { title: 'Trent Audited Financial Statements and Segment Disclosures', publisher: 'BSE India Filings', url: 'https://bseindia.com/stock-share-price/trent-ltd/trent/500251/financial-results/', period: 'Q3 FY25', type: 'statutory_result' }
    ]
  },

  // 3. ITC Limited (ITC)
  {
    id: 'comp-itc',
    name: 'ITC Limited',
    ticker: 'ITC',
    exchange: 'NSE',
    sector: 'FMCG',
    businessModel: 'conglomerate',
    description:
      'Diversified Indian conglomerate with market leadership in Cigarettes, rapidly expanding FMCG-Others (Aashirvaad, Sunfeast, Bingo, Yippee), Hotels, Paperboards, and Agri-Business.',
    businessSegments: [
      { name: 'Cigarettes', shareOfRevenuePercent: 41, description: 'Traditional core tobacco and cigarette manufacturing', isRetailOrFMCG: false },
      { name: 'FMCG - Others (Branded Consumer)', shareOfRevenuePercent: 29, description: 'Branded packaged foods, personal care, education and stationery', isRetailOrFMCG: true },
      { name: 'Agri-Business & Paperboards', shareOfRevenuePercent: 25, description: 'Wheat, soya, coffee, paperboards, specialty papers', isRetailOrFMCG: false },
      { name: 'Hotels (Demerged / Operating)', shareOfRevenuePercent: 5, description: 'Luxury hotel chain operations', isRetailOrFMCG: false }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-margin-input',
        title: 'FMCG-Others Segment Margin Resilience vs Wheat/Sugar Inflation',
        description: 'Investigate how Aashirvaad and Sunfeast maintained segment operating margins despite spikes in agricultural input costs.',
        anomalyHypothesis: 'Backward integration into agri-sourcing shielded FMCG-Others gross margins compared to pure-play food competitors.',
        associatedCaseletId: 'CASELET-03-MAR-INP',
        priorityScore: 91
      },
      {
        id: 'angle-company-industry',
        title: 'Segment Growth Disconnect: Cigarette Tax Stability vs Agri-Business Headwinds',
        description: 'Examine consolidated earnings stability driven by cigarette pricing power offsetting export bans in wheat/rice.',
        anomalyHypothesis: 'Tobacco division cash flow subsidizes scale investments in packaged consumer food brands.',
        associatedCaseletId: 'CASELET-08-COMP-IND',
        priorityScore: 84
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-pat',
      'met-ocf',
      'met-cash-conversion',
      'met-gross-margin',
      'met-ebitda-margin',
      'met-statutory-segment-ebit'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 18220, revenueGrowthYoY: 7.2, volumeGrowthYoY: 4.5, grossMarginPercent: 57.5, ebitdaMarginPercent: 36.1, patCrores: 5092, ocfCrores: 4450 },
      { period: 'Q2 FY25', revenueCrores: 19328, revenueGrowthYoY: 15.6, volumeGrowthYoY: 5.0, grossMarginPercent: 56.2, ebitdaMarginPercent: 34.8, patCrores: 5054, ocfCrores: 4320 },
      { period: 'Q3 FY25', revenueCrores: 19850, revenueGrowthYoY: 8.4, volumeGrowthYoY: 3.8, grossMarginPercent: 56.8, ebitdaMarginPercent: 35.2, patCrores: 5210, ocfCrores: 4610 }
    ],
    keyAnomalies: [
      { metric: 'Segment EBIT Divergence', description: 'Cigarettes EBIT grew +6% while Paperboards EBIT declined -24% YoY due to Chinese cheap imports', observedValue: 'Paperboards EBIT -24%', severity: 'high', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'ITC Limited Q3 FY25 Segment Financial Statement', publisher: 'ITC Corporate Communications', url: 'https://www.itcportal.com/investor/financial-results.aspx', period: 'Q3 FY25', type: 'statutory_result' },
      { title: 'ITC Investor Deck: FMCG-Others Scale and Brand Momentum', publisher: 'ITC IR', url: 'https://www.itcportal.com/investor/investor-presentation.aspx', period: 'Q3 FY25', type: 'investor_presentation' }
    ]
  },

  // 4. Avenue Supermarts (DMART)
  {
    id: 'comp-dmart',
    name: 'Avenue Supermarts Limited (DMart)',
    ticker: 'DMART',
    exchange: 'NSE',
    sector: 'Consumer Retail',
    businessModel: 'retail_chain',
    description:
      'India\'s lowest-cost supermarket retail chain operating large format physical stores under the DMart brand with high inventory velocity and everyday low pricing (EDLP).',
    businessSegments: [
      { name: 'Foods & Edible Grocery', shareOfRevenuePercent: 56, description: 'Staples, dairy, packaged foods, and beverages', isRetailOrFMCG: true },
      { name: 'Non-Foods (FMCG)', shareOfRevenuePercent: 21, description: 'Toiletries, home cleaning, beauty care products', isRetailOrFMCG: true },
      { name: 'General Merchandise & Apparel', shareOfRevenuePercent: 23, description: 'High-margin bedsheets, cookware, garments, and plasticware', isRetailOrFMCG: true }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-store-productivity',
        title: 'Quick Commerce Encroachment vs DMart Metro Store Footfalls',
        description: 'Investigate whether 10-minute grocery delivery apps (Blinkit, Zepto, Swiggy Instamart) are eroding high-margin general merchandise and metro sales velocity.',
        anomalyHypothesis: 'Quick-commerce convenience in Tier-1 cities is trimming weekend basket size, shifting DMart\'s sales mix toward lower-margin food staples.',
        associatedCaseletId: 'CASELET-06-STORE-PROD',
        priorityScore: 97
      },
      {
        id: 'angle-margin-input',
        title: 'Gross Margin Compression (14.0% to 13.5%) vs Product Mix Shift',
        description: 'Examine general merchandise contribution decline from 27% to 23% and its mechanical drag on blended gross margins.',
        anomalyHypothesis: 'Consumers down-traded on discretionary items while purchasing lower-margin food staples at discounted prices.',
        associatedCaseletId: 'CASELET-03-MAR-INP',
        priorityScore: 90
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-store-count',
      'met-sales-sqft',
      'met-gross-margin',
      'met-ebitda-margin',
      'met-pat',
      'met-ocf',
      'met-inv-growth',
      'met-dsi'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 14069, revenueGrowthYoY: 18.6, grossMarginPercent: 14.1, ebitdaMarginPercent: 8.7, patCrores: 774, ocfCrores: 810, storeCount: 371, sssgPercent: 9.1, inventoryCrores: 3780, dsiDays: 31 },
      { period: 'Q2 FY25', revenueCrores: 14445, revenueGrowthYoY: 14.4, grossMarginPercent: 13.6, ebitdaMarginPercent: 7.6, patCrores: 659, ocfCrores: 720, storeCount: 377, sssgPercent: 5.5, inventoryCrores: 4210, dsiDays: 34 },
      { period: 'Q3 FY25', revenueCrores: 15840, revenueGrowthYoY: 17.2, grossMarginPercent: 13.8, ebitdaMarginPercent: 7.9, patCrores: 735, ocfCrores: 790, storeCount: 387, sssgPercent: 6.8, inventoryCrores: 4560, dsiDays: 33 }
    ],
    keyAnomalies: [
      { metric: 'SSSG Deceleration in Mature Stores', description: 'SSSG in stores older than 2 years dipped to 5.5% in Q2 amidst aggressive quick commerce penetration in metro catchments', observedValue: 'SSSG 5.5% vs 9.1% in Q1', severity: 'high', period: 'FY2024-25 Q2' },
      { metric: 'General Merchandise Share Dilution', description: 'Discretionary high-margin general merchandise dropped to 22.8% of sales, compressing gross margin by 50 bps', observedValue: 'Gross Margin 13.6%', severity: 'high', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'Avenue Supermarts Q3 FY25 Operational Update', publisher: 'DMart Investor Relations', url: 'https://www.dmartindia.com/investor-relations/q3-2025', period: 'Q3 FY25', type: 'investor_presentation' },
      { title: 'Statement of Financial Results for Quarter Ended Dec 31, 2024', publisher: 'BSE India Filings', url: 'https://bseindia.com/dmart_q3_fy25.pdf', period: 'Q3 FY25', type: 'statutory_result' }
    ]
  },

  // 5. Asian Paints (ASIANPAINT)
  {
    id: 'comp-asianpaints',
    name: 'Asian Paints Limited',
    ticker: 'ASIANPAINT',
    exchange: 'NSE',
    sector: 'Paints & Decor',
    businessModel: 'manufacturing_fmcg',
    description:
      'India\'s leading decorative paint and coatings company, with a vast direct dealer network of tinting machines, facing competitive entry from Grasim Industries (Birla Opus).',
    businessSegments: [
      { name: 'Decorative Paints (Domestic)', shareOfRevenuePercent: 82, description: 'Interior/exterior emulsions, enamels, and wood finishes', isRetailOrFMCG: true },
      { name: 'Home Decor & Kitchen / Bath', shareOfRevenuePercent: 8, description: 'Modular kitchens, sanitaryware, wall coverings', isRetailOrFMCG: true },
      { name: 'Industrial Coatings & International', shareOfRevenuePercent: 10, description: 'Automotive coatings and overseas subsidiaries', isRetailOrFMCG: false }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-company-industry',
        title: 'Competitive Price Cuts & Dealer Rebates vs Birla Opus Entry',
        description: 'Examine how market entry by Aditya Birla Group\'s Birla Opus triggered price reductions and rebate schemes, depressing revenue growth despite positive volume.',
        anomalyHypothesis: 'Asian Paints lowered list prices and offered unprecedented dealer schemes to defend its dealer network, causing revenue to contract despite volume growth.',
        associatedCaseletId: 'CASELET-08-COMP-IND',
        priorityScore: 98
      },
      {
        id: 'angle-rev-vol',
        title: 'Negative Revenue Growth (-5%) vs Flat/Positive Volume (0-1%)',
        description: 'Investigate the dramatic price-mix deflation (-6%) resulting from cumulative price cuts in economy emulsions.',
        anomalyHypothesis: 'Price cuts in mass economy paints severely shrank realization per liter, creating negative top-line growth.',
        associatedCaseletId: 'CASELET-01-REV-VOL',
        priorityScore: 95
      },
      {
        id: 'angle-margin-input',
        title: 'Operating Margin Compression (20.3% to 15.5%) vs Fixed Cost De-leverage',
        description: 'Analyze the 480 bps EBITDA margin contraction caused by price rollbacks and elevated promotional rebates.',
        anomalyHypothesis: 'Promotional trade rebates and fixed overheads severely compressed EBITDA margins as revenue declined.',
        associatedCaseletId: 'CASELET-03-MAR-INP',
        priorityScore: 91
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-uvg',
      'met-price-realization',
      'met-gross-margin',
      'met-ebitda-margin',
      'met-pat',
      'met-ocf',
      'met-cash-conversion'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 8943, revenueGrowthYoY: -2.3, volumeGrowthYoY: 3.0, grossMarginPercent: 43.8, ebitdaMarginPercent: 18.9, patCrores: 1187, ocfCrores: 950 },
      { period: 'Q2 FY25', revenueCrores: 8028, revenueGrowthYoY: -5.3, volumeGrowthYoY: 0.5, grossMarginPercent: 41.0, ebitdaMarginPercent: 15.5, patCrores: 694, ocfCrores: 610 },
      { period: 'Q3 FY25', revenueCrores: 9110, revenueGrowthYoY: -6.1, volumeGrowthYoY: -1.0, grossMarginPercent: 41.5, ebitdaMarginPercent: 16.2, patCrores: 840, ocfCrores: 780 }
    ],
    keyAnomalies: [
      { metric: 'Revenue-Volume Divergence', description: 'Revenue contracted -5.3% while volume grew +0.5% due to 5.8% cumulative price cuts and dealer scheme payouts', observedValue: '-5.8 pp price realization', severity: 'high', period: 'FY2024-25 Q2' },
      { metric: 'EBITDA Margin Collapse', description: 'Operating margin compressed by 480 bps YoY to 15.5%, reaching multi-year low', observedValue: '15.5% (-480 bps)', severity: 'high', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'Asian Paints Q2 FY25 Investor Presentation: Market Dynamics', publisher: 'Asian Paints IR', url: 'https://www.asianpaints.com/more/investors/investor-presentation.html', period: 'Q2 FY25', type: 'investor_presentation' },
      { title: 'Asian Paints Unaudited Financial Results for Q2 FY25', publisher: 'NSE India Filings', url: 'https://nsetools.in/filings/ASIANPAINT_Q2_FY25.pdf', period: 'Q2 FY25', type: 'statutory_result' },
      { title: 'Asian Paints Q2 FY25 Concall Transcript: Pricing Competition & Demand Environment', publisher: 'AlphaStreet / Bloomberg', url: 'https://alphastreet.com/india/asian-paints-q2-2025/', period: 'Q2 FY25', type: 'earnings_concall' }
    ]
  },

  // 6. Nestle India (NESTLEIND)
  {
    id: 'comp-nestle',
    name: 'Nestle India Limited',
    ticker: 'NESTLEIND',
    exchange: 'NSE',
    sector: 'FMCG',
    businessModel: 'manufacturing_fmcg',
    description:
      'Indian subsidiary of Nestlé S.A., market leader in culinary (Maggi), infant nutrition (Cerelac, Lactogen), beverages (Nescafé), and confectionery (KitKat, Munch).',
    businessSegments: [
      { name: 'Prepared Dishes & Cooking Aids (Maggi)', shareOfRevenuePercent: 32, description: 'Instant noodles, sauces, pasta, and seasonings', isRetailOrFMCG: true },
      { name: 'Milk Products & Nutrition', shareOfRevenuePercent: 38, description: 'Infant cereals, infant formula, and dairy milk powders', isRetailOrFMCG: true },
      { name: 'Confectionery & Beverages', shareOfRevenuePercent: 30, description: 'Chocolates, confectionery, and soluble coffee powders', isRetailOrFMCG: true }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-margin-input',
        title: 'Acute Cocoa & Coffee Commodity Inflation vs Gross Margin Defense',
        description: 'Examine international cocoa prices surging 150% and robusta coffee prices doubling, testing Nestle\'s product grammage adjustments and pricing resistance.',
        anomalyHypothesis: 'Sharp commodity cost escalation in cocoa and coffee forced selective grammage reductions that triggered consumer pushback.',
        associatedCaseletId: 'CASELET-03-MAR-INP',
        priorityScore: 95
      },
      {
        id: 'angle-rev-vol',
        title: 'Metro Urban Consumption Slowdown vs Packaged Food Demand',
        description: 'Investigate volume growth deceleration in metropolitan modern trade channels amidst high food inflation.',
        anomalyHypothesis: 'Urban middle-class households pinched by broad food inflation reduced discretionary confectionery purchases.',
        associatedCaseletId: 'CASELET-01-REV-VOL',
        priorityScore: 88
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-uvg',
      'met-gross-margin',
      'met-ebitda-margin',
      'met-pat',
      'met-ocf',
      'met-cash-conversion'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 4814, revenueGrowthYoY: 3.3, volumeGrowthYoY: 1.5, grossMarginPercent: 56.5, ebitdaMarginPercent: 23.9, patCrores: 747, ocfCrores: 780 },
      { period: 'Q2 FY25', revenueCrores: 5104, revenueGrowthYoY: 1.3, volumeGrowthYoY: -0.8, grossMarginPercent: 55.4, ebitdaMarginPercent: 22.8, patCrores: 899, ocfCrores: 810 },
      { period: 'Q3 FY25', revenueCrores: 5210, revenueGrowthYoY: 2.1, volumeGrowthYoY: 0.2, grossMarginPercent: 55.8, ebitdaMarginPercent: 23.1, patCrores: 845, ocfCrores: 830 }
    ],
    keyAnomalies: [
      { metric: 'Volume Stagnation in Food & Confectionery', description: 'Volume growth dipped to -0.8% in Q2 due to cocoa/coffee inflation and urban demand softness', observedValue: 'Volume -0.8%', severity: 'high', period: 'FY2024-25 Q2' },
      { metric: 'Key Commodity Cost Surge', description: 'Cocoa import costs up > 120% and robusta coffee up > 80% YoY', observedValue: '+120% Cocoa Cost', severity: 'high', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'Nestle India Q2 FY25 Results Press Release', publisher: 'Nestle India Media Center', url: 'https://www.nestle.in/media/pressreleases/q2-2024-25-results', period: 'Q2 FY25', type: 'statutory_result' },
      { title: 'Nestle India Management Comments on Raw Material Inflation', publisher: 'Economic Times / Concall', url: 'https://economictimes.indiatimes.com/nestle-india-concall-q2fy25', period: 'Q2 FY25', type: 'earnings_concall' }
    ]
  },

  // 7. Titan Company (TITAN)
  {
    id: 'comp-titan',
    name: 'Titan Company Limited',
    ticker: 'TITAN',
    exchange: 'NSE',
    sector: 'Consumer Retail',
    businessModel: 'retail_chain',
    description:
      'Tata Group\'s premium consumer retail enterprise, leading India\'s branded jewellery market (Tanishq, Mia, CaratLane), watches (Titan, Fastrack), and eye care.',
    businessSegments: [
      { name: 'Jewellery (Tanishq, Mia, Zoya, CaratLane)', shareOfRevenuePercent: 88, description: 'Gold, diamond, and precious gem jewellery retailing', isRetailOrFMCG: true },
      { name: 'Watches & Wearables', shareOfRevenuePercent: 8, description: 'Analog, smartwatches, and fashion accessories', isRetailOrFMCG: true },
      { name: 'EyeCare & Fragrances / Indian Dresswear (Taneira)', shareOfRevenuePercent: 4, description: 'Optical frames, perfumes, and sarees', isRetailOrFMCG: true }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-margin-input',
        title: 'Customs Duty Reduction Impact on Inventory Loss vs Consumer Demand Rebound',
        description: 'Analyze the Union Budget 2024 gold import duty cut (from 15% to 6%) causing non-recurring inventory valuation write-offs alongside massive festive gold demand surge.',
        anomalyHypothesis: 'Statutory gross margins compressed sharply due to customs duty inventory adjustment, while underlying customer footfalls broke records.',
        associatedCaseletId: 'CASELET-03-MAR-INP',
        priorityScore: 97
      },
      {
        id: 'angle-store-productivity',
        title: 'Tanishq Domestic Store Additions vs Studded (Diamond) Jewellery Ratio',
        description: 'Examine store expansion into Tier 2/3 cities and whether studded jewellery ratio (which carries 2.5x gold gross margins) kept pace with plain gold volumes.',
        anomalyHypothesis: 'Studded jewellery mix moderation diluted gross margins despite soaring plain gold bullion turnover.',
        associatedCaseletId: 'CASELET-06-STORE-PROD',
        priorityScore: 88
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-store-count',
      'met-gross-margin',
      'met-ebitda-margin',
      'met-pat',
      'met-ocf',
      'met-inv-growth',
      'met-dsi'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 12223, revenueGrowthYoY: 11.5, grossMarginPercent: 24.2, ebitdaMarginPercent: 9.8, patCrores: 770, ocfCrores: 620, storeCount: 3035 },
      { period: 'Q2 FY25', revenueCrores: 13473, revenueGrowthYoY: 25.8, grossMarginPercent: 21.0, ebitdaMarginPercent: 7.7, patCrores: 704, ocfCrores: 480, storeCount: 3108 },
      { period: 'Q3 FY25', revenueCrores: 16540, revenueGrowthYoY: 22.4, grossMarginPercent: 22.8, ebitdaMarginPercent: 9.1, patCrores: 1040, ocfCrores: 890, storeCount: 3180 }
    ],
    keyAnomalies: [
      { metric: 'Gross Margin Compression from Customs Duty', description: 'Gross margin fell 320 bps YoY in Q2 due to customs duty inventory markdown (INR 290 Cr impact)', observedValue: 'Gross Margin 21.0% (-320 bps)', severity: 'high', period: 'FY2024-25 Q2' },
      { metric: 'Revenue Acceleration from Gold Duty Cut', description: 'Jewellery revenue surged +26% YoY as consumers flocked to buy gold at reduced domestic rates', observedValue: '+26% Revenue YoY', severity: 'medium', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'Titan Company Q2 FY25 Investor Deck: Customs Duty Impact', publisher: 'Titan IR', url: 'https://www.titancompany.in/investors/investor-presentation/q2-2025', period: 'Q2 FY25', type: 'investor_presentation' },
      { title: 'Titan Audited Quarterly Results Statement', publisher: 'BSE India Filings', url: 'https://bseindia.com/titan_q2_2025.pdf', period: 'Q2 FY25', type: 'statutory_result' }
    ]
  },

  // 8. Britannia Industries (BRITANNIA)
  {
    id: 'comp-britannia',
    name: 'Britannia Industries Limited',
    ticker: 'BRITANNIA',
    exchange: 'NSE',
    sector: 'FMCG',
    businessModel: 'manufacturing_fmcg',
    description:
      'India\'s leading biscuit and bakery foods company (Good Day, Marie Gold, NutriChoice, Milk Bikis, Winkies) with expanding dairy presence.',
    businessSegments: [
      { name: 'Biscuits & Bakery', shareOfRevenuePercent: 88, description: 'Sweet, savory, and healthy bakery products', isRetailOrFMCG: true },
      { name: 'Dairy & Cheese', shareOfRevenuePercent: 8, description: 'Cheese, milk, butter, and yogurt through Bel-Britannia JV', isRetailOrFMCG: true },
      { name: 'Adjacent Snacks & Export', shareOfRevenuePercent: 4, description: 'Wafers, croissants, and international exports', isRetailOrFMCG: true }
    ],
    reportingPeriods: ['FY2024-25 Q3', 'FY2024-25 Q2', 'FY2024-25 Q1', 'FY2023-24 (Audited)'],
    suggestedAngles: [
      {
        id: 'angle-margin-input',
        title: 'Flour, Sugar and Palm Oil Inflation vs Biscuit Grammage Cuts',
        description: 'Examine wheat and palm oil cost trends forcing grammage reductions in INR 5 and INR 10 price-point packs.',
        anomalyHypothesis: 'Grammage reductions in entry packs prompted consumer down-trading to local unorganised bakeries.',
        associatedCaseletId: 'CASELET-03-MAR-INP',
        priorityScore: 92
      },
      {
        id: 'angle-rev-vol',
        title: 'Volume Growth Trajectory (4-5% UVG) vs Price Rollbacks',
        description: 'Evaluate volume elasticity across rural vs urban distributors as consumer promotions were expanded.',
        anomalyHypothesis: 'Volume growth is concentrated in mass glucose/Marie packs while premium cookie volume lags.',
        associatedCaseletId: 'CASELET-01-REV-VOL',
        priorityScore: 86
      }
    ],
    availableMetricIds: [
      'met-rev-growth',
      'met-uvg',
      'met-gross-margin',
      'met-ebitda-margin',
      'met-pat',
      'met-ocf',
      'met-cash-conversion'
    ],
    historicalFinancials: [
      { period: 'Q1 FY25', revenueCrores: 4250, revenueGrowthYoY: 6.0, volumeGrowthYoY: 8.0, grossMarginPercent: 43.5, ebitdaMarginPercent: 18.0, patCrores: 506, ocfCrores: 480 },
      { period: 'Q2 FY25', revenueCrores: 4667, revenueGrowthYoY: 5.3, volumeGrowthYoY: 5.0, grossMarginPercent: 42.1, ebitdaMarginPercent: 17.5, patCrores: 531, ocfCrores: 490 },
      { period: 'Q3 FY25', revenueCrores: 4720, revenueGrowthYoY: 4.8, volumeGrowthYoY: 4.2, grossMarginPercent: 42.4, ebitdaMarginPercent: 17.8, patCrores: 540, ocfCrores: 510 }
    ],
    keyAnomalies: [
      { metric: 'Input Cost Pressure on Margins', description: 'Gross margin contracted 140 bps YoY due to wheat and palm oil price increases', observedValue: 'Gross margin 42.1% (-140 bps)', severity: 'medium', period: 'FY2024-25 Q2' }
    ],
    sourcesSample: [
      { title: 'Britannia Q2 FY25 Investor Presentation', publisher: 'Britannia IR', url: 'https://britannia.co.in/investors/q2-2025', period: 'Q2 FY25', type: 'investor_presentation' },
      { title: 'Britannia Financial Results for Q2 FY25', publisher: 'NSE India Filings', url: 'https://nsetools.in/filings/BRITANNIA_Q2_FY25.pdf', period: 'Q2 FY25', type: 'statutory_result' }
    ]
  }
];

export function getCompanyById(id: string): Company | undefined {
  return NIFTY_COMPANIES.find((c) => c.id === id);
}
