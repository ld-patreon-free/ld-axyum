/**
 * AxyumStaticData - Static data definitions for LD Axyum
 * Contains languages, proficiencies, skills, and class data maps
 */

export const STANDARD_LANGUAGES = [
  { id: 'common', name: 'Common', type: 'standard' },
  { id: 'dwarvish', name: 'Dwarvish', type: 'standard' },
  { id: 'elvish', name: 'Elvish', type: 'standard' },
  { id: 'giant', name: 'Giant', type: 'standard' },
  { id: 'gnomish', name: 'Gnomish', type: 'standard' },
  { id: 'goblin', name: 'Goblin', type: 'standard' },
  { id: 'halfling', name: 'Halfling', type: 'standard' },
  { id: 'orc', name: 'Orc', type: 'standard' }
];

export const EXOTIC_LANGUAGES = [
  { id: 'abyssal', name: 'Abyssal', type: 'exotic' },
  { id: 'celestial', name: 'Celestial', type: 'exotic' },
  { id: 'draconic', name: 'Draconic', type: 'exotic' },
  { id: 'deep-speech', name: 'Deep Speech', type: 'exotic' },
  { id: 'infernal', name: 'Infernal', type: 'exotic' },
  { id: 'primordial', name: 'Primordial', type: 'exotic' },
  { id: 'sylvan', name: 'Sylvan', type: 'exotic' },
  { id: 'undercommon', name: 'Undercommon', type: 'exotic' }
];

export const ALL_LANGUAGES = [...STANDARD_LANGUAGES, ...EXOTIC_LANGUAGES];

export const RACE_LANGUAGE_MAP = {
  'human': ['common'],
  'elf': ['common', 'elvish'],
  'high elf': ['common', 'elvish'],
  'wood elf': ['common', 'elvish'],
  'dark elf': ['common', 'elvish'],
  'drow': ['common', 'elvish'],
  'dwarf': ['common', 'dwarvish'],
  'hill dwarf': ['common', 'dwarvish'],
  'mountain dwarf': ['common', 'dwarvish'],
  'halfling': ['common', 'halfling'],
  'lightfoot halfling': ['common', 'halfling'],
  'stout halfling': ['common', 'halfling'],
  'gnome': ['common', 'gnomish'],
  'rock gnome': ['common', 'gnomish'],
  'forest gnome': ['common', 'gnomish'],
  'half-elf': ['common', 'elvish'],
  'half-orc': ['common', 'orc'],
  'tiefling': ['common', 'infernal'],
  'dragonborn': ['common', 'draconic']
};

export const ARMOR_TYPES = [
  { id: 'lgt', name: 'Light Armor' },
  { id: 'med', name: 'Medium Armor' },
  { id: 'hvy', name: 'Heavy Armor' },
  { id: 'shl', name: 'Shields' }
];

export const CLASS_ARMOR_MAP = {
  'barbarian': ['lgt', 'med', 'shl'],
  'bard': ['lgt'],
  'cleric': ['lgt', 'med', 'shl'],
  'druid': ['lgt', 'med', 'shl'],
  'fighter': ['lgt', 'med', 'hvy', 'shl'],
  'monk': [],
  'paladin': ['lgt', 'med', 'hvy', 'shl'],
  'ranger': ['lgt', 'med', 'shl'],
  'rogue': ['lgt'],
  'sorcerer': [],
  'warlock': ['lgt'],
  'wizard': []
};

export const WEAPON_TYPES = [
  { id: 'sim', name: 'Simple Weapons' },
  { id: 'mar', name: 'Martial Weapons' },
  { id: 'longsword', name: 'Longsword' },
  { id: 'rapier', name: 'Rapier' },
  { id: 'shortsword', name: 'Shortsword' },
  { id: 'handCrossbow', name: 'Hand Crossbow' },
  { id: 'lightCrossbow', name: 'Light Crossbow' },
  { id: 'scimitar', name: 'Scimitar' }
];

export const CLASS_WEAPON_MAP = {
  'barbarian': ['sim', 'mar'],
  'bard': ['sim', 'handCrossbow', 'longsword', 'rapier', 'shortsword'],
  'cleric': ['sim'],
  'druid': ['club', 'dagger', 'dart', 'javelin', 'mace', 'quarterstaff', 'scimitar', 'sickle', 'sling', 'spear'],
  'fighter': ['sim', 'mar'],
  'monk': ['sim', 'shortsword'],
  'paladin': ['sim', 'mar'],
  'ranger': ['sim', 'mar'],
  'rogue': ['sim', 'handCrossbow', 'longsword', 'rapier', 'shortsword'],
  'sorcerer': ['dagger', 'dart', 'sling', 'quarterstaff', 'lightCrossbow'],
  'warlock': ['sim'],
  'wizard': ['dagger', 'dart', 'sling', 'quarterstaff', 'lightCrossbow']
};

