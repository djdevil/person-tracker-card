// Person Tracker Card v1.2.0 - Multilanguage Version
// Full support for all editor options
// Languages: Italian (default), English, French, German
// v1.2.3 Fix Language fr,ge. Hide Activity Status when unknown
// v1.2.2: Bug fix, battery state, animation,fixed light theme
// v1.2.0: Added Modern layout with circular progress indicators for battery and travel time
// v1.1.2: Added dynamic unit of measurement for distance sensor
// v1.1.2: Activity icon now follows entity's icon attribute with fallback to predefined mapping
// v1.1.2: Fixed WiFi detection for Android (case-insensitive check for "wifi", "Wi-Fi", etc.)

console.log("Person Tracker Card v1.2.0 Multilanguage loading...");

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Localization Helper Class
class LocalizationHelper {
  constructor(hass) {
    this.hass = hass;
    this.translations = {};
    this.currentLanguage = 'en'; // Default: English
    this.loadTranslations();
  }

  loadTranslations() {
    // Get language from Home Assistant
    const haLanguage = this.hass?.language || this.hass?.locale?.language || 'en';

    // Map HA language codes to our supported languages
    const languageMap = {
      'it': 'it',
      'it-IT': 'it',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en',
      'fr': 'fr',
      'fr-FR': 'fr',
      'de': 'de',
      'de-DE': 'de'
    };

    this.currentLanguage = languageMap[haLanguage] || 'en';

    // Translations embedded (fallback if files are not loaded)
    this.translations = {
      'it': {
        'common.person_tracker': 'Tracciatore Persona',
        'common.unknown': 'Sconosciuto',
        'common.home': 'Casa',
        'common.away': 'Fuori',
        'common.not_home': 'Non a Casa',
        'attributes.battery': 'Batteria',
        'attributes.speed': 'Velocità',
        'attributes.direction': 'Direzione',
        'attributes.accuracy': 'Precisione',
        'attributes.gps_accuracy': 'Precisione GPS',
        'attributes.altitude': 'Altitudine',
        'attributes.source': 'Fonte',
        'attributes.last_changed': 'Ultimo aggiornamento',
        'attributes.distance': 'Distanza',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'Proprio ora',
        'time.minute': 'minuto',
        'time.minutes': 'minuti',
        'time.hour': 'ora',
        'time.hours': 'ore',
        'time.day': 'giorno',
        'time.days': 'giorni',
        'time.ago': 'fa'
      },
      'en': {
        'common.person_tracker': 'Person Tracker',
        'common.unknown': 'Unknown',
        'common.home': 'Home',
        'common.away': 'Away',
        'common.not_home': 'Not Home',
        'attributes.battery': 'Battery',
        'attributes.speed': 'Speed',
        'attributes.direction': 'Direction',
        'attributes.accuracy': 'Accuracy',
        'attributes.gps_accuracy': 'GPS Accuracy',
        'attributes.altitude': 'Altitude',
        'attributes.source': 'Source',
        'attributes.last_changed': 'Last Changed',
        'attributes.distance': 'Distance',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'Just now',
        'time.minute': 'minute',
        'time.minutes': 'minutes',
        'time.hour': 'hour',
        'time.hours': 'hours',
        'time.day': 'day',
        'time.days': 'days',
        'time.ago': 'ago'
      },
      'fr': {
        'common.person_tracker': 'Suivi de Personne',
        'common.unknown': 'Inconnu',
        'common.home': 'Maison',
        'common.away': 'Absent',
        'common.not_home': 'Pas à la Maison',
        'attributes.battery': 'Batterie',
        'attributes.speed': 'Vitesse',
        'attributes.direction': 'Direction',
        'attributes.accuracy': 'Précision',
        'attributes.gps_accuracy': 'Précision GPS',
        'attributes.altitude': 'Altitude',
        'attributes.source': 'Source',
        'attributes.last_changed': 'Dernière Mise à Jour',
        'attributes.distance': 'Distance',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'À l\'instant',
        'time.minute': 'minute',
        'time.minutes': 'minutes',
        'time.hour': 'heure',
        'time.hours': 'heures',
        'time.day': 'jour',
        'time.days': 'jours',
        'time.ago': 'il y a'
      },
      'de': {
        'common.person_tracker': 'Personen-Tracker',
        'common.unknown': 'Unbekannt',
        'common.home': 'Zuhause',
        'common.away': 'Abwesend',
        'common.not_home': 'Nicht Zuhause',
        'attributes.battery': 'Batterie',
        'attributes.speed': 'Geschwindigkeit',
        'attributes.direction': 'Richtung',
        'attributes.accuracy': 'Genauigkeit',
        'attributes.gps_accuracy': 'GPS-Genauigkeit',
        'attributes.altitude': 'Höhe',
        'attributes.source': 'Quelle',
        'attributes.last_changed': 'Letzte Änderung',
        'attributes.distance': 'Entfernung',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'Gerade eben',
        'time.minute': 'Minute',
        'time.minutes': 'Minuten',
        'time.hour': 'Stunde',
        'time.hours': 'Stunden',
        'time.day': 'Tag',
        'time.days': 'Tage',
        'time.ago': 'vor'
      }
    };
  }

  localize(key) {
    const langTranslations = this.translations[this.currentLanguage];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }

    // Fallback to English
    const defaultTranslations = this.translations['en'];
    if (defaultTranslations && defaultTranslations[key]) {
      return defaultTranslations[key];
    }

    // Fallback to key itself
    return key;
  }
}

class PersonTrackerCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      config: { attribute: false },
      _batteryLevel: { state: true },
      _batteryIcon: { state: true },
      _batteryCharging: { state: true },
      _activity: { state: true },
      _activityIcon: { state: true },
      _connectionType: { state: true },
      _distanceFromHome: { state: true },
      _distanceUnit: { state: true },
      _travelTime: { state: true },
      _watchBatteryLevel: { state: true },
      _watchBatteryIcon: { state: true },
      _watchBatteryCharging: { state: true }
    };
  }

  constructor() {
    super();
    this._batteryLevel = 0;
    this._batteryIcon = 'mdi:battery';
    this._batteryCharging = false;
    this._activity = 'unknown';
    this._activityIcon = '';
    this._connectionType = 'unknown';
    this._distanceFromHome = 0;
    this._distanceUnit = 'km';
    this._watchBatteryLevel = 0;
    this._watchBatteryIcon = 'mdi:battery';
    this._watchBatteryCharging = false;
    this._travelTime = 0;
    this._localize = null;
  }

  // Initialize localization when hass is available
  _initLocalization() {
    if (this.hass && !this._localize) {
      this._localize = new LocalizationHelper(this.hass);
    }
  }

  // Helper method to get localized strings
  _t(key) {
    this._initLocalization();
    return this._localize ? this._localize.localize(key) : key;
  }

  // Translate common entity states
  _translateState(state) {
    if (!state) return this._t('common.unknown');

    const stateMap = {
      'home': 'common.home',
      'not_home': 'common.not_home',
      'away': 'common.away',
      'unknown': 'common.unknown'
    };

    const lowerState = state.toLowerCase();
    return stateMap[lowerState] ? this._t(stateMap[lowerState]) : state;
  }

  // Support for the visual editor
  static async getConfigElement() {
    try {
      await import('./person-tracker-card-editor.js');
      return document.createElement('person-tracker-card-editor');
    } catch (error) {
      console.error('Person Tracker Card Editor not found:', error);
      return document.createElement('div');
    }
  }

  static getStubConfig(hass) {
    let defaultEntity = '';

    if (hass && hass.states) {
      const personEntities = Object.keys(hass.states).filter(
        eid => eid.startsWith('person.')
      );
      if (personEntities.length > 0) {
        defaultEntity = personEntities[0];
      }
    }

    return {
      entity: defaultEntity,
      type: 'custom:person-tracker-card'
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    if (!config.entity) {
      throw new Error('You must define a person entity');
    }

    // Default configuration with all new options
    this.config = {
      // Layout
      layout: 'classic',
      compact_width: 300,
      modern_width: 300,
      // Display
      show_entity_picture: true,
      show_person_name: true,
      show_name: true,
      show_last_changed: true,
      show_battery: true,
      show_activity: true,
      show_distance: true,
      show_watch_battery: true,
      show_travel_time: true,
      show_connection: true,
      // Layout
      aspect_ratio: '1/0.7',
      triggers_update: 'all',
      // General styles
      name_font_size: '20px',
      state_font_size: '14px',
      last_changed_font_size: '12px',
      card_background: 'rgba(255,255,255,0.05)',
      card_border_radius: '15px',
      picture_size: 55,
      // Element positions
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right',
      // Element font sizes
      battery_font_size: '13px',
      watch_battery_font_size: '13px',
      activity_font_size: '13px',
      distance_font_size: '12px',
      travel_font_size: '12px',
      connection_font_size: '12px',
      // Classic layout options
      classic_icon_size: 16,
      // Compact layout options
      compact_icon_size: 16,
      // Modern layout options
      modern_picture_size: 40,
      modern_ring_size: 38,
      modern_show_battery_ring: true,
      modern_show_travel_ring: true,
      modern_travel_max_time: 60,
      modern_name_font_size: '14px',
      modern_state_font_size: '12px',
      ...config
    };
  }

  getCardSize() {
    return 3;
  }

  shouldUpdate(changedProps) {
    if (!this.config) {
      return false;
    }

    if (changedProps.has('config')) {
      return true;
    }

    const oldHass = changedProps.get('hass');
    if (!oldHass) {
      return true;
    }

    // Check the primary entity
    if (oldHass.states[this.config.entity] !== this.hass.states[this.config.entity]) {
      return true;
    }

    // If triggers_update is 'entity', update only for the primary entity
    if (this.config.triggers_update === 'entity') {
      return false;
    }

    // Check related entities if configured
    const relatedEntities = this._getRelatedEntities();
    for (const entityId of relatedEntities) {
      if (oldHass.states[entityId] !== this.hass.states[entityId]) {
        return true;
      }
    }

    return false;
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (this.hass && this.config) {
      this._updateSensorData();
    }
  }

  _getRelatedEntities() {
    const entities = [];
    const entityBase = this.config.entity.replace('person.', '');

    if (this.config.show_battery) {
      entities.push(this.config.battery_sensor || `sensor.phone_${entityBase}_battery_level`);
      if (this.config.battery_state_sensor) {
        entities.push(this.config.battery_state_sensor);
      }
    }
    if (this.config.show_watch_battery) {
      entities.push(this.config.watch_battery_sensor || `sensor.watch_${entityBase}_battery_level`);
      if (this.config.watch_battery_state_sensor) {
        entities.push(this.config.watch_battery_state_sensor);
      }
    }
    if (this.config.show_activity) {
      entities.push(this.config.activity_sensor || `sensor.phone_${entityBase}_activity`);
    }
    if (this.config.show_connection) {
      entities.push(this.config.connection_sensor || `sensor.phone_${entityBase}_connection_type`);
    }
    if (this.config.show_distance) {
      entities.push(this.config.distance_sensor || `sensor.waze_${entityBase}`);
    }
    if (this.config.show_travel_time) {
      entities.push(this.config.travel_sensor || `sensor.home_work_${entityBase}`);
    }

    return entities;
  }

  _updateSensorData() {
    const entityBase = this.config.entity.replace('person.', '');

    // Battery
    if (this.config.show_battery) {
      const batteryEntityId = this.config.battery_sensor || `sensor.phone_${entityBase}_battery_level`;
      const batteryEntity = this.hass.states[batteryEntityId];
      if (batteryEntity) {
        const newLevel = parseFloat(batteryEntity.state) || 0;
        const newIcon = batteryEntity.attributes?.icon || 'mdi:battery';

        // SOLO se il valore è cambiato, aggiorna
        if (this._batteryLevel !== newLevel) {
          this._batteryLevel = newLevel;
        }
        if (this._batteryIcon !== newIcon) {
          this._batteryIcon = newIcon;
        }
      }

      // Battery charging state
      if (this.config.battery_state_sensor) {
        const batteryStateEntity = this.hass.states[this.config.battery_state_sensor];
        if (batteryStateEntity) {
          const newChargingState = this._isChargingState(
            batteryStateEntity.state,
            this.config.battery_charging_value
          );

          if (this._batteryCharging !== newChargingState) {
            this._batteryCharging = newChargingState;
          }
        }
      }
    }

    // Watch Battery
    if (this.config.show_watch_battery) {
      const watchBatteryEntityId = this.config.watch_battery_sensor || `sensor.watch_${entityBase}_battery_level`;
      const watchBatteryEntity = this.hass.states[watchBatteryEntityId];
      if (watchBatteryEntity) {
        const newLevel = parseFloat(watchBatteryEntity.state) || 0;
        const newIcon = watchBatteryEntity.attributes?.icon || 'mdi:battery';

        if (this._watchBatteryLevel !== newLevel) {
          this._watchBatteryLevel = newLevel;
        }
        if (this._watchBatteryIcon !== newIcon) {
          this._watchBatteryIcon = newIcon;
        }
      }

      // Watch Battery charging state
      if (this.config.watch_battery_state_sensor) {
        const watchBatteryStateEntity = this.hass.states[this.config.watch_battery_state_sensor];
        if (watchBatteryStateEntity) {
          const newChargingState = this._isChargingState(
            watchBatteryStateEntity.state,
            this.config.watch_battery_charging_value
          );

          if (this._watchBatteryCharging !== newChargingState) {
            this._watchBatteryCharging = newChargingState;
          }
        }
      }
    }

    // Activity
    // Activity - NASCONDE se stato è unknown, unavailable o simili, senza distinzione tra maiuscole/minuscole
    if (this.config.show_activity) {
      const activityEntityId = this.config.activity_sensor || `sensor.phone_${entityBase}_activity`;
      const activityEntity = this.hass.states[activityEntityId];

      // Lista stati da escludere (case insensitive)
      const invalidStates = ['unknown', 'unavailable', 'none', 'null', ''];

      if (
        activityEntity &&
        !invalidStates.includes((activityEntity.state || '').toLowerCase().trim())
      ) {
        this._activity = activityEntity.state;
        // Legge l'icona dall'attributo icon dell'entità, se non presente usa il mapping hardcoded
        if (activityEntity.attributes?.icon) {
          this._activityIcon = activityEntity.attributes.icon;
        } else {
          this._activityIcon = this._getActivityIcon();
        }
      } else {
        // Reset per valori non validi
        this._activity = 'unknown';
        this._activityIcon = '';
      }
    }


    // Connection
    if (this.config.show_connection) {
      const connectionEntityId = this.config.connection_sensor || `sensor.phone_${entityBase}_connection_type`;
      const connectionEntity = this.hass.states[connectionEntityId];
      if (connectionEntity) {
        this._connectionType = connectionEntity.state;
        // Legge l'icona dall'entità se disponibile
        this._connectionIcon = connectionEntity.attributes?.icon || null;
      }
    }

    // Distance
    if (this.config.show_distance) {
      const distanceEntityId = this.config.distance_sensor || `sensor.waze_${entityBase}`;
      const distanceEntity = this.hass.states[distanceEntityId];
      if (distanceEntity) {
        this._distanceFromHome = parseFloat(distanceEntity.state) || 0;
        // Legge l'unità di misura dall'entità, default 'km'
        this._distanceUnit = distanceEntity.attributes?.unit_of_measurement || 'km';
        // Legge l'icona dall'entità se disponibile
        this._distanceIcon = distanceEntity.attributes?.icon || 'mdi:map-marker-distance';
      }
    }

    // Travel time
    if (this.config.show_travel_time) {
      const travelEntityId = this.config.travel_sensor || `sensor.home_work_${entityBase}`;
      const travelEntity = this.hass.states[travelEntityId];
      if (travelEntity) {
        this._travelTime = parseFloat(travelEntity.state) || 0;
        // Legge l'icona dall'entità se disponibile
        this._travelIcon = travelEntity.attributes?.icon || 'mdi:car-clock';
      }
    }
  }

  _getActivityIcon() {
    const activity = this._activity?.toLowerCase() || '';
    const icons = {
      'walking': 'mdi:walk',
      'running': 'mdi:run',
      'automotive': 'mdi:car',
      'stationary': 'mdi:human',
      'cycling': 'mdi:bike',
      'still': 'mdi:human-handsdown',
      'unknown': 'mdi:help-circle-outline',
      'tilting': 'mdi:phone-rotate-landscape',
      'on_foot': 'mdi:walk',
      'on_bicycle': 'mdi:bike',
      'in_vehicle': 'mdi:car',
      // Italiano
      'a piedi': 'mdi:walk',
      'in bicicletta': 'mdi:bike',
      'in auto': 'mdi:car',
      'fermo': 'mdi:human-handsdown',
      'corsa': 'mdi:run'
    };
    return icons[activity] || 'mdi:human-male';
  }

  _getBatteryColor(level) {
    const batteryLevel = level !== undefined ? level : this._batteryLevel;
    if (batteryLevel < 10) return '#e45649';
    if (batteryLevel < 20) return '#e45649';
    if (batteryLevel < 30) return '#ff9800';
    if (batteryLevel < 50) return '#ffa229';
    if (batteryLevel < 80) return '#8bc34a';
    return '#50A14F';
  }

  // Check if connection type is WiFi (case-insensitive, handles iOS "Wi-Fi" and Android "wifi")
  _isWifiConnection(connectionType) {
    if (!connectionType) return false;
    const normalized = connectionType.toLowerCase().replace(/[-_\s]/g, '');
    return normalized === 'wifi';
  }

  // Open more-info dialog for an entity
  _showMoreInfo(entityId) {
    if (!entityId) return;
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId }
    });
    this.dispatchEvent(event);
  }

  // Get sensor entity ID for a specific type
  _getSensorEntityId(type) {
    const entityBase = this.config.entity?.split('.')[1] || '';
    const sensorMap = {
      'battery': this.config.battery_sensor || `sensor.phone_${entityBase}_battery_level`,
      'watch_battery': this.config.watch_battery_sensor || `sensor.watch_${entityBase}_battery_level`,
      'activity': this.config.activity_sensor || `sensor.phone_${entityBase}_activity`,
      'connection': this.config.connection_sensor || `sensor.phone_${entityBase}_connection_type`,
      'distance': this.config.distance_sensor || `sensor.waze_${entityBase}`,
      'travel': this.config.travel_sensor || `sensor.home_work_${entityBase}`
    };
    return sensorMap[type] || null;
  }

  _getCurrentStateConfig() {
    if (!this.config.state || !this.hass) return undefined;

    const entity = this.hass.states[this.config.entity];
    if (!entity) return undefined;

    return this.config.state.find(s => s.value === entity.state);
  }

  _getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      const unit = diffDay === 1 ? this._t('time.day') : this._t('time.days');
      return `${diffDay} ${unit} ${this._t('time.ago')}`;
    } else if (diffHour > 0) {
      const unit = diffHour === 1 ? this._t('time.hour') : this._t('time.hours');
      return `${diffHour} ${unit} ${this._t('time.ago')}`;
    } else if (diffMin > 0) {
      const unit = diffMin === 1 ? this._t('time.minute') : this._t('time.minutes');
      return `${diffMin} ${unit} ${this._t('time.ago')}`;
    } else {
      return this._t('time.just_now');
    }
  }

  _getPositionStyles(position) {
    const positions = {
      'top-left': { top: '8px', left: '8px' },
      'top-right': { top: '8px', right: '8px' },
      'top-left-2': { top: '40px', left: '8px' },
      'top-right-2': { top: '40px', right: '8px' },
      'bottom-left': { bottom: '8px', left: '8px' },
      'bottom-left-2': { bottom: '28px', left: '8px' },
      'bottom-right': { bottom: '8px', right: '8px' },
      'bottom-right-2': { bottom: '28px', right: '8px' }
    };

    if (!position || !(position in positions)) {
      console.warn(`Invalid position "${position}" received, defaulting to "top-right"`);
      return positions['top-right'];
    }
    return positions[position];
  }

  // Get border color based on person state
  _getStateBorderColor(state) {
    if (!state) return 'gray';

    const lowerState = state.toLowerCase();
    if (lowerState === 'home') return '#50A14F';
    if (lowerState === 'not_home') return '#e45649';
    return '#ff9800'; // orange for other locations (zones)
  }

  // Get ring background color - adapts to light/dark theme
  _getRingBackgroundColor() {
    // Try to detect theme from CSS variables
    if (this.shadowRoot) {
      const computedStyle = getComputedStyle(this);
      const bgColor = computedStyle.getPropertyValue('--primary-background-color').trim();

      // If we can get the background color, check if it's light or dark
      if (bgColor) {
        // Parse the color to determine brightness
        const isLight = this._isLightColor(bgColor);
        return isLight ? '#d0d0d0' : '#333333';
      }
    }
    // Default to dark theme background
    return '#333333';
  }

  // Check if a color is light (for theme detection)
  _isLightColor(color) {
    // Handle rgb/rgba format
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }

    // Handle hex format
    const hexMatch = color.match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }

    // Default to dark theme
    return false;
  }

  // Check if battery is charging based on state value
  // Supports custom value or auto-detection from predefined list
  _isChargingState(stateValue, customChargingValue) {
    if (!stateValue) return false;

    const state = String(stateValue).toLowerCase().trim();

    // If user specified a custom charging value, use exact match
    if (customChargingValue) {
      return state === customChargingValue.toLowerCase().trim();
    }

    // Auto-detect using predefined list of charging states
    const CHARGING_STATES = [
      'charging',      // iOS/Android Companion App
      'in carica',     // Italian
      'carica',        // Italian short
      'full',          // Full battery (still connected)
      'piena',         // Italian full
      'on',            // Binary sensor
      'true',          // Boolean
      '1',             // Numeric boolean
      'connected',     // Some devices
      'ac',            // AC power
      'usb',           // USB charging
      'wireless',      // Wireless charging
      'plugged',       // Plugged in
      'yes',           // Some devices
      'attivo',        // Italian active
      'en charge',     // French
      'laden',         // German
      'aufladen'       // German
    ];

    return CHARGING_STATES.includes(state);
  }

  // Get travel time color based on value
  _getTravelTimeColor(travelTime) {
    const maxTime = this.config.modern_travel_max_time || 60;
    if (travelTime >= maxTime * 0.67) return '#e45649'; // red
    if (travelTime >= maxTime * 0.33) return '#ffa229'; // yellow/orange
    return '#50A14F'; // green
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    // If no entity is configured, show a different message
    if (!this.config.entity) {
      return html`
        <ha-card>
          <div class="warning">
            <ha-icon icon="mdi:account-question"></ha-icon>
            <span>Please select a person entity in the configuration</span>
          </div>
        </ha-card>
      `;
    }

    // Scegli il layout in base alla configurazione
    if (this.config.layout === 'compact') {
      return this._renderCompactLayout();
    } else if (this.config.layout === 'modern') {
      return this._renderModernLayout();
    } else {
      return this._renderClassicLayout();
    }
  }

  _renderClassicLayout() {
    const entity = this.hass.states[this.config.entity];


    const stateConfig = this._getCurrentStateConfig();
    const stateName = stateConfig?.name || this.config.name || this._translateState(entity.state);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;
    const isCustomImage = !!this.config.entity_picture;

    const stateStyles = stateConfig?.styles?.name || {};
    const activityIcon = this._activityIcon;
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';

    // Calcola aspect ratio
    const [widthRatio, heightRatio] = (this.config.aspect_ratio || '1/1')
      .split('/')
      .map(n => parseFloat(n));
    const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;

    // Posizioni elementi con fallback sicuro
    const batteryPos = this._getPositionStyles(this.config.battery_position) || {};
    const watchBatteryPos = this._getPositionStyles(this.config.watch_battery_position) || {};
    const activityPos = this._getPositionStyles(this.config.activity_position) || {};
    const distancePos = this._getPositionStyles(this.config.distance_position) || {};
    const travelPos = this._getPositionStyles(this.config.travel_position) || {};
    const connectionPos = this._getPositionStyles(this.config.connection_position) || {};

    // Icon size configurabile
    const iconSize = this.config.classic_icon_size || 16;
    const iconStyle = `width: ${iconSize}px; height: ${iconSize}px;`;

    return html`
      <ha-card style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}">
        <div class="card-container" style="padding-bottom: ${paddingBottom}">
          <div class="card-content">
            <!-- Sezione superiore con foto, nome e stato -->
            <div class="content-top clickable" @click=${() => this._showMoreInfo(this.config.entity)} style="cursor: pointer;">
              ${this.config.show_entity_picture && entityPicture ? html`
                <div class="entity-picture" style="width: ${this.config.picture_size}%;">
                  <img
                    src="${stateConfig?.entity_picture || entityPicture}"
                    alt="${entity.attributes?.friendly_name || this.config.name || 'Person'}"
                    class="${stateConfig?.entity_picture ? 'custom-state-image' : (isCustomImage ? 'custom-image' : '')}"
                  />
                </div>
              ` : ''}

              ${this.config.show_person_name ? html`
                <div class="entity-person-name"
                     style="font-size: ${this.config.name_font_size};
                            margin-top: ${this.config.show_entity_picture ? `calc(${this.config.name_font_size} * 0.4)` : '0'};">
                  ${entity.attributes?.friendly_name || this.config.name || 'Person'}
                </div>
              ` : ''}

              ${this.config.show_name ? html`
                <div class="entity-state-name"
                     style="font-size: ${this.config.state_font_size};
                            color: ${stateStyles.color || 'var(--secondary-text-color)'};
                            margin-top: ${this.config.show_person_name ? `calc(${this.config.name_font_size} * 0.3)` : (this.config.show_entity_picture ? '16px' : '0')};">
                  ${stateName}
                </div>
              ` : ''}
            </div>

            <!-- Sezione inferiore sempre in basso -->
            ${this.config.show_last_changed ? html`
              <div class="content-bottom">
                <div class="entity-last-changed"
                     style="font-size: ${this.config.last_changed_font_size};">
                  ${this._getRelativeTime(entity.last_changed)}
                </div>
              </div>
            ` : ''}

            ${this.config.show_battery ? html`
              <div class="custom-field battery clickable ${this._batteryCharging ? 'charging' : ''}"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))}
                   style="color: ${this._getBatteryColor()};
                          font-size: ${this.config.battery_font_size};
                          ${Object.entries(batteryPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <span>📱</span>
                <ha-icon icon="${this._batteryCharging ? 'mdi:battery-charging' : this._batteryIcon}" .style=${iconStyle}></ha-icon>
                <span>${this._batteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_watch_battery ? html`
              <div class="custom-field watch-battery clickable ${this._watchBatteryCharging ? 'charging' : ''}"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))}
                   style="color: ${this._getBatteryColor(this._watchBatteryLevel)};
                          font-size: ${this.config.watch_battery_font_size};
                          ${Object.entries(watchBatteryPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <span>⌚</span>
                <ha-icon icon="${this._watchBatteryCharging ? 'mdi:battery-charging' : this._watchBatteryIcon}" .style=${iconStyle}></ha-icon>
                <span>${this._watchBatteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="custom-field activity clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))}
                   style="font-size: ${this.config.activity_font_size};
                          ${Object.entries(activityPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${activityIcon}" .style=${iconStyle}></ha-icon>
                <span style="margin-left: 4px; font-size: 11px;">${this._activity}</span>
              </div>
            ` : ''}

            ${this.config.show_distance && this._distanceFromHome > 0 ? html`
              <div class="custom-field distance clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))}
                   style="font-size: ${this.config.distance_font_size};
                          ${Object.entries(distancePos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" .style=${iconStyle}></ha-icon>
                <span>${Math.round(this._distanceFromHome)} ${this._distanceUnit}</span>
              </div>
            ` : ''}

            ${this.config.show_travel_time && this._travelTime > 0 ? html`
              <div class="custom-field travel clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))}
                   style="font-size: ${this.config.travel_font_size};
                          ${Object.entries(travelPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" .style=${iconStyle}></ha-icon>
                <span>${Math.round(this._travelTime)} min</span>
              </div>
            ` : ''}

            ${this.config.show_connection ? html`
              <div class="custom-field wifi clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))}
                   style="font-size: ${this.config.connection_font_size};
                          ${Object.entries(connectionPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" .style=${iconStyle}></ha-icon>
              </div>
            ` : ''}
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderCompactLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();

    // Nome della persona (non dello stato!)
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';

    // Nome dello stato personalizzato (location)
    const displayLocation = stateConfig?.name || this._translateState(entity.state);

    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;
    const stateStyles = stateConfig?.styles?.name || {};

    // Activity icon e color
    const activityIcon = this._activityIcon;
    let activityColor = 'var(--secondary-text-color)';
    if (this._activity === 'Stationary') activityColor = 'green';
    else if (this._activity === 'Walking' || this._activity === 'Running') activityColor = 'orange';
    else if (this._activity === 'Automotive') activityColor = 'blue';

    // Connection
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? 'blue' : 'orange';

    // Battery color
    const batteryColor = this._getBatteryColor();

    // Larghezza configurabile
    const maxWidth = this.config.compact_width || 300;

    // Icon size configurabile - tutto si scala proporzionalmente
    const iconSize = this.config.compact_icon_size || 16;
    const badgeSize = iconSize * 2; // Il badge è il doppio dell'icona
    const smallIconSize = Math.max(10, Math.round(iconSize * 0.75));
    const badgeFontSize = Math.max(8, Math.round(iconSize * 0.56)); // Font proporzionale
    const smallFontSize = Math.max(7, Math.round(iconSize * 0.5));
    const pictureSize = Math.max(36, Math.round(iconSize * 2.5)); // Immagine proporzionale
    const nameFontSize = Math.max(12, Math.round(iconSize * 0.875));
    const locationFontSize = Math.max(9, Math.round(iconSize * 0.625));
    const cardPadding = Math.max(6, Math.round(iconSize * 0.5));
    const badgeGap = Math.max(4, Math.round(iconSize * 0.5));

    return html`
      <ha-card style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}; padding: ${cardPadding}px; max-width: ${maxWidth}px;">
        <div class="compact-grid">
          ${this.config.show_entity_picture && entityPicture ? html`
            <div class="compact-picture clickable" @click=${() => this._showMoreInfo(this.config.entity)}>
              <img src="${entityPicture}" alt="${personName}" style="width: ${pictureSize}px; height: ${pictureSize}px;" />
            </div>
          ` : ''}

          ${this.config.show_name ? html`
            <div class="compact-name clickable" @click=${() => this._showMoreInfo(this.config.entity)} style="color: inherit; cursor: pointer; font-size: ${nameFontSize}px;">
              ${personName}
            </div>
          ` : ''}

          <div class="compact-location clickable" @click=${() => this._showMoreInfo(this.config.entity)} style="color: ${stateStyles.color || 'var(--secondary-text-color)'}; cursor: pointer; font-size: ${locationFontSize}px;">
            ${displayLocation}
          </div>

          <div class="compact-icons" style="gap: ${badgeGap}px;">
           ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))} style="width: ${badgeSize}px; height: ${badgeSize}px;">
                <ha-icon icon="${activityIcon}" style="--mdc-icon-size: ${iconSize}px; color: ${activityColor};"></ha-icon>
              </div>
            ` : ''}

            ${this.config.show_connection ? html`
              <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="width: ${badgeSize}px; height: ${badgeSize}px;">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="--mdc-icon-size: ${iconSize}px; color: ${connectionColor};"></ha-icon>
              </div>
            ` : ''}

            ${this.config.show_battery ? html`
              <div class="compact-icon-badge clickable ${this._batteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))} style="width: ${badgeSize}px; height: ${badgeSize}px;">
                ${this._batteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(iconSize * 0.6)}px; color: #4CAF50; position: absolute; top: -2px; right: -2px;"></ha-icon>` : ''}
                <span style="font-size: ${badgeFontSize}px; font-weight: bold; color: ${batteryColor};">${this._batteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_watch_battery ? html`
              <div class="compact-icon-badge clickable ${this._watchBatteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))} style="width: ${badgeSize}px; height: ${badgeSize}px; flex-direction: column; justify-content: center; align-items: center; gap: 0; line-height: 1; position: relative;">
                ${this._watchBatteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(iconSize * 0.5)}px; color: #4CAF50; position: absolute; top: -2px; right: -2px;"></ha-icon>` : ''}
                <span style="font-size: ${smallFontSize}px; line-height: 1;">⌚</span>
                <span style="font-size: ${smallFontSize}px; font-weight: bold; color: ${this._getBatteryColor(this._watchBatteryLevel)}; line-height: 1;">
                  ${this._watchBatteryLevel}%
                </span>
              </div>
            ` : ''}

            ${this.config.show_distance && this._distanceFromHome > 0 ? html`
              <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="width: ${badgeSize}px; height: ${badgeSize}px; flex-direction: column; justify-content: center; align-items: center; gap: 0; line-height: 1;">
                <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size: ${smallIconSize}px;"></ha-icon>
                <span style="font-size: ${smallFontSize}px; font-weight: bold; color: #4A9EFF; line-height: 1;">
                  ${Math.round(this._distanceFromHome)}${this._distanceUnit}
                </span>
              </div>
            ` : ''}

            ${this.config.show_travel_time && this._travelTime > 0 ? html`
              <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="width: ${badgeSize}px; height: ${badgeSize}px; flex-direction: column; justify-content: center; align-items: center; gap: 0; line-height: 1;">
                <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size: ${smallIconSize}px;"></ha-icon>
                <span style="font-size: ${smallFontSize}px; font-weight: bold; line-height: 1;">
                  ${Math.round(this._travelTime)}m
                </span>
              </div>
            ` : ''}
          </div>
        </div>
      </ha-card>
    `;
  }

  // NEW: Modern Layout with circular progress indicators
  _renderModernLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();

    // Person name
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';

    // State name (location)
    const displayLocation = stateConfig?.name || this._translateState(entity.state);

    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;
    const stateStyles = stateConfig?.styles?.name || {};

    // Border color based on state
    const borderColor = stateStyles.color || this._getStateBorderColor(entity.state);

    // Battery colors and values
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const batteryLevel = Math.round(this._batteryLevel);

    // Watch Battery
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const watchBatteryLevel = Math.round(this._watchBatteryLevel);

    // Travel time
    const travelTime = Math.round(this._travelTime);
    const maxTravelTime = this.config.modern_travel_max_time || 60;
    const travelPercentage = travelTime > 0 ? Math.min((travelTime / maxTravelTime) * 100, 100) : 0;
    const travelColor = this._getTravelTimeColor(travelTime);

    // Distance
    const distance = Math.round(this._distanceFromHome);
    const maxDistance = this.config.modern_distance_max || 100;
    const distancePercentage = distance > 0 ? Math.min((distance / maxDistance) * 100, 100) : 0;

    // Activity
    const activityIcon = this._activityIcon;
    const activity = this._activity;

    // Connection
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? '#4CAF50' : '#FF9800';

    // Picture size
    const pictureSize = this.config.modern_picture_size || 40;

    // Ring size (configurable)
    const ringSize = this.config.modern_ring_size || 38;
    const ringValueFontSize = Math.max(9, Math.round(ringSize * 0.29)); // Scale font with ring
    const ringUnitFontSize = Math.max(6, Math.round(ringSize * 0.18));
    const ringIconSize = Math.max(16, Math.round(ringSize * 0.58));

    // Ring background color (adapts to theme)
    const ringBgColor = this._getRingBackgroundColor();

    // Width
    const maxWidth = this.config.modern_width || 300;

    return html`
      <ha-card style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}; padding: 10px 12px;">
        <div class="modern-container">
          <!-- Picture with state-colored border - clicks open person entity -->
          ${this.config.show_entity_picture && entityPicture ? html`
            <div class="modern-picture clickable"
                 @click=${() => this._showMoreInfo(this.config.entity)}
                 style="
              border: 3px solid ${borderColor};
              border-radius: 50%;
              width: ${pictureSize}px;
              height: ${pictureSize}px;
              overflow: hidden;
              flex-shrink: 0;
              cursor: pointer;
            ">
              <img
                src="${entityPicture}"
                alt="${personName}"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
          ` : ''}

          <!-- Center: Name and State - clicks open person entity -->
          <div class="modern-info clickable" @click=${() => this._showMoreInfo(this.config.entity)} style="cursor: pointer;">
            ${this.config.show_person_name ? html`
              <div style="font-size: ${this.config.modern_name_font_size || '14px'}; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0;">
                ${personName}
              </div>
            ` : ''}
            ${this.config.show_name ? html`
              <div style="font-size: ${this.config.modern_state_font_size || '12px'}; color: ${stateStyles.color || 'var(--secondary-text-color)'}; margin: 0; padding: 0;">
                ${displayLocation}
              </div>
            ` : ''}
          </div>

          <!-- Right: Circular indicators -->
          <div class="modern-rings">
            <!-- Battery -->
            ${this.config.show_battery ? html`
              <div class="ring-container clickable ${this._batteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))} style="width: ${ringSize}px; height: ${ringSize}px; position: relative;">
                ${this._batteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(ringSize * 0.35)}px; color: #4CAF50; position: absolute; top: -4px; right: -4px; z-index: 1;"></ha-icon>` : ''}
                <svg viewBox="0 0 36 36" class="ring-svg ${this._batteryCharging ? 'charging-ring' : ''}">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._batteryCharging ? '#4CAF50' : batteryColor}" stroke-width="3" stroke-dasharray="${batteryLevel}, 100" stroke-linecap="round"/>
                </svg>
                <div class="ring-text">
                  <span class="ring-value" style="font-size: ${ringValueFontSize}px;">${batteryLevel}</span>
                  <span class="ring-unit" style="font-size: ${ringUnitFontSize}px;">%</span>
                </div>
              </div>
            ` : ''}

            <!-- Watch Battery -->
            ${this.config.show_watch_battery ? html`
              <div class="ring-container clickable ${this._watchBatteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))} style="width: ${ringSize}px; height: ${ringSize}px; position: relative;">
                ${this._watchBatteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(ringSize * 0.35)}px; color: #4CAF50; position: absolute; top: -4px; right: -4px; z-index: 1;"></ha-icon>` : ''}
                <svg viewBox="0 0 36 36" class="ring-svg ${this._watchBatteryCharging ? 'charging-ring' : ''}">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._watchBatteryCharging ? '#4CAF50' : watchBatteryColor}" stroke-width="3" stroke-dasharray="${watchBatteryLevel}, 100" stroke-linecap="round"/>
                </svg>
                <div class="ring-text">
                  <span class="ring-value" style="font-size: ${ringValueFontSize}px;">${watchBatteryLevel}</span>
                  <span class="ring-unit" style="font-size: ${ringUnitFontSize}px;">⌚</span>
                </div>
              </div>
            ` : ''}

            <!-- Activity -->
            ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="ring-container ring-icon-only clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))} style="width: ${ringSize}px; height: ${ringSize}px;">
                <ha-icon icon="${activityIcon}" style="--mdc-icon-size: ${ringIconSize}px;"></ha-icon>
              </div>
            ` : ''}

            <!-- Connection -->
            ${this.config.show_connection ? html`
              <div class="ring-container ring-icon-only clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="width: ${ringSize}px; height: ${ringSize}px;">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="color: ${connectionColor}; --mdc-icon-size: ${ringIconSize}px;"></ha-icon>
              </div>
            ` : ''}

            <!-- Distance -->
            ${this.config.show_distance ? html`
              <div class="ring-container clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="width: ${ringSize}px; height: ${ringSize}px;">
                <svg viewBox="0 0 36 36" class="ring-svg">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._distanceColor || '#4A9EFF'}" stroke-width="3" stroke-dasharray="${distancePercentage}, 100" stroke-linecap="round"/>
                </svg>
                <div class="ring-text">
                  <span class="ring-value" style="font-size: ${ringValueFontSize}px;">${distance}</span>
                  <span class="ring-unit" style="font-size: ${ringUnitFontSize}px;">${this._distanceUnit}</span>
                </div>
              </div>
            ` : ''}

            <!-- Travel time -->
            ${this.config.show_travel_time ? html`
              <div class="ring-container clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="width: ${ringSize}px; height: ${ringSize}px;">
                <svg viewBox="0 0 36 36" class="ring-svg">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${travelColor}" stroke-width="3" stroke-dasharray="${travelPercentage}, 100" stroke-linecap="round"/>
                </svg>
                <div class="ring-text">
                  <span class="ring-value" style="font-size: ${ringValueFontSize}px;">${travelTime}</span>
                  <span class="ring-unit" style="font-size: ${ringUnitFontSize}px;">min</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </ha-card>
    `;
  }



  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      ha-card:hover {
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      }

      /* Charging animation */
      @keyframes charging-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.6);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
        }
      }

      @keyframes charging-glow {
        0%, 100% {
          filter: brightness(1);
        }
        50% {
          filter: brightness(1.3);
        }
      }

      .charging {
        animation: charging-glow 2s ease-in-out infinite;
      }


      .charging-ring {
        animation: charging-glow 2s ease-in-out infinite;
      }

      .card-container {
        position: relative;
        width: 100%;
        height: 0;
      }

      .card-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
      }

      .content-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }

      .content-bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: auto;
      }

      .entity-picture {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 0 auto;
        max-width: 100%;
        max-height: 100%;
      }


      .entity-picture img {
        display: block;
        margin: auto;
        width: 100%;       /* o una dimensione fissa, es. 100px */
        height: 100%;      /* stessa misura per avere un cerchio */
        max-width: 100%;
        border-radius: 50%;  /* rende l'immagine circolare */
        border: 3px solid var(--primary-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        background-color: white;
        object-fit: cover;   /* fa il ritaglio proporzionale */
      }


      .entity-picture img.custom-image {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        object-fit: contain !important;
      }

      .entity-picture img.custom-state-image {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        object-fit: contain !important;
      }



      .position-button-group.buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .position-button-group.buttons button {
        padding: 6px 12px;
        border: 1px solid var(--divider-color);
        background: none;
        cursor: pointer;
        border-radius: 4px;
        color: var(--primary-text-color);
        transition: background-color 0.3s;
      }

      .position-button-group.buttons button.selected {
        background-color: var(--primary-color);
        color: white;
      }

      .custom-field.watch-battery {
        font-weight: 500;
      }

      .entity-person-name {
        font-weight: 600;
        text-align: center;
        color: var(--primary-text-color);
        line-height: 1.2;
      }

      .entity-state-name {
        font-weight: 500;
        text-align: center;
        line-height: 1.3;
      }

      .entity-last-changed {
        color: var(--secondary-text-color);
        text-align: center;
        font-size: 0.9em;
        line-height: 1.2;
      }

      .entity-name {
        font-weight: 500;
        text-align: center;
        margin: 8px 0 4px 0;
      }

      .entity-state {
        color: var(--secondary-text-color);
        text-align: center;
      }

      .custom-field {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 2px;
        background: var(--card-background-color);
        padding: 2px 6px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      }

      .custom-field.battery {
        font-weight: 500;
      }

      .warning {
        padding: 16px;
        color: var(--error-color);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .warning ha-icon {
        --mdc-icon-size: 48px;
      }

      ha-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      /* Compact Layout Styles */
      .compact-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto auto;
        grid-template-areas:
          "picture name"
          "picture location"
          "icons icons";
        row-gap: 1px;
      }

      .compact-picture {
        grid-area: picture;
        justify-self: start;
        align-self: start;
        margin-right: 8px;
      }

      .compact-picture img {
        border: 3px solid var(--primary-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        object-fit: cover;
      }

      .compact-name {
        grid-area: name;
        justify-self: start;
        align-self: end;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        padding: 0;
      }

      .compact-location {
        grid-area: location;
        justify-self: start;
        align-self: start;
        font-size: 10px;
        margin: 0;
        padding: 0;
        margin-bottom: 3px;
      }

      .compact-icons {
        grid-area: icons;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        padding-top: 6px;
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.1));
        margin-top: 3px;
      }

      .compact-icon-badge {
        background: var(--secondary-background-color, rgba(255,255,255,0.1));
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-text-color, #fff);
      }

      /* Modern Layout Styles */
      .modern-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        width: 100%;
      }

      .modern-picture {
        flex-shrink: 0;
      }

      .modern-info {
        flex: 1 1 auto;
        min-width: 60px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
      }

      .modern-info div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .modern-rings {
        display: flex;
        flex-direction: row;
        gap: 6px;
        flex-shrink: 0;
        margin-left: auto;
      }

      .ring-container {
        position: relative;
        width: 38px;
        height: 38px;
        flex-shrink: 0;
      }

      .ring-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .ring-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      .ring-value {
        font-size: 11px;
        font-weight: bold;
        color: var(--primary-text-color, #fff);
      }

      .ring-unit {
        font-size: 7px;
        color: var(--secondary-text-color, #aaa);
        margin-top: 1px;
      }

      .ring-icon-only {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--secondary-background-color, rgba(255,255,255,0.1));
        border-radius: 50%;
      }

      .ring-icon-only ha-icon {
        --mdc-icon-size: 22px;
      }

      .clickable {
        cursor: pointer;
        transition: transform 0.2s ease, opacity 0.2s ease;
      }

      .clickable:hover {
        transform: scale(1.1);
        opacity: 0.8;
      }

      .clickable:active {
        transform: scale(0.95);
      }

      .circular-chart {
        display: block;
      }

      .circle-bg {
        stroke-linecap: round;
      }

      .circle {
        stroke-linecap: round;
        transition: stroke-dasharray 0.3s ease;
      }

      @media (max-width: 400px) {
        .custom-field {
          font-size: 11px !important;
        }

        .custom-field ha-icon {
          --mdc-icon-size: 14px;
        }
      }
    `;
  }
}

// Card registration
if (!customElements.get('person-tracker-card')) {
  customElements.define('person-tracker-card', PersonTrackerCard);
  console.info(
    '%c PERSON-TRACKER-CARD %c v1.2.3 %c! ',
    'background-color: #7DDA9F; color: black; font-weight: bold;',
    'background-color: #93ADCB; color: white; font-weight: bold;',
    'background-color: #FFD700; color: black; font-weight: bold;'
  );
}

// Add info for Lovelace
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'person-tracker-card',
  name: 'Person Tracker Card',
  description: 'Advanced person tracking card with full visual editor',
  preview: true
});
