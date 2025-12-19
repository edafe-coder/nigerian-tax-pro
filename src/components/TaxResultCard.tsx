import { motion } from 'framer-motion';
import { ArrowLeft, Download, TrendingDown, PiggyBank, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaxResult, TaxInput, formatNaira, generateExplanation } from '@/lib/taxCalculator';

interface TaxResultCardProps {
  result: TaxResult;
  input: TaxInput;
  onRecalculate: () => void;
}

export function TaxResultCard({ result, input, onRecalculate }: TaxResultCardProps) {
  const explanation = generateExplanation(input, result);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-primary via-forest to-forest-light" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-hero-pattern opacity-20" />
      
      {/* Floating decorations */}
      <motion.div
        className="absolute top-40 right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onRecalculate}
            className="text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Calculate Again
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Your Tax Report
          </h1>
          <p className="text-primary-foreground/70">
            Based on the 2025 Nigerian Tax Reform
          </p>
        </motion.div>

        {/* Main Result Card - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-strong rounded-3xl shadow-elevated p-6 md:p-8 mb-6"
        >
          {/* Big Figures */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Total Annual Tax
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-1">
                {formatNaira(result.totalAnnualTax)}
              </h2>
              {result.totalAnnualTax === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gold font-semibold flex items-center justify-center gap-2"
                >
                  <PiggyBank className="h-5 w-5" />
                  Tax Free!
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Monthly Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="p-4 rounded-2xl bg-secondary text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Monthly Tax
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {formatNaira(result.monthlyTax)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Effective Rate
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {result.effectiveTaxRate.toFixed(2)}%
              </p>
            </div>
          </motion.div>

          {/* Deductions Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 mb-8"
          >
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Deductions Applied
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Gross Annual Income</span>
                <span className="font-semibold">{formatNaira(result.grossAnnualIncome)}</span>
              </div>
              {result.rentRelief > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Rent Relief (20%, max ₦500k)</span>
                  <span className="font-semibold text-green-600">-{formatNaira(result.rentRelief)}</span>
                </div>
              )}
              {result.pensionDeduction > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Pension Contribution (8%)</span>
                  <span className="font-semibold text-green-600">-{formatNaira(result.pensionDeduction)}</span>
                </div>
              )}
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10 border-2 border-primary/20">
                <span className="text-sm font-medium">Chargeable Income</span>
                <span className="font-bold">{formatNaira(result.chargeableIncome)}</span>
              </div>
            </div>
          </motion.div>

          {/* Tax Band Breakdown */}
          {result.taxBandBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3 mb-8"
            >
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Tax Band Breakdown
              </h3>
              <div className="space-y-2">
                {result.taxBandBreakdown.map((band, index) => (
                  <motion.div
                    key={band.band}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex justify-between items-center p-3 rounded-xl bg-muted/50"
                  >
                    <div>
                      <span className="text-sm text-muted-foreground">{band.band}</span>
                      <span className="text-xs text-muted-foreground/70 ml-2">@ {band.rate}%</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNaira(band.taxAmount)}</p>
                      <p className="text-xs text-muted-foreground">on {formatNaira(band.taxableAmount)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-4 rounded-2xl bg-gold/10 border border-gold/30"
          >
            <h3 className="text-sm uppercase tracking-wider text-foreground flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-gold" />
              The Why
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {explanation}
            </p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 pb-8"
        >
          <Button
            type="button"
            onClick={onRecalculate}
            className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 relative z-10"
          >
            <Calculator className="mr-2 h-4 w-4" />
            New Calculation
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
