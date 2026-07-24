/**
 * LD Axyum - Recommendation Engine Data
 * 
 * Mapping data for intelligent character creation recommendations.
 * Extracted from recommendation-engine.js for LD protocol compliance.
 * 
 * Contains:
 * - Role to Class mapping with priorities
 * - Class to Race/Species synergies
 * - Background suggestions by class
 * - Ability score priorities by class
 * - Class pros and cons
 */

export const ROLE_CLASS_MAP = {
  'warrior': {
    primary: ['barbarian', 'fighter', 'monk', 'paladin'],
    secondary: ['ranger', 'rogue'],
    explanation: 'Warriors excel in melee combat and physical prowess'
  },
  'mage': {
    primary: ['wizard', 'sorcerer', 'cleric', 'druid'],
    secondary: ['warlock', 'bard'],
    explanation: 'Mages command magical forces to control the battlefield'
  },
  'rogue': {
    primary: ['rogue', 'monk', 'ranger'],
    secondary: ['bard', 'warlock'],
    explanation: 'Rogues excel in stealth, precision, and cunning'
  },
  'paladin': {
    primary: ['paladin', 'cleric'],
    secondary: ['fighter', 'ranger'],
    explanation: 'Paladins combine martial prowess with divine power'
  },
  'archer': {
    primary: ['ranger', 'rogue', 'fighter'],
    secondary: ['monk', 'bard'],
    explanation: 'Archers deal precise damage from range'
  },
  'healer': {
    primary: ['cleric', 'druid', 'monk'],
    secondary: ['bard', 'paladin'],
    explanation: 'Healers support allies and restore life'
  },
  'summoner': {
    primary: ['wizard', 'sorcerer', 'warlock', 'druid'],
    secondary: ['cleric', 'bard'],
    explanation: 'Summoners command creatures and magic'
  },
  'trickster': {
    primary: ['bard', 'rogue', 'warlock'],
    secondary: ['sorcerer', 'wizard'],
    explanation: 'Tricksters use cunning, magic, and misdirection'
  }
};

export const CLASS_RACE_MAP = {
  'barbarian': {
    primary: ['orc', 'half-orc', 'dwarf', 'dragonborn'],
    explanation: 'Physical strength and endurance synergies'
  },
  'bard': {
    primary: ['human', 'half-elf', 'gnome', 'halfling'],
    explanation: 'Charisma-based and naturally persuasive'
  },
  'cleric': {
    primary: ['human', 'dwarf', 'half-elf', 'dragonborn'],
    explanation: 'Divine connection and wisdom synergies'
  },
  'druid': {
    primary: ['elf', 'half-elf', 'human', 'goblin'],
    explanation: 'Nature affinity and transformative abilities'
  },
  'fighter': {
    primary: ['human', 'dwarf', 'dragonborn', 'half-orc'],
    explanation: 'Martial training and combat heritage'
  },
  'monk': {
    primary: ['human', 'elf', 'halfling', 'kenku'],
    explanation: 'Discipline and dexterity synergies'
  },
  'paladin': {
    primary: ['human', 'half-elf', 'dragonborn', 'dwarf'],
    explanation: 'Divine purpose and noble bearings'
  },
  'ranger': {
    primary: ['elf', 'human', 'dwarf', 'halfling'],
    explanation: 'Wilderness survival and tracking abilities'
  },
  'rogue': {
    primary: ['halfling', 'human', 'elf', 'gnome'],
    explanation: 'Dexterity and stealth heritage'
  },
  'sorcerer': {
    primary: ['human', 'dragonborn', 'tiefling', 'elf'],
    explanation: 'Innate magical bloodlines'
  },
  'warlock': {
    primary: ['human', 'tiefling', 'elf', 'half-elf'],
    explanation: 'Charisma and otherworldly patrons'
  },
  'wizard': {
    primary: ['human', 'elf', 'gnome', 'half-elf'],
    explanation: 'Intellect and arcane aptitude'
  }
};

