/**
 * Cyberpunk 2020 System Configuration
 */

export const cyberpunk2020Config = {
  id: 'cyberpunk2020',
  name: 'Cyberpunk 2020',
  description: 'High-tech, low-life cyberpunk adventure',
  icon: 'fa-solid fa-robot',
  color: '#7dd3fc',
  underglow: '#334155',
  version: '1.0.0',
  available: false, // TODO: Implement Cyberpunk 2020 wizard

  wizardClass: null,
  rulesEngine: null,
  characterModel: null,
  actorAdapter: null,

  requiredFoundrySystem: 'cyberpunk2020',
  minimumFoundryVersion: '13.0.0',

  features: {
    roles: true,
    cyberware: true,
    netrunning: true,
    lifepaths: true
  }
};
