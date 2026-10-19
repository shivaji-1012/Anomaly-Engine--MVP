/**
 * Deterministic Financial Analysis Engine
 * ATMOS 2026 - Track C: Consumer Retail & FMCG
 * 
 * Strict deterministic calculations: NO LLM arithmetic, explicit units, formulas,
 * inputs, assumptions, and missing data disclosure.
 */

export interface CalculationInput {
  name: string;
  value: number | string;
  unit: string;
  period: string;
  sourceDescription: string;
}

export interface DeterministicCalculationResult {
  id: string;
  name: string;
  metricCategory: 'growth' | 'profitability' | 'cashflow' | 'working_capital' | 'productivity';
  formula: string;
  inputs: CalculationInput[];
  steps: string[];
  outputValue: number | string;
  outputUnit: string;
  interpretation: string;
  assumptionsDisclosed: string[];
  dataCompleteness: 'complete' | 'partial' | 'insufficient';
  missingDataReason?: string;
  isAnomaly: boolean;
  anomalyBenchmark?: string;
}

// 1. Revenue Growth YoY
export function calculateRevenueGrowth(
  currentRevenue: number,
  priorRevenue: number,
  periodCurrent: string,
  periodPrior: string,
  entityName = 'Company'
): DeterministicCalculationResult {
  if (!currentRevenue || !priorRevenue || priorRevenue <= 0) {
    return {
      id: 'CALC-REV-GROWTH',
      name: 'Revenue YoY Growth Rate',
      metricCategory: 'growth',
      formula: 'Revenue_Growth_% = ((Revenue_Current - Revenue_Prior) / Revenue_Prior) * 100',
      inputs: [
        { name: 'Revenue_Current', value: currentRevenue || 'N/A', unit: 'INR Cr', period: periodCurrent, sourceDescription: 'Statutory P&L Line 1' },
        { name: 'Revenue_Prior', value: priorRevenue || 'N/A', unit: 'INR Cr', period: periodPrior, sourceDescription: 'Statutory P&L Line 1 (Prior Year)' }
      ],
      steps: ['Cannot compute: Prior period revenue is missing or zero.'],
      outputValue: 'INSUFFICIENT_DATA',
      outputUnit: '%',
      interpretation: 'Calculation aborted due to missing historical comparative base.',
      assumptionsDisclosed: [],
      dataCompleteness: 'insufficient',
      missingDataReason: 'Prior year revenue disclosure unavailable.',
      isAnomaly: false
    };
  }

  const growthPercent = Number((((currentRevenue - priorRevenue) / priorRevenue) * 100).toFixed(2));
  const isAnomaly = growthPercent < 0 || growthPercent > 30;

  return {
    id: 'CALC-REV-GROWTH',
    name: 'Reported Net Revenue YoY Growth',
    metricCategory: 'growth',
    formula: 'Revenue_YoY_% = ((Revenue_Current - Revenue_Prior) / Revenue_Prior) * 100',
    inputs: [
      { name: 'Revenue_Current', value: currentRevenue, unit: 'INR Cr', period: periodCurrent, sourceDescription: `${entityName} Financial Results - Line 1` },
      { name: 'Revenue_Prior', value: priorRevenue, unit: 'INR Cr', period: periodPrior, sourceDescription: `${entityName} Comparative Period - Line 1` }
    ],
    steps: [
      `Step 1: Compute absolute delta = ${currentRevenue} - ${priorRevenue} = ${(currentRevenue - priorRevenue).toFixed(2)} INR Cr.`,
      `Step 2: Divide by prior period revenue base: (${(currentRevenue - priorRevenue).toFixed(2)} / ${priorRevenue}) = ${((currentRevenue - priorRevenue) / priorRevenue).toFixed(4)}.`,
      `Step 3: Convert to percentage = ${growthPercent}%.`
    ],
    outputValue: growthPercent,
    outputUnit: '% YoY',
    interpretation: `Reported revenue grew ${growthPercent >= 0 ? '+' : ''}${growthPercent}% year-over-year.`,
    assumptionsDisclosed: ['Revenue represents net sales from operations excluding GST/indirect taxes.'],
    dataCompleteness: 'complete',
    isAnomaly,
    anomalyBenchmark: 'Normal FMCG nominal growth band: +6% to +14% YoY'
  };
}

