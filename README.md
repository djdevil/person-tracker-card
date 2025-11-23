# 👤 Person Tracker Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)

Advanced card for Home Assistant that shows detailed information about people with complete visual editor.

![Person Tracker Card](images/preview.png)

## ✨ Main Features

- 📱 **Battery Monitoring** - Displays device battery level with dynamic icon
- 🚶 **Activity Tracking** - Shows current activity (Walking, Running, Automotive, Stationary, Cycling)
- 📍 **Distance from Home** - Waze integration to calculate distance
- ⏱️ **Travel Time** - Estimates time needed to reach home/work
- 📶 **Connection Type** - Shows if device is connected via WiFi or mobile network
- 🎨 **Customizable States** - Different colors and images for each state (Home, Office, etc.)
- 🖼️ **Custom Images** - Support for transparent PNG/GIF images
- 🎯 **Complete Visual Editor** - Easy configuration through graphical interface
- 📐 **Flexible Layout** - Freely position each element on the card
- 🎨 **Highly Customizable** - Fonts, colors, sizes, spacing fully configurable
- 🌍 **Multi-Language Support** - Available in English and Italian, with automatic language detection

## 📸 Screenshots

### Visual Editor
| Base Tab | Sensors Tab | States Tab |
|----------|-------------|------------|
| ![Editor Base](images/editor-base.png) | ![Editor Sensors](images/editor-sensors.png) | ![Editor States](images/editor-states.png) |

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Go to "Frontend"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this URL: `https://github.com/djdevil/person-tracker-card`
6. Select category "Lovelace"
7. Click "Add"
8. Search for "Person Tracker Card" and install it
9. Restart Home Assistant

### Manual Installation

1. Download `person-tracker-card.js` and `person-tracker-card-editor.js`
2. Copy the files to the `config/www/person-tracker-card/` folder
3. Add the resource in Home Assistant:
   - Go to Settings → Dashboards → Menu (⋮) → Resources
   - Click "+ ADD RESOURCE"
   - URL: `/local/person-tracker-card/person-tracker-card.js`
   - Type: JavaScript Module
4. Reload the page (Ctrl+F5)

## 🔧 Basic Configuration

### Method 1: Visual Editor (Recommended)

1. Edit your dashboard
2. Add a new card
3. Search for "Person Tracker Card"
4. Configure through the graphical interface

### Method 2: YAML

```yaml
type: custom:person-tracker-card
entity: person.david
show_entity_picture: true
show_name: true
show_last_changed: true
show_battery: true
show_activity: true
show_distance: true
show_travel_time: true
show_connection: true
```

## ⚙️ Advanced Configuration

### Complete Options

```yaml
type: custom:person-tracker-card
entity: person.david

# Element Display
show_entity_picture: true
show_name: true
show_last_changed: true
show_battery: true
show_activity: true
show_distance: true
show_travel_time: true
show_connection: true

# Custom Sensors (optional)
battery_sensor: sensor.phone_david_battery_level
activity_sensor: sensor.phone_david_activity
connection_sensor: sensor.phone_david_connection_type
distance_sensor: sensor.waze_david
travel_sensor: sensor.home_work_david

# Layout and Dimensions
aspect_ratio: '1/0.7'
picture_size: 55

# General Styles
card_background: 'rgba(255,255,255,0.05)'
card_border_radius: '15px'
name_font_size: '20px'
state_font_size: '14px'

# Element Positioning
battery_position: top-right
activity_position: bottom-left
distance_position: top-left
travel_position: top-left-2
connection_position: bottom-right

# Element Font Sizes
battery_font_size: '13px'
activity_font_size: '13px'
distance_font_size: '12px'
travel_font_size: '12px'
connection_font_size: '12px'

# Updates
triggers_update: all  # all | entity | custom

# Custom States (see below)
state:
  - value: home
    name: 🏡 Home
    styles:
      name:
        color: '#7DDA9F'
  - value: not_home
    name: 🏃‍♂️ Away from Home
    styles:
      name:
        color: '#93ADCB'
```

### Custom States with Images

You can define custom states with different colors and images:

```yaml
state:
  - value: home
    name: 🏡 Home
    entity_picture: /local/images/home.png
    styles:
      name:
        color: '#7DDA9F'
  
  - value: Office
    name: 🏢 Office
    entity_picture: /local/images/office.png
    styles:
      name:
        color: '#FFD700'
  
  - value: Gym
    name: 🏋️ Gym
    entity_picture: /local/images/gym.gif
    styles:
      name:
        color: '#FF6B6B'
```

### Available Positions

Each element can be positioned in one of the following positions:

- `top-left` - Top left
- `top-right` - Top right
- `bottom-left` - Bottom left
- `bottom-right` - Bottom right
- `top-left-2` - Top left (second position)
- `top-right-2` - Top right (second position)
- `bottom-left-2` - Bottom left (second position)
- `bottom-right-2` - Bottom right (second position)

### Update Modes

The `triggers_update` option controls when the card is updated:

- `all` - Updates when any related entity changes (default)
- `entity` - Updates only when the main person entity changes
- `custom` - Updates for specific user-defined entities

## 🎨 Creating Custom Images

### With iPhone/iPad

1. **Download the free "Background Eraser" app**
   - Available on App Store
   - Easy to use for removing backgrounds

