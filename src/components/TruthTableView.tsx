import React, { useState, useMemo } from 'react';
import { TruthTableRow, MultiGateType, generateTruthTableCSV, downloadCSV } from '../core';
import { useTranslation } from '../i18n';
import { Download, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TruthTableViewProps {
  rows: TruthTableRow[];
  n: number;
  currentInputs?: number[];
  gate?: MultiGateType | 'ALL';
  showAllGates?: boolean;
}

export const TruthTableView: React.FC<TruthTableViewProps> = ({
  rows,
  n,
  currentInputs,
  gate = 'ALL',
  showAllGates = false,
}) => {
  const { t } = useTranslation();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [outputFilter, setOutputFilter] = useState<'ALL' | 'ONLY_1' | 'ONLY_0'>('ALL');
  const [sortBy, setSortBy] = useState<'index' | 's'>('index');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 32; // Page size for fast rendering

  // Filter and sort memoized
  const filteredRows = useMemo(() => {
    let result = [...rows];

    // Search by pattern
    if (searchTerm.trim() !== '') {
      const term = searchTerm.trim();
      result = result.filter((r) => r.inputs.join('').includes(term));
    }

    // Output filter
    if (outputFilter !== 'ALL' && gate !== 'ALL') {
      const target = outputFilter === 'ONLY_1' ? 1 : 0;
      result = result.filter((r) => r.outputs[gate] === target);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 's') {
        cmp = a.s - b.s;
      } else {
        cmp = a.index - b.index;
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [rows, searchTerm, outputFilter, sortBy, sortAsc, gate]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Y=1 count for active gate
  const onesCount = useMemo(() => {
    if (gate === 'ALL') return 0;
    return rows.filter((r) => r.outputs[gate] === 1).length;
  }, [rows, gate]);

  const ratioPercent = rows.length > 0 ? (onesCount / rows.length) * 100 : 0;

  // CSV Export handler
  const handleExportCSV = () => {
    const csv = generateTruthTableCSV(filteredRows, n);
    const filename = `truth_table_n${n}_${gate}_${Date.now()}.csv`;
    downloadCSV(csv, filename);
  };

  return (
    <div className="bg-lab-card/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.common.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lab-accentBlue"
          />
        </div>

        {/* Filter & Sort & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {gate !== 'ALL' && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
              <Filter size={14} className="text-slate-400 ml-1.5" />
              <button
                type="button"
                onClick={() => {
                  setOutputFilter('ALL');
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-lg ${
                  outputFilter === 'ALL' ? 'bg-lab-accentBlue text-white font-bold' : 'text-slate-400'
                }`}
              >
                {t.common.all}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOutputFilter('ONLY_1');
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-lg ${
                  outputFilter === 'ONLY_1' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                {t.common.only1}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOutputFilter('ONLY_0');
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-lg ${
                  outputFilter === 'ONLY_0' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                {t.common.only0}
              </button>
            </div>
          )}

          {/* Sort button */}
          <button
            type="button"
            onClick={() => {
              if (sortBy === 'index') {
                setSortBy('s');
              } else {
                setSortBy('index');
                setSortAsc(!sortAsc);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl text-xs text-slate-300 font-mono transition-all"
          >
            <ArrowUpDown size={13} />
            <span>{sortBy === 's' ? 's-ə görə' : 'İndeks'}</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-lab-accentBlue/20 border border-lab-accentBlue hover:bg-lab-accentBlue text-white rounded-xl text-xs font-semibold transition-all shadow-glow-blue/20"
          >
            <Download size={13} />
            <span>{t.common.exportCSV}</span>
          </button>
        </div>
      </div>

      {/* Y=1 Ratio Bar */}
      {gate !== 'ALL' && (
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-1.5">
            <span>
              {gate} çıxış nisbəti: <strong className="text-white">{onesCount} / {rows.length}</strong> ({ratioPercent.toFixed(1)}%)
            </span>
            <span className="text-slate-400">{t.common.rowsCount}: {filteredRows.length}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${ratioPercent}%` }}
            />
            <div
              className="bg-rose-500/80 transition-all duration-500"
              style={{ width: `${100 - ratioPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[460px]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead className="bg-slate-900 sticky top-0 z-10 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 text-center">#</th>
              {Array.from({ length: n }, (_, i) => (
                <th key={i} className="py-2.5 px-3 text-center">
                  X{i + 1}
                </th>
              ))}
              <th className="py-2.5 px-3 text-center text-slate-300">s</th>
              {showAllGates ? (
                <>
                  <th className="py-2.5 px-3 text-center text-blue-400">AND</th>
                  <th className="py-2.5 px-3 text-center text-purple-400">NAND</th>
                  <th className="py-2.5 px-3 text-center text-cyan-400">OR</th>
                  <th className="py-2.5 px-3 text-center text-amber-400">NOR</th>
                  <th className="py-2.5 px-3 text-center text-emerald-400">XOR</th>
                  <th className="py-2.5 px-3 text-center text-rose-400">XNOR</th>
                </>
              ) : (
                <th className="py-2.5 px-4 text-center text-lab-accentBlue font-bold">
                  {gate} (Y)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-lab-bg/40">
            {pageRows.map((row) => {
              const isSelected =
                currentInputs &&
                currentInputs.every((v, i) => v === row.inputs[i]);

              return (
                <tr
                  key={row.index}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-lab-accentBlue/20 font-bold border-l-4 border-lab-accentBlue text-white'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 text-center text-slate-500">{row.index}</td>
                  {row.inputs.map((val, i) => (
                    <td key={i} className="py-2 px-3 text-center">
                      <span
                        className={`inline-block w-5 h-5 rounded leading-5 text-center font-bold ${
                          val === 1
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {val}
                      </span>
                    </td>
                  ))}
                  <td className="py-2 px-3 text-center font-bold text-slate-200">
                    {row.s}
                  </td>
                  {showAllGates ? (
                    <>
                      <td className="py-2 px-3 text-center">{renderCell(row.outputs['AND'])}</td>
                      <td className="py-2 px-3 text-center">{renderCell(row.outputs['NAND'])}</td>
                      <td className="py-2 px-3 text-center">{renderCell(row.outputs['OR'])}</td>
                      <td className="py-2 px-3 text-center">{renderCell(row.outputs['NOR'])}</td>
                      <td className="py-2 px-3 text-center">{renderCell(row.outputs['XOR'])}</td>
                      <td className="py-2 px-3 text-center">{renderCell(row.outputs['XNOR'])}</td>
                    </>
                  ) : (
                    <td className="py-2 px-4 text-center">
                      {renderCell(gate !== 'ALL' ? row.outputs[gate] : 0)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span>
            {t.truthTablePage.page} <strong className="text-white">{currentPage}</strong> {t.truthTablePage.of} {totalPages} ({filteredRows.length} sətir)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function renderCell(val?: number) {
  const isOne = val === 1;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
        isOne
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
      }`}
    >
      {val ?? 0}
    </span>
  );
}
