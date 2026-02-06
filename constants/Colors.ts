// Her Universe - Cosmic Color Palette
const cosmic = {
  // Core space colors
  deepSpace: '#0A0A0F',
  nebulaPurple: '#2D1B4E',
  stardustGold: '#FFD700',
  cosmicWhite: '#F5F0FF',
  voidBlack: '#050508',

  // Planet colors (mapped to pillars)
  planetHealth: '#4ECDC4',      // Earth-like teal
  planetFinances: '#FFD700',    // Jupiter gold
  planetRelationships: '#FF6B9D', // Venus pink
  planetPurpose: '#FF6347',     // Mars red
  planetGrowth: '#9B59B6',      // Saturn purple
  planetEnvironment: '#3498DB', // Neptune blue
  planetSpirituality: '#E8E4F0', // Moon silver

  // Gradients & effects
  nebulaGlow: 'rgba(45, 27, 78, 0.6)',
  starGlow: 'rgba(255, 215, 0, 0.3)',

  // Text colors
  starlightText: '#E8E2D9',
  dimStar: '#8C929D',
};

export const PLANET_COLORS = {
  health: cosmic.planetHealth,
  finances: cosmic.planetFinances,
  relationships: cosmic.planetRelationships,
  purpose: cosmic.planetPurpose,
  growth: cosmic.planetGrowth,
  environment: cosmic.planetEnvironment,
  spirituality: cosmic.planetSpirituality,
};

export default {
  light: {
    text: '#2D2926',
    background: cosmic.cosmicWhite,
    tint: cosmic.nebulaPurple,
    tabIconDefault: cosmic.dimStar,
    tabIconSelected: cosmic.nebulaPurple,
    card: '#FFFFFF',
    border: '#C7BBAF',
    glass: 'rgba(249, 247, 242, 0.15)',
    primary: cosmic.stardustGold,
    secondary: cosmic.nebulaPurple,
    glow: cosmic.starGlow,
  },
  dark: {
    text: cosmic.starlightText,
    background: cosmic.deepSpace,
    tint: cosmic.stardustGold,
    tabIconDefault: cosmic.dimStar,
    tabIconSelected: cosmic.stardustGold,
    card: '#1A1A2E',
    border: '#2A2A3E',
    glass: 'rgba(255, 255, 255, 0.08)',
    primary: cosmic.stardustGold,
    secondary: cosmic.nebulaPurple,
    glow: cosmic.starGlow,
  },
  cosmic, // Export cosmic palette for direct use
};
