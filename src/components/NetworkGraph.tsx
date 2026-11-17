import React from 'react';
import { motion } from 'framer-motion';
import { CounterMLPEvaluation, CascadedMLPEvaluation } from '../core';

interface NetworkGraphProps {
  n: number;
  architecture: 'counter' | 'cascaded';
  inputs: number[];
  counterData?: CounterMLPEvaluation;
  cascadedData?: CascadedMLPEvaluation;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  n,
  architecture,
  inputs,
  counterData,
  cascadedData,
}) => {
  if (n > 8) {
    return (
      <div className="p-6 text-center bg-lab-card/60 rounded-2xl border border-slate-800 text-slate-400 font-mono text-sm">
        n = {n} üçün şəbəkə vizualizasiyası yığcam rejimdədir (n ≤ 8 olduqda tam qrafik çəkilir). Bütün hesablamalar dəqiq aparılır.
      </div>
    );
  }

  const width = 640;
  const height = Math.max(340, n * 48);

  const inputX = 80;
  const hiddenX = 320;
  const outputX = 540;
  const outputY = height / 2;

  const inputSpacing = (height - 60) / Math.max(1, n - 1);

  if (architecture === 'counter' && counterData) {
    const hiddenSpacing = (height - 60) / Math.max(1, n - 1);

    return (
      <div className="w-full overflow-x-auto flex justify-center py-2 bg-lab-card/60 rounded-2xl border border-slate-800">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[650px] select-none"
          style={{ minWidth: '420px' }}
        >
          <defs>
            <filter id="mlpGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connections: Input -> Hidden (All weights +1) */}
          {inputs.map((xVal, i) => {
            const iy = n === 1 ? height / 2 : 30 + i * inputSpacing;
            return counterData.hiddenActivations.map((_, k) => {
              const hy = n === 1 ? height / 2 : 30 + k * hiddenSpacing;
              const isActive = xVal === 1;

              return (
                <line
                  key={`in-${i}-hid-${k}`}
                  x1={inputX}
                  y1={iy}
                  x2={hiddenX}
                  y2={hy}
                  stroke="#3B82F6"
                  strokeWidth={isActive ? 2 : 1}
                  strokeOpacity={isActive ? 0.7 : 0.15}
                />
              );
            });
          })}

          {/* Connections: Hidden -> Output (Alternating weights +1, -1...) */}
          {counterData.hiddenActivations.map((hVal, k) => {
            const hy = n === 1 ? height / 2 : 30 + k * hiddenSpacing;
            const wOut = counterData.outputWeights[k] ?? 1;
            const isActive = hVal === 1;
            const strokeColor = wOut > 0 ? '#3B82F6' : '#EF4444';

            return (
              <g key={`hid-${k}-out`}>
                <line
                  x1={hiddenX}
                  y1={hy}
                  x2={outputX}
                  y2={outputY}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 2.5 : 1.2}
                  strokeOpacity={isActive ? 0.85 : 0.25}
                />
                {isActive && (
                  <motion.circle
                    r="3"
                    fill={strokeColor}
                    filter="url(#mlpGlow)"
                    initial={{ cx: hiddenX, cy: hy }}
                    animate={{ cx: outputX, cy: outputY }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: k * 0.1,
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Input Layer Nodes */}
          {inputs.map((val, i) => {
            const iy = n === 1 ? height / 2 : 30 + i * inputSpacing;
            const isOn = val === 1;
            return (
              <g key={`in-node-${i}`}>
                <circle
                  cx={inputX}
                  cy={iy}
                  r={15}
                  fill={isOn ? '#1E293B' : '#0F172A'}
                  stroke={isOn ? '#3B82F6' : '#475569'}
                  strokeWidth={2}
                />
                <text
                  x={inputX}
                  y={iy + 4}
                  textAnchor="middle"
                  fill={isOn ? '#60A5FA' : '#94A3B8'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  X{i + 1}:{val}
                </text>
              </g>
            );
          })}

          {/* Hidden Layer Nodes (Counter Neurons h_k) */}
          {counterData.hiddenActivations.map((hVal, k) => {
            const hy = n === 1 ? height / 2 : 30 + k * hiddenSpacing;
            const isOn = hVal === 1;
            const thresh = counterData.hiddenThresholds[k] ?? k + 0.5;
            const wOut = counterData.outputWeights[k] ?? 1;

            return (
              <g key={`hid-node-${k}`}>
                <circle
                  cx={hiddenX}
                  cy={hy}
                  r={20}
                  fill={isOn ? '#2E1065' : '#0F172A'}
                  stroke={isOn ? '#A855F7' : '#475569'}
                  strokeWidth={2}
                  filter={isOn ? 'url(#mlpGlow)' : undefined}
                />
                <text
                  x={hiddenX}
                  y={hy - 4}
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  h{k + 1}:{hVal}
                </text>
                <text
                  x={hiddenX}
                  y={hy + 9}
                  textAnchor="middle"
                  fill="#C084FC"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  s≥{k + 1} ({thresh})
                </text>
                <text
                  x={hiddenX + 32}
                  y={hy + 3}
                  fill={wOut > 0 ? '#60A5FA' : '#F87171'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  w={wOut > 0 ? `+${wOut}` : wOut}
                </text>
              </g>
            );
          })}

          {/* Output Node */}
          <g>
            <circle
              cx={outputX}
              cy={outputY}
              r={25}
              fill="#0F172A"
              stroke={counterData.y === 1 ? '#10B981' : '#64748B'}
              strokeWidth={3}
              filter={counterData.y === 1 ? 'url(#mlpGlow)' : undefined}
            />
            <text
              x={outputX}
              y={outputY - 3}
              textAnchor="middle"
              fill={counterData.y === 1 ? '#34D399' : '#94A3B8'}
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {counterData.type}
            </text>
            <text
              x={outputX}
              y={outputY + 12}
              textAnchor="middle"
              fill={counterData.y === 1 ? '#34D399' : '#94A3B8'}
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Y = {counterData.y}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Cascaded XOR visualization
  return (
    <div className="w-full p-4 bg-lab-card/60 rounded-2xl border border-slate-800">
      <div className="text-xs font-mono text-slate-300 mb-3 text-center">
        Zəncirvari XOR Sxemi: {n - 1} sayda 2-girişli XOR bloku (Cəmi {2 * (n - 1)} gizli neyron)
      </div>
      <div className="flex flex-col gap-2.5 max-w-lg mx-auto">
        {cascadedData?.stages.map((st) => (
          <div
            key={st.stageIndex}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-lab-accentBlue font-bold">Blok {st.stageIndex}:</span>
              <span className="text-slate-300">
                XOR({st.inputA}, {st.inputB})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                [h₁:{st.h1}, h₂:{st.h2}] →
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  st.stageOutput === 1
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {st.stageOutput}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
