export type GateType2Input = 'AND' | 'NAND' | 'OR' | 'NOR' | 'XOR' | 'XNOR' | 'NOT';

export type MultiGateType = 'AND' | 'NAND' | 'OR' | 'NOR' | 'XOR' | 'XNOR';

export type GeneralizedGateType = MultiGateType | 'AT_LEAST_K' | 'MAJORITY';

export type ArchitectureType = 'counter' | 'cascaded';

export interface PerceptronParams {
  weights: number[];
  bias: number;
}

export interface CalculationTerm {
  index: number;
  x: number;
  w: number;
  product: number;
}

export interface PerceptronEvaluation {
  z: number;
  y: number;
  expected: number;
  isCorrect: boolean;
  terms: CalculationTerm[];
  bias: number;
  s: number;
}

export interface CounterMLPEvaluation {
  s: number;
  hiddenActivations: number[]; // h_1 ... h_n
  hiddenThresholds: number[];  // k - 0.5
  outputWeights: number[];     // +1, -1, +1, ...
  outputBias: number;          // -0.5 (XOR) or +0.5 (XNOR)
  alternatingSum: number;
  outputZ: number;
  y: number;
  expected: number;
  isCorrect: boolean;
  type: 'XOR' | 'XNOR';
}

export interface CascadedStage {
  stageIndex: number;
  inputA: number;
  inputB: number;
  h1: number; // step(a - b - 0.5)
  h2: number; // step(-a + b - 0.5)
  stageOutput: number; // step(h1 + h2 - 0.5)
}

export interface CascadedMLPEvaluation {
  stages: CascadedStage[];
  y: number;
  expected: number;
  isCorrect: boolean;
  type: 'XOR' | 'XNOR';
}

export interface TruthTableRow {
  index: number;
  inputs: number[];
  s: number;
  outputs: Record<string, number>;
}

export interface BiasInterval {
  min: number; // open or closed interval representation
  max: number;
  minInclusive: boolean;
  maxInclusive: boolean;
  explanation: string;
}

export interface TestAllResults {
  total: number;
  correct: number;
  accuracy: number; // 0 - 100
  wrongRows: {
    inputs: number[];
    s: number;
    expected: number;
    actual: number;
    z: number;
  }[];
}

export interface EpochLog {
  epoch: number;
  errors: number;
  accuracy: number;
  weights: number[];
  bias: number;
}

export interface TrainingResult {
  gate: MultiGateType;
  n: number;
  learningRate: number;
  maxEpochs: number;
  converged: boolean;
  convergedEpoch: number | null;
  history: EpochLog[];
  finalWeights: number[];
  finalBias: number;
  finalAccuracy: number;
}

export interface LinearlySeparableRef {
  n: number;
  totalFunctions: string;
  separableFunctions: string;
  percentage: string;
}