// 2. Price-Volume Decomposition
export function calculatePriceVolumeDecomposition(
  revenueGrowthYoY: number,
  volumeGrowthYoY: number | undefined,
  period: string
): DeterministicCalculationResult {
  if (volumeGrowthYoY === undefined || isNaN(volumeGrowthYoY)) {
    return {
      id: 'CALC-PRICE-VOL',
      name: 'Price-Volume Decomposition & Realization Spread',
      metricCategory: 'growth',
      formula: 'Realization_Spread = Revenue_Growth_% - Volume_Growth_%',
      inputs: [
        { name: 'Revenue_Growth_%', value: revenueGrowthYoY, unit: '% YoY', period, sourceDescription: 'Calculated from reported revenue' },
        { name: 'Volume_Growth_%', value: 'Not Disclosed', unit: '% YoY', period, sourceDescription: 'Underlying Volume Growth (UVG)' }
      ],
      steps: ['Volume data is withheld or not disclosed as a distinct percentage by management.'],
      outputValue: 'UNAVAILABLE',
      outputUnit: 'pp',
      interpretation: 'Cannot compute deterministic price-volume decomposition without official volume growth or physical tonnage disclosures.',
      assumptionsDisclosed: ['Do not extrapolate volume from revenue alone.'],
      dataCompleteness: 'insufficient',
      missingDataReason: 'Company does not report quantitative UVG or tonnage in statutory filings for this period.',
      isAnomaly: false
    };
  }

  const spreadPp = Number((revenueGrowthYoY - volumeGrowthYoY).toFixed(2));
  const isAnomaly = spreadPp >= 5.0 || (volumeGrowthYoY <= 0 && revenueGrowthYoY > 0);

  // Volume contribution vs price-mix contribution
  let volumeContributionPct = 0;
  let priceMixContributionPct = 100;
  if (Math.abs(revenueGrowthYoY) > 0.1) {
    volumeContributionPct = Number(((volumeGrowthYoY / revenueGrowthYoY) * 100).toFixed(1));
    priceMixContributionPct = Number((100 - volumeContributionPct).toFixed(1));
  }

  return {
    id: 'CALC-PRICE-VOL',
    name: 'Price-Volume Realization Spread',
    metricCategory: 'growth',
    formula: 'Realization_Spread_(pp) = Revenue_YoY_% - Volume_YoY_%',
    inputs: [
      { name: 'Revenue_YoY_%', value: revenueGrowthYoY, unit: '% YoY', period, sourceDescription: 'Reported Top-Line Growth' },
      { name: 'Volume_YoY_%', value: volumeGrowthYoY, unit: '% YoY', period, sourceDescription: 'Reported Underlying Volume Growth (UVG)' }
    ],
    steps: [
      `Step 1: Subtract volume growth from revenue growth: ${revenueGrowthYoY}% - (${volumeGrowthYoY}%) = ${spreadPp} percentage points.`,
      `Step 2: Calculate price-mix share of growth = ((${spreadPp} pp) / ${revenueGrowthYoY}%) * 100 = ${priceMixContributionPct}%.`,
      `Step 3: Calculate volume share of growth = (${volumeGrowthYoY}% / ${revenueGrowthYoY}%) * 100 = ${volumeContributionPct}%.`
    ],
    outputValue: spreadPp,
    outputUnit: 'percentage points (pp)',
    interpretation: spreadPp >= 5.0
      ? `Severe divergence: Pricing and mix drove ${priceMixContributionPct}% of revenue growth while unit volume growth was only ${volumeGrowthYoY}%. Top-line is heavily reliant on realization hikes.`
      : spreadPp <= -3.0
      ? `Negative price realization: Price rollbacks or competitive discounts eroded ${Math.abs(spreadPp)} pp of realization despite ${volumeGrowthYoY}% volume growth.`
      : `Balanced growth: Realization spread of ${spreadPp} pp indicates healthy alignment between unit demand and price realization.`,
    assumptionsDisclosed: [
      'Assumes underlying volume growth applies to the same product perimeter as consolidated revenue.',
      'Price realization incorporates MRP hikes, trade discounts, and product mix shifts.'
    ],
    dataCompleteness: 'complete',
    isAnomaly,
    anomalyBenchmark: 'Normal realization spread threshold: |Spread| < 4.0 pp'
  };
}

