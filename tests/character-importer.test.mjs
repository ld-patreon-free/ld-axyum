import assert from 'node:assert/strict';
import test from 'node:test';
import { CharacterImporter } from '../core/character-importer.js';

function makeActor(overrides = {}) {
  const updates = [];
  const flags = {};
  const createdDocuments = [];
  return {
    name: 'Existing Actor',
    id: 'actor1',
    items: [],
    system: { details: {}, abilities: {} },
    async update(data) {
      updates.push(data);
      return data;
    },
    async setFlag(scope, key, value) {
      flags[scope] = flags[scope] || {};
      flags[scope][key] = value;
      return value;
    },
    async createEmbeddedDocuments(type, docs) {
      createdDocuments.push({ type, docs });
      return docs;
    },
    _updates: updates,
    _flags: flags,
    _createdDocuments: createdDocuments,
    ...overrides
  };
}

const minimalValidImport = {
  character: { name: 'Test Hero' },
  abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
};

test('importCharacter accepts minimal valid data and fills defaults', () => {
  const result = CharacterImporter.importCharacter(minimalValidImport);
  assert.equal(result.success, true);
  assert.equal(result.data.character.name, 'Test Hero');
  assert.deepEqual(result.data.items, []);
  assert.equal(result.summary.characterName, 'Test Hero');
});

test('importCharacter rejects missing character name', () => {
  const result = CharacterImporter.importCharacter({ abilities: { str: 10 } });
  assert.equal(result.success, false);
  assert.match(result.error, /Character name is required/);
});

test('importCharacter rejects out-of-range ability scores and attaches details', () => {
  const result = CharacterImporter.importCharacter({
    character: { name: 'Bad Stats' },
    abilities: { str: 99 }
  });
  assert.equal(result.success, false);
  assert.match(result.error, /Invalid ability score for STR/);
  assert.deepEqual(result.details, { ability: 'str', score: 99 });
});

test('applyImportToActor does not throw on a minimal import missing optional sections', async () => {
  const actor = makeActor();
  const result = await CharacterImporter.applyImportToActor(minimalValidImport, actor);
  assert.equal(result.success, true);
  assert.equal(actor._updates.length, 1);
  assert.equal(actor._updates[0].system.attributes.hp.value, 0);
  assert.equal(actor._updates[0].system.attributes.hp.max, 1);
  assert.deepEqual(actor._updates[0].system.traits.armorProf.value, []);
});

test('applyImportToActor applies hit points, proficiencies, and multiclass when present', async () => {
  const actor = makeActor();
  const importData = {
    character: { name: 'Full Hero', level: 5 },
    abilities: { str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 8 },
    hitPoints: { value: 40, max: 44, temp: 2 },
    proficiencies: { armor: ['light', 'medium'], weapons: ['simple'] },
    class: { multiclass: { active: true, classes: ['fighter', 'rogue'] } }
  };

  const result = await CharacterImporter.applyImportToActor(importData, actor);
  assert.equal(result.success, true);
  assert.equal(actor._updates[0].system.attributes.hp.value, 40);
  assert.deepEqual(actor._updates[0].system.traits.armorProf.value, ['light', 'medium']);
  assert.equal(actor._flags['ld-axyum'].isMulticlass, true);
});

test('applyImportToActor imports items and spells', async () => {
  const actor = makeActor();
  const importData = {
    character: { name: 'Loaded Hero' },
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    items: [{ name: 'Longsword', type: 'weapon' }],
    spells: { cantrips: [{ name: 'Fire Bolt', level: 0 }] }
  };

  await CharacterImporter.applyImportToActor(importData, actor);
  assert.equal(actor._createdDocuments.length, 2);
  assert.equal(actor._createdDocuments[0].docs[0].name, 'Longsword');
  assert.equal(actor._createdDocuments[1].docs[0].name, 'Fire Bolt');
});

test('loadFromString rejects malformed JSON', () => {
  assert.throws(() => CharacterImporter.loadFromString('{not json'), /Failed to parse JSON/);
});

test('compareWithActor flags name and level differences', () => {
  const actor = makeActor({
    name: 'Old Name',
    system: { details: { level: 3 }, abilities: { str: 10 } }
  });
  const importData = {
    character: { name: 'New Name', level: 5 },
    abilities: { str: 14 }
  };

  const comparison = CharacterImporter.compareWithActor(importData, actor);
  assert.equal(comparison.differences.some((d) => d.field === 'Character Name'), true);
  assert.equal(comparison.differences.some((d) => d.field === 'Level'), true);
});
