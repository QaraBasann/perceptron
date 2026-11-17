import { MultiGateType, PerceptronParams, PerceptronEvaluation, TestAllResults, BiasInterval } from './types';
import { evaluateMultiGate, sumOfOnes } from './gates';

/**
 * Step activation function: Y = 1 if z >= 0 else 0
 */
export function stepActivation(z: number): number {
  return z >= 0 ? 1 : 0;
}

/**
 * Get mathematically exact default working parameters (Section 5.3)
 * AND:  W = +1, b = -(n - 0.5)
 * NAND: W = -1, b = +(n - 0.5)
 * OR:   W = +1, b = -0.5
 * NOR:  W = -1, b = +0.5
 */
export function getDefaultParameters(gate: MultiGateType, n: number): PerceptronParams {
  switch (gate) {
    case 'AND':
      return {
        weights: Array(n).fill(1),
        bias: -(n - 0.5),
      };
    case 'NAND':
      return {
        weights: Array(n).fill(-1),
        bias: +(n - 0.5),
      };
    case 'OR':
      return {
        weights: Array(n).fill(1),
        bias: -0.5,
      };
    case 'NOR':
      return {
        weights: Array(n).fill(-1),
        bias: 0.5,
      };
    case 'XOR':
    case 'XNOR':
      // Fallback for single perceptron on XOR (will not be 100% accurate)
      return {
        weights: Array(n).fill(1),
        bias: -0.5,
      };
    default:
      return {
        weights: Array(n).fill(1),
        bias: -0.5,
      };
  }
}

/**
 * Forward pass for single perceptron:
 * z = Σ(Xi × Wi) + b
 * Y = step(z)
 */
export function forwardPerceptron(
  weights: number[],
  bias: number,
  inputs: number[],
  gate?: MultiGateType
): PerceptronEvaluation {
  const terms = inputs.map((x, i) => {
    const w = weights[i] ?? 0;
    return {
      index: i + 1,
      x,
      w,
      product: x * w,
    };
  });

  const sumProducts = terms.reduce((acc, t) => acc + t.product, 0);
  const z = sumProducts + bias;
  const y = stepActivation(z);
  const s = sumOfOnes(inputs);

  const expected = gate ? evaluateMultiGate(gate, inputs) : y;
  const isCorrect = y === expected;

  return {
    z,
    y,
    expected,
    isCorrect,
    terms,
    bias,
    s,
  };
}

/**
 * Generate all 2^n binary input vectors
 */
export function generateAllInputs(n: number): number[][] {
  const total = Math.pow(2, n);
  const result: number[][] = [];
  for (let i = 0; i < total; i++) {
    const vector: number[] = [];
    for (let bit = n - 1; bit >= 0; bit--) {
      vector.push((i >> bit) & 1);
    }
    result.push(vector);
  }
  return result;
}

/**
 * Test all 2^n input combinations for given weights and bias against target gate
 */
export function testAllCombinations(
  weights: number[],
  bias: number,
  gate: MultiGateType,
  n: number
): TestAllResults {
  const allInputs = generateAllInputs(n);
  let correct = 0;
  const wrongRows: TestAllResults['wrongRows'] = [];

  for (const inputs of allInputs) {
    const s = sumOfOnes(inputs);
    const expected = evaluateMultiGate(gate, inputs);
    const sumProducts = inputs.reduce((acc, x, i) => acc + x * (weights[i] ?? 0), 0);
    const z = sumProducts + bias;
    const actual = stepActivation(z);

    if (actual === expected) {
      correct++;
    } else {
      wrongRows.push({
        inputs,
        s,
        expected,
        actual,
        z,
      });
    }
  }

  const total = allInputs.length;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  return {
    total,
    correct,
    accuracy,
    wrongRows,
  };
}

/**
 * Computes allowable bias interval for a gate under given weights (or default weights)
 * For AND(n) with W=1: s=n gives n + b >= 0 -> b >= -n. s=n-1 gives n-1 + b < 0 -> b < -(n-1).
 * Allowed interval: -n <= b < -(n - 1)
 * For OR(n) with W=1: s=1 gives 1 + b >= 0 -> b >= -1. s=0 gives b < 0 -> b < 0.
 * Allowed interval: -1 <= b < 0
 */
export function getAllowableBiasInterval(
  gate: MultiGateType,
  n: number,
  weights: number[]
): BiasInterval {
  const allInputs = generateAllInputs(n);
  let minAllowed = -Infinity; // max of -sum for Y=1
  let maxAllowed = Infinity;  // min of -sum for Y=0

  let hasOne = false;
  let hasZero = false;

  for (const inputs of allInputs) {
    const expected = evaluateMultiGate(gate, inputs);
    const sumProd = inputs.reduce((acc, x, i) => acc + x * (weights[i] ?? 0), 0);

    if (expected === 1) {
      // z = sumProd + b >= 0 => b >= -sumProd
      hasOne = true;
      if (-sumProd > minAllowed) {
        minAllowed = -sumProd;
      }
    } else {
      // z = sumProd + b < 0 => b < -sumProd
      hasZero = true;
      if (-sumProd < maxAllowed) {
        maxAllowed = -sumProd;
      }
    }
  }

  const isSolvable = minAllowed < maxAllowed;

  let explanation = '';
  if (!isSolvable) {
    explanation = 'Bu çəkilərlə qapı xətti ayrıla bilən deyil (interval boşdur).';
  } else {
    explanation = `${minAllowed.toFixed(1)} ≤ b < ${maxAllowed.toFixed(1)}`;
  }

  return {
    min: isSolvable ? minAllowed : 0,
    max: isSolvable ? maxAllowed : 0,
    minInclusive: true,
    maxInclusive: false,
    explanation,
  };
}
