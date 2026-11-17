import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { generateFullTruthTable, MultiGateType } from '../core';
import { TruthTableView, NSelector } from '../components';

export const MultiInputTruthTablePage: React.FC = () => {
  const { t } = useTranslation();

  const [n, setN] = useState(3);
  const [selectedGate, setSelectedGate] = useState<MultiGateType | 'ALL'>('ALL');

  const rows = useMemo(() => generateFullTruthTable(n), [n]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.truthTablePage.titleN}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          n = 2-dən 10-a qədər (1024 sətir) bütün 6 qapının çıxışları, 1-lərin sayı və CSV ixracı
        </p>
      </div>

      {/* N Selector */}
      <NSelector n={n} onChange={setN} min={2} max={10} />

      {/* Table view */}
      <TruthTableView
        rows={rows}
        n={n}
        gate={selectedGate}
        showAllGates={true}
      />
    </div>
  );
};
