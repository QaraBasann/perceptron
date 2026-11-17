import React from 'react';

interface ScatterPlot3DProps {
  currentInputs: number[];
  weights: number[];
  bias: number;
}

export const ScatterPlot3D: React.FC<ScatterPlot3DProps> = ({
  currentInputs,
  weights,
  bias,
}) => {
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2 + 10;

  // 3D Isometric projection angles
  const project = (x: number, y: number, z: number) => {
    // x: right-up, y: left-up, z: straight down (inverted for SVG)
    const scale = 75;
    const px = centerX + (x - y) * Math.cos(Math.PI / 6) * scale;
    const py = centerY + (x + y) * Math.sin(Math.PI / 6) * scale - z * scale;
    return { x: px, y: py };
  };

  const vertices = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1],
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // bottom
    [4, 5], [5, 6], [6, 7], [7, 4], // top
    [0, 4], [1, 5], [2, 6], [3, 7], // pillars
  ];

  return (
    <div className="flex flex-col items-center bg-lab-card/60 p-3 rounded-2xl border border-slate-800">
      <div className="text-xs font-mono text-slate-300 mb-2">
        3D Vahid Kub Proyeksiyası (n = 3, 8 nöqtə)
      </div>

      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Wireframe edges */}
        {edges.map(([i, j], idx) => {
          const p1 = project(vertices[i][0], vertices[i][1], vertices[i][2]);
          const p2 = project(vertices[j][0], vertices[j][1], vertices[j][2]);
          return (
            <line
              key={idx}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#334155"
              strokeWidth={1.5}
            />
          );
        })}

        {/* 8 Vertices */}
        {vertices.map((v, idx) => {
          const pt = project(v[0], v[1], v[2]);
          const zVal =
            v[0] * (weights[0] ?? 1) +
            v[1] * (weights[1] ?? 1) +
            v[2] * (weights[2] ?? 1) +
            bias;
          const isClass1 = zVal >= 0;
          const isSelected =
            currentInputs[0] === v[0] &&
            currentInputs[1] === v[1] &&
            currentInputs[2] === v[2];

          return (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 9 : 6}
                fill={isClass1 ? '#10B981' : '#EF4444'}
                stroke={isSelected ? '#FFFFFF' : '#0F172A'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                ({v[0]},{v[1]},{v[2]})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
