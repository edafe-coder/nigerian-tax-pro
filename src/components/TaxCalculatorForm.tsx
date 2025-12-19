import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowLeft, Briefcase, User, Home, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { TaxInput } from '@/lib/taxCalculator';

interface TaxCalculatorFormProps {
  onCalculate: (input: TaxInput) => void;
  onBack: () => void;
}

export function TaxCalculatorForm({ onCalculate, onBack }: TaxCalculatorFormProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [grossIncome, setGrossIncome] = useState('');
  const [annualRent, setAnnualRent] = useState('');
  const [hasPension, setHasPension] = useState(true);

  // Auto-check pension for salary earners
  const handleEmploymentChange = (freelancer: boolean) => {
    setIsFreelancer(freelancer);
    if (!freelancer) {
      setHasPension(true);
    }
  };

  const formatInputValue = (value: string): string => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Format with commas
    return numericValue ? parseInt(numericValue).toLocaleString() : '';
  };

  const parseInputValue = (value: string): number => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCalculate({
      grossIncome: parseInputValue(grossIncome),
      annualRent: parseInputValue(annualRent),
      isMonthly,
      hasPension,
    });
  };

  const isValid = parseInputValue(grossIncome) > 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-primary via-forest to-forest-light" />
      <div className="absolute top-0 left-0 right-0 h-80 bg-hero-pattern opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
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
            Enter Your Income Details
          </h1>
          <p className="text-primary-foreground/70">
            We'll calculate your tax based on the 2025 Nigerian Tax Reform
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl shadow-elevated p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Income Period Toggle */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-gold" />
                Income Period
              </Label>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary">
                <span className={`text-sm font-medium transition-colors ${isMonthly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <Switch
                  checked={!isMonthly}
                  onCheckedChange={(checked) => setIsMonthly(!checked)}
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`text-sm font-medium transition-colors ${!isMonthly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Annual
                </span>
              </div>
            </div>

            {/* Employment Status Toggle */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gold" />
                Employment Status
              </Label>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary">
                <span className={`text-sm font-medium transition-colors ${!isFreelancer ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <User className="inline h-4 w-4 mr-1" />
                  Salary Earner
                </span>
                <Switch
                  checked={isFreelancer}
                  onCheckedChange={handleEmploymentChange}
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`text-sm font-medium transition-colors ${isFreelancer ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <Briefcase className="inline h-4 w-4 mr-1" />
                  Freelancer
                </span>
              </div>
            </div>

            {/* Gross Income Input */}
            <div className="space-y-3">
              <Label htmlFor="grossIncome" className="text-base font-semibold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-gold" />
                Gross {isMonthly ? 'Monthly' : 'Annual'} Income
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₦
                </span>
                <Input
                  id="grossIncome"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(formatInputValue(e.target.value))}
                  className="pl-8 h-14 text-lg font-medium rounded-2xl border-2 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Annual Rent Input */}
            <div className="space-y-3">
              <Label htmlFor="annualRent" className="text-base font-semibold flex items-center gap-2">
                <Home className="h-4 w-4 text-gold" />
                {isMonthly ? 'Monthly' : 'Annual'} Rent Paid
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₦
                </span>
                <Input
                  id="annualRent"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={annualRent}
                  onChange={(e) => setAnnualRent(formatInputValue(e.target.value))}
                  className="pl-8 h-14 text-lg font-medium rounded-2xl border-2 focus:border-primary transition-colors"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                You can claim up to 20% of rent paid (max ₦500,000/year) as tax relief
              </p>
            </div>

            {/* Pension Contribution Checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary">
              <Checkbox
                id="pension"
                checked={hasPension}
                onCheckedChange={(checked) => setHasPension(checked as boolean)}
                disabled={!isFreelancer}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor="pension" className="text-base font-medium cursor-pointer">
                  Pension Contribution (8%)
                </Label>
                <p className="text-sm text-muted-foreground">
                  {!isFreelancer 
                    ? "Automatically included for salary earners" 
                    : "Optional for freelancers - reduces taxable income"}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid}
              className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Tax
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
