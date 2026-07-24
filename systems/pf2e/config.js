/**
 * Pathfinder 2nd Edition System Configuration
 */

export const pf2eConfig = {
  id: 'pf2e',
  name: 'Pathfinder 2nd Edition',
  description: 'Modern fantasy RPG with ancestry and heritage',
  icon: 'fa-solid fa-dragon',
  color: '#C87533',
  underglow: '#8B4513',
  version: '1.0.0',
  available: false, // TODO: Implement Pathfinder 2e wizard

  wizardClass: null,
  rulesEngine: null,
  characterModel: null,
  actorAdapter: null,

  requiredFoundrySystem: 'pf2e',
  minimumFoundryVersion: '13.0.0',

  features: {
    ancestry: true,
    heritage: true,
    backgrounds: true,
    classes: true,
    proficiency: true,
    feats: true
  }
};