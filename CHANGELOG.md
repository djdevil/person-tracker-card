# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-05-30

### Added
- 🎨 **Modern Layout** - New stylish layout with circular progress indicators
  - Circular SVG rings for battery, watch battery, distance, and travel time
  - Icon badges for activity and connection status
  - State-colored border around profile picture (green=home, red=not_home, orange=other)
  - Clean horizontal design: Picture | Name/State | Indicators
- ⚙️ **Modern Layout Customization**:
  - `modern_picture_size` - Profile picture size (30-80px, default: 40px)
  - `modern_name_font_size` - Person name font size (default: 14px)
  - `modern_state_font_size` - State/location font size (default: 12px)
  - `modern_travel_max_time` - Max travel time for ring calculation (default: 60 min)
- 🔋 **Enhanced Battery Display** - Circular progress rings show percentage visually
- 📍 **Enhanced Distance Display** - Circular ring with distance value and unit
- 🚗 **Enhanced Travel Time Display** - Color-coded ring (green/orange/red based on time)
- 🎯 **Improved Activity Icons**:
  - Now reads icon from entity attributes first
  - Extended icon mapping with Italian translations
  - Fallback to `mdi:human-male` for unknown states
  - Case-insensitive state matching

### Changed
- 📐 **Responsive Modern Layout** - Card automatically expands based on number of indicators
- 🔤 **Larger Default Fonts** - Modern layout uses 14px for name, 12px for state (more readable)
- ⭕ **Larger Indicator Rings** - 38px rings with 11px text for better visibility
- 🎨 **Improved Ring Design** - Rounded stroke caps, better contrast colors

### Fixed
- 🐛 **Activity Icon Always Visible** - Removed condition that hid icon when empty
- 🐛 **Ring Overlap Prevention** - Indicators no longer overlap with name/state text
- 🐛 **Editor Cleanup** - Removed redundant "show ring" toggles from Modern options

### Technical Improvements
- ⚡ **Flexbox Layout** - Modern layout uses flexbox for better responsiveness
- 🎨 **CSS Variables** - Ring sizes and colors defined in static styles
- 🔧 **Simplified Conditions** - Cleaner render logic for all layouts

---

## [1.1.2] - 2025-01-25

### Added
- 📏 **Dynamic Distance Unit** - Distance sensor now reads unit of measurement from entity attributes
- 🎯 **Dynamic Activity Icon** - Activity icon follows entity's `icon` attribute with fallback to predefined mapping
- 🔤 **State Font Customization** - Added option to customize state text font size (Classic layout)
- 🕐 **Last Changed Font Customization** - Added option to customize last changed text font size (Classic layout)

### Fixed
- 🤖 **Android WiFi Detection** - Fixed connection type detection for Android devices
  - iOS uses `Wi-Fi` while Android Companion App uses `wifi`
  - Added case-insensitive check that handles all variations (`wifi`, `Wi-Fi`, `WIFI`, `wi-fi`, etc.)
  - New helper method `_isWifiConnection()` normalizes connection type before comparison
- 👤 **Person Name Display** - Fixed person name visualization in Classic layout

### Technical Improvements
- ⚡ **Normalized WiFi Check** - Removes spaces, hyphens, and underscores before lowercase comparison
- 🔧 **Cross-Platform Compatibility** - Now works identically on iOS and Android devices

---

## [1.1.1] - 2024-11-24

### Added - Multilanguage Support 🌍
- 🌍 **Complete Multilanguage System** - Full internationalization support
- 🇮🇹 **Italian** - Complete translation (Italiano)
- 🇬🇧 **English** - Complete translation (default fallback)
- 🇫🇷 **French** - Complete translation (Français)
- 🇩🇪 **German** - Complete translation (Deutsch)
- 🔄 **Automatic Language Detection** - Reads from Home Assistant settings
- 🎯 **Smart Fallback System** - English as default for unsupported languages
- 📝 **Translated Elements**:
  - Person states (Home, Away, Not Home, Unknown)
  - Editor interface (all tabs and labels)
  - Sensor names and descriptions
  - Position labels
  - Custom state defaults
  - Time relative strings (hours ago, minutes ago, etc.)
  - All buttons and actions

### Changed
- 🔤 **Default Language** - Changed from hardcoded to English fallback
- 🎨 **Editor Organization** - All UI elements now multilingual
- 📱 **User Experience** - Seamless language switching based on HA settings

### Technical Improvements
- ⚡ **Embedded Translations** - Zero latency with embedded translation dictionaries
- 🏗️ **LocalizationHelper Class** - Centralized translation management
- 🔧 **Type-safe Code** - Removed TypeScript annotations for JavaScript compatibility
- 📦 **No External Dependencies** - All translations included in JS files

---

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

---

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

## Features Summary

### Layout Modes

#### Classic Layout (v1.0.0)
- Fully customizable element positioning
- Configurable aspect ratio
- Adjustable image size
- 8 position options for each element
- Perfect for large dashboard cards

#### Compact Layout (v1.1.0)
- Space-efficient horizontal grid
- Fixed 40x40px image
- Bottom icon bar with all indicators
- Configurable width (200-500px)
- Perfect for multiple person tracking

#### Modern Layout (v1.2.0) 🆕
- Circular progress indicators for numeric values
- Icon badges for activity and connection
- State-colored profile picture border
- Auto-expanding responsive design
- Customizable font sizes
- Perfect for modern, minimal dashboards

---

## Supported Languages

| Language | Code | Status | Version |
|----------|------|--------|---------|
| 🇬🇧 English | en | ✅ Complete | 1.1.1 |
| 🇮🇹 Italiano | it | ✅ Complete | 1.1.1 |
| 🇫🇷 Français | fr | ✅ Complete | 1.1.1 |
| 🇩🇪 Deutsch | de | ✅ Complete | 1.1.1 |

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
- [1.2.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.0
- [1.1.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.2
- [1.1.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.1
- [1.1.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.0
- [1.0.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.0.0
