# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-11-23

### Added
- ✨ **Compact Layout Mode** - New space-efficient horizontal grid layout
- 📏 **Configurable Width** - Adjustable card width for compact layout (200-500px)
- ⌚ **Watch Battery Support** - Display smartwatch battery level
- 🎨 **Conditional UI** - Editor adapts based on selected layout
- 📐 **Position Tab** - Dedicated tab for element positioning (Classic mode only)
- 🎯 **Smart Field Visibility** - Fields appear/hide based on layout selection

### Changed
- 🎨 Improved editor organization with layout-specific options
- 📱 Enhanced mobile dashboard compatibility with compact mode
- 🔧 Better default values for all configuration options
- 📝 Separated person name from location display in compact layout

### Fixed
- 🐛 Fixed crash when selecting layout from dropdown menu
- 🐛 Fixed person name disappearing with custom states in compact mode
- 🐛 Fixed irrelevant style fields showing in compact mode
- 🔧 Improved event handling for ha-select components

## [1.0.0] - 2024-11-22

### Added
- 🎉 **Initial Public Release**
- ✨ **Complete Visual Editor** with organized tabs (Base, Sensors, Position, States, Style)
- 📱 **Full Companion App Support**:
  - Battery monitoring with dynamic icon
  - Activity tracking (Walking, Running, Automotive, Stationary, Cycling)
  - Connection type detection (WiFi/Mobile)
  - Distance from home
  - Travel time estimation
- 🎨 **Customizable States**:
  - Custom names with emoji support
  - Personalized colors
  - Custom images per state
  - Support for transparent PNG and animated GIF
- 📍 **Waze Integration** for distance calculation
- 🎯 **Free Element Positioning** - 8 available positions
- 📐 **Configurable Aspect Ratio**
- 🖼️ **Custom Images** - Transparent PNG and animated GIF support
- 🎨 **Fully Customizable Styling**:
  - Card background and border radius
  - Font sizes for each element
  - Element colors
  - Picture size control
- 🔄 **Update Control** - Choose update mode (all/entity/custom)
- 📱 **Responsive Design**
- 🌙 **Dark/Light Theme Support**

### Technical Features
- ⚡ Performance optimized with `shouldUpdate()`
- 🔧 YAML and UI configuration support
- 🎨 Modular and maintainable CSS
- 📝 Well-documented code
- 🧪 Tested across multiple configurations

---

## Layout Modes

### Classic Layout (v1.0.0)
- Fully customizable element positioning
- Configurable aspect ratio
- Adjustable image size
- 8 position options for each element
- Perfect for large dashboard cards

### Compact Layout (v1.1.0)
- Space-efficient horizontal grid
- Fixed 40x40px image
- Bottom icon bar with all indicators
- Configurable width (200-500px)
- Perfect for multiple person tracking

---

## Change Types

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for bug fixes
- `Security` for vulnerability fixes

---

## Version Links

- [1.1.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.0
- [1.0.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.0.0
