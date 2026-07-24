# Compendium Selector

The Compendium Selector allows you to choose which compendia Axyum will use when loading content for character creation.

## Features

- **Tabbed Interface**: Organized by content type (Classes, Races, Backgrounds, Spells, Equipment, Feats)
- **Visual Feedback**: See which compendia are currently enabled
- **Select/Deselect All**: Quick buttons to enable or disable all compendia in a category
- **Package Information**: Shows which module/system each compendium belongs to
- **Real-time Updates**: Changes take effect immediately (wizard may need refresh)

## How to Use

### Opening the Selector

1. **From the Character Creation Wizard**: Click the "Configure Compendia" button on the Welcome page
2. **From Game Settings**: Module settings include compendium configuration
3. **Via Console**: `game.ldAxyum.openCompendiumSelector()`

### Selecting Content

1. Navigate between tabs to see different content types
2. Check/uncheck compendia to enable/disable them
3. Use "Select All" or "Deselect All" for quick changes
4. Click "Save Settings" to apply your changes

### Tips

- **Official Content**: Foundry's dnd5e system compendia are automatically detected
- **Third-Party Modules**: Premium modules like "D&D Players Handbook" and "Tasha's Cauldron" are supported
- **Homebrew**: Custom compendia from other modules will appear in the appropriate category
- **Performance**: Disabling unused compendia can improve loading times

## Technical Details

### Settings Storage

Compendium selections are stored in the world setting `ld-axyum.enabledCompendia` as an object:

```json
{
  "dnd5e.classes24": true,
  "dnd5e.races": true,
  "dnd5e.spells24": true,
  "custom-module.classes": false
}
```

### Categorization

Compendia are automatically categorized based on their collection name and title:
- **Classes**: Contains "class" in name
- **Races**: Contains "race", "species", or "origin" in name
- **Backgrounds**: Contains "background" in name
- **Spells**: Contains "spell" in name
- **Equipment**: Contains "equipment" or "item" in name
- **Feats**: Contains "feat" in name
- **Other**: Everything else

### Integration

The CompendiumLoader reads these settings when loading content:

```javascript
const enabledCompendia = game.settings.get('ld-axyum', 'enabledCompendia');
const loader = new CompendiumLoader();
loader.loadAllContent(); // Uses enabled compendia only
```

## Styling

Custom CSS is provided in `styles/compendium-selector.css` with:
- Dark theme matching Axyum's visual style
- Hover effects and smooth transitions
- Responsive layout
- Custom scrollbars

## Files

- `ui/modals/compendium-selector.js` - ApplicationV2 modal class
- `ui/modals/compendium-selector.hbs` - Handlebars template
- `styles/compendium-selector.css` - Styling
