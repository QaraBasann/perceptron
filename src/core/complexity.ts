import { LinearlySeparableRef } from './types';

/**
 * Reference data for Linearly Separable Functions vs Total Boolean Functions (PRD Section 5.5)
 */
export const LINEARLY_SEPARABLE_DATA: LinearlySeparableRef[] = [
  { n: 1, totalFunctions: '4', separableFunctions: '4', percentage: '100%' },
  { n: 2, totalFunctions: '16', separableFunctions: '14', percentage: '87.5%' },
  { n: 3, totalFunctions: '256', separableFunctions: '104', percentage: '40.62%' },
  { n: 4, totalFunctions: '65,536', separableFunctions: '1,882', percentage: '2.87%' },
  { n: 5, totalFunctions: '4,294,967,296', separableFunctions: '94,572', percentage: '0.0022%' },
];

/**
 * Number of input combinations: 2^n
 */
export function getCombinationsCount(n: number): number {
  return Math.pow(2, n);
}

/**
 * Single Perceptron parameters: n weights + 1 bias = n + 1
 */
export function getPerceptronParamCount(n: number): number {
  return n + 1;
}

/**
 * Counter MLP parameters: (n + 1)^2
 * Hidden layer: n inputs * n neurons = n^2 weights + n biases
 * Output layer: n hidden * 1 neuron = n weights + 1 bias
 * Total = n^2 + 2n + 1 = (n + 1)^2
 */
export function getCounterMLPParamCount(n: number): number {
  return Math.pow(n + 1, 2);
}

/**
 * Cascaded XOR MLP parameters: (n - 1) blocks * 9 params = 9(n - 1)
 */
export function getCascadedMLPParamCount(n: number): number {
  return 9 * (n - 1);
}

/**
 * Hidden neurons count
 */
export function getHiddenNeuronsCount(n: number, architecture: 'counter' | 'cascaded'): number {
  if (architecture === 'counter') {
    return n;
  }
  return 2 * (n - 1);
}

/**
 * Network depth (number of layers with weights)
 */
export function getNetworkDepth(n: number, architecture: 'counter' | 'cascaded'): number {
  if (architecture === 'counter') {
    return 2; // Input -> Hidden -> Output (2 weight layers)
  }
  return n; // Cascaded chain of n-1 stages
}

/**
 * Number of rows where Y = 1 for each gate
 */
export function getY1RowCount(gate: string, n: number): number {
  const total = Math.pow(2, n);
  switch (gate) {
    case 'AND':
      return 1;
    case 'NAND':
      return total - 1;
    case 'OR':
      return total - 1;
    case 'NOR':
      return 1;
    case 'XOR':
      return Math.pow(2, n - 1);
    case 'XNOR':
      return Math.pow(2, n - 1);
    default:
      return 0;
  }
}

/**
 * Total Boolean functions of n inputs: 2^(2^n) as formatted string
 */
export function getTotalBooleanFunctionsString(n: number): string {
  if (n === 1) return '4';
  if (n === 2) return '16';
  if (n === 3) return '256';
  if (n === 4) return '65,536';
  if (n === 5) return '4,294,967,296';
  if (n === 6) return '1.84 × 10¹⁹';
  return `2^(2^${n})`;
}
