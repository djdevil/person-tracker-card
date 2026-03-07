# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-03-07

### Added
- 🔧 **Configurable Distance Precision** - New `distance_precision` option to control decimal places shown for distance (0=integer, 1=one decimal, 2=two decimals; default: 1). Works across all three layouts.
- 🖱️ **Tap Action Support** - New `tap_action` config option to override the default click behavior on the card:
  - `more-info` (default) — opens the more-info dialog for the person entity (or a custom entity)
  - `navigate` — navigates to a Lovelace path (e.g. `/lovelace/home`)
  - `url` — opens an external URL in a new tab
  - `call-service` — calls a HA service with optional `service_data`
  - `none` — disables click entirely
- 🛠️ **Tap Action Editor UI** — dedicated section in the Base tab to configure tap action without YAML
- 🔄 **Automatic Cache Busting** — the card now automatically updates its Lovelace resource URL with the current version query param (`?v=X.X.X`) on load. After a HACS update, admin users no longer need to manually clear the browser cache — the page reloads automatically.

### Fixed
- 🐛 **iOS Connection Type** (issue #14) — iOS Companion App uses `sensor.*_network_type` instead of `sensor.*_connection_type`. The card now auto-detects which sensor exists and falls back gracefully, so connection status works on both iOS and Android without manual configuration.
- 🐛 **Sensors Not Showing in Classic/Compact** (issue #15) — distance was hidden when value was `0` or unavailable/unknown state string. The card now tracks sensor existence separately (`_distanceSensorFound`) and shows the distance indicator whenever the sensor is present.
- 🐛 **ha-entity-picker Not Loading in Editor** (issue #20) — `ha-entity-picker` is lazy-loaded by HA and was sometimes undefined when the editor opened first. Fixed by requesting the config element of `hui-glance-card` (which depends on `ha-entity-picker`), forcing HA to register the component before the editor renders.

### Changed
- 📦 **`hacs.json`** — added `"filename"` field so HACS correctly identifies the main resource file for URL management

## [1.2.4] - 2025-12-04

### Fixed
- Fixed German (de) translations encoding issues (ä, ö, ü, ß characters were corrupted)
- Fixed French (fr) translations encoding issues (é, è, à characters)

### Changed
- Activity sensor is now automatically hidden when state is "unknown"

## [1.2.2] - 2025-11-30

### Added
- 📐 **Configurable Indicator Sizes** - New options to customize indicator dimensions for all layouts
  - `classic_icon_size` - Icon size for Classic layout (12-32px, default: 16px)
  - `compact_icon_size` - Icon size for Compact layout (12-32px, default: 16px)
  - `modern_ring_size` - Ring size for Modern layout (28-60px, default: 38px)
- 🔄 **Proportional Scaling (Compact)** - Entire card scales proportionally with icon size:
  - Badge circles: `iconSize × 2`
  - Profile picture: `iconSize × 2.5`
  - Name font: `iconSize × 0.875`
  - Location font: `iconSize × 0.625`
  - Card padding and gaps scale automatically
- 🔄 **Proportional Scaling (Modern)** - Ring content scales with ring size:
  - Value font: ~29% of ring size
  - Unit font: ~18% of ring size
  - Icon size: ~58% of ring size
- 🎨 **Layout-Specific Editor Sections** - New dedicated sections in Style tab:
  - "Classic Layout Options" with icon size and font settings
  - "Compact Layout Options" with proportional icon size
  - "Modern Layout Options" with ring size and font settings
- ⚡ **Battery Charging Animation** - Visual indicator when device is charging
  - Pulse animation on battery indicators (all layouts)
  - Lightning bolt icon ⚡ appears when charging
  - Ring glows green when charging (Modern layout)
  - Icon changes to `mdi:battery-charging` (Classic layout)
- 🔌 **Charging State Sensors** - New configuration options:
  - `battery_state_sensor` - Entity to monitor phone charging state
  - `battery_charging_value` - Custom value for charging state (optional)
  - `watch_battery_state_sensor` - Entity to monitor watch charging state
  - `watch_battery_charging_value` - Custom value for watch charging (optional)
- 🔍 **Auto-Detection of Charging States** - Recognizes multiple states:
  - iOS: `Charging`,`Full`
  - Android: `charging`, `discharging`, `full`
  - Binary: `on`, `off`, `true`, `false`, `1`, `0`
  - Power types: `ac`, `usb`, `wireless`
  - Multilingual: `in carica`, `en charge`, `laden`, `aufladen`

### Fixed
- 🌓 **Light Theme Support** - Card now properly adapts to light/dark themes
  - Ring background color adapts automatically (dark on light theme, light on dark theme)
  - Text colors use HA CSS variables (`--primary-text-color`, `--secondary-text-color`)
  - Badge backgrounds use `--secondary-background-color`
  - Dividers use `--divider-color`
  - Automatic theme detection based on `--primary-background-color` luminance
- 🔧 **Watch Battery Badge Alignment** - Fixed vertical alignment in Compact layout

### Changed
- 📝 **Editor Helper Text** - Updated to explain proportional scaling behavior
- 🔧 **Default Values** - Added proper defaults for all new size options

### Translations
- 🌍 **New Translation Keys** (IT/EN/FR/DE):
  - `editor.classic_icon_size` - Classic icon size
  - `editor.compact_icon_size` - Compact icon size
  - `editor.modern_ring_size` - Modern ring size
  - `editor.battery_font_size` - Battery font size
  - `editor.activity_font_size` - Activity font size
  - `editor.battery_state_sensor` - Phone charging state sensor
  - `editor.battery_charging_value` - Charging state value
  - `editor.watch_battery_state_sensor` - Watch charging state sensor
  - `editor.watch_battery_charging_value` - Watch charging state value
  - `editor.charging_helper` - Helper text for auto-detection
  - `section.classic_options` - Classic Layout Options
  - `section.compact_options` - Compact Layout Options

---

## [1.2.1] - 2025-11-30

### Added
- 🖱️ **Clickable Indicators** - All indicators now open their respective entity's more-info dialog
  - Picture and name/state → opens person entity
  - Battery → opens battery sensor
  - Watch battery → opens watch battery sensor
  - Activity → opens activity sensor
  - Connection → opens connection sensor
  - Distance → opens distance sensor
  - Travel time → opens travel sensor
- ✨ **Hover Effects** - Visual feedback on clickable elements (scale + opacity)
- 🎨 **Dynamic Icons** - All icons now read from entity attributes with smart fallbacks
  - Connection icon from entity or auto-detect WiFi/Signal
  - Distance icon from entity or `mdi:map-marker-distance`
  - Travel icon from entity or `mdi:car-clock`

### Fixed
- 🐛 **Editor Sensors Tab** - Entity pickers now always visible when editing saved cards
  - Previously, sensor pickers disappeared after saving the card
  - Pickers now show placeholder with default sensor pattern
- 🐛 **Entity Picker Improvements**
  - Added `allow-custom-entity` for manual entity input
  - Extended supported domains: `sensor`, `input_number`, `binary_sensor`
  - Empty default value prevents unwanted auto-selection

### Changed
- 🔧 **Sensor Flexibility** - Any entity type can now be used for any sensor slot
- 📝 **Editor UX** - Sensor pickers always visible with default pattern as placeholder label

---

## [1.2.0] - 2025-11-30

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
- **Configurable icon size** (v1.2.2)
- Perfect for large dashboard cards

#### Compact Layout (v1.1.0)
- Space-efficient horizontal grid
- Configurable image size (scales with icons)
- Bottom icon bar with all indicators
- Configurable width (200-500px)
- **Proportional scaling** (v1.2.2)
- Perfect for multiple person tracking

#### Modern Layout (v1.2.0)
- Circular progress indicators for numeric values
- Icon badges for activity and connection
- State-colored profile picture border
- Auto-expanding responsive design
- **Configurable ring size** (v1.2.2)
- Perfect for modern, minimal dashboards

#### Clickable Indicators (v1.2.1)
- All elements open more-info dialog on click
- Visual hover feedback
- Works across all layouts

#### Configurable Sizes (v1.2.2)
- Classic: `classic_icon_size` (12-32px)
- Compact: `compact_icon_size` (12-32px) with proportional scaling
- Modern: `modern_ring_size` (28-60px) with proportional scaling

#### Tap Action & Cache Busting (v1.3.0) 🆕
- Configurable `tap_action` with 5 modes (more-info, navigate, url, call-service, none)
- Automatic browser cache invalidation after HACS updates

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
- [1.3.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.3.0
- [1.2.4]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.4
- [1.2.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.2
- [1.2.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.1
- [1.2.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.0
- [1.1.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.2
- [1.1.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.1
- [1.1.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.0
- [1.0.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.0.0
