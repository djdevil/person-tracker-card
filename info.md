## Person Tracker Card

Advanced card for Home Assistant that displays detailed information about people with complete visual editor and dual layout modes.

### ✨ Features

- 🎨 **Two Layout Modes** - Classic (customizable) and Compact (space-efficient)
- 📱 **Battery Monitoring** - Phone battery with dynamic icon and color
- ⌚ **Watch Battery** - Smartwatch battery support (Apple Watch, etc.)
- 🚶 **Activity Tracking** - Walking, Running, Automotive, Stationary, Cycling
- 📍 **Distance from Home** - Waze integration for real-time distance
- ⏱️ **Travel Time** - Estimated time to reach home/work
- 📶 **Connection Type** - WiFi or mobile network indicator
- 🎨 **Customizable States** - Different colors and images per location
- 🖼️ **Custom Images** - Transparent PNG and animated GIF support
- 🎯 **Complete Visual Editor** - Easy configuration via GUI
- 📐 **Fully Customizable Layout** - Position elements freely (Classic mode)
- 📏 **Adjustable Width** - Configurable card width in Compact mode (200-500px)

### 🎨 Layout Modes

**Classic Layout**
- Fully customizable element positioning
- Configurable aspect ratio and image size
- Perfect for large dashboard cards

**Compact Layout** (New!)
- Horizontal grid with fixed structure
- Space-efficient design
- Adjustable width (200-500px)
- Perfect for tracking multiple people

### 📦 Installation

1. Install via HACS
2. Add the card to your dashboard
3. Configure using the visual editor

### 🔧 Basic Configuration

**Compact Layout:**
```yaml
type: custom:person-tracker-card
entity: person.name
layout: compact
compact_width: 300
```

**Classic Layout:**
```yaml
type: custom:person-tracker-card
entity: person.name
layout: classic
aspect_ratio: '1/0.7'
```

### 📱 Requirements

- Home Assistant Companion App installed
- Location permissions enabled
- Battery and activity sensors configured

For complete documentation, visit the [README](https://github.com/djdevil/person-tracker-card).
