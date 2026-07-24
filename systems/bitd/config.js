/**
 * Blades in the Dark System Configuration
 */

export const bitdConfig = {
  id: 'bitd',
  name: 'Blades in the Dark',
  description: 'Narrative-driven scoundrel RPG in a gothic city',
  icon: 'fa-solid fa-mask',
  color: '#4A0E4E',
  underglow: '#2D082E',
  version: '1.0.0',
  available: false, // TODO: Implement Blades in the Dark wizard

  wizardClass: null,
  rulesEngine: null,
  characterModel: null,
  actorAdapter: null,

  requiredFoundrySystem: 'blades-in-the-dark',
  minimumFoundryVersion: '13.0.0',

  features: {
    playbooks: true,
    crews: true,
    stress: true,
    trauma: true
  }
};