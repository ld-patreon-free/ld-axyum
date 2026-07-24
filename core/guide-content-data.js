/**
 * LD Axyum - New Player Guide Content Data
 * 
 * Learning topics, terminology, and page guides for new D&D 5e players.
 * Extracted from new-player-guide.js for LD protocol compliance.
 * 
 * Contains:
 * - 100+ learning topics across all D&D concepts
 * - Terminology dictionary with abbreviations
 * - Page-specific learning guides and tips
 */

export const GUIDE_TOPICS = {
  // Ability Scores
  'ability-scores': {
    title: 'What Are Ability Scores?',
    shortDescription: 'Six core attributes that define your character\'s strengths and weaknesses.',
    fullDescription: 'Ability scores range from 1-20. Each ability determines what you\'re good at: Strength for physical power, Dexterity for agility, Constitution for endurance, Intelligence for book smarts, Wisdom for intuition, and Charisma for personality. Your modifier (the number you add to rolls) is calculated from your score: (score - 10) / 2, rounded down.',
    examples: ['A 16 Strength gives +3 modifier', 'A 10 Constitution gives +0 modifier', 'A 8 Wisdom gives -1 modifier'],
    relatedTopics: ['modifiers', 'proficiency', 'ability-checks']
  },
  'modifiers': {
    title: 'What Are Modifiers?',
    shortDescription: 'The bonus or penalty added to your rolls based on ability scores.',
    fullDescription: 'Your ability modifier is derived from your ability score. Subtract 10 from the score, divide by 2, and round down. This modifier is what you actually use: add it to d20 rolls for ability checks, attacks, saving throws, and damage rolls. A higher score = better rolls.',
    examples: ['Score 18: (18-10)/2 = +4 modifier', 'Score 13: (13-10)/2 = +1 modifier', 'Score 6: (6-10)/2 = -2 modifier'],
    relatedTopics: ['ability-scores', 'd20-rolls', 'advantage-disadvantage']
  },
  'proficiency': {
    title: 'What Is Proficiency?',
    shortDescription: 'Your character\'s expertise in specific areas - you add your proficiency bonus to relevant rolls.',
    fullDescription: 'Proficiency represents training. You add your proficiency bonus to attack rolls with weapons you\'re proficient with, saving throws you\'re proficient in, and ability checks for skills you\'re trained in. Your proficiency bonus increases as you level up: +2 at level 1, +3 at level 5, +4 at level 9, +5 at level 13, +6 at level 17. If you\'re not proficient, you don\'t add the bonus - just use the base ability modifier.',
    examples: ['Fighter proficient with longsword: add proficiency to attack roll', 'Rogue proficient in Stealth: add proficiency to Stealth checks', 'Wizard not proficient with longsword: only add Strength modifier to attack roll'],
    relatedTopics: ['ability-checks', 'skills', 'attack-rolls']
  },
  'ability-checks': {
    title: 'What Are Ability Checks?',
    shortDescription: 'A d20 roll plus your ability modifier to see if you succeed at something.',
    fullDescription: 'When you try to do something that\'s risky or uncertain, you make an ability check. Roll a d20 (20-sided die) and add the relevant ability modifier. If you\'re proficient in the related skill, add your proficiency bonus too. The Dungeon Master sets a DC (Difficulty Class) - you succeed if you roll equal to or higher than the DC.',
    examples: ['Climb a wall: Strength check (roll d20 + Strength modifier)', 'Hide in shadows: Dexterity check + Stealth proficiency', 'Recall information: Intelligence check + Arcana proficiency'],
    relatedTopics: ['d20-rolls', 'modifiers', 'skills', 'difficulty-class']
  },
  'difficulty-class': {
    title: 'What Is Difficulty Class (DC)?',
    shortDescription: 'The target number you need to roll to succeed at a task.',
    fullDescription: 'The DC is what the DM sets for any ability check. DC 10 is "Easy", DC 15 is "Hard", DC 20 is "Very Difficult". You compare your total roll (d20 + modifiers + proficiency) to the DC. If your total is equal to or greater than the DC, you succeed!',
    examples: ['DC 10: Easy task like climbing a rope', 'DC 15: Hard task like picking a complex lock', 'DC 20: Very difficult like scaling a sheer cliff face'],
    relatedTopics: ['ability-checks', 'difficulty-rating']
  },
  'saving-throws': {
    title: 'What Are Saving Throws?',
    shortDescription: 'A defensive roll to resist harmful effects, like spells or poison.',
    fullDescription: 'When something bad happens to you (like a dragon\'s fire breath or a spell), you get a saving throw to avoid or reduce the damage. Roll a d20 and add the relevant ability modifier. Some classes have proficiency in certain saving throws and add their proficiency bonus. You succeed if you meet or exceed the DC set by the effect.',
    examples: ['Dragon fire: Dexterity save to dodge partially out of the way', 'Fear spell: Wisdom save to resist the magical terror', 'Poison: Constitution save to resist the toxin'],
    relatedTopics: ['ability-checks', 'modifiers', 'spells']
  },
  'skills': {
    title: 'What Are Skills?',
    shortDescription: 'Specific areas of training that add bonus to ability checks.',
    fullDescription: 'There are 18 skills in D&D 5e, each tied to an ability. If you\'re proficient in a skill, you add your proficiency bonus to checks using that skill. Skills are: Acrobatics, Animal Handling, Arcana, Athletics, Deception, History, Insight, Intimidation, Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Sleight of Hand, Stealth, Survival.',
    examples: ['Stealth (Dexterity): Move silently, hide from enemies', 'Perception (Wisdom): Notice hidden details, spot traps', 'Arcana (Intelligence): Identify magical items, recognize spells'],
    relatedTopics: ['proficiency', 'ability-checks', 'modifiers']
  },
  'd20-rolls': {
    title: 'What Is a d20 Roll?',
    shortDescription: 'Rolling a 20-sided die - the foundation of D&D mechanics.',
    fullDescription: 'A d20 is a 20-sided die. You roll it whenever there\'s uncertainty: ability checks, attack rolls, saving throws. You add modifiers to the roll. Nat 20s (rolling exactly 20) are automatic success on attacks and often critical hits. Nat 1s are automatic failures on attacks. When two options are "equal chance", you can use a d20 roll to decide.',
    examples: ['Roll d20 for attack: 15 + 3 (Strength) + 2 (proficiency) = 20 total hit', 'Roll d20 for save: 8 + 2 (Constitution) = 10, need 12 to resist (fail)', 'Nat 20: automatic hit on an attack roll (then roll for critical damage)'],
    relatedTopics: ['advantage-disadvantage', 'critical-hits', 'ability-checks']
  },
  'advantage-disadvantage': {
    title: 'Advantage and Disadvantage',
    shortDescription: 'Rolling twice and taking the better (advantage) or worse (disadvantage) result.',
    fullDescription: 'Advantage: Roll the d20 twice and use the higher roll. This represents circumstances favoring you. Disadvantage: Roll the d20 twice and use the lower roll. This represents circumstances working against you. Advantage and disadvantage cancel each other out - if you have both, roll normally instead. These are applied before adding modifiers.',
    examples: ['Advantage sneaking in darkness: roll twice for Stealth, take the better roll', 'Disadvantage attacking while blinded: roll twice for attack, take the worse roll', 'Advantage and disadvantage both active: roll once normally instead'],
    relatedTopics: ['d20-rolls', 'ability-checks', 'attack-rolls']
  },
  'attack-rolls': {
    title: 'How Attack Rolls Work',
    shortDescription: 'Rolling to hit with a weapon or spell attack.',
    fullDescription: 'When you attack: Roll d20 + your ability modifier (Strength for melee, Dexterity for ranged) + proficiency bonus (if you\'re proficient with the weapon). Compare to the target\'s AC (Armor Class). If you hit, roll damage. Spell attacks follow the same pattern but use your spellcasting ability.',
    examples: ['Longsword: d20 + Strength + proficiency (if trained) vs target AC', 'Bow: d20 + Dexterity + proficiency vs target AC', 'Spell attack: d20 + spell ability modifier + proficiency vs target AC'],
    relatedTopics: ['damage', 'critical-hits', 'armor-class', 'weapons']
  },
  'damage': {
    title: 'How Damage Works',
    shortDescription: 'Rolling to determine how much harm your attack causes.',
    fullDescription: 'When you hit with a weapon, you roll the weapon\'s damage die (d6 for longsword, d8 for greataxe, d4 for dagger, etc.). Add your ability modifier (usually Strength for melee, sometimes Dexterity). This is your total damage. The target subtracts this from their hit points. When HP reaches 0, they fall unconscious.',
    examples: ['Longsword hit: roll d8 + 3 (Strength) = 7 damage', 'Dagger hit: roll d4 + 2 (Dexterity) = 3 damage', 'Spell damage: cast fireball for 8d6 damage to all in area'],
    relatedTopics: ['attack-rolls', 'hit-points', 'critical-hits', 'weapons']
  },
  'critical-hits': {
    title: 'What Are Critical Hits?',
    shortDescription: 'When you roll a 20 on an attack, you automatically hit and roll damage twice.',
    fullDescription: 'On an attack roll, if you roll exactly 20 on the d20 (before adding modifiers), you automatically hit regardless of AC. Then you roll damage normally but use double the number of dice. For example, a longsword normally does d8 damage on a crit, you roll d8 + d8 + your modifier.',
    examples: ['Attack roll: roll 20 on d20 (automatic hit)', 'Roll 8 on d8 damage dice, but since crit, roll another d8 and add both + modifier', 'Automatic miss: rolling exactly 1 on attack roll'],
    relatedTopics: ['attack-rolls', 'damage', 'd20-rolls']
  },
  'armor-class': {
    title: 'What Is Armor Class (AC)?',
    shortDescription: 'How hard you are to hit - your defense rating.',
    fullDescription: 'AC is a number representing how well-protected you are. Attackers roll d20 + bonuses and compare to your AC. Higher AC is better (harder to hit). AC comes from armor (leather = 11, chainmail = 16), shields (usually +2), and sometimes ability modifiers (if not wearing heavy armor, add Dexterity to AC). Spells and class features can also increase AC.',
    examples: ['No armor: AC 10 + Dexterity', 'Leather armor: AC 11 + Dexterity', 'Chainmail: AC 16 (no Dexterity added)', 'Shield spell: temporarily raise AC by 5'],
    relatedTopics: ['armor', 'shields', 'attack-rolls']
  },
  'hit-points': {
    title: 'What Are Hit Points (HP)?',
    shortDescription: 'Your health - when this reaches 0, you fall unconscious.',
    fullDescription: 'Hit points represent how much punishment you can take. You start with HP equal to your class\'s hit die plus your Constitution modifier. Each level, you gain more HP (roll hit die + Constitution modifier, minimum 1). When you take damage, subtract it from your HP. At 0 HP, you fall unconscious. At -10 HP (or sometimes sooner), you die permanently.',
    examples: ['Fighter with 14 HP takes 8 damage: now has 6 HP', 'Wizard casts magic missile for 3 damage, reduces target by 3 HP', 'Character at 2 HP and takes 5 damage: falls unconscious at 0 HP'],
    relatedTopics: ['damage', 'death-saves', 'healing']
  },
  'healing': {
    title: 'How Healing Works',
    shortDescription: 'Spells and abilities that restore hit points.',
    fullDescription: 'You can heal other characters using healing spells (Cure Wounds, Healing Word) or potions (Potion of Healing). Healing adds to your current HP, but you can\'t exceed your maximum HP. During a short rest (1 hour), you can spend hit dice to heal yourself (roll hit die + Constitution modifier). During a long rest (8 hours), you recover all HP and half your max hit dice.',
    examples: ['Healing Word spell: restore 1d4 + spellcaster modifier to target HP', 'Potion of Healing: restore 2d4 + 2 HP', 'During rest: spend 2 hit dice, roll d10 + 3, restore that much HP'],
    relatedTopics: ['hit-points', 'spells', 'resting']
  },
  'classes': {
    title: 'What Are Classes?',
    shortDescription: 'Your character\'s profession and role - determines abilities and progression.',
    fullDescription: 'Your class defines how you fight and what abilities you have. 12 core classes: Barbarian (rage), Bard (magic & support), Cleric (healing), Druid (nature magic), Fighter (weapon master), Monk (martial arts), Paladin (holy warrior), Ranger (tracker), Rogue (stealth), Sorcerer (innate magic), Warlock (magical contract), Wizard (learned magic). Each class has unique features and progression.',
    examples: ['Barbarian: rage for damage and resistance', 'Wizard: prepare spells, get ritual casting', 'Rogue: sneak attack for extra damage when hidden'],
    relatedTopics: ['subclasses', 'class-features', 'multiclassing']
  },
  'subclasses': {
    title: 'What Are Subclasses?',
    shortDescription: 'A specialization within your class that defines your unique abilities.',
    fullDescription: 'At level 3 (usually), you choose a subclass (also called an archetype). This represents your specialization within your class. For example, a Fighter might choose Battle Master (tactical maneuvers), Champion (critical hits), or Eldritch Knight (magic). Subclasses give unique features that define your playstyle.',
    examples: ['Barbarian - Path of the Berserker: extra attacks while raging', 'Cleric - Life Domain: extra healing on spells', 'Wizard - Evocation: boost damage of blast spells'],
    relatedTopics: ['classes', 'class-features']
  },
  'class-features': {
    title: 'What Are Class Features?',
    shortDescription: 'Special abilities that your class gains as you level up.',
    fullDescription: 'Class features are what make your class unique. A Fighter gets Extra Attack (attack twice per turn), a Rogue gets Sneak Attack (bonus damage when hidden), a Wizard gets Spellcasting. Some features are automatic at certain levels, others you choose. Features are the core of character progression.',
    examples: ['Rogue level 1: Expertise (extra proficiency in skills)', 'Fighter level 5: Extra Attack (attack twice per action)', 'Barbarian level 2: Reckless Attack (attack with advantage, enemies attack you with advantage)'],
    relatedTopics: ['classes', 'subclasses', 'multiclassing', 'ability-score-improvements']
  },
  'ability-score-improvements': {
    title: 'Ability Score Improvements (ASI)',
    shortDescription: 'At certain levels, increase an ability score or gain a feat.',
    fullDescription: 'At levels 4, 8, 12, 16, and 19, you gain an Ability Score Improvement. You can either increase two ability scores by 1 each, increase one ability score by 2, or gain a feat instead. Feats are special powerful abilities outside your class. ASI is crucial for improving your character\'s power over time.',
    examples: ['Level 4: increase Strength by 2 (improving your attack rolls)', 'Level 8: take Polearm Master feat (swing polearms faster)', 'Level 12: increase Dexterity by 1 and Wisdom by 1'],
    relatedTopics: ['ability-scores', 'feats', 'leveling-up']
  },
  'races': {
    title: 'What Are Races?',
    shortDescription: 'Your character\'s ancestry - determines appearance and gives ability bonuses.',
    fullDescription: 'Your race represents your heritage and appearance. Core races include Human, Elf, Dwarf, Halfling, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling. Each race gives you: ability score bonuses, languages, size, speed, and racial traits (special abilities). For example, Elves are fast and perceptive, Dwarves are tough and resistant to poison.',
    examples: ['Elf: +2 Dexterity, darkvision, advantage on charm saves', 'Dwarf: +2 Constitution, dwarven weapon training, poison resistance', 'Halfling: +2 Dexterity, lucky (reroll 1s), can move through larger creatures'],
    relatedTopics: ['ability-scores', 'racial-traits', 'multiclassing']
  },
  'racial-traits': {
    title: 'What Are Racial Traits?',
    shortDescription: 'Special abilities granted by your race.',
    fullDescription: 'Beyond ability bonuses, races grant special traits. These might be resistances (immunity to poison), languages (Draconic, Dwarvish), darkvision (see in darkness), weapon training, or magical abilities. These traits define how your race is different mechanically.',
    examples: ['Dragonborn: breath weapon usable once per rest', 'Elf: extra proficiency with certain weapons', 'Gnome: resistance to magic (advantage on saves against spells)'],
    relatedTopics: ['races', 'ability-scores', 'languages']
  },
  'backgrounds': {
    title: 'What Are Backgrounds?',
    shortDescription: 'Your character\'s history and occupation before adventuring.',
    fullDescription: 'Your background defines who you were before becoming an adventurer. Backgrounds give you: two skill proficiencies, one tool proficiency, languages, and a background feature (a special ability from your past). Examples: Soldier (military training), Criminal (underworld connections), Noble (political influence), Acolyte (religious knowledge).',
    examples: ['Soldier background: Insight and Athletics, gaming set proficiency, extra contacts in military', 'Scholar background: Arcana and History, your past research is known by academics', 'Criminal background: Deception and Stealth, underworld contacts help you'],
    relatedTopics: ['skills', 'background-features', 'personality']
  },
  'background-features': {
    title: 'What Is a Background Feature?',
    shortDescription: 'A special ability granted by your background.',
    fullDescription: 'Your background gives you one special ability called a background feature. This represents the lasting impact of your past. For example, the Soldier gets "Military Rank" (can requisition supplies), the Noble gets "Position of Privilege" (people respect you for your status), the Criminal gets "Criminal Contacts" (you know people in the underworld).',
    examples: ['Acolyte: Shelter of the Faithful (temples give you free room and board)', 'Soldier: Military Rank (give orders to soldiers, get help from military)', 'Sage: Researcher (can spend downtime researching questions with your contacts)'],
    relatedTopics: ['backgrounds', 'downtime']
  },
  'spellcasting': {
    title: 'How Spellcasting Works',
    shortDescription: 'Casting magical spells - core to wizard, cleric, sorcerer, and other classes.',
    fullDescription: 'Full casters (Wizard, Cleric, Druid, Sorcerer, Bard) gain spellcasting. You have a certain number of spell slots per day per spell level. You cast a spell by using one slot and rolling if the spell requires a save. Spell save DC is 8 + your spellcasting modifier + proficiency bonus. Half-casters (Ranger, Paladin) get fewer slots. Some spells can be cast without using a slot (cantrips).',
    examples: ['Wizard: prepare spells from spellbook each morning, use spell slots to cast', 'Cleric: prepare spells based on domain, use spell slots per day', 'Sorcerer: fewer spells known but flexible casting with metamagic'],
    relatedTopics: ['spell-slots', 'cantrips', 'spell-save-dc', 'concentration']
  },
  'spell-slots': {
    title: 'What Are Spell Slots?',
    shortDescription: 'Limited uses of spellcasting - you have a certain number per day.',
    fullDescription: 'Spell slots determine how many spells you can cast. A 1st-level spell uses a 1st-level slot, a 2nd-level spell uses a 2nd-level slot. You recover all spell slots after a long rest. The number of slots depends on your class and level. For example, a level 5 Wizard has four 1st-level slots, three 2nd-level slots, and two 3rd-level slots.',
    examples: ['Cast magic missile (1st level): use one 1st-level slot', 'Cast fireball (3rd level): use one 3rd-level slot', 'After long rest: all slots recover to maximum'],
    relatedTopics: ['spellcasting', 'cantrips', 'prepared-spells']
  },
  'cantrips': {
    title: 'What Are Cantrips?',
    shortDescription: 'Simple spells that don\'t use spell slots - you can cast them unlimited times.',
    fullDescription: 'Cantrips are 0-level spells. You don\'t use a spell slot to cast them, so you can cast them repeatedly. Examples: Fire Bolt (ranged attack), Healing Word (minor healing), Prestidigitation (minor magical effects). Cantrips scale in power as you level up.',
    examples: ['Fire Bolt: ranged spell attack, 1d10 fire damage at level 5', 'Prestidigitation: clean yourself, flavor food, create small magical effects', 'Mage Hand: invisible hand to manipulate objects from range'],
    relatedTopics: ['spellcasting', 'spell-slots']
  },
  'concentration': {
    title: 'What Is Concentration?',
    shortDescription: 'You can only concentrate on one spell at a time - taking damage might break concentration.',
    fullDescription: 'Many spells require concentration to maintain their effect. You can only concentrate on one spell at a time. If you take damage while concentrating, you must make a Constitution save (DC 10 or half the damage taken, whichever is higher). Failure breaks concentration and ends the spell. Casting another concentration spell immediately breaks the previous one.',
    examples: ['Cast Haste (concentration): boost an ally\'s movement and attacks', 'Take 10 damage: make Constitution save DC 10 or lose concentration', 'Cast another concentration spell: automatically lose Haste effect'],
    relatedTopics: ['spellcasting', 'saving-throws']
  },
  'spell-save-dc': {
    title: 'What Is Spell Save DC?',
    shortDescription: 'The difficulty class for saving throws against your spells.',
    fullDescription: 'Spell Save DC = 8 + your spellcasting ability modifier + your proficiency bonus. When you cast a spell that forces someone to make a saving throw (like Fireball), they roll d20 + relevant ability modifier and compare to your DC. If they equal or beat it, they save and reduce the effect.',
    examples: ['Wizard with Intelligence 16 (+3) at level 1: DC = 8 + 3 + 2 = 13', 'Fireball cast at DC 13: enemies make Dexterity save, beating 13 takes half damage', 'At level 5, your DC increases by 1 due to proficiency bonus: 8 + 3 + 3 = 14'],
    relatedTopics: ['spellcasting', 'saving-throws', 'proficiency']
  },
  'multiclassing': {
    title: 'What Is Multiclassing?',
    shortDescription: 'Splitting your levels between two or more classes for diverse abilities.',
    fullDescription: 'When you level up, you can take a level in a different class instead of your current class. This lets you mix abilities from multiple classes. For example, you might take 5 levels of Fighter then 5 levels of Wizard to combine combat and magic. Be careful: multiclassing can make you weaker if not planned correctly.',
    examples: ['Paladin (5) / Warlock (3): mix holy warrior and magical abilities', 'Fighter (10) / Rogue (2): extra attacks plus sneak attack bonus', 'Cleric (3) / Wizard (5): healing and blasting spells'],
    relatedTopics: ['classes', 'experience-progression']
  },
  'leveling-up': {
    title: 'How Leveling Up Works',
    shortDescription: 'Gaining experience points and advancing your character.',
    fullDescription: 'You gain experience points (XP) by defeating enemies, solving puzzles, and completing quests. When you accumulate enough XP (depends on your level), you level up. Leveling up increases your proficiency bonus (at levels 5, 9, 13, 17), gives you new class features, increases spell slots, and increases your hit points.',
    examples: ['Defeat 5 enemies: gain 300 XP', 'Reach 300 XP total: level up to level 2', 'Level 2 Wizard: gain new spell slot, proficiency bonus still +2'],
    relatedTopics: ['experience-points', 'class-features', 'ability-score-improvements']
  },
  'experience-points': {
    title: 'What Are Experience Points (XP)?',
    shortDescription: 'Points gained by defeating enemies and completing tasks.',
    fullDescription: 'You earn XP by defeating enemies (based on their difficulty), completing quests, and solving puzzles. The more powerful the enemy, the more XP. As you level up, you need more total XP to reach the next level. Tracking is simple: DM awards XP, you track it, and when you hit the threshold, you level up.',
    examples: ['Easy enemy: 50 XP', 'Medium enemy: 200 XP', 'Hard boss: 800 XP', 'Solving a puzzle: 100-300 XP depending on difficulty'],
    relatedTopics: ['leveling-up', 'difficulty-rating']
  },
  'actions-per-turn': {
    title: 'What Can You Do Per Turn?',
    shortDescription: 'In combat, you get one action, one bonus action, and movement per turn.',
    fullDescription: 'Each turn in combat, you get: one action (attack, cast a spell, use an ability), one bonus action (if available from spells/abilities), movement (usually 30 feet), and a reaction (interrupt someone else\'s turn). You can do things in any order but can\'t change your move after using your action.',
    examples: ['Action: Attack with a weapon', 'Bonus action: use Cunning Action to hide (Rogue ability)', 'Movement: move 30 feet', 'Reaction: use Shield spell when hit to increase AC'],
    relatedTopics: ['combat', 'turn-order', 'bonus-actions']
  },
  'bonus-actions': {
    title: 'What Are Bonus Actions?',
    shortDescription: 'Faster actions available in combat if granted by spells or abilities.',
    fullDescription: 'A bonus action is a faster action available on your turn if a spell, class feature, or magic item grants it. You can use your bonus action on your turn even if you\'ve already used your action. If you use a bonus action action (like a bonus action spell), you can\'t cast a bonus action and an action spell in the same turn.',
    examples: ['Rogue: Cunning Action to Disengage as bonus action', 'Bonus action spells: Healing Word, Spiritual Weapon', 'Two-weapon fighting: attack with off-hand weapon as bonus action'],
    relatedTopics: ['actions-per-turn', 'spellcasting']
  },
  'reactions': {
    title: 'What Are Reactions?',
    shortDescription: 'Actions you can take outside your turn in response to events.',
    fullDescription: 'A reaction is an action you can take when someone else acts or something happens. You can take one reaction per turn (your turns and others\' turns). Most characters have basic reactions (like opportunity attacks), but spells and abilities add special reactions. For example, the Shield spell can be cast as a reaction when you\'re about to be hit.',
    examples: ['Opportunity attack: attack an enemy that leaves your reach', 'Shield spell: cast when targeted by an attack to increase AC', 'Counterspell: counter another spellcaster\'s spell'],
    relatedTopics: ['actions-per-turn', 'combat', 'spellcasting']
  },
  'combat': {
    title: 'How Combat Works',
    shortDescription: 'Turn-based combat system with initiative, actions, and attacks.',
    fullDescription: 'Combat is turn-based. Everyone rolls initiative (d20 + Dexterity modifier). Highest goes first. On your turn: declare action (attack, spell, ability), roll to hit (d20 + modifiers), roll damage if hit. Use movement to move up to your speed. After everyone takes a turn, the round ends and you start a new round. Combat continues until enemies are defeated or flee.',
    examples: ['Initiative: roll d20 + 3 (Dexterity), get 18 total (you go early)', 'Your turn: move 30 feet closer, attack with longsword (hit!), roll damage', 'Enemy turn: move and attack you', 'Next round: repeat until combat ends'],
    relatedTopics: ['initiative', 'attack-rolls', 'actions-per-turn', 'turn-order']
  },
  'initiative': {
    title: 'What Is Initiative?',
    shortDescription: 'Roll to determine combat turn order.',
    fullDescription: 'When combat starts, everyone rolls initiative: d20 + Dexterity modifier. Highest result goes first. Initiative determines the order of turns throughout combat. Some creatures might go multiple times per round (legendary actions), or you might have abilities that let you go again (haste, action surge).',
    examples: ['Roll d20 + 3, get 18: you go early in combat', 'Enemy rolls d20 + 1, gets 12: you go before them', 'Rogue with Cunning Action can act again in some situations'],
    relatedTopics: ['combat', 'turn-order', 'dexterity']
  },
  'turn-order': {
    title: 'What Is Turn Order?',
    shortDescription: 'The sequence of who acts in combat based on initiative.',
    fullDescription: 'After rolling initiative, DM arranges everyone in order from highest to lowest initiative. This is the turn order. Each turn, the next person in order takes their turn. After everyone has taken a turn once, it\'s a new round and it starts over from the top.',
    examples: ['Player 1 (18), Enemy 1 (16), Player 2 (14), Enemy 2 (8): that\'s the turn order', 'Everyone takes one turn, then back to Player 1', 'If someone dies, skip them in the order'],
    relatedTopics: ['initiative', 'combat', 'rounds']
  },
  'death-saves': {
    title: 'What Are Death Saves?',
    shortDescription: 'Saving throws you make when at 0 HP - survive three successes before three failures.',
    fullDescription: 'When you reach 0 HP, you fall unconscious and start making death saves. On your turn, roll d20 (no modifiers). 10+ is a success, 9 or less is a failure. Nat 20 restores 1 HP and you stand up. Nat 1 counts as two failures. After three successes, you stabilize at 0 HP. After three failures, you die. Healing immediately ends death saves.',
    examples: ['Fail death save: 1 failure', 'Success on next turn: 1 success', 'Get healed: you\'re conscious again, death saves reset', 'Three failures: you die permanently'],
    relatedTopics: ['hit-points', 'healing']
  },
  'resting': {
    title: 'How Resting Works',
    shortDescription: 'Short rests (1 hour) and long rests (8 hours) recover resources.',
    fullDescription: 'A short rest is 1 hour of inactivity. During a short rest, you can spend hit dice to heal. A long rest is 8 hours of sleep. After a long rest: you recover all HP, all spell slots, and recover half your max hit dice (rounded up). You can only benefit from one long rest per 24 hours.',
    examples: ['After combat: take a short rest, spend some hit dice to heal', 'After long rest: full HP, full spell slots, ready for the day', 'During day: one short rest possible, one long rest per 24 hours'],
    relatedTopics: ['hit-points', 'healing', 'spell-slots']
  },
  'feats': {
    title: 'What Are Feats?',
    shortDescription: 'Special abilities you can take instead of ability score improvements.',
    fullDescription: 'Feats are powerful options you can take at levels 4, 8, 12, 16, 19 instead of increasing ability scores. Feats grant new capabilities like Extra Attack, Polearm Master, Sentinel, Tavern Brawler. Some feats have prerequisites (you need certain ability scores or proficiencies). Each feat is unique and powerful.',
    examples: ['Polearm Master: attack with polearm as bonus action', 'Sentinel: enemies have disadvantage leaving your reach', 'Tavern Brawler: use improvised weapons, make unarmed strikes without hands'],
    relatedTopics: ['ability-score-improvements', 'class-features']
  },
  'weapons': {
    title: 'How Weapons Work',
    shortDescription: 'Different weapons have different properties and damage.',
    fullDescription: 'Weapons come in two categories: melee (swords, axes, etc.) and ranged (bows, crossbows). Each weapon has: a damage die (d4, d6, d8, d10, d12), damage type (slashing, piercing, bludgeoning, etc.), and properties (heavy, light, versatile, range, etc.). Heavier weapons do more damage but are slower. Lighter weapons are faster but weaker.',
    examples: ['Longsword: 1d8 damage, versatile (1d10 if two-handed)', 'Dagger: 1d4 damage, light (can use two)', 'Bow: 1d8 damage, ranged, ammunition'],
    relatedTopics: ['armor', 'proficiency', 'damage']
  },
  'armor': {
    title: 'How Armor Works',
    shortDescription: 'Armor increases AC but might impose penalties.',
    fullDescription: 'Armor provides protection by increasing your AC. Light armor doesn\'t restrict you; add Dexterity to AC. Medium armor caps Dexterity bonus (+2); don\'t add full Dexterity. Heavy armor has set AC with no Dexterity bonus. Heavy armor has Strength requirements. Wearing armor you\'re not trained in imposes disadvantage on physical checks.',
    examples: ['No armor: AC 10 + Dexterity', 'Leather (light): AC 11 + Dexterity', 'Chainmail (heavy): AC 16 (no Dex added, requires Strength 13)'],
    relatedTopics: ['armor-class', 'weapons']
  },
  'downtime': {
    title: 'What Is Downtime?',
    shortDescription: 'Free time between adventures where you can do activities.',
    fullDescription: 'Downtime is non-adventuring time (days, weeks, months). You can spend downtime days training new skills, creating magic items, recovering from injuries, researching, or carousing. Each activity takes a certain number of downtime days and might require skill checks.',
    examples: ['Research ancient lore: 10 downtime days, Intelligence check', 'Learn a language: 250 downtime days (about 1 year)', 'Carousing: spend gold, gain contacts and rumors'],
    relatedTopics: ['background-features', 'crafting']
  },
  'difficulty-rating': {
    title: 'What Is Difficulty Rating (CR)?',
    shortDescription: 'Enemy power level - CR 1 is novice, CR 20+ is world-ending.',
    fullDescription: 'Each enemy has a Challenge Rating (CR). A CR equal to your level is "balanced". CR higher than your level is harder. CR lower is easier. For example, a CR 3 monster is appropriate for a party of level 3 characters. CR scales exponentially - CR 5 is much harder than CR 3.',
    examples: ['CR 1: Bandit, appropriate for level 1 party', 'CR 5: Basilisk, challenging for level 5 party', 'CR 20: Ancient dragon, deadly threat for entire high-level party'],
    relatedTopics: ['experience-points', 'combat']
  },
  'personality': {
    title: 'What Is Personality?',
    shortDescription: 'Your character\'s personality traits, ideals, bonds, and flaws.',
    fullDescription: 'Your character has personality traits (mannerisms), ideals (what you believe), bonds (connections to people/places), and flaws (weaknesses). These define your roleplay. Your background often suggests personality elements. Some DMs might reward you for playing your flaws or ideals.',
    examples: ['Trait: I\'m sarcastic and crack jokes', 'Ideal: I believe freedom is above all', 'Bond: I owe my life to the tavern keeper who saved me', 'Flaw: I get angry when people insult my family'],
    relatedTopics: ['backgrounds', 'roleplay']
  }
};

