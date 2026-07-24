/**
 * RollTableManager - Handles rolling on personality/background tables
 */
export class RollTableManager {
  constructor() {
    this.tableFiles = {
      'personality-traits': 'modules/ld-axyum/roll tables/fvtt-RollTable-personality-traits-A2zF7IacZHOmVyvB.json',
      'ideals': 'modules/ld-axyum/roll tables/fvtt-RollTable-ideals-58IC3OPRxEhdUfya.json',
      'bonds': 'modules/ld-axyum/roll tables/fvtt-RollTable-bonds-EpusEUNIYhvotFhq.json',
      'flaws': 'modules/ld-axyum/roll tables/fvtt-RollTable-flaws-l8OXlgOtVlR5TubX.json'
    };
  }

  async rollOnTable(tableName) {
    try {
      const tableFile = this.tableFiles[tableName];
      if (!tableFile) {
        console.error('LD Axyum | Unknown roll table:', tableName);
        return null;
      }

      const response = await fetch(tableFile);
      if (!response.ok) {
        console.error('LD Axyum | Failed to load roll table:', tableFile);
        return null;
      }

      const tableData = await response.json();
      
      const roll = Math.floor(Math.random() * 100) + 1;
      
      const result = tableData.results.find(r => {
        const [min, max] = r.range;
        return roll >= min && roll <= max;
      });

      if (result) {
        if (ui && ui.notifications) {
          ui.notifications.info(`Rolled ${roll} on ${tableData.name}`);
        }
        return result.description;
      }

      return null;
    } catch (err) {
      console.error('LD Axyum | Error rolling on table:', err);
      if (ui && ui.notifications) {
        ui.notifications.error('Failed to roll on table');
      }
      return null;
    }
  }

  async rollPersonalityTrait() {
    return await this.rollOnTable('personality-traits');
  }

  async rollIdeal() {
    return await this.rollOnTable('ideals');
  }

  async rollBond() {
    return await this.rollOnTable('bonds');
  }

  async rollFlaw() {
    return await this.rollOnTable('flaws');
  }

  async rollAllBiographyTraits() {
    const results = {};
    results.personalityTrait = await this.rollPersonalityTrait();
    results.ideal = await this.rollIdeal();
    results.bond = await this.rollBond();
    results.flaw = await this.rollFlaw();
    return results;
  }

  getAvailableTables() {
    return Object.keys(this.tableFiles);
  }

  hasTable(tableName) {
    return tableName in this.tableFiles;
  }
}
