// Her Brand - Simple & Elegant Palette
const brand = {
  // Core colors
  background: '#050508', // Deepest Space
  deep: '#030305',
  primary: '#E6C15C',    // Refined Stardust Gold (less "yellow", more metallic)
  secondary: '#6347D1',  // Vibrant Nebula Purple
  accent: '#4ECDC4',     // Cosmic Teal
  white: '#F5F0FF',

  // Identity colors - Refined for "Premium" feel
  identityHealth: '#4ECDC4',
  identityFinances: '#E6C15C',
  identityRelationships: '#FF6B9D',
  identityPurpose: '#FF7F50',
  identityGrowth: '#9B59B6',
  identityEnvironment: '#3498DB',
  identitySpirituality: '#DCD0FF',

  // Effects
  glow: 'rgba(99, 71, 209, 0.4)',
  highlight: 'rgba(230, 193, 92, 0.2)',

  // Text
  textMain: '#F2F2F7',
  textMuted: '#8E8E93',
  textDim: 'rgba(242, 242, 247, 0.5)',
};

export const IDENTITY_COLORS = {
  health: brand.identityHealth,
  finances: brand.identityFinances,
  relationships: brand.identityRelationships,
  purpose: brand.identityPurpose,
  growth: brand.identityGrowth,
  environment: brand.identityEnvironment,
  spirituality: brand.identitySpirituality,
};

export const PILLAR_COLORS = IDENTITY_COLORS; // Backward compatibility



export default {
  light: {
    text: '#2D2926',
    background: brand.white,
    tint: brand.secondary,
    tabIconDefault: brand.textMuted,
    tabIconSelected: brand.secondary,
    card: '#FFFFFF',
    border: '#C7BBAF',
    glass: 'rgba(249, 247, 242, 0.15)',
    primary: brand.primary,
    secondary: brand.secondary,
    glow: brand.highlight,
  },
  dark: {
    text: brand.textMain,
    background: brand.background,
    tint: brand.primary,
    tabIconDefault: brand.textMuted,
    tabIconSelected: brand.primary,
    card: '#1A1A2E',
    border: '#2A2A3E',
    glass: 'rgba(5, 5, 10, 0.5)',
    primary: brand.primary,
    secondary: brand.secondary,
    glow: brand.highlight,
  },
  brand,
};