// 3. Cash Conversion Ratio (OCF / PAT)
export function calculateCashConversionRatio(
  operatingCashFlow: number | undefined,
  profitAfterTax: number,
  period: string
): DeterministicCalculationResult {
  if (operatingCashFlow === undefined || isNaN(operatingCashFlow)) {
    return {
      id: 'CALC-CASH-CONV',
      name: 'Cash Conversion Ratio (OCF / PAT)',
      metricCategory: 'cashflow',
      formula: 'Cash_Conversion_Ratio = Operating_Cash_Flow / Profit_After_Tax',
      inputs: [
        { name: 'Profit_After_Tax', value: profitAfterTax, unit: 'INR Cr', period, sourceDescription: 'Statement of Profit and Loss' },
        { name: 'Operating_Cash_Flow', value: 'Not Disclosed (Interim Quarter)', unit: 'INR Cr', period, sourceDescription: 'Cash Flow Statement' }
      ],
      steps: ['Interim quarterly cash flow statement is not statutory under SEBI LODR regulations unless H1 or FY.'],
      outputValue: 'UNAVAILABLE',
      outputUnit: 'ratio (x)',
      interpretation: 'Operating cash flow is only mandatorily reported on a half-yearly and annual basis under Indian statutory reporting.',
      assumptionsDisclosed: [],
      dataCompleteness: 'insufficient',
      missingDataReason: 'No interim quarterly Cash Flow Statement filed.',
      isAnomaly: false
    };
  }

  const ratio = Number((operatingCashFlow / profitAfterTax).toFixed(2));
  const divergenceGap = Number((profitAfterTax - operatingCashFlow).toFixed(2));
  const isAnomaly = ratio < 0.65 || ratio > 1.8;

  return {
    id: 'CALC-CASH-CONV',
    name: 'Cash Conversion Ratio (OCF / PAT)',
    metricCategory: 'cashflow',
    formula: 'Cash_Conversion_Ratio = Operating_Cash_Flow / Profit_After_Tax',
    inputs: [
      { name: 'Operating_Cash_Flow', value: operatingCashFlow, unit: 'INR Cr', period, sourceDescription: 'Cash Flow from Operating Activities' },
      { name: 'Profit_After_Tax', value: profitAfterTax, unit: 'INR Cr', period, sourceDescription: 'Net Profit Attributable to Shareholders' }
    ],
    steps: [
      `Step 1: Divide OCF by PAT: ${operatingCashFlow} / ${profitAfterTax} = ${ratio}x.`,
      `Step 2: Compute absolute liquidity divergence gap: PAT (${profitAfterTax}) - OCF (${operatingCashFlow}) = ${divergenceGap} INR Cr absorbed in working capital/taxes.`
    ],
    outputValue: ratio,
    outputUnit: 'x',
    interpretation: ratio < 0.65
      ? `Significant cash flow lag: The company converted only ${Math.round(ratio * 100)}% of reported profits into liquid cash. ${divergenceGap} INR Cr remains locked in working capital.`
      : `Healthy cash conversion: Company generated ${ratio}x of PAT in operating cash flow.`,
    assumptionsDisclosed: [
      'Operating cash flow calculated post-working capital adjustments and income taxes paid.',
      'Lease payments categorized under financing activities under Ind AS 116.'
    ],
    dataCompleteness: 'complete',
    isAnomaly,
    anomalyBenchmark: 'Healthy FMCG benchmark: OCF / PAT >= 0.85x'
  };
}

