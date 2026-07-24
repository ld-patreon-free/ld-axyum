/**
 * Call of Cthulhu 7th Edition System Configuration
 */

export const coc7Config = {
  id: 'coc7',
  name: 'Call of Cthulhu 7th Edition',
  description: 'Horror RPG investigating the unknown',
  icon: 'fa-solid fa-ghost',
  color: '#2F1B14',
  underglow: '#1a0f0a',
  version: '1.0.0',
  available: false, // TODO: Implement CoC7 wizard

  wizardClass: null,
  rulesEngine: null,
  characterModel: null,
  actorAdapter: null,

  requiredFoundrySystem: 'CoC7',
  minimumFoundryVersion: '13.0.0',

  features: {
    occupations: true,
    sanity: true,
    skills: true,
    eras: true
  }
};