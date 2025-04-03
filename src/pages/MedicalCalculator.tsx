import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, HeartPulse, Activity, Footprints, Calculator as CalculatorIcon } from 'lucide-react'; // Added CalculatorIcon alias
import PageHeader from '../components/PageHeader';

// --- Helper Functions (Existing) ---

// BMI Calculation
const calculateBMI = (weightKg: number, heightM: number): number | null => {
  if (heightM <= 0 || weightKg <= 0) return null;
  return weightKg / (heightM * heightM);
};

// BMI Interpretation
const interpretBMI = (bmi: number | null): { text: string; color: string } => {
  if (bmi === null) return { text: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
  if (bmi < 25) return { text: 'Normal range', color: 'text-green-600' };
  if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
  return { text: 'Obese', color: 'text-cardiair-red' }; // Use theme color
};

// BSA Calculation (Mosteller)
const calculateBSA = (weightKg: number, heightCm: number): number | null => {
  if (weightKg <= 0 || heightCm <= 0) return null;
  return Math.sqrt((weightKg * heightCm) / 3600);
};

// BSA Interpretation
const interpretBSA = (bsa: number | null): { text: string; color: string } => {
  if (bsa === null) return { text: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  return {
    text: `BSA is often used by clinicians for drug dosing or physiological assessments. Typical adult values range from 1.5 to 2.2 m².`,
    color: 'text-cardiair-gray-medium' // Use theme color
  };
};

// eGFR Calculation (CKD-EPI 2021 without race)
const calculateGFR_CKDEPI = (creatinineMgDl: number, age: number, sex: 'male' | 'female'): number | null => {
  if (creatinineMgDl <= 0 || age <= 0) return null;
  const kappa = sex === 'female' ? 0.7 : 0.9;
  const alpha = sex === 'female' ? -0.241 : -0.302;
  const sexFactor = sex === 'female' ? 1.012 : 1.0;
  const scrOverKappa = creatinineMgDl / kappa;
  const term1 = Math.min(scrOverKappa, 1) ** alpha;
  const term2 = Math.max(scrOverKappa, 1) ** -1.200;
  const ageFactor = 0.9938 ** age;
  const egfr = 142 * term1 * term2 * ageFactor * sexFactor;
  return egfr;
};

// eGFR Interpretation (KDIGO Stages)
const interpretGFR = (gfr: number | null): { text: string; stage: string; color: string } => {
  if (gfr === null) return { text: '', stage: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  if (gfr >= 90) return { text: 'Normal or high kidney function (check for kidney damage if other signs present).', stage: 'Stage 1', color: 'text-green-600' };
  if (gfr >= 60) return { text: 'Mildly decreased kidney function.', stage: 'Stage 2', color: 'text-lime-600' };
  if (gfr >= 45) return { text: 'Mild to moderately decreased kidney function.', stage: 'Stage 3a', color: 'text-yellow-600' };
  if (gfr >= 30) return { text: 'Moderate to severely decreased kidney function.', stage: 'Stage 3b', color: 'text-orange-600' };
  if (gfr >= 15) return { text: 'Severely decreased kidney function.', stage: 'Stage 4', color: 'text-red-600' }; // Keep red for severe
  return { text: 'Kidney failure.', stage: 'Stage 5', color: 'text-red-800' }; // Keep darker red
};

// IBW Calculation (Devine)
const calculateIBW_Devine = (heightCm: number, sex: 'male' | 'female'): number | null => {
  if (heightCm <= 0) return null;
  const heightInches = heightCm / 2.54;
  const inchesOver5Feet = Math.max(0, heightInches - 60);
  if (sex === 'male') {
    return 50 + (2.3 * inchesOver5Feet);
  } else { // female
    return 45.5 + (2.3 * inchesOver5Feet);
  }
};

// IBW Interpretation
const interpretIBW = (ibw: number | null): { text: string; color: string } => {
  if (ibw === null) return { text: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  return {
    text: `This is an estimation using the Devine formula. IBW is often used for ventilator settings or certain drug dosages.`,
    color: 'text-cardiair-gray-medium' // Use theme color
  };
};

// AdjBW Calculation
const calculateAdjBW = (actualWeightKg: number, idealWeightKg: number): number | null => {
  if (actualWeightKg <= 0 || idealWeightKg <= 0) return null;
  if (actualWeightKg > idealWeightKg * 1.2) {
    return idealWeightKg + 0.4 * (actualWeightKg - idealWeightKg);
  }
  return null;
};

// AdjBW Interpretation
const interpretAdjBW = (adjbw: number | null, abw: number, ibw: number): { text: string; color: string } => {
  if (adjbw === null) {
    if (abw > 0 && ibw > 0 && abw <= ibw * 1.2) {
      return { text: 'Adjusted Body Weight is typically calculated when Actual Body Weight significantly exceeds Ideal Body Weight (e.g., >120%).', color: 'text-cardiair-gray-medium' }; // Use theme color
    }
    return { text: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  }
  return {
    text: `AdjBW estimates a relevant body mass for dosing certain drugs in obese patients. It's used when Actual Weight significantly exceeds Ideal Weight.`,
    color: 'text-cardiair-gray-medium' // Use theme color
  };
};

// BMR Calculation (Mifflin-St Jeor)
const calculateBMR_MifflinStJeor = (weightKg: number, heightCm: number, age: number, sex: 'male' | 'female'): number | null => {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return null;
  const sexConstant = sex === 'male' ? 5 : -161;
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + sexConstant;
  return bmr;
};

// BMR Interpretation
const interpretBMR = (bmr: number | null): { text: string; color: string } => {
  if (bmr === null) return { text: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  return {
    text: `This is the estimated minimum calories your body needs at rest. Total daily energy needs depend on activity levels.`,
    color: 'text-cardiair-gray-medium' // Use theme color
  };
};

// Corrected Calcium Calculation
const calculateCorrectedCalcium = (totalCalciumMgDl: number, albuminGdl: number): number | null => {
  if (totalCalciumMgDl <= 0 || albuminGdl <= 0) return null;
  return totalCalciumMgDl + 0.8 * (4.0 - albuminGdl);
};

// Corrected Calcium Interpretation
const interpretCorrectedCalcium = (correctedCa: number | null, totalCa: number, albumin: number): { text: string; color: string } => {
  if (correctedCa === null) return { text: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  let interpretation = `Corrected for Albumin (${albumin.toFixed(1)} g/dL). This estimates calcium if albumin were normal (4.0 g/dL). `;
  let color = 'text-cardiair-gray-medium'; // Use theme color
  if (correctedCa < 8.5) {
    interpretation += 'Result is below the typical normal range (approx. 8.5-10.5 mg/dL).';
    color = 'text-blue-600';
  } else if (correctedCa > 10.5) {
    interpretation += 'Result is above the typical normal range (approx. 8.5-10.5 mg/dL).';
    color = 'text-cardiair-red'; // Use theme color
  } else {
    interpretation += 'Result is within the typical normal range (approx. 8.5-10.5 mg/dL).';
    color = 'text-green-600';
  }
  return { text: interpretation, color: color };
};

// --- Helper Functions (New Cardio Calculators) ---

// Target Heart Rate (THR) Calculation
const calculateTHR = (age: number): { moderateMin: number; moderateMax: number; vigorousMin: number; vigorousMax: number } | null => {
  if (age <= 0) return null;
  const mhr = 220 - age;
  return {
    moderateMin: Math.round(mhr * 0.50),
    moderateMax: Math.round(mhr * 0.70),
    vigorousMin: Math.round(mhr * 0.70),
    vigorousMax: Math.round(mhr * 0.85),
  };
};

// Ankle-Brachial Index (ABI) Interpretation
const interpretABI = (abi: number | null): { text: string; color: string } => {
  if (abi === null) return { text: '', color: 'text-cardiair-gray-medium' }; // Use theme color
  if (abi > 1.3) return { text: 'Non-compressible arteries (suggests calcification, may require further investigation)', color: 'text-purple-600' };
  if (abi >= 1.0) return { text: 'Normal', color: 'text-green-600' };
  if (abi >= 0.91) return { text: 'Borderline', color: 'text-lime-600' };
  if (abi >= 0.41) return { text: 'Mild to Moderate Peripheral Artery Disease (PAD)', color: 'text-yellow-600' };
  return { text: 'Severe Peripheral Artery Disease (PAD)', color: 'text-cardiair-red' }; // Use theme color
};

// Framingham Risk Score (FRS) - Simplified Point System (Example - Needs validation against specific source)
const calculateFRS = (
  age: number,
  sex: 'male' | 'female',
  totalChol: number,
  hdlChol: number,
  sbp: number,
  isTreatedSbp: boolean,
  isSmoker: boolean
): { points: number; riskPercent: string } | null => {
  if (age <= 0 || totalChol <= 0 || hdlChol <= 0 || sbp <= 0) return null;

  let points = 0;

  // Example Point Logic (Highly Simplified - Replace with actual tables)
  if (sex === 'male') {
    if (age >= 35 && age <= 39) points += 2; else if (age >= 40 && age <= 44) points += 5; // ... add all age ranges
    if (totalChol >= 200 && totalChol <= 239) points += 2; // ... add all cholesterol ranges
    if (hdlChol < 40) points += 2; // ... add HDL ranges
    if (isSmoker) points += 4;
    if (isTreatedSbp && sbp >= 140) points += 2; else if (!isTreatedSbp && sbp >= 140) points += 1; // ... add BP ranges
  } else { // female
    if (age >= 35 && age <= 39) points += 1; else if (age >= 40 && age <= 44) points += 3; // ... add all age ranges
    if (totalChol >= 200 && totalChol <= 239) points += 1; // ... add all cholesterol ranges
    if (hdlChol < 40) points += 2; // ... add HDL ranges
    if (isSmoker) points += 3;
    if (isTreatedSbp && sbp >= 140) points += 3; else if (!isTreatedSbp && sbp >= 140) points += 1; // ... add BP ranges
  }

  // Example Risk Lookup (Highly Simplified - Replace with actual tables)
  let riskPercent = '>30%'; // Default to highest if points exceed table
  if (points <= 0) riskPercent = '<1%';
  else if (points <= 4) riskPercent = '1%';
  else if (points <= 6) riskPercent = '2%';
  else if (points <= 8) riskPercent = '3-4%';
  // ... add all point ranges

  return { points, riskPercent };
};


// --- Component ---

const MedicalCalculator = () => {
  // Existing State...
  const [bmiWeight, setBmiWeight] = useState<string>('');
  const [bmiHeight, setBmiHeight] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiInterpretation, setBmiInterpretation] = useState<{ text: string; color: string }>({ text: '', color: '' });
  const [bsaWeight, setBsaWeight] = useState<string>('');
  const [bsaHeight, setBsaHeight] = useState<string>('');
  const [bsaResult, setBsaResult] = useState<number | null>(null);
  const [bsaInterpretation, setBsaInterpretation] = useState<{ text: string; color: string }>({ text: '', color: '' });
  const [gfrCreatinine, setGfrCreatinine] = useState<string>('');
  const [gfrAge, setGfrAge] = useState<string>('');
  const [gfrSex, setGfrSex] = useState<'male' | 'female' | ''>('');
  const [gfrResult, setGfrResult] = useState<number | null>(null);
  const [gfrInterpretation, setGfrInterpretation] = useState<{ text: string; stage: string; color: string }>({ text: '', stage: '', color: '' });
  const [ibwHeight, setIbwHeight] = useState<string>('');
  const [ibwSex, setIbwSex] = useState<'male' | 'female' | ''>('');
  const [ibwResult, setIbwResult] = useState<number | null>(null);
  const [ibwInterpretation, setIbwInterpretation] = useState<{ text: string; color: string }>({ text: '', color: '' });
  const [adjBwActualWeight, setAdjBwActualWeight] = useState<string>('');
  const [adjBwResult, setAdjBwResult] = useState<number | null>(null);
  const [adjBwInterpretation, setAdjBwInterpretation] = useState<{ text: string; color: string }>({ text: '', color: '' });
  const [bmrWeight, setBmrWeight] = useState<string>('');
  const [bmrHeight, setBmrHeight] = useState<string>('');
  const [bmrAge, setBmrAge] = useState<string>('');
  const [bmrSex, setBmrSex] = useState<'male' | 'female' | ''>('');
  const [bmrResult, setBmrResult] = useState<number | null>(null);
  const [bmrInterpretation, setBmrInterpretation] = useState<{ text: string; color: string }>({ text: '', color: '' });
  const [ccTotalCalcium, setCcTotalCalcium] = useState<string>('');
  const [ccAlbumin, setCcAlbumin] = useState<string>('');
  const [ccResult, setCcResult] = useState<number | null>(null);
  const [ccInterpretation, setCcInterpretation] = useState<{ text: string; color: string }>({ text: '', color: '' });

  // New State for Cardio Calculators
  const [thrAge, setThrAge] = useState<string>('');
  const [thrResult, setThrResult] = useState<{ moderateMin: number; moderateMax: number; vigorousMin: number; vigorousMax: number } | null>(null);
  const [abiValue, setAbiValue] = useState<string>('');
  const [abiInterpretation, setAbiInterpretation] = useState<{ text: string; color: string }>({ text: '', color: '' });
  const [frsAge, setFrsAge] = useState<string>('');
  const [frsSex, setFrsSex] = useState<'male' | 'female' | ''>('');
  const [frsTotalChol, setFrsTotalChol] = useState<string>('');
  const [frsHdlChol, setFrsHdlChol] = useState<string>('');
  const [frsSbp, setFrsSbp] = useState<string>('');
  const [frsIsTreatedSbp, setFrsIsTreatedSbp] = useState<'yes' | 'no' | ''>('');
  const [frsIsSmoker, setFrsIsSmoker] = useState<'yes' | 'no' | ''>('');
  const [frsResult, setFrsResult] = useState<{ points: number; riskPercent: string } | null>(null);

  // Error State
  const [error, setError] = useState<string>('');

  // --- Calculation Handlers (Existing - Simplified for brevity, assume they exist) ---
  const handleBmiCalculate = () => {
    setError('');
    const weightNum = parseFloat(bmiWeight);
    const heightNum = parseFloat(bmiHeight);
    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      setError('BMI: Please enter valid positive numbers for weight (kg) and height (cm).');
      setBmiResult(null); setBmiInterpretation({ text: '', color: '' }); return;
    }
    const heightM = heightNum / 100;
    const result = calculateBMI(weightNum, heightM);
    setBmiResult(result); setBmiInterpretation(interpretBMI(result));
  };
  const handleBsaCalculate = () => {
    setError('');
    const weightNum = parseFloat(bsaWeight);
    const heightNum = parseFloat(bsaHeight);
    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      setError('BSA: Please enter valid positive numbers for weight (kg) and height (cm).');
      setBsaResult(null); setBsaInterpretation({ text: '', color: '' }); return;
    }
    const result = calculateBSA(weightNum, heightNum);
    setBsaResult(result); setBsaInterpretation(interpretBSA(result));
  };
  const handleGfrCalculate = () => {
    setError('');
    const creatinineNum = parseFloat(gfrCreatinine);
    const ageNum = parseInt(gfrAge, 10);
    if (isNaN(creatinineNum) || isNaN(ageNum) || creatinineNum <= 0 || ageNum <= 0 || !gfrSex) {
      setError('eGFR: Please enter valid positive numbers for creatinine (mg/dL), age, and select sex.');
      setGfrResult(null); setGfrInterpretation({ text: '', stage: '', color: '' }); return;
    }
    const result = calculateGFR_CKDEPI(creatinineNum, ageNum, gfrSex);
    setGfrResult(result); setGfrInterpretation(interpretGFR(result));
  };
  const handleIbwCalculate = () => {
    setError('');
    const heightNum = parseFloat(ibwHeight);
    if (isNaN(heightNum) || heightNum <= 0 || !ibwSex) {
      setError('IBW: Please enter a valid positive height (cm) and select sex.');
      setIbwResult(null); setIbwInterpretation({ text: '', color: '' }); return;
    }
    const result = calculateIBW_Devine(heightNum, ibwSex);
    setIbwResult(result); setIbwInterpretation(interpretIBW(result));
  };
  const handleAdjBwCalculate = () => {
    setError('');
    const actualWeightNum = parseFloat(adjBwActualWeight);
    const ibwNum = ibwResult;
    if (isNaN(actualWeightNum) || actualWeightNum <= 0) {
       setError('AdjBW: Please enter a valid positive Actual Body Weight (kg).');
       setAdjBwResult(null); setAdjBwInterpretation({ text: '', color: '' }); return;
    }
    if (ibwNum === null || ibwNum <= 0) {
       setError('AdjBW: Please calculate Ideal Body Weight (IBW) first.');
       setAdjBwResult(null); setAdjBwInterpretation({ text: '', color: '' }); return;
    }
    const result = calculateAdjBW(actualWeightNum, ibwNum);
    setAdjBwResult(result); setAdjBwInterpretation(interpretAdjBW(result, actualWeightNum, ibwNum));
  };
  const handleBmrCalculate = () => {
     setError('');
     const weightNum = parseFloat(bmrWeight);
     const heightNum = parseFloat(bmrHeight);
     const ageNum = parseInt(bmrAge, 10);
     if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum) || weightNum <= 0 || heightNum <= 0 || ageNum <= 0 || !bmrSex) {
       setError('BMR: Please enter valid positive numbers for weight (kg), height (cm), age, and select sex.');
       setBmrResult(null); setBmrInterpretation({ text: '', color: '' }); return;
     }
     const result = calculateBMR_MifflinStJeor(weightNum, heightNum, ageNum, bmrSex);
     setBmrResult(result); setBmrInterpretation(interpretBMR(result));
  };
  const handleCorrectedCalciumCalculate = () => {
     setError('');
     const totalCaNum = parseFloat(ccTotalCalcium);
     const albuminNum = parseFloat(ccAlbumin);
     if (isNaN(totalCaNum) || isNaN(albuminNum) || totalCaNum <= 0 || albuminNum <= 0) {
       setError('Corrected Ca: Please enter valid positive numbers for Total Calcium (mg/dL) and Albumin (g/dL).');
       setCcResult(null); setCcInterpretation({ text: '', color: '' }); return;
     }
     const result = calculateCorrectedCalcium(totalCaNum, albuminNum);
     setCcResult(result); setCcInterpretation(interpretCorrectedCalcium(result, totalCaNum, albuminNum));
  };

  // --- Calculation Handlers (New Cardio Calculators) ---
  const handleThrCalculate = () => {
    setError('');
    const ageNum = parseInt(thrAge, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      setError('THR: Please enter a valid positive age.');
      setThrResult(null); return;
    }
    setThrResult(calculateTHR(ageNum));
  };

  const handleAbiInterpret = () => {
    setError('');
    const abiNum = parseFloat(abiValue);
    if (isNaN(abiNum)) {
      setError('ABI: Please enter a valid number for the Ankle-Brachial Index.');
      setAbiInterpretation({ text: '', color: '' }); return;
    }
    setAbiInterpretation(interpretABI(abiNum));
  };

  const handleFrsCalculate = () => {
    setError('');
    const ageNum = parseInt(frsAge, 10);
    const totalCholNum = parseInt(frsTotalChol, 10);
    const hdlCholNum = parseInt(frsHdlChol, 10);
    const sbpNum = parseInt(frsSbp, 10);

    if (isNaN(ageNum) || isNaN(totalCholNum) || isNaN(hdlCholNum) || isNaN(sbpNum) ||
        ageNum <= 0 || totalCholNum <= 0 || hdlCholNum <= 0 || sbpNum <= 0 ||
        !frsSex || !frsIsTreatedSbp || !frsIsSmoker) {
      setError('FRS: Please enter valid positive numbers for all fields and select all options.');
      setFrsResult(null); return;
    }
    if (ageNum < 20 || ageNum > 79) {
       setError('FRS: Age must be between 20 and 79 for this calculator.');
       setFrsResult(null); return;
    }

    const result = calculateFRS(
      ageNum,
      frsSex,
      totalCholNum,
      hdlCholNum,
      sbpNum,
      frsIsTreatedSbp === 'yes',
      frsIsSmoker === 'yes'
    );
    setFrsResult(result);
  };


  return (
    <>
      <PageHeader
        title="Medical Calculator"
        subtitle="Calculate common clinical & cardiorespiratory values. For informational purposes only."
      />

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Disclaimer */}
        <Alert variant="destructive" className="mb-8 bg-red-50 border-red-500 text-red-800">
          <AlertTriangle className="h-4 w-4 !text-red-800" />
          <AlertTitle className="font-bold">Disclaimer</AlertTitle>
          <AlertDescription>
            These calculators are intended for informational and educational purposes only and do not substitute for professional medical diagnosis, advice, or treatment. Normal values and risk interpretations can vary. Always consult with a qualified healthcare professional for accurate interpretation and recommendations. Framingham Risk Score calculations are based on specific population data and may have limitations.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Input Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Grid for all calculators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* --- Existing Calculators (Restored) --- */}
          {/* BMI Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalculatorIcon size={20} /> BMI Calculator</CardTitle> {/* Added Icon */}
              <CardDescription>Body Mass Index</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="bmi-weight">Weight (kg)</Label>
                <Input id="bmi-weight" type="number" value={bmiWeight} onChange={(e) => setBmiWeight(e.target.value)} placeholder="e.g., 70" />
              </div>
              <div>
                <Label htmlFor="bmi-height">Height (cm)</Label>
                <Input id="bmi-height" type="number" value={bmiHeight} onChange={(e) => setBmiHeight(e.target.value)} placeholder="e.g., 175" />
              </div>
              <Button onClick={handleBmiCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate BMI</Button>
              {bmiResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  <p className="text-2xl font-bold text-cardiair-gray-dark">{bmiResult.toFixed(1)} kg/m²</p>
                  <p className={`mt-1 font-semibold ${bmiInterpretation.color}`}>{bmiInterpretation.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* BSA Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalculatorIcon size={20} /> BSA Calculator</CardTitle> {/* Added Icon */}
              <CardDescription>Body Surface Area (Mosteller)</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="bsa-weight">Weight (kg)</Label>
                <Input id="bsa-weight" type="number" value={bsaWeight} onChange={(e) => setBsaWeight(e.target.value)} placeholder="e.g., 70" />
              </div>
              <div>
                <Label htmlFor="bsa-height">Height (cm)</Label>
                <Input id="bsa-height" type="number" value={bsaHeight} onChange={(e) => setBsaHeight(e.target.value)} placeholder="e.g., 175" />
              </div>
              <Button onClick={handleBsaCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate BSA</Button>
              {bsaResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  <p className="text-2xl font-bold text-cardiair-gray-dark">{bsaResult.toFixed(2)} m²</p>
                  <p className={`mt-1 text-sm ${bsaInterpretation.color}`}>{bsaInterpretation.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* eGFR Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalculatorIcon size={20} /> eGFR Calculator</CardTitle> {/* Added Icon */}
              <CardDescription>CKD-EPI 2021 (No Race)</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="gfr-creatinine">Serum Creatinine (mg/dL)</Label>
                <Input id="gfr-creatinine" type="number" value={gfrCreatinine} onChange={(e) => setGfrCreatinine(e.target.value)} placeholder="e.g., 1.1" />
              </div>
              <div>
                <Label htmlFor="gfr-age">Age (years)</Label>
                <Input id="gfr-age" type="number" value={gfrAge} onChange={(e) => setGfrAge(e.target.value)} placeholder="e.g., 50" />
              </div>
              <div>
                 <Label>Sex</Label>
                 <Select onValueChange={(value: 'male' | 'female') => setGfrSex(value)} value={gfrSex}>
                   <SelectTrigger> <SelectValue placeholder="Select sex" /> </SelectTrigger>
                   <SelectContent> <SelectItem value="male">Male</SelectItem> <SelectItem value="female">Female</SelectItem> </SelectContent>
                 </Select>
              </div>
              <Button onClick={handleGfrCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate eGFR</Button>
              {gfrResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  <p className="text-2xl font-bold text-cardiair-gray-dark">{gfrResult.toFixed(0)} mL/min/1.73 m²</p>
                  <p className={`mt-1 font-semibold ${gfrInterpretation.color}`}>{gfrInterpretation.stage}</p>
                  <p className={`mt-1 text-sm ${gfrInterpretation.color}`}>{gfrInterpretation.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* IBW Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalculatorIcon size={20} /> IBW Calculator</CardTitle> {/* Added Icon */}
              <CardDescription>Ideal Body Weight (Devine)</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="ibw-height">Height (cm)</Label>
                <Input id="ibw-height" type="number" value={ibwHeight} onChange={(e) => setIbwHeight(e.target.value)} placeholder="e.g., 175" />
              </div>
              <div>
                 <Label>Sex</Label>
                 <Select onValueChange={(value: 'male' | 'female') => setIbwSex(value)} value={ibwSex}>
                   <SelectTrigger> <SelectValue placeholder="Select sex" /> </SelectTrigger>
                   <SelectContent> <SelectItem value="male">Male</SelectItem> <SelectItem value="female">Female</SelectItem> </SelectContent>
                 </Select>
              </div>
              <Button onClick={handleIbwCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate IBW</Button>
              {ibwResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  <p className="text-2xl font-bold text-cardiair-gray-dark">{ibwResult.toFixed(1)} kg</p>
                  <p className={`mt-1 text-sm ${ibwInterpretation.color}`}>{ibwInterpretation.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AdjBW Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalculatorIcon size={20} /> AdjBW Calculator</CardTitle> {/* Added Icon */}
              <CardDescription>Adjusted Body Weight</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="adjbw-actual-weight">Actual Body Weight (kg)</Label>
                <Input id="adjbw-actual-weight" type="number" value={adjBwActualWeight} onChange={(e) => setAdjBwActualWeight(e.target.value)} placeholder="e.g., 90" />
              </div>
               <div>
                 <Label>Ideal Body Weight (kg)</Label>
                 <Input type="number" value={ibwResult !== null ? ibwResult.toFixed(1) : ''} readOnly disabled placeholder="Calculate IBW first" />
               </div>
              <Button onClick={handleAdjBwCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90" disabled={ibwResult === null}>Calculate AdjBW</Button>
              {adjBwResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  <p className="text-2xl font-bold text-cardiair-gray-dark">{adjBwResult.toFixed(1)} kg</p>
                  <p className={`mt-1 text-sm ${adjBwInterpretation.color}`}>{adjBwInterpretation.text}</p>
                </div>
              )}
               {adjBwResult === null && adjBwInterpretation.text && ibwResult !== null && (
                 <div className="mt-4 p-4 bg-gray-50 rounded">
                   <p className={`mt-1 text-sm ${adjBwInterpretation.color}`}>{adjBwInterpretation.text}</p>
                 </div>
               )}
            </CardContent>
          </Card>

          {/* BMR Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalculatorIcon size={20} /> BMR Calculator</CardTitle> {/* Added Icon */}
              <CardDescription>Basal Metabolic Rate (Mifflin-St Jeor)</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="bmr-weight">Weight (kg)</Label>
                <Input id="bmr-weight" type="number" value={bmrWeight} onChange={(e) => setBmrWeight(e.target.value)} placeholder="e.g., 70" />
              </div>
              <div>
                <Label htmlFor="bmr-height">Height (cm)</Label>
                <Input id="bmr-height" type="number" value={bmrHeight} onChange={(e) => setBmrHeight(e.target.value)} placeholder="e.g., 175" />
              </div>
              <div>
                <Label htmlFor="bmr-age">Age (years)</Label>
                <Input id="bmr-age" type="number" value={bmrAge} onChange={(e) => setBmrAge(e.target.value)} placeholder="e.g., 30" />
              </div>
              <div>
                 <Label>Sex</Label>
                 <Select onValueChange={(value: 'male' | 'female') => setBmrSex(value)} value={bmrSex}>
                   <SelectTrigger> <SelectValue placeholder="Select sex" /> </SelectTrigger>
                   <SelectContent> <SelectItem value="male">Male</SelectItem> <SelectItem value="female">Female</SelectItem> </SelectContent>
                 </Select>
              </div>
              <Button onClick={handleBmrCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate BMR</Button>
              {bmrResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  <p className="text-2xl font-bold text-cardiair-gray-dark">{bmrResult.toFixed(0)} kcal/day</p>
                  <p className={`mt-1 text-sm ${bmrInterpretation.color}`}>{bmrInterpretation.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Corrected Calcium Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalculatorIcon size={20} /> Corrected Calcium</CardTitle> {/* Added Icon */}
              <CardDescription>Adjusts for Albumin Level</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="cc-calcium">Total Calcium (mg/dL)</Label>
                <Input id="cc-calcium" type="number" value={ccTotalCalcium} onChange={(e) => setCcTotalCalcium(e.target.value)} placeholder="e.g., 9.5" />
              </div>
              <div>
                <Label htmlFor="cc-albumin">Serum Albumin (g/dL)</Label>
                <Input id="cc-albumin" type="number" value={ccAlbumin} onChange={(e) => setCcAlbumin(e.target.value)} placeholder="e.g., 3.5" />
              </div>
              <Button onClick={handleCorrectedCalciumCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate Corrected Ca</Button>
              {ccResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  <p className="text-2xl font-bold text-cardiair-gray-dark">{ccResult.toFixed(1)} mg/dL</p>
                  <p className={`mt-1 text-sm ${ccInterpretation.color}`}>{ccInterpretation.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* --- New Cardio Calculators --- */}

          {/* Target Heart Rate (THR) Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity size={20} /> Target Heart Rate</CardTitle>
              <CardDescription>Estimate exercise heart rate zones</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="thr-age">Age (years)</Label>
                <Input id="thr-age" type="number" value={thrAge} onChange={(e) => setThrAge(e.target.value)} placeholder="e.g., 45" />
              </div>
              <Button onClick={handleThrCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate THR Zones</Button>
              {thrResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded space-y-1">
                  <p className="text-sm text-cardiair-gray-medium">Estimated Max Heart Rate: <span className="font-semibold">{220 - parseInt(thrAge, 10)} bpm</span></p>
                  <p className="text-sm text-green-600">Moderate Zone (50-70%): <span className="font-semibold">{thrResult.moderateMin} - {thrResult.moderateMax} bpm</span></p>
                  <p className="text-sm text-orange-600">Vigorous Zone (70-85%): <span className="font-semibold">{thrResult.vigorousMin} - {thrResult.vigorousMax} bpm</span></p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ankle-Brachial Index (ABI) Interpreter */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Footprints size={20} /> ABI Interpreter</CardTitle>
              <CardDescription>Interpret Ankle-Brachial Index value</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <Label htmlFor="abi-value">ABI Value</Label>
                <Input id="abi-value" type="number" step="0.01" value={abiValue} onChange={(e) => setAbiValue(e.target.value)} placeholder="e.g., 0.95" />
              </div>
              <Button onClick={handleAbiInterpret} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Interpret ABI</Button>
              {abiInterpretation.text && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Interpretation:</p>
                  <p className={`text-lg font-bold ${abiInterpretation.color}`}>{abiInterpretation.text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Framingham Risk Score (FRS) Calculator */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse size={20} /> Framingham Risk Score</CardTitle>
              <CardDescription>10-Year CVD Risk (Simplified Example)</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3"> {/* Reduced spacing slightly */}
              <div>
                <Label htmlFor="frs-age">Age (years)</Label>
                <Input id="frs-age" type="number" value={frsAge} onChange={(e) => setFrsAge(e.target.value)} placeholder="20-79" />
              </div>
              <div>
                 <Label>Sex</Label>
                 <Select onValueChange={(value: 'male' | 'female') => setFrsSex(value)} value={frsSex}>
                   <SelectTrigger> <SelectValue placeholder="Select sex" /> </SelectTrigger>
                   <SelectContent> <SelectItem value="male">Male</SelectItem> <SelectItem value="female">Female</SelectItem> </SelectContent>
                 </Select>
              </div>
               <div>
                <Label htmlFor="frs-total-chol">Total Cholesterol (mg/dL)</Label>
                <Input id="frs-total-chol" type="number" value={frsTotalChol} onChange={(e) => setFrsTotalChol(e.target.value)} placeholder="e.g., 210" />
              </div>
               <div>
                <Label htmlFor="frs-hdl-chol">HDL Cholesterol (mg/dL)</Label>
                <Input id="frs-hdl-chol" type="number" value={frsHdlChol} onChange={(e) => setFrsHdlChol(e.target.value)} placeholder="e.g., 45" />
              </div>
               <div>
                <Label htmlFor="frs-sbp">Systolic Blood Pressure (mmHg)</Label>
                <Input id="frs-sbp" type="number" value={frsSbp} onChange={(e) => setFrsSbp(e.target.value)} placeholder="e.g., 135" />
              </div>
               <div>
                 <Label>On BP Treatment?</Label>
                 <Select onValueChange={(value: 'yes' | 'no') => setFrsIsTreatedSbp(value)} value={frsIsTreatedSbp}>
                   <SelectTrigger> <SelectValue placeholder="Select option" /> </SelectTrigger>
                   <SelectContent> <SelectItem value="yes">Yes</SelectItem> <SelectItem value="no">No</SelectItem> </SelectContent>
                 </Select>
              </div>
               <div>
                 <Label>Smoker?</Label>
                 <Select onValueChange={(value: 'yes' | 'no') => setFrsIsSmoker(value)} value={frsIsSmoker}>
                   <SelectTrigger> <SelectValue placeholder="Select option" /> </SelectTrigger>
                   <SelectContent> <SelectItem value="yes">Yes</SelectItem> <SelectItem value="no">No</SelectItem> </SelectContent>
                 </Select>
              </div>
              <Button onClick={handleFrsCalculate} className="w-full bg-cardiair-red text-cardiair-white hover:bg-opacity-90">Calculate FRS</Button>
              {frsResult !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-cardiair-gray-medium">Result:</p>
                  {/* <p className="text-lg font-semibold text-cardiair-gray-dark">Points: {frsResult.points}</p> */}
                  <p className="text-xl font-bold text-cardiair-red">10-Year CVD Risk: {frsResult.riskPercent}</p>
                  <p className="text-xs italic text-gray-500 mt-1">(Based on simplified example points system)</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center mb-12">
          <Link to="/screening">
            <Button variant="outline" className="flex items-center gap-2 border-cardiair-red text-cardiair-red hover:bg-cardiair-red hover:text-cardiair-white">
              <ArrowLeft size={16} />
              Back to Screening Tools
            </Button>
          </Link>
        </div>
      </div>
    </> // Close fragment
  );
};

export default MedicalCalculator;