export const GUIDE_TERMINOLOGY = {
  'AC': { term: 'Armor Class', definition: 'Your defense rating - how hard you are to hit' },
  'ASI': { term: 'Ability Score Improvement', definition: 'Bonus at levels 4, 8, 12, 16, 19 to increase abilities or gain feats' },
  'CR': { term: 'Challenge Rating', definition: 'Enemy difficulty level' },
  'd20': { term: 'd20 Die', definition: '20-sided die - rolled for checks, attacks, saves' },
  'DC': { term: 'Difficulty Class', definition: 'Target number you need to roll to succeed at a task' },
  'DM': { term: 'Dungeon Master', definition: 'The person running the game, controlling enemies and NPCs' },
  'HP': { term: 'Hit Points', definition: 'Your health - at 0, you fall unconscious' },
  'initiative': { term: 'Initiative', definition: 'Roll to determine combat turn order' },
  'NPC': { term: 'Non-Player Character', definition: 'Characters controlled by the DM' },
  'PC': { term: 'Player Character', definition: 'Characters controlled by players' },
  'proficiency': { term: 'Proficiency', definition: 'Training in a skill, weapon, or save - add proficiency bonus' },
  'XP': { term: 'Experience Points', definition: 'Points earned by defeating enemies and completing tasks' }
};

