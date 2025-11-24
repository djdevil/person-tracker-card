# 👤 Person Tracker Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![Version](https://img.shields.io/badge/version-1.1.1-blue.svg)](https://github.com/djdevil/person-tracker-card)


Advanced card for Home Assistant that displays detailed information about people with complete visual editor and two layout modes.

## 📑 Classic Layout
![Person Tracker Card](images/preview.png)

## 📑 Compact Layout
![Person Tracker Card](images/compact2.png)

**[🇬🇧 English](#english-version) | [🇮🇹 Versione Italiana](#versione-italiana)**

---

<a name="english-version"></a>
## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🎨 Layout Modes](#-layout-modes)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [📱 Mobile App Integration](#-mobile-app-integration)
- [🎭 Examples](#-examples)
- [🔍 Troubleshooting](#-troubleshooting)

---

## ✨ Key Features

- 🎨 **Two Layout Modes**
  - **Classic**: Fully customizable with positionable elements
  - **Compact**: Space-efficient horizontal grid layout
- 📱 **Battery Monitoring** - Phone battery with dynamic icon and color
- ⌚ **Watch Battery** - Apple Watch and smartwatch support
- 🚶 **Activity Tracking** - Walking, Running, Automotive, Stationary, Cycling
- 📍 **Distance from Home** - Waze integration
- ⏱️ **Travel Time** - Estimated time to reach home/work
- 📶 **Connection Type** - WiFi or mobile network indicator
- 🎨 **Customizable States** - Different colors and images for each location
- 🖼️ **Custom Images** - PNG/GIF with transparency support
- 🎯 **Complete Visual Editor** - User-friendly GUI configuration
- 🎨 **Highly Customizable** - Fonts, colors, sizes, background

---

## 🎨 Layout Modes

### Classic Layout
Full-size card with customizable element positioning.

**Perfect for:**
- Large dashboard cards
- Maximum customization
- Custom aspect ratios
- Freely positionable elements

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: classic
aspect_ratio: '1/0.7'
picture_size: 60
battery_position: top-right
activity_position: bottom-left
```

### Compact Layout
Horizontal grid layout with fixed structure.

**Perfect for:**
- Multiple people tracking
- Space-limited dashboards
- Mobile interfaces
- Dense information display

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 300  # 200-500px
```

**Layout structure:**
```
┌────────────────────────────┐
│ 🖼️  Person Name           │
│ 40px  📍 Location         │
├────────────────────────────┤
│ 🚶 📶 📱 ⌚ 🏠         │
└────────────────────────────┘
```

---

## 📦 Installation

## Install

### Installation via HACS (Recommended)

Have [HACS](https://hacs.xyz/) installed, this will allow you to update easily.

* Adding Person Tracker Card to HACS can be done using this button:

[![image](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=djdevil&repository=person-tracker-card&category=dashboard)

> [!NOTE]
> If the button above doesn't work, add `https://github.com/djdevil/person-tracker-card` as a custom repository of type **Dashboard** in HACS.

* Click Install on the `Person Tracker Card` card.
* Restart Home Assistant.

### Manual Installation

1. Download `person-tracker-card.js` and `person-tracker-card-editor.js`
2. Copy to `config/www/person-tracker-card/`
3. Add resource:
   - Settings → Dashboards → ⋮ → Resources
   - **+ ADD RESOURCE**
   - URL: `/local/person-tracker-card/person-tracker-card.js`
   - Type: **JavaScript Module**
4. Hard refresh browser (Ctrl+Shift+R)

---

## 🔧 Configuration

### Quick Start (GUI Editor)

1. Edit dashboard → Add card
2. Search **Person Tracker Card**
3. Select **person** entity
4. Choose **layout** (classic/compact)
5. Configure sensors and style

### Basic YAML

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact  # or 'classic'
```

### Compact Layout Configuration

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 300        # Width in pixels (200-500)
show_entity_picture: true
show_name: true
show_battery: true
show_watch_battery: true
show_activity: true
show_connection: true
show_distance: true
show_travel_time: true

# Custom sensors (optional)
battery_sensor: sensor.phone_davide_battery_level
watch_battery_sensor: sensor.watch_davide_battery_level
activity_sensor: sensor.phone_davide_activity
connection_sensor: sensor.phone_davide_connection_type
distance_sensor: sensor.waze_davide

# Styling
card_background: 'rgba(255,255,255,0.05)'
card_border_radius: '12px'
```

### Classic Layout Configuration

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: classic
aspect_ratio: '1/0.7'
picture_size: 55
show_entity_picture: true
show_name: true
show_last_changed: true
show_battery: true
show_watch_battery: true
show_activity: true
show_connection: true
show_distance: true
show_travel_time: true

# Element positioning
battery_position: top-right
watch_battery_position: top-right-2
activity_position: bottom-left
distance_position: top-left
travel_position: top-left-2
connection_position: bottom-right

# Font sizes
name_font_size: '20px'
state_font_size: '14px'
battery_font_size: '13px'
activity_font_size: '13px'

# Styling
card_background: 'rgba(255,255,255,0.05)'
card_border_radius: '15px'
```

### Available Positions (Classic only)

- `top-left`, `top-right`
- `bottom-left`, `bottom-right`
- `top-left-2`, `top-right-2`
- `bottom-left-2`, `bottom-right-2`

### Custom States with Colors

```yaml
state:
  - value: home
    name: 🏡 Home
    styles:
      name:
        color: '#7DDA9F'
  
  - value: not_home
    name: 🏃‍♂️ Away
    styles:
      name:
        color: '#93ADCB'
  
  - value: work
    name: 🏢 Office
    entity_picture: /local/images/office.png
    styles:
      name:
        color: '#FFD700'
```

---

## 📱 Mobile App Integration

### Required Permissions

**iOS - Home Assistant Companion App:**
1. Location: Settings → App → Location → **Always**
2. Motion & Fitness: Settings → Privacy → Motion & Fitness → **ON**

**Android - Home Assistant Companion App:**
1. Location: Always allow
2. Physical Activity: Enable in app settings

### Automatic Sensor Detection

The card automatically finds these sensors:

```
sensor.phone_[name]_battery_level
sensor.phone_[name]_activity
sensor.phone_[name]_connection_type
sensor.watch_[name]_battery_level
```

Where `[name]` is your person entity name without `person.` prefix.

Example for `person.davide`:
```
sensor.phone_davide_battery_level
sensor.phone_davide_activity
sensor.phone_davide_connection_type
sensor.watch_davide_battery_level
```

### Waze Integration

For distance tracking:

1. Settings → Devices & Services → Add Integration
2. Search **Waze Travel Time**
3. Configure:
   - Origin: `zone.home`
   - Destination: `person.name`
   - Name: `waze_name`

---

## 🎭 Examples

### Compact Grid - Multiple People

```yaml
type: grid
columns: 2
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: compact
    compact_width: 280
    
  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: compact
    compact_width: 280
    
  - type: custom:person-tracker-card
    entity: person.child
    layout: compact
    compact_width: 280
    
  - type: custom:person-tracker-card
    entity: person.grandpa
    layout: compact
    compact_width: 280
```

### Vertical Stack - Mobile View

```yaml
type: vertical-stack
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: compact
    compact_width: 250
    
  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: compact
    compact_width: 250
```

### Mixed Layout

```yaml
type: vertical-stack
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: classic
    aspect_ratio: '1/1'
    
  - type: horizontal-stack
    cards:
      - type: custom:person-tracker-card
        entity: person.child1
        layout: compact
        compact_width: 240
        
      - type: custom:person-tracker-card
        entity: person.child2
        layout: compact
        compact_width: 240
```

### Minimal Compact (Sidebar)

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 200
show_last_changed: false
show_watch_battery: false
show_travel_time: false
show_distance: false
```

---

## 🔍 Troubleshooting

### Card doesn't appear
- Check browser console (F12) for errors
- Verify resource is loaded in Dashboard → Resources
- Hard refresh: Ctrl+Shift+R

### Sensors not found
- Check Companion App is installed
- Verify sensor names in Developer Tools → States
- Manually specify sensors in configuration

### Images don't show
- Place files in `config/www/`
- Use correct path: `/local/folder/file.png`
- Restart Home Assistant if needed

### Editor doesn't open
- Ensure both JS files are loaded
- Clear browser cache
- Restart Home Assistant

### Layout doesn't change
- Verify `layout: 'compact'` or `layout: 'classic'`
- Values are case-sensitive
- Clear cache and reload

---

## 📝 Changelog

### v1.1.0 (2024-11-23)
- ✨ New compact layout mode
- 📏 Configurable width for compact layout (200-500px)
- ⌚ Watch battery support
- 🎨 Separate Position tab in editor
- 📐 Conditional UI based on selected layout
- 🐛 Fixed: Person name disappears with custom states in compact layout
- 🎨 Hidden irrelevant style fields in compact mode

### v1.0.0 (2024-11-22)
- 🎉 Initial public release
- ✨ Complete visual editor
- 📱 Full Companion App support
- 🎨 Customizable states
- 📍 Waze integration

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 💝 Support

If you find this card useful:

- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute code

---

## 🙏 Credits

- Home Assistant Community
- HACS Team
- All contributors

---

**Made with ❤️ for the Home Assistant Community**

---

<a name="versione-italiana"></a>
# 👤 Person Tracker Card per Home Assistant

**[🇬🇧 English](#english-version) | [🇮🇹 Versione Italiana](#versione-italiana)**

---

## ✨ Caratteristiche Principali

- 🎨 **Due Modalità di Layout**
  - **Classic**: Completamente personalizzabile con elementi posizionabili
  - **Compact**: Layout a griglia orizzontale per risparmiare spazio
- 📱 **Monitoraggio Batteria** - Batteria telefono con icona e colore dinamici
- ⌚ **Batteria Smartwatch** - Supporto Apple Watch e altri smartwatch
- 🚶 **Tracciamento Attività** - Walking, Running, Automotive, Stationary, Cycling
- 📍 **Distanza da Casa** - Integrazione Waze
- ⏱️ **Tempo di Viaggio** - Tempo stimato per raggiungere casa/lavoro
- 📶 **Tipo Connessione** - Indicatore WiFi o rete mobile
- 🎨 **Stati Personalizzabili** - Colori e immagini diverse per ogni posizione
- 🖼️ **Immagini Personalizzate** - Supporto PNG/GIF con trasparenza
- 🎯 **Editor Visuale Completo** - Configurazione tramite GUI
- 🎨 **Altamente Personalizzabile** - Font, colori, dimensioni, background

---

## 🎨 Modalità Layout

### Layout Classic
Card a dimensione intera con posizionamento elementi personalizzabile.

**Perfetto per:**
- Card dashboard grandi
- Massima personalizzazione
- Aspect ratio personalizzati
- Elementi posizionabili liberamente

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: classic
aspect_ratio: '1/0.7'
picture_size: 60
battery_position: top-right
activity_position: bottom-left
```

### Layout Compact
Layout a griglia orizzontale con struttura fissa.

**Perfetto per:**
- Tracciamento di più persone
- Dashboard con spazio limitato
- Interfacce mobile
- Visualizzazione densa di informazioni

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 300  # 200-500px
```

**Struttura layout:**
```
┌────────────────────────────┐
│ 🖼️  Nome Persona          │
│ 40px  📍 Posizione        │
├────────────────────────────┤
│ 🚶 📶 📱 ⌚ 🏠         │
└────────────────────────────┘
```

---

## 📦 Installazione

### Installazione via HACS (Consigliato)

Assicurati di avere [HACS](https://hacs.xyz/) installato, questo ti permetterà di aggiornare facilmente.

* Puoi aggiungere Person Tracker Card a HACS usando questo pulsante:

[![image](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=djdevil&repository=person-tracker-card&category=dashboard)

> [!NOTE]
> Se il pulsante sopra non funziona, aggiungi `https://github.com/djdevil/person-tracker-card` come repository personalizzata di tipo **Dashboard** in HACS.

* Clicca Installa sulla card `Person Tracker Card`.
* Riavvia Home Assistant.

### Installazione Manuale

1. Scarica `person-tracker-card.js` e `person-tracker-card-editor.js`
2. Copia in `config/www/person-tracker-card/`
3. Aggiungi risorsa:
   - Impostazioni → Dashboard → ⋮ → Risorse
   - **+ AGGIUNGI RISORSA**
   - URL: `/local/person-tracker-card/person-tracker-card.js`
   - Tipo: **Modulo JavaScript**
4. Ricarica forzata browser (Ctrl+Shift+R)

---

## 🔧 Configurazione

### Quick Start (Editor GUI)

1. Modifica dashboard → Aggiungi card
2. Cerca **Person Tracker Card**
3. Seleziona entità **person**
4. Scegli **layout** (classic/compact)
5. Configura sensori e stile

### YAML Base

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact  # oppure 'classic'
```

### Configurazione Layout Compact

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 300        # Larghezza in pixel (200-500)
show_entity_picture: true
show_name: true
show_battery: true
show_watch_battery: true
show_activity: true
show_connection: true
show_distance: true
show_travel_time: true

# Sensori personalizzati (opzionale)
battery_sensor: sensor.iphonedavide_battery_level
watch_battery_sensor: sensor.watch_davide_battery_level
activity_sensor: sensor.iphonedavide_activity
connection_sensor: sensor.iphonedavide_connection_type
distance_sensor: sensor.waze_davide

# Stile
card_background: 'rgba(255,255,255,0.05)'
card_border_radius: '12px'
```

### Configurazione Layout Classic

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: classic
aspect_ratio: '1/0.7'
picture_size: 55
show_entity_picture: true
show_name: true
show_last_changed: true
show_battery: true
show_watch_battery: true
show_activity: true
show_connection: true
show_distance: true
show_travel_time: true

# Posizionamento elementi
battery_position: top-right
watch_battery_position: top-right-2
activity_position: bottom-left
distance_position: top-left
travel_position: top-left-2
connection_position: bottom-right

# Dimensioni font
name_font_size: '20px'
state_font_size: '14px'
battery_font_size: '13px'
activity_font_size: '13px'

# Stile
card_background: 'rgba(255,255,255,0.05)'
card_border_radius: '15px'
```

### Posizioni Disponibili (Solo Classic)

- `top-left`, `top-right`
- `bottom-left`, `bottom-right`
- `top-left-2`, `top-right-2`
- `bottom-left-2`, `bottom-right-2`

### Stati Personalizzati con Colori

```yaml
state:
  - value: home
    name: 🏡 Casa
    styles:
      name:
        color: '#7DDA9F'
  
  - value: not_home
    name: 🏃‍♂️ Fuori
    styles:
      name:
        color: '#93ADCB'
  
  - value: Lavoro Davide
    name: 🏢 Ufficio
    entity_picture: /local/foto-pkg/davidelavoro.gif
    styles:
      name:
        color: '#FFD700'
```

---

## 📱 Integrazione App Mobile

### Permessi Richiesti

**iOS - App Home Assistant Companion:**
1. Posizione: Impostazioni → App → Posizione → **Sempre**
2. Movimento e Fitness: Impostazioni → Privacy → Movimento e Fitness → **ON**

**Android - App Home Assistant Companion:**
1. Posizione: Consenti sempre
2. Attività Fisica: Abilita nelle impostazioni app

### Rilevamento Automatico Sensori

La card trova automaticamente questi sensori:

```
sensor.phone_[nome]_battery_level
sensor.phone_[nome]_activity
sensor.phone_[nome]_connection_type
sensor.watch_[nome]_battery_level
```

Dove `[nome]` è il nome della tua entità person senza `person.`

Esempio per `person.davide`:
```
sensor.phone_davide_battery_level
sensor.phone_davide_activity
sensor.phone_davide_connection_type
sensor.watch_davide_battery_level
```

### Integrazione Waze

Per il tracciamento distanza:

1. Impostazioni → Dispositivi e Servizi → Aggiungi Integrazione
2. Cerca **Waze Travel Time**
3. Configura:
   - Origine: `zone.home`
   - Destinazione: `person.nome`
   - Nome: `waze_nome`

---

## 🎭 Esempi

### Griglia Compact - Più Persone

```yaml
type: grid
columns: 2
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: compact
    compact_width: 280
    
  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: compact
    compact_width: 280
    
  - type: custom:person-tracker-card
    entity: person.bambino
    layout: compact
    compact_width: 280
    
  - type: custom:person-tracker-card
    entity: person.nonno
    layout: compact
    compact_width: 280
```

### Stack Verticale - Vista Mobile

```yaml
type: vertical-stack
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: compact
    compact_width: 250
    
  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: compact
    compact_width: 250
```

### Layout Misto

```yaml
type: vertical-stack
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: classic
    aspect_ratio: '1/1'
    
  - type: horizontal-stack
    cards:
      - type: custom:person-tracker-card
        entity: person.figlio1
        layout: compact
        compact_width: 240
        
      - type: custom:person-tracker-card
        entity: person.figlio2
        layout: compact
        compact_width: 240
```

### Compact Minimale (Sidebar)

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 200
show_last_changed: false
show_watch_battery: false
show_travel_time: false
show_distance: false
```

---

## 🔍 Risoluzione Problemi

### La card non appare
- Controlla console browser (F12) per errori
- Verifica risorsa caricata in Dashboard → Risorse
- Ricarica forzata: Ctrl+Shift+R

### Sensori non trovati
- Controlla Companion App installata
- Verifica nomi sensori in Strumenti Sviluppatore → Stati
- Specifica manualmente i sensori nella configurazione

### Immagini non appaiono
- Inserisci file in `config/www/`
- Usa percorso corretto: `/local/cartella/file.png`
- Riavvia Home Assistant se necessario

### Editor non si apre
- Assicurati che entrambi i file JS siano caricati
- Svuota cache browser
- Riavvia Home Assistant

### Layout non cambia
- Verifica `layout: 'compact'` o `layout: 'classic'`
- I valori sono case-sensitive
- Svuota cache e ricarica

---

## 📝 Changelog

### v1.1.0 (2024-11-23)
- ✨ Nuova modalità layout compact
- 📏 Larghezza configurabile per layout compact (200-500px)
- ⌚ Supporto batteria smartwatch
- 🎨 Tab Position separato nell'editor
- 📐 UI condizionale basata sul layout selezionato
- 🐛 Corretto: Nome persona scompare con stati personalizzati in layout compact
- 🎨 Nascosti campi stile non rilevanti in modalità compact

### v1.0.0 (2024-11-22)
- 🎉 Prima release pubblica
- ✨ Editor visuale completo
- 📱 Supporto completo Companion App
- 🎨 Stati personalizzabili
- 📍 Integrazione Waze

---

## 🤝 Contribuire

Contributi benvenuti! Per favore:

1. Fai Fork del repository
2. Crea feature branch (`git checkout -b feature/FunzionalitàFica`)
3. Committa modifiche (`git commit -m 'Aggiungi FunzionalitàFica'`)
4. Push al branch (`git push origin feature/FunzionalitàFica`)
5. Apri Pull Request

---

## 📄 Licenza

Licenza MIT - Vedi file [LICENSE](LICENSE)

---

## 💝 Supporto

Se trovi utile questa card:

- ⭐ Stella il repository
- 🐛 Segnala bug
- 💡 Suggerisci funzionalità
- 🤝 Contribuisci al codice

---

## 🙏 Ringraziamenti

- Home Assistant Community
- HACS Team
- Tutti i contributori

---

**Realizzato con ❤️ per la Community Home Assistant**
