import { TruthTableRow, MultiGateType } from './types';
import { generateAllInputs } from './perceptron';
import { sumOfOnes, evaluateMultiGate } from './gates';

export interface TruthTableFilter {
  selectedGate?: MultiGateType | 'ALL';
  outputFilter?: 'ALL' | 'ONLY_1' | 'ONLY_0';
  searchPattern?: string;
  sortBy?: 'index' | 's';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Generate full truth table for n inputs (all 6 gates + s)
 */
export function generateFullTruthTable(n: number): TruthTableRow[] {
  const allVectors = generateAllInputs(n);
  const gates: MultiGateType[] = ['AND', 'NAND', 'OR', 'NOR', 'XOR', 'XNOR'];

  return allVectors.map((inputs, idx) => {
    const s = sumOfOnes(inputs);
    const outputs: Record<string, number> = {};

    for (const g of gates) {
      outputs[g] = evaluateMultiGate(g, inputs);
    }

    return {
      index: idx,
      inputs,
      s,
      outputs,
    };
  });
}

/**
 * Filter and sort truth table
 */
export function filterAndSortTruthTable(
  rows: TruthTableRow[],
  filters: TruthTableFilter
): TruthTableRow[] {
  let result = [...rows];

  // Search by input pattern
  if (filters.searchPattern && filters.searchPattern.trim() !== '') {
    const pattern = filters.searchPattern.trim().replace(/\s+/g, '');
    result = result.filter((row) => {
      const inputStr = row.inputs.join('');
      return inputStr.includes(pattern);
    });
  }

  // Filter by output value
  if (filters.outputFilter && filters.outputFilter !== 'ALL' && filters.selectedGate && filters.selectedGate !== 'ALL') {
    const targetVal = filters.outputFilter === 'ONLY_1' ? 1 : 0;
    const gateKey = filters.selectedGate;
    result = result.filter((row) => row.outputs[gateKey] === targetVal);
  }

  // Sorting
  const sortBy = filters.sortBy || 'index';
  const sortOrder = filters.sortOrder || 'asc';

  result.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 's') {
      comparison = a.s - b.s;
    } else {
      comparison = a.index - b.index;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
}
