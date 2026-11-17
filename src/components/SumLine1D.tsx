import React from 'react';

interface SumLine1DProps {
  n: number;
  currentS: number;
  bias: number;
  gate: string;
}

export const SumLine1D: React.FC<SumLine1DProps> = ({
  n,
  currentS,
  bias,
  gate,
}) => {
  // Line covers s from 0 to n
  const width = 500;
  const padding = 40;
  const trackWidth = width - 2 * padding;

  const getX = (s: number) => padding + (s / n) * trackWidth;

  // Decision threshold: for W = +1, z = s + b = 0 => s_thresh = -b
  // For W = -1 (NAND, NOR), z = -s + b = 0 => s_thresh = b
  let thresholdS = -bias;
  if (gate === 'NAND' || gate === 'NOR') {
    thresholdS = bias;
  }

  const clampedThresh = Math.max(-0.5, Math.min(n + 0.5, thresholdS));
  const threshX = getX(clampedThresh);

  return (
    <div className="flex flex-col items-center bg-lab-card/60 p-4 rounded-2xl border border-slate-800 w-full overflow-x-auto">
      <div className="flex items-center justify-between w-full max-w-[500px] text-xs font-mono text-slate-300 mb-3">
        <span>1D Qərar Xətti (1-lərin cəmi s = 0 ... {n})</span>
        <span className="text-lab-accentBlue font-bold">Hədd: s = {thresholdS.toFixed(1)}</span>
      </div>

      <svg viewBox={`0 0 ${width} 90`} className="w-full max-w-[500px] select-none">
        {/* Track Line */}
        <line
          x1={padding}
          y1={45}
          x2={width - padding}
          y2={45}
          stroke="#334155"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Threshold divider */}
        <line
          x1={threshX}
          y1={15}
          x2={threshX}
          y2={75}
          stroke="#F59E0B"
          strokeWidth={2.5}
          strokeDasharray="4 2"
        />
        <text
          x={threshX}
          y={12}
          textAnchor="middle"
          fill="#F59E0B"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Hədd ({thresholdS.toFixed(1)})
        </text>

        {/* Integer ticks for each s from 0 to n */}
        {Array.from({ length: n + 1 }, (_, s) => {
          const sx = getX(s);
          const isCurrent = s === currentS;
          return (
            <g key={s}>
              <line
                x1={sx}
                y1={38}
                x2={sx}
                y2={52}
                stroke={isCurrent ? '#3B82F6' : '#64748B'}
                strokeWidth={isCurrent ? 3 : 1.5}
              />
              <text
                x={sx}
                y={68}
                textAnchor="middle"
                fill={isCurrent ? '#60A5FA' : '#94A3B8'}
                fontSize={isCurrent ? '12' : '10'}
                fontFamily="monospace"
                fontWeight={isCurrent ? 'bold' : 'normal'}
              >
                {s}
              </text>
            </g>
          );
        })}

        {/* Current s indicator ball */}
        <circle
          cx={getX(currentS)}
          cy={45}
          r={9}
          fill="#3B82F6"
          stroke="#FFFFFF"
          strokeWidth={2.5}
        />
        <text
          x={getX(currentS)}
          y={49}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
        >
          s
        </text>
      </svg>
    </div>
  );
};
