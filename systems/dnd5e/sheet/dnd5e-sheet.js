/**
 * D&D 5e Character Sheet - Post-Apocalyptic Axyum Theme
 * Custom character sheet with Axyum post-apocalyptic aesthetic
 */

import { Dnd5eActorAdapter } from '../adapter/dnd5e-actor-adapter.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class Dnd5eCharacterSheet extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: 'dnd5e-character-sheet',
    tag: 'div',
    window: {
      title: 'Character Sheet (Axyum Theme)',
      icon: 'fa-solid fa-user',
      resizable: true,
      minimizable: true
    },
    classes: ['ld-axyum-sheet', 'dnd5e-sheet', 'axyum-post-apocalyptic'],
    position: { width: 900, height: 700 },
    actions: {
      editAbility: Dnd5eCharacterSheet.prototype._onEditAbility,
      rollAbility: Dnd5eCharacterSheet.prototype._onRollAbility,
      rollSkill: Dnd5eCharacterSheet.prototype._onRollSkill,
      rollSavingThrow: Dnd5eCharacterSheet.prototype._onRollSavingThrow,
      toggleProficiency: Dnd5eCharacterSheet.prototype._onToggleProficiency,
      editHitPoints: Dnd5eCharacterSheet.prototype._onEditHitPoints,
      rollHitDie: Dnd5eCharacterSheet.prototype._onRollHitDie
    }
  };

  static PARTS = {
    main: { template: 'modules/ld-axyum/systems/dnd5e/sheet/dnd5e-sheet.hbs' }
  };

  constructor(actor, options = {}) {
    super(options);
    this.actor = actor;
    this.system = actor.system;
  }

  // ===== CONTEXT PREPARATION =====

  async _prepareContext(options) {
    const context = {
      actor: this.actor,
      system: this.system,
      abilities: this._prepareAbilities(),
      skills: this._prepareSkills(),
      combat: this._prepareCombat(),
      spellcasting: this._prepareSpellcasting(),
      equipment: this._prepareEquipment(),
      features: this._prepareFeatures(),
      biography: this._prepareBiography()
    };

    return context;
  }

  /**
   * Prepare ability scores for display
   * @returns {Object} Formatted abilities
   * @private
   */
  _prepareAbilities() {
    const abilities = {};
    const abilityNames = {
      str: 'Strength',
      dex: 'Dexterity',
      con: 'Constitution',
      int: 'Intelligence',
      wis: 'Wisdom',
      cha: 'Charisma'
    };

    for (const [key, name] of Object.entries(abilityNames)) {
      const score = this.system.abilities[key]?.value || 10;
      const modifier = Math.floor((score - 10) / 2);

      abilities[key] = {
        name,
        score,
        modifier: modifier >= 0 ? `+${modifier}` : modifier,
        savingThrow: this.system.abilities[key]?.proficient ? modifier : null
      };
    }

    return abilities;
  }

  /**
   * Prepare skills for display
   * @returns {Array} Formatted skills
   * @private
   */
  _prepareSkills() {
    const skills = [];
    const skillDefinitions = {
      acr: { name: 'Acrobatics', ability: 'dex' },
      ani: { name: 'Animal Handling', ability: 'wis' },
      arc: { name: 'Arcana', ability: 'int' },
      ath: { name: 'Athletics', ability: 'str' },
      dec: { name: 'Deception', ability: 'cha' },
      his: { name: 'History', ability: 'int' },
      ins: { name: 'Insight', ability: 'wis' },
      itm: { name: 'Intimidation', ability: 'cha' },
      inv: { name: 'Investigation', ability: 'int' },
      med: { name: 'Medicine', ability: 'wis' },
      nat: { name: 'Nature', ability: 'int' },
      prc: { name: 'Perception', ability: 'wis' },
      prf: { name: 'Performance', ability: 'cha' },
      per: { name: 'Persuasion', ability: 'cha' },
      rel: { name: 'Religion', ability: 'int' },
      slt: { name: 'Sleight of Hand', ability: 'dex' },
      ste: { name: 'Stealth', ability: 'dex' },
      sur: { name: 'Survival', ability: 'wis' }
    };

    for (const [key, def] of Object.entries(skillDefinitions)) {
      const skill = this.system.skills[key] || { value: 0 };
      const abilityScore = this.system.abilities[def.ability]?.value ?? 10;
      const abilityMod = Math.floor((abilityScore - 10) / 2);
      const proficiencyBonus = skill.value * (this._getProficiencyBonus());
      const total = abilityMod + proficiencyBonus;

      skills.push({
        key,
        name: def.name,
        ability: def.ability.toUpperCase(),
        proficient: skill.value > 0,
        expertise: skill.value > 1,
        modifier: total >= 0 ? `+${total}` : total
      });
    }

    return skills;
  }

  /**
   * Prepare combat stats
   * @returns {Object} Combat data
   * @private
   */
  _prepareCombat() {
    return {
      hitPoints: {
        current: this.system.attributes.hp?.value || 0,
        max: this.system.attributes.hp?.max || 0,
        temp: this.system.attributes.hp?.temp || 0
      },
      armorClass: this._calculateAC(),
      initiative: this._calculateInitiative(),
      speed: this.system.attributes.movement?.walk || 30,
      hitDice: this.system.attributes.hitDice || '1d8'
    };
  }

  /**
   * Prepare spellcasting data
   * @returns {Object} Spellcasting data
   * @private
   */
  _prepareSpellcasting() {
    // Simplified spellcasting - expand as needed
    return {
      caster: this.system.details.spellcasting || false,
      level: this.system.details.spellLevel || 0,
      ability: this.system.attributes.spellcasting || 'int'
    };
  }

  /**
   * Prepare equipment
   * @returns {Array} Equipment items
   * @private
   */
  _prepareEquipment() {
    // Get items from actor
    return this.actor.items
      .filter(item => ['weapon', 'equipment', 'consumable', 'tool', 'loot'].includes(item.type))
      .map(item => ({
        name: item.name,
        type: item.type,
        quantity: item.system.quantity || 1,
        equipped: item.system.equipped || false
      }));
  }

  /**
   * Prepare features and traits
   * @returns {Object} Features data
   * @private
   */
  _prepareFeatures() {
    return {
      race: this.system.details.race?.name || '',
      background: this.system.details.background?.name || '',
      classes: Object.entries(this.system.classes || {}).map(([id, cls]) => ({
        name: cls.name,
        level: cls.level
      }))
    };
  }

  /**
   * Prepare biography
   * @returns {Object} Biography data
   * @private
   */
  _prepareBiography() {
    return {
      personality: this.system.details.biography?.value || '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: this.system.details.biography?.public || ''
    };
  }

  /**
   * Calculate Armor Class
   * @returns {number} AC value
   * @private
   */
  _calculateAC() {
    // Simplified AC calculation - expand for full armor system
    const dexScore = this.system.abilities.dex?.value ?? 10;
    return 10 + Math.floor((dexScore - 10) / 2);
  }

  /**
   * Calculate initiative modifier
   * @returns {string} Initiative modifier
   * @private
   */
  _calculateInitiative() {
    const dexScore = this.system.abilities.dex?.value ?? 10;
    const dexMod = Math.floor((dexScore - 10) / 2);
    const modifier = dexMod >= 0 ? `+${dexMod}` : dexMod;
    return modifier;
  }

  /**
   * Get proficiency bonus
   * @returns {number} Proficiency bonus
   * @private
   */
  _getProficiencyBonus() {
    const level = Object.values(this.system.classes || {}).reduce((sum, cls) => sum + (cls.level || 0), 0);
    return Math.ceil(level / 4) + 1;
  }

  // ===== EVENT HANDLERS =====

  async _onEditAbility(event, target) {
    const ability = target.dataset.ability;
    const currentValue = this.system.abilities[ability]?.value || 10;

    const newValue = await this._promptNumber('Edit Ability Score', currentValue, 3, 20);
    if (newValue !== null && newValue !== currentValue) {
      await this.actor.update({
        [`system.abilities.${ability}.value`]: newValue
      });
      this.render();
    }
  }

  async _onRollAbility(event, target) {
    const ability = target.dataset.ability;
    const abilityScore = this.system.abilities[ability]?.value ?? 10;
    const modifier = Math.floor((abilityScore - 10) / 2);

    const roll = new Roll('1d20 + @mod', { mod: modifier });
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${ability.toUpperCase()} Ability Check`
    });
  }

  async _onRollSkill(event, target) {
    const skill = target.dataset.skill;
    const skillData = this.system.skills[skill];
    if (!skillData) return;

    const ability = this._getSkillAbility(skill);
    const abilityScore = this.system.abilities[ability]?.value ?? 10;
    const abilityMod = Math.floor((abilityScore - 10) / 2);
    const proficiencyBonus = skillData.value * this._getProficiencyBonus();
    const modifier = abilityMod + proficiencyBonus;

    const roll = new Roll('1d20 + @mod', { mod: modifier });
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${skill} Skill Check`
    });
  }

  async _onRollSavingThrow(event, target) {
    const ability = target.dataset.ability;
    const proficient = this.system.abilities[ability]?.proficient || false;
    const abilityScore = this.system.abilities[ability]?.value ?? 10;
    const abilityMod = Math.floor((abilityScore - 10) / 2);
    const proficiencyBonus = proficient ? this._getProficiencyBonus() : 0;
    const modifier = abilityMod + proficiencyBonus;

    const roll = new Roll('1d20 + @mod', { mod: modifier });
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${ability.toUpperCase()} Saving Throw`
    });
  }

  async _onToggleProficiency(event, target) {
    const type = target.dataset.type; // 'skill' or 'save'
    const key = target.dataset.key;

    let currentValue = 0;
    if (type === 'skill') {
      currentValue = this.system.skills[key]?.value || 0;
    } else if (type === 'save') {
      currentValue = this.system.abilities[key]?.proficient ? 1 : 0;
    }

    const newValue = currentValue > 0 ? 0 : 1;

    if (type === 'skill') {
      await this.actor.update({
        [`system.skills.${key}.value`]: newValue
      });
    } else if (type === 'save') {
      await this.actor.update({
        [`system.abilities.${key}.proficient`]: newValue > 0
      });
    }

    this.render();
  }

  async _onEditHitPoints(event, target) {
    const type = target.dataset.type; // 'current', 'max', 'temp'
    const currentValue = this.system.attributes.hp?.[type] || 0;

    const newValue = await this._promptNumber(`Edit ${type.charAt(0).toUpperCase() + type.slice(1)} HP`, currentValue, 0, 999);
    if (newValue !== null) {
      await this.actor.update({
        [`system.attributes.hp.${type}`]: newValue
      });
      this.render();
    }
  }

  async _onRollHitDie(event, target) {
    const hitDie = this.system.attributes.hitDice || '1d8';
    const roll = new Roll(hitDie);
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: 'Hit Die Recovery'
    });
  }

  // ===== UTILITY METHODS =====

  /**
   * Get the ability associated with a skill
   * @param {string} skill - Skill key
   * @returns {string} Ability key
   * @private
   */
  _getSkillAbility(skill) {
    const skillAbilities = {
      acr: 'dex', ani: 'wis', arc: 'int', ath: 'str', dec: 'cha',
      his: 'int', ins: 'wis', itm: 'cha', inv: 'int', med: 'wis',
      nat: 'int', prc: 'wis', prf: 'cha', per: 'cha', rel: 'int',
      slt: 'dex', ste: 'dex', sur: 'wis'
    };
    return skillAbilities[skill] || 'str';
  }

  /**
   * Prompt user for a number input
   * @param {string} title - Dialog title
   * @param {number} defaultValue - Default value
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {Promise<number|null>} Entered value or null if cancelled
   * @private
   */
  async _promptNumber(title, defaultValue, min = 0, max = 100) {
    return new Promise(resolve => {
      const dialog = new Dialog({
        title,
        content: `
          <div style="margin: 1rem 0;">
            <input type="number" id="number-input" value="${defaultValue}" min="${min}" max="${max}" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        buttons: {
          ok: {
            label: 'OK',
            callback: (html) => {
              const root = html instanceof HTMLElement ? html : (html?.[0] ?? html?.element ?? html ?? null);
              const input = root?.querySelector?.('#number-input');
              const value = parseInt(input?.value || '', 10);
              resolve(isNaN(value) ? null : Math.clamp(value, min, max));
            }
          },
          cancel: {
            label: 'Cancel',
            callback: () => resolve(null)
          }
        },
        default: 'ok'
      });
      dialog.render(true);
    });
  }
}

export { Dnd5eCharacterSheet };