export const TOOL_TYPES = [
  { id: 'thievesTools', name: "Thieves' Tools" },
  { id: 'disguiseKit', name: 'Disguise Kit' },
  { id: 'forgeryKit', name: 'Forgery Kit' },
  { id: 'herbalismKit', name: 'Herbalism Kit' },
  { id: 'navigatorsTools', name: "Navigator's Tools" },
  { id: 'artisansTools', name: "Artisan's Tools" },
  { id: 'gamingSet', name: 'Gaming Set' },
  { id: 'musicalInstrument', name: 'Musical Instrument' },
  { id: 'vehiclesLand', name: 'Vehicles (Land)' },
  { id: 'vehiclesWater', name: 'Vehicles (Water)' }
];

export const BACKGROUND_TOOL_MAP = {
  'acolyte': [],
  'charlatan': ['disguiseKit', 'forgeryKit'],
  'criminal': ['gamingSet', 'thievesTools'],
  'entertainer': ['disguiseKit', 'musicalInstrument'],
  'folk hero': ['artisansTools', 'vehiclesLand'],
  'guild artisan': ['artisansTools'],
  'hermit': ['herbalismKit'],
  'noble': ['gamingSet'],
  'outlander': ['musicalInstrument'],
  'sage': [],
  'sailor': ['navigatorsTools', 'vehiclesWater'],
  'soldier': ['gamingSet', 'vehiclesLand'],
  'urchin': ['disguiseKit', 'thievesTools']
};

export const SKILL_DEFINITIONS = [
  { key: 'acrobatics', locKey: 'Acrobatics', ability: 'DEX' },
  { key: 'animalHandling', locKey: 'AnimalHandling', ability: 'WIS' },
  { key: 'arcana', locKey: 'Arcana', ability: 'INT' },
  { key: 'athletics', locKey: 'Athletics', ability: 'STR' },
  { key: 'deception', locKey: 'Deception', ability: 'CHA' },
  { key: 'history', locKey: 'History', ability: 'INT' },
  { key: 'insight', locKey: 'Insight', ability: 'WIS' },
  { key: 'intimidation', locKey: 'Intimidation', ability: 'CHA' },
  { key: 'investigation', locKey: 'Investigation', ability: 'INT' },
  { key: 'medicine', locKey: 'Medicine', ability: 'WIS' },
  { key: 'nature', locKey: 'Nature', ability: 'INT' },
  { key: 'perception', locKey: 'Perception', ability: 'WIS' },
  { key: 'performance', locKey: 'Performance', ability: 'CHA' },
  { key: 'persuasion', locKey: 'Persuasion', ability: 'CHA' },
  { key: 'religion', locKey: 'Religion', ability: 'INT' },
  { key: 'sleightOfHand', locKey: 'SleightOfHand', ability: 'DEX' },
  { key: 'stealth', locKey: 'Stealth', ability: 'DEX' },
  { key: 'survival', locKey: 'Survival', ability: 'WIS' }
];

export const CLASS_SKILL_MAP = {
  'Barbarian': { count: 2, pool: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
  'Bard': { count: 3, pool: ['Any'] },
  'Cleric': { count: 2, pool: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
  'Druid': { count: 2, pool: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
  'Fighter': { count: 2, pool: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
  'Monk': { count: 2, pool: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
  'Paladin': { count: 2, pool: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
  'Ranger': { count: 3, pool: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
  'Rogue': { count: 4, pool: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
  'Sorcerer': { count: 2, pool: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
  'Warlock': { count: 2, pool: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
  'Wizard': { count: 2, pool: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
  'Artificer': { count: 2, pool: ['Arcana', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Sleight of Hand'] }
};

export const ABILITY_DEFINITIONS = [
  { key: 'str', name: 'STR', label: 'Strength' },
  { key: 'dex', name: 'DEX', label: 'Dexterity' },
  { key: 'con', name: 'CON', label: 'Constitution' },
  { key: 'int', name: 'INT', label: 'Intelligence' },
  { key: 'wis', name: 'WIS', label: 'Wisdom' },
  { key: 'cha', name: 'CHA', label: 'Charisma' }
];

export const TRAIT_TABLE_MAP = {
  'details.traits': 'personality-traits',
  'details.ideals': 'ideals',
  'details.bonds': 'bonds',
  'details.flaws': 'flaws'
};
