import { GateType2Input, MultiGateType } from './types';

/**
 * Calculates sum of ones in inputs (s = X1 + X2 + ... + Xn)
 */
export function sumOfOnes(inputs: number[]): number {
  return inputs.reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
}

/**
 * Evaluate 2-input boolean gate
 */
export function evaluate2InputGate(gate: GateType2Input, x1: number, x2: number): number {
  const b1 = x1 === 1;
  const b2 = x2 === 1;
  switch (gate) {
    case 'AND':
      return b1 && b2 ? 1 : 0;
    case 'NAND':
      return !(b1 && b2) ? 1 : 0;
    case 'OR':
      return b1 || b2 ? 1 : 0;
    case 'NOR':
      return !(b1 || b2) ? 1 : 0;
    case 'XOR':
      return b1 !== b2 ? 1 : 0;
    case 'XNOR':
      return b1 === b2 ? 1 : 0;
    case 'NOT':
      return b1 ? 0 : 1;
    default:
      return 0;
  }
}

/**
 * Evaluate n-input boolean gate based on exact Boolean definitions (Section 5.2):
 * - AND(n): Y = 1 only if s = n
 * - NAND(n): NOT AND(n)
 * - OR(n): Y = 1 if s >= 1
 * - NOR(n): NOT OR(n) (s = 0)
 * - XOR(n): Y = 1 if s mod 2 = 1 (odd parity)
 * - XNOR(n): Y = 1 if s mod 2 = 0 (even parity)
 */
export function evaluateMultiGate(gate: MultiGateType, inputs: number[]): number {
  const n = inputs.length;
  const s = sumOfOnes(inputs);

  switch (gate) {
    case 'AND':
      return s === n ? 1 : 0;
    case 'NAND':
      return s < n ? 1 : 0;
    case 'OR':
      return s >= 1 ? 1 : 0;
    case 'NOR':
      return s === 0 ? 1 : 0;
    case 'XOR':
      return s % 2 === 1 ? 1 : 0;
    case 'XNOR':
      return s % 2 === 0 ? 1 : 0;
    default:
      return 0;
  }
}

/**
 * Generalized At-Least-k gate
 */
export function evaluateAtLeastK(inputs: number[], k: number): number {
  const s = sumOfOnes(inputs);
  return s >= k ? 1 : 0;
}

/**
 * Generalized Majority gate
 */
export function evaluateMajority(inputs: number[]): number {
  const n = inputs.length;
  const k = Math.floor(n / 2) + 1;
  return evaluateAtLeastK(inputs, k);
}

/**
 * Explains the gate evaluation result in Azerbaijani or English
 */
export function getGateExplanation(
  gate: MultiGateType,
  inputs: number[],
  lang: 'az' | 'en'
): string {
  const n = inputs.length;
  const s = sumOfOnes(inputs);
  const out = evaluateMultiGate(gate, inputs);

  if (lang === 'az') {
    switch (gate) {
      case 'AND':
        return s === n
          ? `AND(${n}): Bütün ${n} giriş 1-dir (s = ${s}), ona görə çıxış Y = 1.`
          : `AND(${n}): Yalnız ${s} giriş 1-dir (bütün ${n} giriş 1 olmalıdır), ona görə çıxış Y = 0.`;
      case 'NAND':
        return s < n
          ? `NAND(${n}): Girişlərin hamısı 1 deyil (s = ${s} < ${n}), ona görə çıxış Y = 1.`
          : `NAND(${n}): Bütün ${n} giriş 1-dir (s = ${s}), AND 1 olduğuna görə tərsi NAND Y = 0.`;
      case 'OR':
        return s >= 1
          ? `OR(${n}): Ən azı bir giriş 1-dir (s = ${s} ≥ 1), ona görə çıxış Y = 1.`
          : `OR(${n}): Heç bir giriş 1 deyil (s = 0), ona görə çıxış Y = 0.`;
      case 'NOR':
        return s === 0
          ? `NOR(${n}): Bütün girişlər 0-dır (s = 0), ona görə çıxış Y = 1.`
          : `NOR(${n}): Ən azı bir giriş 1-dir (s = ${s} ≥ 1), OR 1 olduğu üçün tərsi NOR Y = 0.`;
      case 'XOR':
        return s % 2 === 1
          ? `XOR(${n}) [Paritet]: 1-lərin sayı TƏK-dir (s = ${s}), ona görə çıxış Y = 1.`
          : `XOR(${n}) [Paritet]: 1-lərin sayı CÜT-dür (s = ${s}), ona görə çıxış Y = 0.`;
      case 'XNOR':
        return s % 2 === 0
          ? `XNOR(${n}) [Tərs Paritet]: 1-lərin sayı CÜT-dür (s = ${s}), ona görə çıxış Y = 1.`
          : `XNOR(${n}) [Tərs Paritet]: 1-lərin sayı TƏK-dir (s = ${s}), ona görə çıxış Y = 0.`;
    }
  } else {
    switch (gate) {
      case 'AND':
        return s === n
          ? `AND(${n}): All ${n} inputs are 1 (s = ${s}), therefore output Y = 1.`
          : `AND(${n}): Only ${s} of ${n} inputs are 1 (requires all ${n}), therefore output Y = 0.`;
      case 'NAND':
        return s < n
          ? `NAND(${n}): Not all inputs are 1 (s = ${s} < ${n}), therefore output Y = 1.`
          : `NAND(${n}): All ${n} inputs are 1 (s = ${s}), so inverted NAND output Y = 0.`;
      case 'OR':
        return s >= 1
          ? `OR(${n}): At least one input is 1 (s = ${s} ≥ 1), therefore output Y = 1.`
          : `OR(${n}): No inputs are 1 (s = 0), therefore output Y = 0.`;
      case 'NOR':
        return s === 0
          ? `NOR(${n}): All inputs are 0 (s = 0), therefore output Y = 1.`
          : `NOR(${n}): At least one input is 1 (s = ${s} ≥ 1), so inverted NOR output Y = 0.`;
      case 'XOR':
        return s % 2 === 1
          ? `XOR(${n}) [Parity]: Number of ones is ODD (s = ${s}), therefore output Y = 1.`
          : `XOR(${n}) [Parity]: Number of ones is EVEN (s = ${s}), therefore output Y = 0.`;
      case 'XNOR':
        return s % 2 === 0
          ? `XNOR(${n}) [Even Parity]: Number of ones is EVEN (s = ${s}), therefore output Y = 1.`
          : `XNOR(${n}) [Even Parity]: Number of ones is ODD (s = ${s}), therefore output Y = 0.`;
    }
  }
}
