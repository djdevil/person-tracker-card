// Person Tracker Card v1.1.2 - Multilanguage Version
// Full support for all editor options
// Languages: Italian (default), English, French, German
// v1.1.2: Added dynamic unit of measurement for distance sensor
// v1.1.2: Activity icon now follows entity's icon attribute with fallback to predefined mapping
// v1.1.2: Fixed WiFi detection for Android (case-insensitive check for "wifi", "Wi-Fi", etc.)

console.log("Person Tracker Card v1.1.2 Multilanguage loading...");

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
      _activity: { state: true },
      _activityIcon: { state: true },
      _connectionType: { state: true },
      _distanceFromHome: { state: true },
      _distanceUnit: { state: true },
      _travelTime: { state: true },
      _watchBatteryLevel: { state: true },
      _watchBatteryIcon: { state: true }
    };
  }

  constructor() {
    super();
    this._batteryLevel = 0;
    this._batteryIcon = 'mdi:battery';
    this._activity = 'unknown';
    this._activityIcon = '';
    this._connectionType = 'unknown';
    this._distanceFromHome = 0;
    this._distanceUnit = 'km';
    this._watchBatteryLevel = 0;
    this._watchBatteryIcon = 'mdi:battery';
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

    return this.config.triggers_update === 'all';
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
    }
    if (this.config.show_watch_battery) {
      entities.push(this.config.watch_battery_sensor || `sensor.watch_${entityBase}_battery_level`);
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
        this._batteryLevel = parseFloat(batteryEntity.state) || 0;
        this._batteryIcon = batteryEntity.attributes?.icon || 'mdi:battery';
      }
    }
    // Watch Battery
    if (this.config.show_watch_battery) {
      const watchBatteryEntityId = this.config.watch_battery_sensor || `sensor.watch_${entityBase}_battery_level`;
      const watchBatteryEntity = this.hass.states[watchBatteryEntityId];
      if (watchBatteryEntity) {
        this._watchBatteryLevel = parseFloat(watchBatteryEntity.state) || 0;
        this._watchBatteryIcon = watchBatteryEntity.attributes?.icon || 'mdi:battery';
      }
    }
    // Activity
    if (this.config.show_activity) {
      const activityEntityId = this.config.activity_sensor || `sensor.phone_${entityBase}_activity`;
      const activityEntity = this.hass.states[activityEntityId];
      if (activityEntity) {
        this._activity = activityEntity.state;
        // Legge l'icona dall'attributo icon dell'entità, se non presente usa il mapping hardcoded
        if (activityEntity.attributes?.icon) {
          this._activityIcon = activityEntity.attributes.icon;
        } else {
          // Fallback alle icone predefinite
          this._activityIcon = this._getActivityIcon();
        }
      }
    }

    // Connection
    if (this.config.show_connection) {
      const connectionEntityId = this.config.connection_sensor || `sensor.phone_${entityBase}_connection_type`;
      const connectionEntity = this.hass.states[connectionEntityId];
      if (connectionEntity) {
        this._connectionType = connectionEntity.state;
      }
    }

    // Distance
    if (this.config.show_distance) {
      const distanceEntityId = this.config.distance_sensor || `sensor.waze_${entityBase}`;
      const wazeEntity = this.hass.states[distanceEntityId];
      if (wazeEntity) {
        this._distanceFromHome = parseFloat(wazeEntity.state) || 0;
        // Legge l'unità di misura dall'entità, default 'km'
        this._distanceUnit = wazeEntity.attributes?.unit_of_measurement || 'km';
      }
    }

    // Travel time
    if (this.config.show_travel_time) {
      const travelEntityId = this.config.travel_sensor || `sensor.home_work_${entityBase}`;
      const travelEntity = this.hass.states[travelEntityId];
      if (travelEntity) {
        this._travelTime = parseFloat(travelEntity.state) || 0;
      }
    }
  }

  _getActivityIcon() {
    const icons = {
      'Walking': 'mdi:walk',
      'Running': 'mdi:run',
      'Automotive': 'mdi:car',
      'Stationary': 'mdi:human',
      'Cycling': 'mdi:bike',
      'Still': 'mdi:human-handsdown',
      'Unknown': 'mdi:help',
      'in_vehicle': 'mdi:car',
      'on_bicycle': 'mdi:bike',
      'on_foot': 'mdi:human',
      'still': 'mdi:human-handsdown',
      'tilting': 'mdi:hiking',
      'walking': 'mdi:walk',
      'running': 'mdi:run'
    };
    return icons[this._activity] || '';
  }

  _getBatteryColor(level) {
    const batteryLevel = level !== undefined ? level : this._batteryLevel;
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

    return html`
      <ha-card style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}">
        <div class="card-container" style="padding-bottom: ${paddingBottom}">
          <div class="card-content">
            <!-- Sezione superiore con foto, nome e stato -->
            <div class="content-top">
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
              <div class="custom-field battery"
                   style="color: ${this._getBatteryColor()};
                          font-size: ${this.config.battery_font_size};
                          ${Object.entries(batteryPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <span>📱</span>
                <ha-icon icon="${this._batteryIcon}" .style=${'width: 16px; height: 16px;'}></ha-icon>
                <span>${this._batteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_watch_battery ? html`
              <div class="custom-field watch-battery"
                   style="color: ${this._getBatteryColor(this._watchBatteryLevel)};
                          font-size: ${this.config.watch_battery_font_size};
                          ${Object.entries(watchBatteryPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <span>⌚</span>
                <ha-icon icon="${this._watchBatteryIcon}" .style=${'width: 16px; height: 16px;'}></ha-icon>
                <span>${this._watchBatteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_activity && this._activity && this._activity !== 'unknown' && activityIcon ? html`
              <div class="custom-field activity"
                   style="font-size: ${this.config.activity_font_size};
                          ${Object.entries(activityPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${activityIcon}" .style=${'width: 16px; height: 16px;'}></ha-icon>
                <span style="margin-left: 4px; font-size: 11px;">${this._activity}</span>
              </div>
            ` : ''}

            ${this.config.show_distance && this._distanceFromHome > 0 ? html`
              <div class="custom-field distance"
                   style="font-size: ${this.config.distance_font_size};
                          ${Object.entries(distancePos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="mdi:home" .style=${'width: 16px; height: 16px;'}></ha-icon>
                <span>${Math.round(this._distanceFromHome)} ${this._distanceUnit}</span>
              </div>
            ` : ''}

            ${this.config.show_travel_time && this._travelTime > 0 ? html`
              <div class="custom-field travel"
                   style="font-size: ${this.config.travel_font_size};
                          ${Object.entries(travelPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="mdi:car-clock" .style=${'width: 16px; height: 16px;'}></ha-icon>
                <span>${Math.round(this._travelTime)} min</span>
              </div>
            ` : ''}

            ${this.config.show_connection ? html`
              <div class="custom-field wifi"
                   style="font-size: ${this.config.connection_font_size};
                          ${Object.entries(connectionPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${connectionIcon}" .style=${'width: 16px; height: 16px;'}></ha-icon>
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
    if (this._activity === 'Stationary' || this._activity === 'still' || this._activity === 'Still' || this._activity === 'on_foot') activityColor = 'green';
    else if (this._activity === 'Walking' || this._activity === 'Running' || this._activity === 'tilting' || this._activity === 'walking' || this._activity === 'running') activityColor = 'orange';
    else if (this._activity === 'Automotive' || this._activity === 'Cycling' || this._activity === 'on_bicycle' || this._activity === 'in_vehicle') activityColor = 'blue';

    // Connection
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? 'blue' : 'orange';

    // Battery color
    const batteryColor = this._getBatteryColor();

    // Larghezza configurabile
    const maxWidth = this.config.compact_width || 300;

    return html`
      <ha-card style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}; padding: 8px; max-width: ${maxWidth}px;">
        <div class="compact-grid">
          ${this.config.show_entity_picture && entityPicture ? html`
            <div class="compact-picture">
              <img src="${entityPicture}" alt="${personName}" />
            </div>
          ` : ''}

          ${this.config.show_name ? html`
            <div class="compact-name" style="color: inherit">
              ${personName}
            </div>
          ` : ''}

          <div class="compact-location" style="color: ${stateStyles.color || 'var(--secondary-text-color)'}">
            ${displayLocation}
          </div>

          <div class="compact-icons">
            ${this.config.show_activity && activityIcon ? html`
              <div class="compact-icon-badge">
                <ha-icon icon="${activityIcon}" style="--mdc-icon-size: 16px; color: ${activityColor};"></ha-icon>
              </div>
            ` : ''}

            ${this.config.show_connection ? html`
              <div class="compact-icon-badge">
                <ha-icon icon="${connectionIcon}" style="--mdc-icon-size: 16px; color: ${connectionColor};"></ha-icon>
              </div>
            ` : ''}

            ${this.config.show_battery ? html`
              <div class="compact-icon-badge">
                <span style="font-size: 9px; font-weight: bold; color: ${batteryColor};">${this._batteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_watch_battery ? html`
              <div class="compact-icon-badge">
                <span>⌚</span>
                <span style="font-size: 9px; font-weight: bold; color: ${this._getBatteryColor(this._watchBatteryLevel)};">
                  ${this._watchBatteryLevel}%
                </span>
              </div>
            ` : ''}

            ${this.config.show_distance && this._distanceFromHome > 0 ? html`
              <div class="compact-icon-badge" style="flex-direction: column;">
                <ha-icon icon="mdi:home" style="--mdc-icon-size: 12px;"></ha-icon>
                <span style="font-size: 8px; font-weight: bold; color: #4A9EFF; margin-top: -2px;">
                  ${Math.round(this._distanceFromHome)}${this._distanceUnit}
                </span>
              </div>
            ` : ''}

            ${this.config.show_travel_time && this._travelTime > 0 ? html`
              <div class="compact-icon-badge" style="flex-direction: column;">
                <ha-icon icon="mdi:car-clock" style="--mdc-icon-size: 12px;"></ha-icon>
                <span style="font-size: 8px; font-weight: bold; margin-top: -2px;">
                  ${Math.round(this._travelTime)}m
                </span>
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
        border-top: 1px solid rgba(255,255,255,0.1);
        margin-top: 3px;
      }

      .compact-icon-badge {
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
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
    '%c PERSON-TRACKER-CARD %c v1.1.2 %c! ',
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
