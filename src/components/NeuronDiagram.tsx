import React from 'react';
import { motion } from 'framer-motion';

interface NeuronDiagramProps {
  inputs: number[];
  weights: number[];
  bias: number;
  z: number;
  y: number;
}

export const NeuronDiagram: React.FC<NeuronDiagramProps> = ({
  inputs,
  weights,
  bias,
  z,
  y,
}) => {
  const n = inputs.length;
  const isCompact = n > 6;

  // SVG dimensions
  const width = 600;
  const height = Math.max(340, n * (isCompact ? 36 : 48));

  // Coordinates
  const inputX = 60;
  const sumNodeX = 320;
  const sumNodeY = height / 2;
  const outputNodeX = 520;
  const outputNodeY = height / 2;

  // Calculate Y for each input node
  const spacing = (height - 60) / Math.max(1, n - 1);

  return (
    <div className="w-full overflow-x-auto flex justify-center py-2 bg-lab-card/60 rounded-2xl border border-slate-800">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[620px] select-none"
        style={{ minWidth: '400px' }}
      >
        <defs>
          <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections from Inputs to Summing Node */}
        {inputs.map((val, i) => {
          const inputY = n === 1 ? sumNodeY : 30 + i * spacing;
          const w = weights[i] ?? 0;
          const isActive = val === 1;

          // Color coding for weights: positive = blue, negative = red, zero = gray
          let strokeColor = '#64748B'; // gray
          if (w > 0) strokeColor = '#3B82F6'; // blue
          if (w < 0) strokeColor = '#EF4444'; // red

          return (
            <g key={`conn-${i}`}>
              <line
                x1={inputX}
                y1={inputY}
                x2={sumNodeX}
                y2={sumNodeY}
                stroke={strokeColor}
                strokeWidth={isActive ? 3 : 1.5}
                strokeOpacity={isActive ? 0.9 : 0.4}
                strokeDasharray={isActive ? 'none' : '4 2'}
              />

              {/* Animated pulse on active connections */}
              {isActive && (
                <motion.circle
                  r="3.5"
                  fill={strokeColor}
                  filter="url(#glow)"
                  initial={{ cx: inputX, cy: inputY }}
                  animate={{ cx: sumNodeX, cy: sumNodeY }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.15,
                  }}
                />
              )}

              {/* Weight text badge */}
              <text
                x={(inputX + sumNodeX) / 2 - 15}
                y={(inputY + sumNodeY) / 2 + (i % 2 === 0 ? -6 : 12)}
                fill={strokeColor}
                fontSize={isCompact ? '10' : '11'}
                fontFamily="monospace"
                fontWeight="bold"
              >
                W{i + 1}={w > 0 ? `+${w}` : w}
              </text>
            </g>
          );
        })}

        {/* Connection from Summing Node to Output Node */}
        <line
          x1={sumNodeX}
          y1={sumNodeY}
          x2={outputNodeX}
          y2={outputNodeY}
          stroke={y === 1 ? '#10B981' : '#64748B'}
          strokeWidth={3}
          strokeOpacity={0.9}
        />
        {y === 1 && (
          <motion.circle
            r="4"
            fill="#10B981"
            filter="url(#glow)"
            initial={{ cx: sumNodeX, cy: sumNodeY }}
            animate={{ cx: outputNodeX, cy: outputNodeY }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Input Nodes */}
        {inputs.map((val, i) => {
          const inputY = n === 1 ? sumNodeY : 30 + i * spacing;
          const isOn = val === 1;
          const nodeRadius = isCompact ? 13 : 16;

          return (
            <g key={`node-${i}`}>
              <circle
                cx={inputX}
                cy={inputY}
                r={nodeRadius}
                fill={isOn ? '#1E293B' : '#0F172A'}
                stroke={isOn ? '#3B82F6' : '#475569'}
                strokeWidth={isOn ? 2.5 : 1.5}
                filter={isOn ? 'url(#glow)' : undefined}
              />
              <text
                x={inputX}
                y={inputY + 4}
                textAnchor="middle"
                fill={isOn ? '#60A5FA' : '#94A3B8'}
                fontSize={isCompact ? '10' : '12'}
                fontFamily="monospace"
                fontWeight="bold"
              >
                X{i + 1}:{val}
              </text>
            </g>
          );
        })}

        {/* Summing & Activation Node */}
        <g>
          {/* Outer circle */}
          <circle
            cx={sumNodeX}
            cy={sumNodeY}
            r={isCompact ? 42 : 50}
            fill="#0F172A"
            stroke="url(#blueGlow)"
            strokeWidth={3}
            filter="url(#glow)"
          />

          {/* Sum symbol and bias */}
          <text
            x={sumNodeX}
            y={sumNodeY - 16}
            textAnchor="middle"
            fill="#E2E8F0"
            fontSize="14"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Σ + b
          </text>
          <text
            x={sumNodeX}
            y={sumNodeY}
            textAnchor="middle"
            fill="#A855F7"
            fontSize="11"
            fontFamily="monospace"
          >
            b = {bias >= 0 ? `+${bias}` : bias}
          </text>
          <text
            x={sumNodeX}
            y={sumNodeY + 16}
            textAnchor="middle"
            fill="#60A5FA"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            z = {z.toFixed(2)}
          </text>
          <text
            x={sumNodeX}
            y={sumNodeY + 30}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="9"
            fontFamily="sans-serif"
          >
            step(z)
          </text>
        </g>

        {/* Output Node */}
        <g>
          <circle
            cx={outputNodeX}
            cy={outputNodeY}
            r={isCompact ? 22 : 26}
            fill="#0F172A"
            stroke={y === 1 ? '#10B981' : '#64748B'}
            strokeWidth={y === 1 ? 3 : 2}
            filter={y === 1 ? 'url(#glow)' : undefined}
          />
          <text
            x={outputNodeX}
            y={outputNodeY - 2}
            textAnchor="middle"
            fill={y === 1 ? '#34D399' : '#94A3B8'}
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Y
          </text>
          <text
            x={outputNodeX}
            y={outputNodeY + 12}
            textAnchor="middle"
            fill={y === 1 ? '#34D399' : '#94A3B8'}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {y}
          </text>
        </g>
      </svg>
    </div>
  );
};
