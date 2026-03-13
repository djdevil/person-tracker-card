# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.8] - 2026-03-13

### Fixed
- 🐛 **Editor cache with HACS** — The editor JS file now inherits the `hacstag` query parameter from the main card file via `import.meta.url`, ensuring HACS cache busting is correctly propagated to the editor on every update. Fallback to `?v=CARD_VERSION` for non-HACS installations.
- 🌤️ **Neon layout: weather conditions added** — The neon layout now shows the weather icon, temperature and translated condition label (e.g. `☀ 14°C · Soleggiato`) instead of just the temperature value.

## [1.3.7] - 2026-03-13

### Added
- 🌊 **New Bioluminescence Layout (`bio`)** — Deep ocean theme inspired by bioluminescent deep-sea life. Features three animated glowing orbs, five rising particles, a double pulsing ring around the avatar, SVG battery fill, chip-glow animation and a weather footer bar. Accent color (rings, chips, particles) changes automatically based on the person's zone and supports custom state colors defined in the card config.
- 🌤️ **Weather background/temperature split controls** — Two new toggles in the editor weather section: "Show animated background" and "Show temperature". Allows showing only the animated scene, only the temperature text, or both independently. Available for all layouts (classic, compact, modern, neon, glass, bio).
- 🌡️ **Weather condition label in all layouts** — Compact and modern now show weather icon + temperature + translated condition (e.g. `☀ 14°C · Soleggiato`) directly below the location name instead of a floating overlay. Classic layout also shows condition label next to the temperature.

### Fixed
- 🐛 **State color picker not applying to avatar border** — In classic and compact layouts, changing a state color in the editor now correctly updates the border color of the circular avatar photo.
- 🐛 **Bio layout: accent color not applied to avatar border** — The avatar ring border was using a hardcoded sensor color instead of the custom state accent color. Now correctly follows the state color picker.
- 🐛 **Dir2 pair animation desync** — When smart travel mode is disabled and both directions are visible simultaneously, direction-2 animated chips were in perfect sync with direction-1 (making them look static). Fixed with a `−4 s` animation offset so both pairs alternate independently.
- 🐛 **Weather text unreadable on light backgrounds** — States like `sunny`, `snowy`, `fog` and `partlycloudy` used very bright gradients that made text invisible. Fixed with darker gradient stops and a universal dark scrim overlay (`::after`) on all weather backgrounds.
- 🐛 **Weather contrast missing in classic and modern layouts** — `weather-active` class (which applies frosted-glass badges and text-shadow) was only applied to the compact layout. Now extends to classic and modern as well.


---

## [1.3.6] - 2026-03-11

### Fixed
- 🐛 **Editor not updated after HACS update** — The browser was caching the old `person-tracker-card-editor.js` because the dynamic `import()` didn't include the `?v=` parameter. It now uses `import('./person-tracker-card-editor.js?v=1.3.6')`, which changes with each version and forces a reload of the correct file.
- 🔧 **`CARD_VERSION` promoted to top-level constant** — Previously, it was only declared in the cache-busting IIFE. Now it's available globally and reused in the dynamic import, eliminating the double declaration.
- 🏷️ **Version badge in the editor** — `Person Tracker Card v1.3.6` appears at the top of the visual editor, making it easy to check if the editor is up to date.

---

## [1.3.5] - 2026-03-11

### Changed (Glass layout)
- 🔋 **Battery icon redesigned** — SVG battery that fills up based on level, with the percentage displayed as text next to it. When charging, the icon pulses with a green glow animation instead of showing a text label.
- 📶 **Connection in header** — Connection type (Wi-Fi / cellular) moved to the header pill next to the battery, with icon + label. Chip removed from the bottom row when battery is shown.
- 🌦️ **Weather bar at bottom** — New bottom strip showing weather icon, temperature and translated condition label (IT/EN/FR/DE). Replaces the inline temperature in the header.
- 🌍 **Weather state translations** — All 15 HA weather states translated in Italian, English, French and German via the existing `_t()` system.

---

## [1.3.4] - 2026-03-11

