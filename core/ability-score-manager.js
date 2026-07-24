/**
 * AbilityScoreManager - Handles ability score rolling, assignment, and validation
 */
export class AbilityScoreManager {
  constructor() {
    this.rolledScores = {};
    this.diceBreakdowns = {};
    this.assignedAbilities = {};
    this.rolledPool = null;
    this.hasRolled = false;      // Track if initial roll has been done
    this.hasRerolled = false;    // Track if reroll has been used (limit: 1)
  }

  rollAbilityScore() {
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => b - a);
    const kept = rolls.slice(0, 3);
    const dropped = rolls[3];
    return {
      total: kept.reduce((sum, val) => sum + val, 0),
      breakdown: rolls.join(', '),
      kept: kept,
      dropped: dropped
    };
  }

  rollAllAbilityScores() {
    // Check reroll limit: 1 initial roll + 1 reroll allowed
    if (this.hasRolled && this.hasRerolled) {
      console.warn('LD Axyum | Reroll limit reached - you must keep your current scores');
      return { scores: this.rolledScores, breakdowns: this.diceBreakdowns, rerollLimitReached: true };
    }
    
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const results = {};
    const breakdowns = {};

    abilities.forEach(ability => {
      const roll = this.rollAbilityScore();
      results[ability] = roll.total;
      breakdowns[ability] = roll.breakdown;
    });

    // Track roll state
    if (this.hasRolled) {
      this.hasRerolled = true;  // This was a reroll
    }
    this.hasRolled = true;

    this.rolledScores = results;
    this.diceBreakdowns = breakdowns;
    return { scores: results, breakdowns: breakdowns, rerollLimitReached: this.hasRerolled };
  }

  rollPoolScores(count = 6) {
    // Check reroll limit: 1 initial roll + 1 reroll allowed
    if (this.hasRolled && this.hasRerolled) {
      console.warn('LD Axyum | Reroll limit reached - you must keep your current scores');
      return this.rolledPool;
    }
    
    const pool = [];
    for (let i = 0; i < count; i++) {
      const roll = this.rollAbilityScore();
      pool.push({
        value: roll.total,
        breakdown: roll.breakdown,
        assigned: false
      });
    }
    
    // Track roll state
    if (this.hasRolled) {
      this.hasRerolled = true;  // This was a reroll
    }
    this.hasRolled = true;
    
    this.rolledPool = pool.sort((a, b) => b.value - a.value);
    return this.rolledPool;
  }

  assignScore(ability, score) {
    this.assignedAbilities[ability] = score;
  }

  getAssignedScore(ability) {
    return this.assignedAbilities[ability] || null;
  }

  clearAssignments() {
    this.assignedAbilities = {};
    if (this.rolledPool) {
      this.rolledPool.forEach(score => score.assigned = false);
    }
  }

  isScoreAssigned(score) {
    return Object.values(this.assignedAbilities).includes(score);
  }

  getUnassignedScores() {
    if (!this.rolledPool) return [];
    return this.rolledPool.filter(score => !score.assigned);
  }

  validateStandardArray(scores) {
    const standardArray = [15, 14, 13, 12, 10, 8];
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    return JSON.stringify(sortedScores) === JSON.stringify(standardArray);
  }

  validatePointBuy(scores) {
    const costs = {
      8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    let totalCost = 0;
    for (const score of Object.values(scores)) {
      if (score < 8 || score > 15) return false;
      totalCost += costs[score];
    }
    return totalCost === 27;
  }

  calculateModifier(score) {
    return Math.floor((score - 10) / 2);
  }

  getAbilityModifiers(scores) {
    const modifiers = {};
    for (const [ability, score] of Object.entries(scores)) {
      modifiers[ability] = this.calculateModifier(score);
    }
    return modifiers;
  }

  getStandardArrayScores() {
    return {
      options: [15, 14, 13, 12, 10, 8],
      description: 'Assign these scores to your abilities'
    };
  }

  getPointBuyRules() {
    return {
      pointsTotal: 27,
      minScore: 8,
      maxScore: 15,
      costs: {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
      }
    };
  }

  getRolledScores() {
    return this.rolledScores;
  }

  getDiceBreakdowns() {
    return this.diceBreakdowns;
  }

  getAssignedAbilities() {
    return this.assignedAbilities;
  }

  getRolledPool() {
    return this.rolledPool;
  }

  // Check if reroll is available (limit: 1 reroll)
  canReroll() {
    return !this.hasRerolled;
  }

  // Check if any roll has been made
  hasRolledOnce() {
    return this.hasRolled;
  }

  // Get reroll status for UI
  getRerollStatus() {
    return {
      hasRolled: this.hasRolled,
      hasRerolled: this.hasRerolled,
      canReroll: this.hasRolled && !this.hasRerolled,
      rerollsRemaining: this.hasRerolled ? 0 : 1
    };
  }

  reset() {
    this.rolledScores = {};
    this.diceBreakdowns = {};
    this.assignedAbilities = {};
    this.rolledPool = null;
    this.hasRolled = false;
    this.hasRerolled = false;
  }
}