2. **Create your image**:
   - Take a photo or use an existing image
   - Open the Background Eraser app
   - Remove the background with your finger
   - Export as PNG with transparency

3. **For animated images (GIF)**:
   - Use the "ImgPlay" app (free)
   - Create a GIF from photos or video
   - You can also remove the background
   - Export as GIF

4. **Upload to Home Assistant**:
   - Copy the file to `config/www/images/`
   - Use the path `/local/images/yourimage.png` in configuration

### Recommended Dimensions

- **Static images (PNG)**: 512x512 px
- **Animated GIF**: 512x512 px, max 5 MB
- **Format**: PNG with transparency or GIF
- **Background**: Transparent for better integration

### Image Examples

You can create images to represent:
- 🏠 Home - Your house logo
- 🏢 Office - Company logo
- 🏋️ Gym - Fitness icon
- 🛒 Supermarket - Store logo
- 🚗 Traveling - Animated car icon
- ✈️ Airport - Airplane icon

## 📱 Integration with Home Assistant Companion App

For proper functionality, make sure the Home Assistant Companion app has permissions for:

1. **Location**:
   - Go to phone settings
   - Apps → Home Assistant
   - Location → Always

2. **Battery**:
   - Automatically tracked by the app

3. **Physical Activity**:
   - iOS: Settings → Privacy → Motion & Fitness
   - Android: Enable activity sensor in the app

4. **Connectivity**:
   - Automatically tracked by the app

### Companion App Sensors Used

The card automatically searches for these sensors:

```
sensor.phone_[name]_battery_level
sensor.phone_[name]_activity
sensor.phone_[name]_connection_type
```

Where `[name]` is the person entity name without the `person.` prefix

Example for `person.david`:
```
sensor.phone_david_battery_level
sensor.phone_david_activity
sensor.phone_david_connection_type
```

## 🗺️ Waze Integration

For distance from home, install the Waze Travel Time integration:

1. Go to Settings → Devices and Services
2. Add integration → Search "Waze"
3. Configure:
   - Origin: Your home zone
   - Destination: `person.name`
   - Name: `waze_name`

## 🌍 Multi-Language Support

The card automatically detects your Home Assistant language and displays the interface accordingly.

### Supported Languages

- **English (en)** - Default language
- **Italian (it)** - Lingua italiana

The card will automatically use the language set in your Home Assistant user profile. If your language is not yet supported, the card will default to English.

### Translated Elements

- Time ago indicators (e.g., "2 hours ago" / "2 ore fa")
- Editor interface labels and buttons
- Default state names
- Error messages

## 🎭 Configuration Examples

### Minimal Configuration

```yaml
type: custom:person-tracker-card
entity: person.david
```

### Complete Configuration

```yaml
type: custom:person-tracker-card
entity: person.david
show_entity_picture: true
show_name: true
show_last_changed: true
show_battery: true
show_activity: true
show_distance: true
show_travel_time: true
show_connection: true
aspect_ratio: '1/0.7'
picture_size: 60
card_background: 'linear-gradient(135deg, rgba(125, 218, 159, 0.1) 0%, rgba(147, 173, 203, 0.1) 100%)'
card_border_radius: '20px'
name_font_size: '22px'
state_font_size: '16px'
battery_position: top-right
activity_position: bottom-left
distance_position: top-left
travel_position: top-left-2
connection_position: bottom-right
state:
  - value: home
    name: 🏡 At Home
    entity_picture: /local/images/home.gif
    styles:
      name:
        color: '#7DDA9F'
  - value: Office
    name: 🏢 At Office
    entity_picture: /local/images/office.png
    styles:
      name:
        color: '#FFD700'
  - value: not_home
    name: 🌍 Out and About
    entity_picture: /local/images/travel.gif
    styles:
      name:
        color: '#93ADCB'
```

### Essential Information Only

```yaml
type: custom:person-tracker-card
entity: person.david
show_entity_picture: true
show_name: true
show_last_changed: true
show_battery: true
show_activity: false
show_distance: false
show_travel_time: false
show_connection: true
aspect_ratio: '1/0.5'
```

## 🔍 Troubleshooting

### Card doesn't appear

1. Check browser console (F12) for errors
2. Verify that the resource is loaded correctly
3. Reload the page with empty cache (Ctrl+Shift+R)

### Sensors not found

1. Check that the Companion app is installed and configured
2. Verify sensor names in Developer Tools → States
3. Manually specify sensors in configuration

### Custom images don't appear

1. Check that the file is in `config/www/`
2. Use the correct path: `/local/folder/file.png`
3. Verify file permissions
4. Restart Home Assistant if necessary

### Editor doesn't open

1. Make sure you've loaded both JS files
2. Reload Lovelace resources
3. Try restarting Home Assistant

## 📝 Changelog

### v1.0 (2024-11-22)
- 🎉 First public release
- ✨ Complete visual editor
- 📱 Support for all Companion App sensors
- 🎨 Customizable states with colors
- 📍 Waze integration for distances

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is released under the MIT license. See the [LICENSE](LICENSE) file for details.

## 💝 Support

If this card is useful to you, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🤝 Contributing to the code

## 🙏 Acknowledgments

- Home Assistant Community
- HACS Team
- All contributors

---

**Created with ❤️ for the Home Assistant community**
