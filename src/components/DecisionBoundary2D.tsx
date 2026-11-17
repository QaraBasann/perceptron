import React from 'react';

interface DecisionBoundary2DProps {
  x1: number;
  x2: number;
  w1: number;
  w2: number;
  bias: number;
  activeGate?: string;
}

export const DecisionBoundary2D: React.FC<DecisionBoundary2DProps> = ({
  x1,
  x2,
  w1,
  w2,
  bias,
  activeGate,
}) => {
  const size = 300;
  const padding = 45;
  const plotWidth = size - 2 * padding;

  // Map [0, 1] to SVG coordinates
  const toSvgX = (val: number) => padding + val * plotWidth;
  const toSvgY = (val: number) => size - padding - val * plotWidth;

  // Line equation: w1*x1 + w2*x2 + b = 0  =>  x2 = (-w1*x1 - b) / w2
  // Or if w2 == 0: x1 = -b / w1
  let linePoints: { x1: number; y1: number; x2: number; y2: number } | null = null;

  if (Math.abs(w2) > 0.0001) {
    // Check at x = -0.2 and x = 1.2
    const calcY = (x: number) => (-w1 * x - bias) / w2;
    const yAtMin = calcY(-0.2);
    const yAtMax = calcY(1.2);
    linePoints = {
      x1: toSvgX(-0.2),
      y1: toSvgY(yAtMin),
      x2: toSvgX(1.2),
      y2: toSvgY(yAtMax),
    };
  } else if (Math.abs(w1) > 0.0001) {
    const xVertical = -bias / w1;
    linePoints = {
      x1: toSvgX(xVertical),
      y1: toSvgY(-0.2),
      x2: toSvgX(xVertical),
      y2: toSvgY(1.2),
    };
  }

  // 4 corners of 2-input logic gate
  const corners = [
    { p: [0, 0], label: '(0,0)' },
    { p: [1, 0], label: '(1,0)' },
    { p: [0, 1], label: '(0,1)' },
    { p: [1, 1], label: '(1,1)' },
  ];

  return (
    <div className="flex flex-col items-center bg-lab-card/60 p-3 rounded-2xl border border-slate-800">
      <div className="text-xs font-mono text-slate-300 mb-2">
        2D Qərar Xətti: {w1.toFixed(1)}·X₁ + {w2.toFixed(1)}·X₂ + ({bias.toFixed(1)}) = 0
      </div>

      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Grid and Axes */}
        <line
          x1={padding}
          y1={size - padding}
          x2={size - padding + 20}
          y2={size - padding}
          stroke="#475569"
          strokeWidth={1.5}
        />
        <line
          x1={padding}
          y1={size - padding}
          x2={padding}
          y2={padding - 20}
          stroke="#475569"
          strokeWidth={1.5}
        />

        {/* Axis Labels */}
        <text
          x={size - padding + 15}
          y={size - padding + 15}
          fill="#94A3B8"
          fontSize="11"
          fontFamily="monospace"
        >
          X₁
        </text>
        <text
          x={padding - 15}
          y={padding - 10}
          fill="#94A3B8"
          fontSize="11"
          fontFamily="monospace"
        >
          X₂
        </text>

        {/* Decision Line */}
        {linePoints && (
          <line
            x1={linePoints.x1}
            y1={linePoints.y1}
            x2={linePoints.x2}
            y2={linePoints.y2}
            stroke="#3B82F6"
            strokeWidth={2.5}
            strokeDasharray="4 2"
          />
        )}

        {/* Four Points */}
        {corners.map((c) => {
          const px = c.p[0];
          const py = c.p[1];
          const zVal = w1 * px + w2 * py + bias;
          const isClass1 = zVal >= 0;
          const isSelected = px === x1 && py === x2;

          return (
            <g key={c.label}>
              <circle
                cx={toSvgX(px)}
                cy={toSvgY(py)}
                r={isSelected ? 10 : 7}
                fill={isClass1 ? '#10B981' : '#EF4444'}
                stroke={isSelected ? '#FFFFFF' : '#0F172A'}
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text
                x={toSvgX(px)}
                y={toSvgY(py) + (py === 1 ? -14 : 20)}
                textAnchor="middle"
                fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                fontSize="10"
                fontFamily="monospace"
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {c.label} → {isClass1 ? '1' : '0'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
