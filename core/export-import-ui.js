/**
 * Export/Import UI Handler
 * Manages UI interactions for character export/import modals
 * Handles file uploads, JSON pasting, preview, and validation
 */

function getRootElement(element) {
  return element instanceof HTMLElement ? element : (element?.[0] ?? element?.element ?? element ?? null);
}

function getModalElement(root, selector) {
  return root?.querySelector(selector) ?? null;
}

class ExportImportUI {
  /**
   * Initialize export modal
   */
  static initializeExportModal(html, actor) {
    const root = getRootElement(html);
    const modal = getModalElement(root, '.export-modal');
    if (!modal) return;

    // Set character info
    const CharacterExporter = window.CharacterExporter || game.ldAxyum?.CharacterExporter;
    if (!CharacterExporter) {
      console.warn('CharacterExporter not found');
      return;
    }

    const exportSize = CharacterExporter.getExportSize(actor);
    const system = actor.system;

    modal.querySelector('.export-size')?.replaceChildren(document.createTextNode(String(exportSize)));
    modal._ldAxyumState = modal._ldAxyumState || {};
    modal._ldAxyumState.actor = actor;
    modal._ldAxyumState.exportSize = exportSize;

    // Export option clicks
    modal.querySelectorAll('.export-option').forEach(button => {
      button.addEventListener('click', () => {
        ExportImportUI._handleExportAction(button.dataset.action, actor, modal);
      });
    });

    // Close modal
    modal.querySelector('.close-modal')?.addEventListener('click', () => {
      modal.hidden = true;
      modal.style.display = 'none';
    });

    // Close on overlay click
    modal.querySelector('.modal-overlay')?.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        modal.hidden = true;
        modal.style.display = 'none';
      }
    });
  }

  /**
   * Handle export action
   */
  static _handleExportAction(action, actor, modal) {
    const CharacterExporter = window.CharacterExporter || game.ldAxyum?.CharacterExporter;
    if (!CharacterExporter) return;

    try {
      if (action === 'download') {
        CharacterExporter.downloadCharacterJSON(actor).then(result => {
          if (result.success) {
            ui.notifications.info(result.message);
            setTimeout(() => { modal.hidden = true; modal.style.display = 'none'; }, 500);
          } else {
            ui.notifications.error(result.error || 'Export failed');
          }
        });
      } else if (action === 'copy') {
        const jsonString = CharacterExporter.exportToString(actor);
        navigator.clipboard.writeText(jsonString).then(() => {
          ui.notifications.info(`Character exported to clipboard (${jsonString.length} characters)`);
          setTimeout(() => { modal.hidden = true; modal.style.display = 'none'; }, 500);
        }).catch(err => {
          ui.notifications.error('Failed to copy to clipboard');
          console.error(err);
        });
      }
    } catch (error) {
      ui.notifications.error(`Export error: ${error.message}`);
      console.error(error);
    }
  }

  /**
   * Initialize import modal
   */
  static initializeImportModal(html, actor) {
    const root = getRootElement(html);
    const modal = getModalElement(root, '.import-modal');
    if (!modal) return;

    modal._ldAxyumState = modal._ldAxyumState || {};
    modal._ldAxyumState.actor = actor;
    modal._ldAxyumState.importData = null;

    // Tab switching
    modal.querySelectorAll('.import-tab-btn').forEach(button => {
      button.addEventListener('click', () => {
        ExportImportUI._switchImportTab(modal, button.dataset.tab);
      });
    });

    // File drop zone
    const dropZone = modal.querySelector('.file-drop-zone');
    const fileInput = modal.querySelector('.file-input');

    dropZone?.addEventListener('click', () => {
      fileInput?.click();
    });

    dropZone?.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropZone.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
    });

    dropZone?.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = '';
    });

    dropZone?.addEventListener('drop', (event) => {
      event.preventDefault();
      dropZone.style.backgroundColor = '';
      const files = event.dataTransfer?.files || event.originalEvent?.dataTransfer?.files || [];
      if (files.length > 0) {
        ExportImportUI._handleFileSelect(files[0], modal);
      }
    });

    fileInput?.addEventListener('change', (event) => {
      const input = event.currentTarget;
      if (input.files.length > 0) {
        ExportImportUI._handleFileSelect(input.files[0], modal);
      }
    });

    // JSON paste
    modal.querySelector('.json-paste')?.addEventListener('input', (event) => {
      const json = event.currentTarget.value.trim();
      if (json) {
        ExportImportUI._validateAndPreviewJSON(json, modal);
      } else {
        ExportImportUI._clearPreview(modal);
      }
    });

    // Import button
    modal.querySelector('.import-btn')?.addEventListener('click', () => {
      const importData = modal._ldAxyumState?.importData;
      if (importData) {
        ExportImportUI._performImport(importData, actor, modal);
      }
    });

    // Close modal
    modal.querySelector('.close-modal')?.addEventListener('click', () => {
      ExportImportUI._clearImportModal(modal);
      modal.hidden = true;
      modal.style.display = 'none';
    });

    // Close on overlay click
    modal.querySelector('.modal-overlay')?.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        ExportImportUI._clearImportModal(modal);
        modal.hidden = true;
        modal.style.display = 'none';
      }
    });
  }

  /**
   * Switch import tab
   */
  static _switchImportTab(modal, tabName) {
    modal.querySelectorAll('.import-tab-btn').forEach(button => {
      button.classList.remove('active');
      button.style.borderBottomColor = 'transparent';
      button.style.color = 'var(--axyum-dim)';
    });

    const activeButton = modal.querySelector(`.import-tab-btn[data-tab="${tabName}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      activeButton.style.borderBottomColor = 'var(--axyum-primary)';
      activeButton.style.color = 'var(--axyum-primary)';
    }

    modal.querySelectorAll('.import-tab-content').forEach(panel => {
      panel.hidden = true;
    });

    const activePanel = modal.querySelector(`.import-tab-content[data-tab="${tabName}"]`);
    if (activePanel) activePanel.hidden = false;

    ExportImportUI._clearPreview(modal);
  }

  /**
   * Handle file selection
   */
  static _handleFileSelect(file, modal) {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      ui.notifications.warning('Please select a JSON file');
      return;
    }

    const fileName = file.name;
    modal.querySelector('.file-name')?.removeAttribute('hidden');
    const fileNameText = modal.querySelector('.file-name-text');
    if (fileNameText) fileNameText.textContent = fileName;

    const CharacterImporter = window.CharacterImporter || game.ldAxyum?.CharacterImporter;
    if (!CharacterImporter) {
      ui.notifications.error('CharacterImporter not found');
      return;
    }

    CharacterImporter.loadFromFile(file).then(importData => {
      const validation = CharacterImporter.importCharacter(importData);
      if (validation.success) {
        modal._ldAxyumState = modal._ldAxyumState || {};
        modal._ldAxyumState.importData = importData;
        ExportImportUI._displayImportPreview(validation.summary, modal);
        const importBtn = modal.querySelector('.import-btn');
        if (importBtn) importBtn.disabled = false;
      } else {
        ExportImportUI._displayImportError(validation.error, modal);
        const importBtn = modal.querySelector('.import-btn');
        if (importBtn) importBtn.disabled = true;
      }
    }).catch(error => {
      ExportImportUI._displayImportError(error.message, modal);
      const importBtn = modal.querySelector('.import-btn');
      if (importBtn) importBtn.disabled = true;
    });
  }

  /**
   * Validate and preview JSON
   */
  static _validateAndPreviewJSON(jsonString, modal) {
    const CharacterImporter = window.CharacterImporter || game.ldAxyum?.CharacterImporter;
    if (!CharacterImporter) {
      ui.notifications.error('CharacterImporter not found');
      return;
    }

    try {
      const importData = CharacterImporter.loadFromString(jsonString);
      const validation = CharacterImporter.importCharacter(importData);

      if (validation.success) {
        modal._ldAxyumState = modal._ldAxyumState || {};
        modal._ldAxyumState.importData = importData;
        ExportImportUI._displayImportPreview(validation.summary, modal);
        const importBtn = modal.querySelector('.import-btn');
        if (importBtn) importBtn.disabled = false;
        ExportImportUI._clearImportError(modal);
      } else {
        ExportImportUI._displayImportError(validation.error, modal);
        const importBtn = modal.querySelector('.import-btn');
        if (importBtn) importBtn.disabled = true;
      }
    } catch (error) {
      // Only show error if string is long enough (not just typing)
      if (jsonString.length > 50) {
        ExportImportUI._displayImportError(error.message, modal);
        const importBtn = modal.querySelector('.import-btn');
        if (importBtn) importBtn.disabled = true;
      }
    }
  }

  /**
   * Display import preview
   */
  static _displayImportPreview(summary, modal) {
    modal.querySelector('.preview-section')?.removeAttribute('hidden');
    const setText = (selector, value) => {
      const node = modal.querySelector(selector);
      if (node) node.textContent = String(value);
    };
    setText('.preview-name', summary.characterName || 'Unknown');
    setText('.preview-level', summary.level || '1');
    setText('.preview-class', summary.class || 'Unknown');
    setText('.preview-race', summary.race || 'Unknown');
    setText('.preview-items', summary.itemCount || 0);
    setText('.preview-spells', summary.spellCount || 0);
    setText('.preview-feats', summary.featCount || 0);

    // Display warnings
    const warnings = [];
    if (summary.hasConditions) {
      warnings.push('Character has active conditions that will be imported');
    }
    if (summary.hasTemporaryModifiers) {
      warnings.push('Character has temporary modifiers');
    }
    if (summary.hasMulticlass) {
      warnings.push('Character is multiclass');
    }
    if (summary.homebrewCount > 0) {
      warnings.push(`${summary.homebrewCount} homebrew items included`);
    }

    if (warnings.length > 0) {
      const warningList = modal.querySelector('.warnings-list');
      if (warningList) warningList.replaceChildren();
      warnings.forEach(warning => {
        if (warningList) {
          const li = document.createElement('li');
          li.textContent = warning;
          warningList.appendChild(li);
        }
      });
      modal.querySelector('.warnings-section')?.removeAttribute('hidden');
    } else {
      modal.querySelector('.warnings-section')?.setAttribute('hidden', '');
    }

    ExportImportUI._clearImportError(modal);
  }

  /**
   * Display import error
   */
  static _displayImportError(errorMessage, modal) {
    const errorText = modal.querySelector('.error-text');
    if (errorText) errorText.textContent = errorMessage;
    modal.querySelector('.error-section')?.removeAttribute('hidden');
  }

  /**
   * Clear import error
   */
  static _clearImportError(modal) {
    modal.querySelector('.error-section')?.setAttribute('hidden', '');
    const errorText = modal.querySelector('.error-text');
    if (errorText) errorText.textContent = '';
  }

  /**
   * Clear preview
   */
  static _clearPreview(modal) {
    modal.querySelector('.preview-section')?.setAttribute('hidden', '');
    modal.querySelector('.warnings-section')?.setAttribute('hidden', '');
    modal.querySelector('.error-section')?.setAttribute('hidden', '');
    modal._ldAxyumState = modal._ldAxyumState || {};
    modal._ldAxyumState.importData = null;
    const importBtn = modal.querySelector('.import-btn');
    if (importBtn) importBtn.disabled = true;
  }

  /**
   * Perform import
   */
  static async _performImport(importData, actor, modal) {
    const CharacterImporter = window.CharacterImporter || game.ldAxyum?.CharacterImporter;
    if (!CharacterImporter) {
      ui.notifications.error('CharacterImporter not found');
      return;
    }

    try {
      const result = await CharacterImporter.applyImportToActor(importData, actor);

      if (result.success) {
        ui.notifications.info(result.message);
        setTimeout(() => {
          ExportImportUI._clearImportModal(modal);
          modal.hidden = true;
          modal.style.display = 'none';
          // Refresh the sheet
          actor.sheet?.render();
        }, 500);
      } else {
        ui.notifications.error(result.error || 'Import failed');
      }
    } catch (error) {
      ui.notifications.error(`Import error: ${error.message}`);
      console.error(error);
    }
  }

  /**
   * Clear import modal state
   */
  static _clearImportModal(modal) {
    const jsonPaste = modal.querySelector('.json-paste');
    const fileInput = modal.querySelector('.file-input');
    const fileName = modal.querySelector('.file-name');
    const fileNameText = modal.querySelector('.file-name-text');
    if (jsonPaste) jsonPaste.value = '';
    if (fileInput) fileInput.value = '';
    if (fileName) fileName.hidden = true;
    if (fileNameText) fileNameText.textContent = '';
    ExportImportUI._clearPreview(modal);
    ExportImportUI._clearImportError(modal);
  }

  /**
   * Show export modal
   */
  static showExportModal(html, actor) {
    const root = getRootElement(html);
    const modal = getModalElement(root, '.export-modal');
    if (!modal) return;

    ExportImportUI.initializeExportModal(root, actor);
    modal.hidden = false;
    modal.style.display = 'flex';
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) overlay.style.display = 'flex';
  }

  /**
   * Show import modal
   */
  static showImportModal(html, actor) {
    const root = getRootElement(html);
    const modal = getModalElement(root, '.import-modal');
    if (!modal) return;

    ExportImportUI.initializeImportModal(root, actor);
    modal.hidden = false;
    modal.style.display = 'flex';
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) overlay.style.display = 'flex';
  }
}

// ES module export
export { ExportImportUI };
