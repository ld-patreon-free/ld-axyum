# LD Axyum

LD Axyum is a multi-system character creation and management module for Foundry VTT. It provides a guided D&D 5e character wizard, an integrated character sheet, compendium content loading, and a GM hub.

## Requirements

- Foundry VTT 13 or newer, verified on 14
- D&D 5e system 5.1.0 or newer

## Features

- Twelve-page character creation wizard
- Character sheet creation and editing flow
- Automatic hit point, armor class, proficiency, spell, and equipment calculations
- Compendium and homebrew content loading
- GM hub and character management tools
- Multi-system adapter foundation
- Lazy template loading with event-driven initialization

## Installation

1. Place the module in Foundry's `Data/modules/ld-axyum` directory.
2. Start Foundry and enable **LD Axyum**.
3. Open the Actors Directory and choose **New Character (Axyum)**.

## Usage

Use the **New Character (Axyum)** control to move through the wizard. Choose a role, class, race, background, abilities, skills, equipment, spells, details, biography, and feats, then review the summary and create the actor.

The public API is available through:

```javascript
game.ldAxyum.open();
game.ldAxyum.openCreate();
game.ldAxyum.openEdit(actor);
```

The character lifecycle hooks are:

```javascript
Hooks.on('axyum.beforeCharacterCreate', (characterData) => {});
Hooks.on('axyum.characterCreated', (actor, characterData) => {});
Hooks.on('axyum.validatePage', (pageIndex, characterData) => {});
Hooks.on('axyum.buildActorUpdate', (characterData, updates) => {});
```

## Project

- GitHub: https://github.com/lisasdungeon/ld-axyum
- Discord: MystryssLysa
- Contact: Lisasdungeon@gmail.com

## License

LD Proprietary License. See [LICENSE-LD-PROPRIETARY.md](LICENSE-LD-PROPRIETARY.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
