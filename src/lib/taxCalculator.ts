/**
 * Nigerian Tax Calculator - 2025 Reform Edition
 * Implements the progressive tax bands as per Nigeria Tax Act 2025
 */

export interface TaxInput {
  grossIncome: number;
  annualRent: number;
  isMonthly: boolean;
  hasPension: boolean;
}

export interface TaxResult {
  grossAnnualIncome: number;
  rentRelief: number;
  pensionDeduction: number;
  chargeableIncome: number;
  totalAnnualTax: number;
  monthlyTax: number;
  effectiveTaxRate: number;
  taxBandBreakdown: TaxBandResult[];
}

export interface TaxBandResult {
  band: string;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

// Tax bands for 2025 Nigerian Tax Reform
const TAX_BANDS = [
  { threshold: 800000, rate: 0, label: 'First ₦800,000' },
  { threshold: 2200000, rate: 0.15, label: 'Next ₦2,200,000' },
  { threshold: 9000000, rate: 0.18, label: 'Next ₦9,000,000' },
  { threshold: 13000000, rate: 0.21, label: 'Next ₦13,000,000' },
  { threshold: 25000000, rate: 0.23, label: 'Next ₦25,000,000' },
  { threshold: Infinity, rate: 0.25, label: 'Above ₦50,000,000' },
];

// Maximum rent relief cap
const MAX_RENT_RELIEF = 500000;
const RENT_RELIEF_RATE = 0.20;
const PENSION_RATE = 0.08;

/**
 * Calculate the tax based on Nigerian 2025 tax reform rules
 */
export function calculateTax(input: TaxInput): TaxResult {
  // Step A: Normalization - convert monthly to annual if needed
  const grossAnnualIncome = input.isMonthly 
    ? input.grossIncome * 12 
    : input.grossIncome;
  
  const annualRent = input.isMonthly 
    ? input.annualRent * 12 
    : input.annualRent;

  // Step B: Calculate deductions
  // Rent Relief: 20% of annual rent, capped at ₦500,000
  const rentRelief = Math.min(annualRent * RENT_RELIEF_RATE, MAX_RENT_RELIEF);
  
  // Pension Deduction: 8% of gross if applicable
  const pensionDeduction = input.hasPension 
    ? grossAnnualIncome * PENSION_RATE 
    : 0;

  // Chargeable Income (cannot be less than 0)
  const chargeableIncome = Math.max(
    0, 
    grossAnnualIncome - rentRelief - pensionDeduction
  );

  // Step C: Apply progressive tax bands
  const { totalTax, breakdown } = calculateProgressiveTax(chargeableIncome);

  // Calculate effective tax rate
  const effectiveTaxRate = grossAnnualIncome > 0 
    ? (totalTax / grossAnnualIncome) * 100 
    : 0;

  return {
    grossAnnualIncome,
    rentRelief,
    pensionDeduction,
    chargeableIncome,
    totalAnnualTax: totalTax,
    monthlyTax: totalTax / 12,
    effectiveTaxRate,
    taxBandBreakdown: breakdown,
  };
}

/**
 * Apply progressive tax bands to chargeable income
 */
function calculateProgressiveTax(chargeableIncome: number): { 
  totalTax: number; 
  breakdown: TaxBandResult[] 
} {
  let remainingIncome = chargeableIncome;
  let totalTax = 0;
  const breakdown: TaxBandResult[] = [];
  let previousThreshold = 0;

  for (const band of TAX_BANDS) {
    if (remainingIncome <= 0) break;

    const bandSize = band.threshold === Infinity 
      ? remainingIncome 
      : band.threshold;
    
    const taxableInBand = Math.min(remainingIncome, bandSize);
    const taxInBand = taxableInBand * band.rate;

    if (taxableInBand > 0) {
      breakdown.push({
        band: band.label,
        rate: band.rate * 100,
        taxableAmount: taxableInBand,
        taxAmount: taxInBand,
      });
    }

    totalTax += taxInBand;
    remainingIncome -= taxableInBand;
    previousThreshold = band.threshold;
  }

  return { totalTax, breakdown };
}

/**
 * Format currency in Nigerian Naira
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a human-readable explanation of the tax calculation
 */
export function generateExplanation(input: TaxInput, result: TaxResult): string {
  const incomeType = input.isMonthly ? 'monthly' : 'annual';
  
  if (result.totalAnnualTax === 0) {
    return `Based on your ${incomeType} gross income of ${formatNaira(input.grossIncome)}, your entire income falls within the tax-free threshold of ₦800,000. You don't owe any taxes under the 2025 reform!`;
  }

  let explanation = `Based on your gross income of ${formatNaira(result.grossAnnualIncome)} annually`;
  
  const deductions: string[] = [];
  if (result.rentRelief > 0) {
    deductions.push(`${formatNaira(result.rentRelief)} for rent relief`);
  }
  if (result.pensionDeduction > 0) {
    deductions.push(`${formatNaira(result.pensionDeduction)} for pension contribution`);
  }

  if (deductions.length > 0) {
    explanation += `, we deducted ${deductions.join(' and ')}`;
  }

  explanation += `. Your first ₦800,000 is completely tax-free. The remaining ${formatNaira(Math.max(0, result.chargeableIncome - 800000))} was taxed progressively across the 2025 tax bands, resulting in an effective tax rate of ${result.effectiveTaxRate.toFixed(2)}%.`;

  return explanation;
}
