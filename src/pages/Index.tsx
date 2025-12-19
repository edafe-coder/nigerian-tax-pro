import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { TaxCalculatorForm } from '@/components/TaxCalculatorForm';
import { TaxResultCard } from '@/components/TaxResultCard';
import { Footer } from '@/components/Footer';
import { calculateTax, TaxInput, TaxResult } from '@/lib/taxCalculator';

type Screen = 'welcome' | 'form' | 'result';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [taxInput, setTaxInput] = useState<TaxInput | null>(null);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);

  const handleGetStarted = () => {
    setCurrentScreen('form');
  };

  const handleCalculate = (input: TaxInput) => {
    const result = calculateTax(input);
    setTaxInput(input);
    setTaxResult(result);
    setCurrentScreen('result');
  };

  const handleRecalculate = () => {
    setCurrentScreen('form');
  };

  const handleBack = () => {
    setCurrentScreen('welcome');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {currentScreen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <WelcomeScreen onGetStarted={handleGetStarted} />
            </motion.div>
          )}
          
          {currentScreen === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TaxCalculatorForm onCalculate={handleCalculate} onBack={handleBack} />
            </motion.div>
          )}
          
          {currentScreen === 'result' && taxResult && taxInput && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TaxResultCard 
                result={taxResult} 
                input={taxInput}
                onRecalculate={handleRecalculate} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
