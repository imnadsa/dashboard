import React from 'react';
import { ALL_GRADIENTS } from '../../config/gradients';

const SvgGradients: React.FC = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      {ALL_GRADIENTS.map(g => (
        <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.colors[0]} />
          <stop offset="100%" stopColor={g.colors[1]} />
        </linearGradient>
      ))}
    </defs>
  </svg>
);

export default SvgGradients;