// 4. Days Sales Outstanding (DSO / Receivable Days)
export function calculateReceivableDays(
  tradeReceivables: number | undefined,
  netRevenue: number,
  period: string,
  daysInPeriod = 90
): DeterministicCalculationResult {
  if (tradeReceivables === undefined || !netRevenue || netRevenue <= 0) {
    return {
      id: 'CALC-DSO',
      name: 'Days Sales Outstanding (DSO)',
      metricCategory: 'working_capital',
      formula: 'DSO = (Trade_Receivables / Net_Revenue) * Days_in_Period',
      inputs: [
        { name: 'Trade_Receivables', value: tradeReceivables || 'Not Disclosed', unit: 'INR Cr', period, sourceDescription: 'Balance Sheet Current Assets' },
        { name: 'Net_Revenue', value: netRevenue, unit: 'INR Cr', period, sourceDescription: 'Revenue from Operations' }
      ],
      steps: ['Receivables data not reported for this quarterly interval.'],
      outputValue: 'UNAVAILABLE',
      outputUnit: 'Days',
      interpretation: 'Balance sheet asset balances are not published in standalone quarterly updates.',
      assumptionsDisclosed: [],
      dataCompleteness: 'insufficient',
      missingDataReason: 'Trade Receivables balance withheld in interim press release.',
      isAnomaly: false
    };
  }

  const dso = Number(((tradeReceivables / netRevenue) * daysInPeriod).toFixed(1));
  const isAnomaly = dso >= 35; // Consumer FMCG usually 10-25 days

  return {
    id: 'CALC-DSO',
    name: 'Days Sales Outstanding (DSO)',
    metricCategory: 'working_capital',
    formula: 'DSO = (Trade_Receivables / Net_Revenue) * Days_in_Period',
    inputs: [
      { name: 'Trade_Receivables', value: tradeReceivables, unit: 'INR Cr', period, sourceDescription: 'Balance Sheet - Trade Receivables Note' },
      { name: 'Net_Revenue', value: netRevenue, unit: 'INR Cr', period, sourceDescription: 'Statement of Profit and Loss' },
      { name: 'Days_in_Period', value: daysInPeriod, unit: 'Days', period, sourceDescription: 'Calendar days in quarter' }
    ],
    steps: [
      `Step 1: Divide Trade Receivables by Net Revenue: ${tradeReceivables} / ${netRevenue} = ${(tradeReceivables / netRevenue).toFixed(4)}.`,
      `Step 2: Multiply by days in period: ${(tradeReceivables / netRevenue).toFixed(4)} * ${daysInPeriod} = ${dso} days.`
    ],
    outputValue: dso,
    outputUnit: 'Days',
    interpretation: dso >= 35
      ? `Elevated debtor cycle: It takes an average of ${dso} days to collect cash from trade partners, indicating potential channel credit extension.`
      : `High collection efficiency: Receivable cycle of ${dso} days reflects standard commercial terms.`,
    assumptionsDisclosed: [
      'Assumes revenue is earned ratably across the 90-day quarterly window.',
      'Calculated on period-ending gross receivables.'
    ],
    dataCompleteness: 'complete',
    isAnomaly,
    anomalyBenchmark: 'Indian FMCG benchmark: 12 to 24 days'
  };
}

// 5. Days Sales of Inventory (DSI)
export function calculateInventoryDays(
  inventoryValue: number | undefined,
  revenue: number,
  grossMarginPercent: number,
  period: string,
  daysInPeriod = 90
): DeterministicCalculationResult {
  if (inventoryValue === undefined || !revenue || revenue <= 0) {
    return {
      id: 'CALC-DSI',
      name: 'Days Sales of Inventory (DSI)',
      metricCategory: 'working_capital',
      formula: 'DSI = (Inventory / COGS) * Days_in_Period',
      inputs: [
        { name: 'Inventory', value: inventoryValue || 'N/A', unit: 'INR Cr', period, sourceDescription: 'Balance Sheet Inventories' },
        { name: 'Revenue', value: revenue, unit: 'INR Cr', period, sourceDescription: 'Revenue from Operations' }
      ],
      steps: ['Inventory balance unavailable.'],
      outputValue: 'UNAVAILABLE',
      outputUnit: 'Days',
      interpretation: 'Cannot compute DSI without reported inventory carrying value.',
      assumptionsDisclosed: [],
      dataCompleteness: 'insufficient',
      isAnomaly: false
    };
  }

  const cogs = revenue * (1 - grossMarginPercent / 100);
  const dsi = Number(((inventoryValue / cogs) * daysInPeriod).toFixed(1));
  const isAnomaly = dsi >= 85;

  return {
    id: 'CALC-DSI',
    name: 'Days Sales of Inventory (DSI)',
    metricCategory: 'working_capital',
    formula: 'COGS = Revenue * (1 - Gross_Margin_%); DSI = (Inventory / COGS) * Days_in_Period',
    inputs: [
      { name: 'Inventory', value: inventoryValue, unit: 'INR Cr', period, sourceDescription: 'Carrying Value of Inventories' },
      { name: 'Revenue', value: revenue, unit: 'INR Cr', period, sourceDescription: 'Net Revenue from Operations' },
      { name: 'Gross_Margin_%', value: grossMarginPercent, unit: '%', period, sourceDescription: 'Reported Gross Profit Margin' }
    ],
    steps: [
      `Step 1: Compute COGS = ${revenue} * (1 - ${grossMarginPercent} / 100) = ${cogs.toFixed(2)} INR Cr.`,
      `Step 2: Divide Inventory by COGS: ${inventoryValue} / ${cogs.toFixed(2)} = ${(inventoryValue / cogs).toFixed(4)}.`,
      `Step 3: Multiply by days (${daysInPeriod}) = ${dsi} days.`
    ],
    outputValue: dsi,
    outputUnit: 'Days',
    interpretation: dsi >= 85
      ? `Inventory buildup: Inventory turnover cycle has stretched to ${dsi} days, representing heightened carrying cost and potential obsolescence risk.`
      : `Lean inventory: Turnover of ${dsi} days aligns with operational benchmark.`,
    assumptionsDisclosed: ['COGS derived from reported Gross Margin percentage.'],
    dataCompleteness: 'complete',
    isAnomaly,
    anomalyBenchmark: 'Sector benchmark: 50 to 75 days'
  };
}