export const GUIDE_PAGE_GUIDES = {
  'level-selector': {
    title: 'New to D&D? Start Here!',
    tips: [
      'Level 1 is best for new players',
      'Higher levels get more hit points and abilities',
      'At levels 4, 8, 12, 16, 19 you get to improve abilities'
    ],
    relatedTopics: ['leveling-up', 'experience-points']
  },
  'role-selector': {
    title: 'Choose Your Role',
    tips: [
      'Warrior: Deal and take damage',
      'Mage: Cast powerful spells',
      'Healer: Keep allies alive',
      'Rogue: Sneak and strike with precision'
    ],
    relatedTopics: ['classes', 'combat']
  },
  'class-selector': {
    title: 'Choose Your Class',
    tips: [
      'Your class determines your combat style and abilities',
      'Each class has unique powers that define your playstyle',
      'You\'ll choose a specialization (subclass) at level 3'
    ],
    relatedTopics: ['classes', 'subclasses', 'class-features']
  },
  'race-selector': {
    title: 'Choose Your Race',
    tips: [
      'Your race gives ability score bonuses and special traits',
      'Races have different sizes, speeds, and appearances',
      'Some races have innate magical abilities'
    ],
    relatedTopics: ['races', 'racial-traits', 'ability-scores']
  },
  'background-selector': {
    title: 'Choose Your Background',
    tips: [
      'Your background determines your past profession',
      'Backgrounds grant skill proficiencies and tools',
      'Your background feature can be useful in roleplay and downtime'
    ],
    relatedTopics: ['backgrounds', 'skills', 'background-features']
  },
  'ability-score-guide': {
    title: 'Optimize Your Abilities',
    tips: [
      'Put your highest score in your primary ability',
      'Constitution (HP) is important for everyone',
      'You can improve abilities with ASI at certain levels'
    ],
    relatedTopics: ['ability-scores', 'modifiers', 'ability-score-improvements']
  }
};
