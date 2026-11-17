import {
  CounterMLPEvaluation,
  CascadedMLPEvaluation,
  CascadedStage,
} from './types';
import { sumOfOnes, evaluateMultiGate } from './gates';
import { stepActivation, generateAllInputs } from './perceptron';

/**
 * 2-Input Classic XOR MLP from PRD 1 & Section 5.4
 * h1 = step(X1 - X2 - 0.5)
 * h2 = step(-X1 + X2 - 0.5)
 * Y = step(h1 + h2 - 0.5)
 */
export function evaluate2InputXorMLP(
  x1: number,
  x2: number,
  type: 'XOR' | 'XNOR' = 'XOR'
): {
  h1: number;
  h2: number;
  z1: number;
  z2: number;
  zOut: number;
  y: number;
} {
  const z1 = 1 * x1 + -1 * x2 - 0.5;
  const h1 = stepActivation(z1);

  const z2 = -1 * x1 + 1 * x2 - 0.5;
  const h2 = stepActivation(z2);

  if (type === 'XOR') {
    const zOut = 1 * h1 + 1 * h2 - 0.5;
    const y = stepActivation(zOut);
    return { h1, h2, z1, z2, zOut, y };
  } else {
    // XNOR
    const zOut = -1 * h1 + -1 * h2 + 0.5;
    const y = stepActivation(zOut);
    return { h1, h2, z1, z2, zOut, y };
  }
}

/**
 * Forward pass for Counter MLP (n inputs, n hidden neurons, 1 output neuron)
 * PRD Section 5.4:
 * h_k = step(s - (k - 0.5)) for k = 1 ... n
 * Output weights: w_k = (-1)^(k + 1) -> [+1, -1, +1, -1, ...]
 * XOR:  Y = step( Σ (w_k * h_k) - 0.5 )
 * XNOR: Y = step( -Σ (w_k * h_k) + 0.5 )
 */
export function forwardCounterMLP(
  inputs: number[],
  type: 'XOR' | 'XNOR' = 'XOR'
): CounterMLPEvaluation {
  const n = inputs.length;
  const s = sumOfOnes(inputs);

  const hiddenActivations: number[] = [];
  const hiddenThresholds: number[] = [];
  const outputWeights: number[] = [];

  for (let k = 1; k <= n; k++) {
    const threshold = k - 0.5;
    hiddenThresholds.push(threshold);
    // z_k = s - threshold
    const z_k = s - threshold;
    const h_k = stepActivation(z_k);
    hiddenActivations.push(h_k);

    // w_k = (-1)^(k + 1): k=1 -> +1, k=2 -> -1, k=3 -> +1 ...
    const w_k = k % 2 === 1 ? 1 : -1;
    outputWeights.push(w_k);
  }

  // Alternating sum = h1 - h2 + h3 - h4 + ...
  const alternatingSum = hiddenActivations.reduce(
    (acc, h, i) => acc + h * outputWeights[i],
    0
  );

  let outputZ: number;
  let outputBias: number;
  let y: number;

  if (type === 'XOR') {
    outputBias = -0.5;
    outputZ = alternatingSum + outputBias;
    y = stepActivation(outputZ);
  } else {
    outputBias = 0.5;
    outputZ = -alternatingSum + outputBias;
    y = stepActivation(outputZ);
  }

  const expected = evaluateMultiGate(type, inputs);
  const isCorrect = y === expected;

  return {
    s,
    hiddenActivations,
    hiddenThresholds,
    outputWeights,
    outputBias,
    alternatingSum,
    outputZ,
    y,
    expected,
    isCorrect,
    type,
  };
}

/**
 * Forward pass for Cascaded 2-input XOR blocks (Section 5.4)
 * Chain of n - 1 blocks
 */
export function forwardCascadedMLP(
  inputs: number[],
  type: 'XOR' | 'XNOR' = 'XOR'
): CascadedMLPEvaluation {
  const n = inputs.length;
  if (n < 2) {
    const val = inputs[0] ?? 0;
    return {
      stages: [],
      y: type === 'XOR' ? val : (val ? 0 : 1),
      expected: evaluateMultiGate(type, inputs),
      isCorrect: true,
      type,
    };
  }

  const stages: CascadedStage[] = [];
  let currentVal = inputs[0];

  for (let i = 1; i < n; i++) {
    const nextInput = inputs[i];
    // Evaluate 2-input XOR block using original 2-hidden-neuron network
    const h1 = stepActivation(currentVal - nextInput - 0.5);
    const h2 = stepActivation(-currentVal + nextInput - 0.5);
    const stageOutput = stepActivation(h1 + h2 - 0.5);

    stages.push({
      stageIndex: i,
      inputA: currentVal,
      inputB: nextInput,
      h1,
      h2,
      stageOutput,
    });

    currentVal = stageOutput;
  }

  const finalOutput = type === 'XOR' ? currentVal : (currentVal === 1 ? 0 : 1);
  const expected = evaluateMultiGate(type, inputs);
  const isCorrect = finalOutput === expected;

  return {
    stages,
    y: finalOutput,
    expected,
    isCorrect,
    type,
  };
}

/**
 * Cross-verify all 2^n inputs against direct Boolean parity function
 */
export function verifyAllMLPCombinations(
  n: number,
  type: 'XOR' | 'XNOR',
  architecture: 'counter' | 'cascaded'
): {
  total: number;
  correct: number;
  accuracy: number;
  is100Percent: boolean;
} {
  const allInputs = generateAllInputs(n);
  let correct = 0;

  for (const vector of allInputs) {
    const expected = evaluateMultiGate(type, vector);
    let actual: number;
    if (architecture === 'counter') {
      actual = forwardCounterMLP(vector, type).y;
    } else {
      actual = forwardCascadedMLP(vector, type).y;
    }

    if (actual === expected) {
      correct++;
    }
  }

  const total = allInputs.length;
  const accuracy = (correct / total) * 100;

  return {
    total,
    correct,
    accuracy,
    is100Percent: correct === total,
  };
}