### Added
- ✨ **New Glassmorphism Layout** — Dark frosted-glass card with translucent chips, colored gradient orbs, animated status dot, and per-state accent color. Select `glass` in the layout picker. Supports all sensors: battery, watch battery, connection, distance, travel time (both directions + smart mode), activity, steps.
- 🔧 **`distance_unit` config option** — Override the distance unit displayed (e.g. `km`, `mi`). Leave empty for auto-detection: reads `attributes.distance` unit from HA unit system for Waze/Google sensors, or `unit_of_measurement` for native HA distance sensors.


## [1.3.3] - 2026-03-11

### Fixed
- 🐛 **Fix #24 Distance sensor reads wrong value** — Distance sensors were reading `state` instead of `attributes.distance`. Waze and Google Routes sensors store travel time (minutes) in `state` and actual distance in `attributes.distance`. Now the card reads `attributes.distance` first, falling back to `state` for native HA distance sensors.
- 🐛 **Modern layout pair-b ring overflow** — Second direction ring (travel_2) was appearing below the card during the alternating animation. Fixed by applying `position:absolute;top:0;left:0` as inline style to override the `.ring-container` CSS class.

## [1.3.2] - 2026-03-09

### Added
- 🏢 **Dual Travel Direction (Issue #22)** — Smart home/work dual-sensor system. Configure a second set of distance and travel time sensors (e.g. Waze/Google Routes towards home). Logic:
  - When person is **at home** (`state = 'home'`) and sensor 2 is configured → sensor 1 (home→work direction) is hidden, sensor 2 (work→home direction) is shown
  - When person is **at work** (`zone_2`) → sensor 2 is hidden, sensor 1 is shown
  - All 4 layouts supported: Classic, Compact, Modern (ring indicators), Neon (neon badges)
  - New config: `distance_sensor_2`, `travel_sensor_2`, `zone_2`, `show_distance_2`, `show_travel_time_2`
  - Editor section added (Sensors tab) with entity pickers, toggle switches, and zone field in IT/EN/FR/DE
- 🌦️ **Rich Weather Animations** — Complete rebuild of weather background system with fully animated scenes for every state:
  - ☀️ **Sunny** — Glowing sun with 18 rotating rays and pulsing halo
  - 🌙 **Clear Night** — Moon with craters, aurora borealis ribbons, twinkling stars and falling meteor (fixed direction: top-right → bottom-left)
  - ⛅ **Partly Cloudy** — Day: sun + 2 clouds; Night: moon + stars + 2 night clouds
  - ☁️ **Cloudy** — 5 animated grey clouds at different depths
  - 🌫️ **Fog** — 8 drifting blur bands layered for depth effect
  - 💨 **Windy / Windy-variant** — 10 wind sweep lines with fading gradient
  - 🌧️ **Rainy** — Dark clouds + 26 rain drops with splash animations
  - 🌨️ **Snowy-rainy** — Dark clouds + mixed rain + 8 Unicode snowflakes
  - 🌧️ **Pouring** — Storm clouds + 40 heavy rain drops (accelerated animation)
  - ❄️ **Snowy** — Grey clouds + 18 Unicode snowflakes (❄❅❆✻✼) + snow ground layer
  - 🌩️ **Lightning** — Storm clouds + rain + SVG bolt paths + sky flash effect
  - ⛈️ **Lightning-rainy** — Storm clouds + 36 heavy drops + SVG lightning + sky flash
  - 🌪️ **Exceptional** — Dust swirl particles + hot wind lines
  - 🧊 **Hail** — Dark clouds + 22 glossy sphere hail drops
  - Vivid opaque gradients per state (sunny=blue-to-amber, night=deep navy, storm=dark purple…)
  - Seeded deterministic PRNG (`_rng(seed)`) — same weather state always produces identical particles, preventing LitElement re-render loops
- 📍 **Weather Temperature — layout-aware positioning**:
  - **Classic layout**: temperature shown inline below the last-changed timestamp
  - **Neon layout**: temperature shown inline below the last-changed timestamp, styled with monospace neon font
  - **Modern/Compact layouts**: temperature shown as absolute bottom-right label

### Fixed
- 🐛 **Mobile App Auto-Detection** — sensors are now resolved from `person.attributes.device_trackers` instead of a guessed `sensor.phone_{name}_*` pattern. The card reads the actual device tracker (e.g. `device_tracker.iphonedavide`), extracts the prefix, and builds correct entity IDs (`sensor.iphonedavide_battery_level`, `sensor.iphonedavide_activity`, etc.). Falls back to name-scan if device_trackers attribute is absent.
- 🐛 **Battery/Watch charging state auto-detection** — `sensor.{prefix}_battery_state` and `sensor.{prefix}_watch_battery_state` are now auto-detected without requiring manual config
- 🐛 **Distance sensor** — now resolves to `sensor.{prefix}_distance` (mobile_app) instead of `sensor.waze_{name}`
- 🐛 **Shooting star direction** — was moving horizontally left; now falls diagonally downward (top-right → bottom-left) with correct vertical gradient (bright head, fading tail)
- 🐛 **Modern layout rings** — circular indicators now have a dark frosted-glass background (`rgba(0,0,0,0.45)` + `backdrop-filter: blur`) to remain readable over any weather background
- 🐛 **Compact layout contrast** — when weather background is active (`.weather-active` class), badges get dark frosted background, name gets white text-shadow, icons get drop-shadow, profile picture gets contrast border

### Changed
- 🎨 **Classic layout default picture size** — reduced from 55% to 45% for better proportions
- 🌍 **Editor auto-detection** — sensor fields now show the auto-detected value immediately (without requiring the auto-detect button). Pickers display `sensor.{prefix}_battery_level` etc. as soon as a person entity is selected
- 🌍 **Sensor description text** — updated in all languages to reflect mobile_app prefix detection

### Translations
- 🌍 **New keys added in IT/EN/FR/DE**:
  - `section.neon_options` — Neon Layout Options
  - `section.neon_description` — Neon layout description
  - `section.weather` — Weather section title
  - `editor.show_weather` — Show weather background toggle
  - `editor.weather_entity` — Weather entity picker label
  - `section.weather_description` — Weather background description
  - `section.travel_sensor_2` — Work Direction Sensors section title
  - `section.travel_sensor_2_description` — Work direction sensors description
  - `editor.distance_sensor_2` — Distance sensor 2 label
  - `editor.travel_sensor_2` — Travel time sensor 2 label
  - `editor.zone_2` — Work zone ID field label
  - `editor.show_distance_2` — Show distance direction 2 toggle
  - `editor.show_travel_time_2` — Show travel time direction 2 toggle
- 🌍 **Updated key** `section.sensors_description` — now describes mobile_app prefix auto-detection in all 4 languages

---

## [1.3.1] - 2026-03-08

### Added
- 🌟 **Neon Layout** - New cyberpunk-inspired dark theme layout:
  - Animated pulsing glow ring around profile picture (color adapts to person state)
  - Neon corner brackets framing the card
  - CRT scanlines overlay for retro-futuristic effect
  - Neon status dot next to person name with color glow
  - State label in neon color with text-shadow glow
  - Last changed timestamp in muted style
  - Neon badges row for battery, watch battery, activity, connection, distance, and travel time
  - Charging animation on battery badges
  - Vivid state colors: green (home), red/pink (away), cyan/orange (other states)
- 🎨 **Neon Layout Editor UI** — dedicated section in Style tab with layout description and options panel

---

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

#### Neon Layout (v1.3.1)
- Cyberpunk dark theme with animated glow ring and neon badges
- Vivid state-colored glows, corner brackets, scanlines overlay
- Adapts to person state (home/away/other) with matching neon color

#### Weather Animations (v1.3.2) 🆕
- Rich animated weather backgrounds for all 14 weather states
- Seeded PRNG for stable rendering in LitElement
- Layout-aware temperature display (inline in Classic/Neon, absolute in Modern/Compact)
- Contrast-safe: frosted glass on Modern rings and Compact badges when weather is active

#### Tap Action & Cache Busting (v1.3.0)
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
- [1.3.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.3.2
- [1.3.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.3.1
- [1.3.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.3.0
- [1.2.4]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.4
- [1.2.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.2
- [1.2.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.1
- [1.2.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.0
- [1.1.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.2
- [1.1.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.1
- [1.1.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.0
- [1.0.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.0.0
