import { MultiGateType, EpochLog, TrainingResult } from './types';
import { evaluateMultiGate, sumOfOnes } from './gates';
import { stepActivation, generateAllInputs } from './perceptron';

export interface TrainConfig {
  gate: MultiGateType;
  n: number;
  learningRate?: number;
  maxEpochs?: number;
  initialWeights?: number[];
  initialBias?: number;
}

/**
 * Deterministic Perceptron Learning Algorithm (PRD Section 6.E)
 * Update rule:
 * Wi = Wi + η × (target - output) × Xi
 * b = b + η × (target - output)
 */
export function trainPerceptron(config: TrainConfig): TrainingResult {
  const {
    gate,
    n,
    learningRate = 1.0,
    maxEpochs = 100,
    initialWeights,
    initialBias = 0,
  } = config;

  const weights = initialWeights ? [...initialWeights] : Array(n).fill(0);
  let bias = initialBias;

  const dataset = generateAllInputs(n).map((inputs) => ({
    inputs,
    target: evaluateMultiGate(gate, inputs),
    s: sumOfOnes(inputs),
  }));

  const history: EpochLog[] = [];
  let converged = false;
  let convergedEpoch: number | null = null;

  for (let epoch = 1; epoch <= maxEpochs; epoch++) {
    let epochErrors = 0;

    for (const sample of dataset) {
      const { inputs, target } = sample;
      const sumProd = inputs.reduce((acc, x, i) => acc + x * weights[i], 0);
      const z = sumProd + bias;
      const output = stepActivation(z);

      const error = target - output;
      if (error !== 0) {
        epochErrors++;
        // Weight updates
        for (let i = 0; i < n; i++) {
          weights[i] += learningRate * error * inputs[i];
        }
        // Bias update
        bias += learningRate * error;
      }
    }

    const accuracy = ((dataset.length - epochErrors) / dataset.length) * 100;

    history.push({
      epoch,
      errors: epochErrors,
      accuracy,
      weights: [...weights],
      bias,
    });

    if (epochErrors === 0) {
      converged = true;
      convergedEpoch = epoch;
      break;
    }
  }

  const finalLog = history[history.length - 1];
  const finalAccuracy = finalLog ? finalLog.accuracy : 0;

  return {
    gate,
    n,
    learningRate,
    maxEpochs,
    converged,
    convergedEpoch,
    history,
    finalWeights: weights,
    finalBias: bias,
    finalAccuracy,
  };
}

export interface BatchTrainingResult {
  n: number;
  converged: boolean;
  epochs: number;
  accuracy: number;
}

/**
 * Batch run for n = 2 ... 8 (or custom range)
 * Evaluates real training performance across multiple input dimensions
 */
export function runBatchTraining(
  gate: MultiGateType,
  minN: number = 2,
  maxN: number = 8,
  learningRate: number = 1.0,
  maxEpochs: number = 100
): BatchTrainingResult[] {
  const results: BatchTrainingResult[] = [];

  for (let n = minN; n <= maxN; n++) {
    const res = trainPerceptron({
      gate,
      n,
      learningRate,
      maxEpochs,
    });

    results.push({
      n,
      converged: res.converged,
      epochs: res.converged ? (res.convergedEpoch ?? res.maxEpochs) : res.maxEpochs,
      accuracy: res.finalAccuracy,
    });
  }

  return results;
}