// 6. Retail Store Productivity (Sales per Store)
export function calculateStoreProductivity(
  retailRevenue: number,
  storeCount: number | undefined,
  priorStoreCount: number | undefined,
  period: string
): DeterministicCalculationResult {
  if (!storeCount || storeCount <= 0) {
    return {
      id: 'CALC-STORE-PROD',
      name: 'Retail Store Sales Productivity',
      metricCategory: 'productivity',
      formula: 'Revenue_per_Store = Retail_Revenue / Average_Store_Count',
      inputs: [
        { name: 'Retail_Revenue', value: retailRevenue, unit: 'INR Cr', period, sourceDescription: 'Retail Segment Revenue' },
        { name: 'Store_Count', value: 'Not Disclosed', unit: 'Stores', period, sourceDescription: 'Store Network Disclosures' }
      ],
      steps: ['Store count data is not disclosed for this company or period.'],
      outputValue: 'UNAVAILABLE',
      outputUnit: 'INR Cr / Store',
      interpretation: 'Inapplicable: Company does not operate physical retail outlets or has not published store network numbers.',
      assumptionsDisclosed: [],
      dataCompleteness: 'insufficient',
      isAnomaly: false
    };
  }

  const avgStores = priorStoreCount ? (storeCount + priorStoreCount) / 2 : storeCount;
  const revPerStore = Number((retailRevenue / avgStores).toFixed(2));

  return {
    id: 'CALC-STORE-PROD',
    name: 'Quarterly Revenue per Store',
    metricCategory: 'productivity',
    formula: 'Avg_Stores = (Store_Count_End + Store_Count_Start) / 2; Rev_Per_Store = Retail_Revenue / Avg_Stores',
    inputs: [
      { name: 'Retail_Revenue', value: retailRevenue, unit: 'INR Cr', period, sourceDescription: 'Retail Operations Revenue' },
      { name: 'Store_Count_End', value: storeCount, unit: 'Stores', period, sourceDescription: 'Ending Store Network' },
      { name: 'Store_Count_Start', value: priorStoreCount || storeCount, unit: 'Stores', period, sourceDescription: 'Beginning Store Network' }
    ],
    steps: [
      `Step 1: Compute average operating stores = (${storeCount} + ${priorStoreCount || storeCount}) / 2 = ${avgStores.toFixed(0)} stores.`,
      `Step 2: Divide retail revenue by average stores: ${retailRevenue} / ${avgStores.toFixed(0)} = ${revPerStore} INR Cr per store per quarter.`
    ],
    outputValue: revPerStore,
    outputUnit: 'INR Cr / Store',
    interpretation: `Average quarterly retail sales per operating store is ${revPerStore} INR Cr.`,
    assumptionsDisclosed: ['Assumes new stores were inaugurated evenly across the quarterly window.'],
    dataCompleteness: 'complete',
    isAnomaly: false
  };
}
