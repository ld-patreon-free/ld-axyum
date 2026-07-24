/**
 * LD Axyum - Multiclass Character Utilities
 * 
 * Utilities for multiclass character validation and migration.
 * Extracted from character-model.js for LD protocol compliance.
 * 
 * Supports Phase 2 (single-class) to Phase 3a (multiclass) migration.
 */

import { CHARACTER_DEFAULTS } from './character-defaults.js';

export class MulticlassUtils {
  /**
   * Validate multiclass character data
   * @param {Object} characterData - Character with classes array
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  static validateMulticlass(characterData) {
    const errors = [];

    if (!characterData.classes || !Array.isArray(characterData.classes)) {
      errors.push('Character must have classes array');
      return { valid: false, errors };
    }

    if (characterData.classes.length === 0) {
      errors.push('Character must have at least one class');
    }

    // Validate total level doesn't exceed 20
    const totalLevel = characterData.classes.reduce((sum, cls) => sum + (cls.level || 1), 0);
    if (totalLevel > 20) {
      errors.push(`Total level (${totalLevel}) cannot exceed 20`);
    }

    if (totalLevel < 1) {
      errors.push('Total level must be at least 1');
    }

    // Validate each class entry
    for (let i = 0; i < characterData.classes.length; i++) {
      const cls = characterData.classes[i];
      
      if (!cls.id || !cls.name) {
        errors.push(`Class ${i + 1}: id and name are required`);
      }

      if (!Number.isInteger(cls.level) || cls.level < 1 || cls.level > 20) {
        errors.push(`Class ${i + 1} level must be between 1 and 20`);
      }

      // Check for duplicate classes (not allowed)
      const duplicates = characterData.classes.filter(c => c.id === cls.id && c.id !== null);
      if (duplicates.length > 1) {
        errors.push(`Cannot have duplicate class: ${cls.name}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Migrate Phase 2 single-class character to Phase 3 multiclass format
   * Automatically called during normalization for backward compatibility
   * @param {Object} characterData - Phase 2 character data
   * @returns {Object} Updated character data with multiclass support
   */
  static migrateToMulticlass(characterData) {
    if (!characterData) {
      return JSON.parse(JSON.stringify(CHARACTER_DEFAULTS));
    }

    // If already has classes array, return as-is
    if (Array.isArray(characterData.classes) && characterData.classes.length > 0) {
      return characterData;
    }

    // Migrate from Phase 2 single class to multiclass
    const migrated = {
      ...characterData,
      isMulticlass: false,
      classes: []
    };

    // If has Phase 2 class data, convert to classes array
    if (characterData.class && characterData.class.id) {
      migrated.classes = [
        {
          id: characterData.class.id,
          name: characterData.class.name,
          subclass: characterData.class.subclass || null,
          level: characterData.class.level || 1
        }
      ];
    } else if (!characterData.classes || characterData.classes.length === 0) {
      // Fallback: default to level 1 wizard if no class data exists
      migrated.classes = [
        {
          id: 'dnd5e.class.wizard',
          name: 'Wizard',
          subclass: null,
          level: 1
        }
      ];
    }

    // Initialize feats array if missing (for Phase 3b compatibility)
    if (!Array.isArray(migrated.feats)) {
      migrated.feats = [];
    }

    return migrated;
  }

  /**
   * Get total character level across all classes
   * @param {Object} characterData - Character data
   * @returns {number} Total level
   */
  static getTotalLevel(characterData) {
    if (!characterData || !characterData.classes) {
      return 1;
    }
    return characterData.classes.reduce((sum, cls) => sum + (cls.level || 1), 0);
  }

  /**
   * Get primary class (first class in array)
   * @param {Object} characterData - Character data
   * @returns {Object} Primary class object or null
   */
  static getPrimaryClass(characterData) {
    if (!characterData || !characterData.classes || characterData.classes.length === 0) {
      return null;
    }
    return characterData.classes[0];
  }
}
