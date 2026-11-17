import { describe, it, expect } from 'vitest';
import {
  evaluateMultiGate,
  getDefaultParameters,
  testAllCombinations,
  forwardCounterMLP,
  forwardCascadedMLP,
  trainPerceptron,
  generateFullTruthTable,
  generateTruthTableCSV,
  evaluate2InputGate,
  evaluate2InputXorMLP,
} from '../core';

describe('Base 2-Input Logic Gates & Perceptron', () => {
  it('correctly evaluates all 2-input boolean gates', () => {
    expect(evaluate2InputGate('AND', 1, 1)).toBe(1);
    expect(evaluate2InputGate('AND', 1, 0)).toBe(0);
    expect(evaluate2InputGate('OR', 0, 1)).toBe(1);
    expect(evaluate2InputGate('OR', 0, 0)).toBe(0);
    expect(evaluate2InputGate('XOR', 1, 0)).toBe(1);
    expect(evaluate2InputGate('XOR', 1, 1)).toBe(0);
    expect(evaluate2InputGate('XNOR', 1, 1)).toBe(1);
    expect(evaluate2InputGate('XNOR', 1, 0)).toBe(0);
    expect(evaluate2InputGate('NOT', 1, 0)).toBe(0);
    expect(evaluate2InputGate('NOT', 0, 0)).toBe(1);
  });

  it('correctly evaluates classic 2-input XOR MLP (PRD 1 formulas)', () => {
    // h1 = step(X1 - X2 - 0.5), h2 = step(-X1 + X2 - 0.5), Y = step(h1 + h2 - 0.5)
    expect(evaluate2InputXorMLP(0, 0, 'XOR').y).toBe(0);
    expect(evaluate2InputXorMLP(0, 1, 'XOR').y).toBe(1);
    expect(evaluate2InputXorMLP(1, 0, 'XOR').y).toBe(1);
    expect(evaluate2InputXorMLP(1, 1, 'XOR').y).toBe(0);

    // XNOR
    expect(evaluate2InputXorMLP(0, 0, 'XNOR').y).toBe(1);
    expect(evaluate2InputXorMLP(0, 1, 'XNOR').y).toBe(0);
    expect(evaluate2InputXorMLP(1, 0, 'XNOR').y).toBe(0);
    expect(evaluate2InputXorMLP(1, 1, 'XNOR').y).toBe(1);
  });
});

describe('n-Input Single Perceptron Parameters (Section 5.3)', () => {
  const gates = ['AND', 'NAND', 'OR', 'NOR'] as const;

  // Test for every n from 1 to 10
  for (let n = 1; n <= 10; n++) {
    for (const gate of gates) {
      it(`gate ${gate} with n = ${n} has 100% accuracy on all 2^${n} inputs`, () => {
        const params = getDefaultParameters(gate, n);
        const res = testAllCombinations(params.weights, params.bias, gate, n);
        expect(res.accuracy).toBe(100);
        expect(res.wrongRows.length).toBe(0);
        expect(res.correct).toBe(Math.pow(2, n));
      });
    }
  }
});

describe('n-Input Counter MLP (Section 5.4)', () => {
  // Test for every n from 2 to 10
  for (let n = 2; n <= 10; n++) {
    it(`Counter MLP reproduces XOR(n) for n = ${n} on all 2^${n} inputs`, () => {
      const total = Math.pow(2, n);
      for (let i = 0; i < total; i++) {
        const inputs: number[] = [];
        for (let b = n - 1; b >= 0; b--) {
          inputs.push((i >> b) & 1);
        }
        const expected = evaluateMultiGate('XOR', inputs);
        const actual = forwardCounterMLP(inputs, 'XOR').y;
        expect(actual).toBe(expected);
      }
    });

    it(`Counter MLP reproduces XNOR(n) for n = ${n} on all 2^${n} inputs`, () => {
      const total = Math.pow(2, n);
      for (let i = 0; i < total; i++) {
        const inputs: number[] = [];
        for (let b = n - 1; b >= 0; b--) {
          inputs.push((i >> b) & 1);
        }
        const expected = evaluateMultiGate('XNOR', inputs);
        const actual = forwardCounterMLP(inputs, 'XNOR').y;
        expect(actual).toBe(expected);
      }
    });
  }
});

describe('n-Input Cascaded XOR Architecture (Section 5.4)', () => {
  // Test for every n from 2 to 10
  for (let n = 2; n <= 10; n++) {
    it(`Cascaded XOR architecture reproduces XOR(n) for n = ${n}`, () => {
      const total = Math.pow(2, n);
      for (let i = 0; i < total; i++) {
        const inputs: number[] = [];
        for (let b = n - 1; b >= 0; b--) {
          inputs.push((i >> b) & 1);
        }
        const expected = evaluateMultiGate('XOR', inputs);
        const actual = forwardCascadedMLP(inputs, 'XOR').y;
        expect(actual).toBe(expected);
      }
    });
  }
});

describe('Perceptron Learning Convergence (Section 6.E & Section 10)', () => {
  it('converges for linearly separable gates AND and OR (n = 2, 3, 4)', () => {
    for (const n of [2, 3, 4]) {
      const andRes = trainPerceptron({ gate: 'AND', n, learningRate: 1, maxEpochs: 100 });
      expect(andRes.converged).toBe(true);
      expect(andRes.finalAccuracy).toBe(100);

      const orRes = trainPerceptron({ gate: 'OR', n, learningRate: 1, maxEpochs: 100 });
      expect(orRes.converged).toBe(true);
      expect(orRes.finalAccuracy).toBe(100);

      const nandRes = trainPerceptron({ gate: 'NAND', n, learningRate: 1, maxEpochs: 100 });
      expect(nandRes.converged).toBe(true);
      expect(nandRes.finalAccuracy).toBe(100);

      const norRes = trainPerceptron({ gate: 'NOR', n, learningRate: 1, maxEpochs: 100 });
      expect(norRes.converged).toBe(true);
      expect(norRes.finalAccuracy).toBe(100);
    }
  });

  it('fails to converge for XOR for n = 2 and n = 3', () => {
    const xorRes2 = trainPerceptron({ gate: 'XOR', n: 2, learningRate: 1, maxEpochs: 50 });
    expect(xorRes2.converged).toBe(false);
    expect(xorRes2.finalAccuracy).toBeLessThan(100);

    const xorRes3 = trainPerceptron({ gate: 'XOR', n: 3, learningRate: 1, maxEpochs: 50 });
    expect(xorRes3.converged).toBe(false);
    expect(xorRes3.finalAccuracy).toBeLessThan(100);
  });
});

describe('CSV Export Verification (Section 10)', () => {
  it('generates correct CSV with 2^n rows plus header for n = 3', () => {
    const rows = generateFullTruthTable(3);
    const csv = generateTruthTableCSV(rows, 3);
    const lines = csv.trim().split('\n');
    expect(lines.length).toBe(Math.pow(2, 3) + 1); // 8 rows + 1 header = 9
    expect(lines[0]).toBe('X1,X2,X3,s,AND,NAND,OR,NOR,XOR,XNOR');
  });

  it('generates correct CSV with 2^n rows plus header for n = 5', () => {
    const rows = generateFullTruthTable(5);
    const csv = generateTruthTableCSV(rows, 5);
    const lines = csv.trim().split('\n');
    expect(lines.length).toBe(Math.pow(2, 5) + 1); // 32 rows + 1 header = 33
    expect(lines[0]).toBe('X1,X2,X3,X4,X5,s,AND,NAND,OR,NOR,XOR,XNOR');
  });
});
