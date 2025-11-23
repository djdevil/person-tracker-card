# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.2.0] - 2024-11-22

### Added
- 🌍 Multi-language support (English and Italian)
- 🌐 Automatic language detection from Home Assistant user settings
- 🔤 Translated editor interface for English and Italian
- 📝 Localized time indicators (days/hours/minutes ago)
- 🗣️ Localized error messages and default state names

### Changed
- 📝 Updated code comments from Italian to English for better maintainability
- 🌍 Card now defaults to English for unsupported languages

## [2.1.0] - 2024-11-22

### Added
- ✨ Complete support for PNG images with transparency
- ✨ Support for animated GIFs as state images
- 📱 Ability to position elements in 8 different positions
- 🎨 Custom images for each state
- 📐 Image size control in percentage
- 🔧 Complete visual editor for all options

### Changed
- 🎨 Improved custom image rendering
- 🐛 Fixed rendering of images with transparent background
- 📱 Optimized responsive layout
- 🎯 Improved aspect ratio handling

### Fixed
- 🐛 Fixed editor not saving some options
- 🐛 Fixed overlapping element positioning
- 🐛 Fixed custom image loading in states
- 🔧 Fixed value validation in editor

## [2.0.0] - 2024-11-20

### Added
- 🎉 First public release
- ✨ Complete visual editor with organized tabs
- 📱 Support for all Companion App sensors:
  - Battery with dynamic icon
  - Activity tracking with type recognition
  - Connection type (WiFi/Mobile)
  - Distance from home
  - Travel time
- 🎨 Customizable states:
  - Custom names with emojis
  - Customizable colors
  - State images (basic)
- 📍 Waze integration for distance calculation
- 🎯 Free element positioning
- 📐 Configurable aspect ratio
- 🎨 Fully customizable styles:
  - Card background
  - Border radius
  - Font size for each element
  - Element colors
- 🔄 Update mode control (all/entity/custom)
- 📱 Responsive design
- 🌙 Dark/light theme support

### Technical Features
- ⚡ Optimized with `shouldUpdate()` for performance
- 🔧 YAML and UI configuration support
- 🎨 Modular and maintainable CSS
- 📝 Well-documented code
- 🧪 Tested on various configurations

## [1.0.0] - 2024-11-15 (Internal Version)

### Added
- 📱 Basic card version
- 🎨 Person state visualization
- 📊 Basic sensors (battery, activity)
- 🖼️ Person image

---

## Types of Changes

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

## Version Links

- [2.1.0]: https://github.com/yourusername/person-tracker-card/releases/tag/v2.1.0
- [2.0.0]: https://github.com/yourusername/person-tracker-card/releases/tag/v2.0.0
