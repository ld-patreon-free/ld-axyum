# GM Hub - System Orchestrator

The GM Hub is the central entry point for LD Axyum, providing GMs with a unified interface to select and launch character creation wizards for different game systems.

## Features

- **System Selection**: Visual cards for each supported game system
- **Dynamic Loading**: Systems load their wizards on demand
- **System Registry**: Centralized management of available systems
- **Responsive Design**: Cards arranged in horizontal stacks with custom styling

## Architecture

### Core Components

- **`gm-hub-app.js`**: Main ApplicationV2 class handling the GM Hub interface
- **`system-registry.js`**: Manages system discovery, loading, and metadata
- **`gm-hub.hbs`**: Handlebars template for the main interface
- **`gm-hub.css`**: Styling for cards, colors, and layout

### System Integration

Each system provides a configuration file that defines:
- System metadata (name, description, icons, colors)
- Component classes (wizard, rules engine, etc.)
- Feature flags and requirements
- Foundry system dependencies

## Usage

The GM Hub automatically appears when players click "Create Character" in Foundry. GMs can:

1. **Select System**: Click on a system card to launch its wizard
2. **Configure Settings**: Use the settings button for module configuration
3. **System Management**: View available systems and their status

## Adding New Systems

1. Create system folder under `systems/`
2. Implement required components (wizard, rules, data, adapter)
3. Create `config.js` with system metadata
4. The system registry will automatically discover and load it

## Current Systems

- **D&D 5e**: Fully implemented (legacy wizard)
- **CoC 7**: Configuration ready, wizard pending
- **Cyberpunk 2020**: Configuration ready, wizard pending
- **Blades in the Dark**: Configuration ready, wizard pending
- **Pathfinder 2e**: Configuration ready, wizard pending

## Visual Design

- **Cards**: 320x180px with glassmorphism effects
- **Colors**: Each system has unique colors and underglow effects
- **Layout**: Horizontal stacks with uneven spacing
- **Settings**: Smaller 200x120px card in secondary position
- **Responsive**: Adapts to smaller screens with vertical stacking