export const BACKGROUND_MAP = {
  'barbarian': ['gladiator', 'folk hero', 'soldier', 'hermit'],
  'bard': ['entertainer', 'courtier', 'criminal', 'charlatan'],
  'cleric': ['acolyte', 'sage', 'noble', 'folk hero'],
  'druid': ['hermit', 'folk hero', 'sage', 'outlander'],
  'fighter': ['soldier', 'knight', 'mercenary', 'folk hero'],
  'monk': ['acolyte', 'hermit', 'sage', 'soldier'],
  'paladin': ['knight', 'noble', 'acolyte', 'soldier'],
  'ranger': ['outlander', 'soldier', 'folk hero', 'bounty hunter'],
  'rogue': ['criminal', 'charlatan', 'urchin', 'pirate'],
  'sorcerer': ['sage', 'noble', 'folk hero', 'hermit'],
  'warlock': ['criminal', 'charlatan', 'sage', 'courtier'],
  'wizard': ['sage', 'acolyte', 'scholar', 'courtier']
};

export const CLASS_ABILITY_MAP = {
  'barbarian': {
    primary: 'strength',
    secondary: 'constitution',
    tertiary: 'dexterity'
  },
  'bard': {
    primary: 'charisma',
    secondary: 'dexterity',
    tertiary: 'constitution'
  },
  'cleric': {
    primary: 'wisdom',
    secondary: 'strength',
    tertiary: 'constitution'
  },
  'druid': {
    primary: 'wisdom',
    secondary: 'constitution',
    tertiary: 'dexterity'
  },
  'fighter': {
    primary: 'strength',
    secondary: 'constitution',
    tertiary: 'dexterity'
  },
  'monk': {
    primary: 'dexterity',
    secondary: 'wisdom',
    tertiary: 'constitution'
  },
  'paladin': {
    primary: 'strength',
    secondary: 'charisma',
    tertiary: 'constitution'
  },
  'ranger': {
    primary: 'dexterity',
    secondary: 'wisdom',
    tertiary: 'constitution'
  },
  'rogue': {
    primary: 'dexterity',
    secondary: 'intelligence',
    tertiary: 'charisma'
  },
  'sorcerer': {
    primary: 'charisma',
    secondary: 'constitution',
    tertiary: 'dexterity'
  },
  'warlock': {
    primary: 'charisma',
    secondary: 'constitution',
    tertiary: 'wisdom'
  },
  'wizard': {
    primary: 'intelligence',
    secondary: 'dexterity',
    tertiary: 'constitution'
  }
};

export const CLASS_PROS = {
  'barbarian': ['High damage output', 'Extra HP from Rage', 'Simple mechanics'],
  'bard': ['Excellent utility spells', 'Skill monkey build', 'Support and damage'],
  'cleric': ['Healing and buffing', 'Weapon versatility', 'Armor proficiency'],
  'druid': ['Flexible spellcasting', 'Wild Shape for exploration', 'Healing'],
  'fighter': ['Extra attacks', 'Action Surge', 'Fighting Styles'],
  'monk': ['Mobile and fast', 'Extra unarmed attacks', 'Stun and control'],
  'paladin': ['Smites for damage', 'Healing and buffing', 'Aura support'],
  'ranger': ['Sneak attacks', 'Pet companion', 'Expertise in skills'],
  'rogue': ['Multiple Sneak Attacks', 'Expertise', 'Incredible skill monkey'],
  'sorcerer': ['Flexible spellcasting', 'Metamagic', 'Less preparation needed'],
  'warlock': ['Eldritch Blast spam', 'Invocations for customization', 'Short rest slots'],
  'wizard': ['Most spells known', 'Ritual casting', 'Ritual book flexibility']
};

export const CLASS_CONS = {
  'barbarian': ['Limited spell casting', 'Once raging, limited control', 'Lower AC'],
  'bard': ['Jack of all trades', 'Master of none in combat', 'Lower HP'],
  'cleric': ['Bonus action competition', 'Heavy spell slot usage', 'Limited expertise'],
  'druid': ['Concentration on spells', 'Wild Shape is limited', 'Armor restrictions'],
  'fighter': ['Limited magical features', 'Bonus action competition', 'Action economy dependent'],
  'monk': ['Resource management (Ki)', 'Lower damage than other melee', 'MAD (Multiple Ability Dependent)'],
  'paladin': ['Spell slots on melee use', 'Concentration issues', 'Less flexible than clerics'],
  'ranger': ['Dependent on TWO save DCs', 'Pet can be fragile', 'Half-caster progression'],
  'rogue': ['Single target focus', 'Light armor only', 'Invisible in combat spotlight'],
  'sorcerer': ['Fewer spells known', 'Less utility than wizard', 'MAD with charisma'],
  'warlock': ['Fewer spell slots', 'Pact restrictions', 'Spell slot recovery dependent'],
  'wizard': ['Squishy early on', 'Preparation intensive', 'No healing']
};
