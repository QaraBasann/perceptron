import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { generateFullTruthTable } from '../core';
import { TruthTableView, InputSwitch } from '../components';

export const TruthTablePage: React.FC = () => {
  const { t } = useTranslation();
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);

  const rows = generateFullTruthTable(2);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.truthTablePage.title2}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          2-girişli sistemin bütün məntiq qapıları üçün birləşdirilmiş doğruluq cədvəli
        </p>
      </div>

      {/* Row Selector Switches */}
      <div className="p-4 rounded-2xl bg-lab-card/80 border border-slate-700/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-mono font-bold text-slate-300">
          Cədvəldə sətir seçin (X₁, X₂):
        </span>
        <div className="flex gap-4">
          <InputSwitch index={1} value={x1} onChange={setX1} compact />
          <InputSwitch index={2} value={x2} onChange={setX2} compact />
        </div>
      </div>

      {/* Full Combined Truth Table */}
      <TruthTableView
        rows={rows}
        n={2}
        currentInputs={[x1, x2]}
        showAllGates={true}
      />
    </div>
  );
};
