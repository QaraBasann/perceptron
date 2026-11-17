import { TruthTableRow } from './types';

/**
 * Generate CSV string from TruthTable rows
 */
export function generateTruthTableCSV(rows: TruthTableRow[], n: number): string {
  if (rows.length === 0) return '';

  const inputHeaders = Array.from({ length: n }, (_, i) => `X${i + 1}`);
  const headers = [...inputHeaders, 's', 'AND', 'NAND', 'OR', 'NOR', 'XOR', 'XNOR'];

  const lines: string[] = [headers.join(',')];

  for (const row of rows) {
    const values = [
      ...row.inputs,
      row.s,
      row.outputs['AND'] ?? 0,
      row.outputs['NAND'] ?? 0,
      row.outputs['OR'] ?? 0,
      row.outputs['NOR'] ?? 0,
      row.outputs['XOR'] ?? 0,
      row.outputs['XNOR'] ?? 0,
    ];
    lines.push(values.join(','));
  }

  return lines.join('\n');
}

/**
 * Trigger CSV file download in browser
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
