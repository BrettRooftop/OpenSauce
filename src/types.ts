/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AlertSeverity {
  GREEN = 'green',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  RED = 'red',
}

export enum AlertLikelihood {
  VERY_LOW = 'Very Low',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum AlertImpact {
  MINIMAL = 'Minimal',
  MINOR = 'Minor',
  SIGNIFICANT = 'Significant',
  SEVERE = 'Severe',
}

export interface WeatherAlert {
  id: string;
  headline: string;
  description: string;
  instruction: string;
  severity: AlertSeverity; // Derived from matrix
  impact: AlertImpact;
  likelihood: AlertLikelihood;
  province: string;
  district: string;
  startTime: string;
  endTime: string;
  phenomena: string; // e.g., 'Severe Thunderstorms', 'Veld Fire'
  warningLevel?: string;
  source: 'SAWS' | 'AfriGIS' | 'X';
  sourceUrl?: string;
  visualUrl?: string; // For X posts
}

export interface DistrictInfo {
  name: string;
  province: string;
}
