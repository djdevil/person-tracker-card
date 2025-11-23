// Person Tracker Card v2.1 - Fixed Version
// Complete support for all editor options

console.log("Person Tracker Card v2.1 Fixed loading...");

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Translations
const translations = {
  en: {
    day: 'day',
    days: 'days',
    hour: 'hour',
    hours: 'hours',
    minute: 'minute',
    minutes: 'minutes',
    now: 'Now',
    ago: 'ago',
    entity_not_found: 'Entity {entity} not found'
  },
  it: {
    day: 'giorno',
    days: 'giorni',
    hour: 'ora',
    hours: 'ore',
    minute: 'minuto',
    minutes: 'minuti',
    now: 'Ora',
    ago: 'fa',
    entity_not_found: 'Entità {entity} non trovata'
  }
};

class PersonTrackerCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      config: { attribute: false },
      _batteryLevel: { state: true },
      _batteryIcon: { state: true },
      _activity: { state: true },
      _connectionType: { state: true },
      _distanceFromHome: { state: true },
      _travelTime: { state: true }
    };
  }

  constructor() {
    super();
    this._batteryLevel = 0;
    this._batteryIcon = 'mdi:battery';
    this._activity = 'unknown';
    this._connectionType = 'unknown';
    this._distanceFromHome = 0;
    this._travelTime = 0;
  }

  // Get translated string
  _t(key, replacements = {}) {
    const lang = this.hass?.language || 'en';
    const translationSet = translations[lang] || translations['en'];
    let text = translationSet[key] || translations['en'][key] || key;
    
    // Replace placeholders
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    
    return text;
  }

  // Visual editor support
  static async getConfigElement() {
    // Try first the fixed version, then the normal one
    await import('./person-tracker-card-editor-fixed.js').catch(async () => {
      await import('./person-tracker-card-editor.js').catch(() => {
        console.warn('Editor not found');
      });
    });
    return document.createElement('person-tracker-card-editor');
  }

  static getStubConfig() {
    return {
      entity: 'person.example',
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

    // Default configuration with all the new options
    this.config = {
      // Display
      show_entity_picture: true,
      show_name: true,
      show_last_changed: true,
      show_battery: true,
      show_activity: true,
      show_distance: true,
      show_travel_time: true,
      show_connection: true,
      // Layout
      aspect_ratio: '1/0.7',
      triggers_update: 'all',
      // General styles
      name_font_size: '20px',
      state_font_size: '14px',
      card_background: 'rgba(255,255,255,0.05)',
      card_border_radius: '15px',
      picture_size: 55,
      // Element positions
      battery_position: 'top-right',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right',
      // Element font sizes
      battery_font_size: '13px',
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

    // Check main entity
    if (oldHass.states[this.config.entity] !== this.hass.states[this.config.entity]) {
      return true;
    }

    // If triggers_update is 'entity', update only for main entity
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

    // Activity
    if (this.config.show_activity) {
      const activityEntityId = this.config.activity_sensor || `sensor.phone_${entityBase}_activity`;
      const activityEntity = this.hass.states[activityEntityId];
      if (activityEntity) {
        this._activity = activityEntity.state;
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
      'Unknown': 'mdi:help'
    };
    return icons[this._activity] || '';
  }

  _getBatteryColor() {
    if (this._batteryLevel < 20) return '#e45649';
    if (this._batteryLevel < 30) return '#ff9800';
    if (this._batteryLevel < 50) return '#ffa229';
    if (this._batteryLevel < 80) return '#8bc34a';
    return '#50A14F';
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
      const dayLabel = diffDay === 1 ? this._t('day') : this._t('days');
      return `${diffDay} ${dayLabel} ${this._t('ago')}`;
    } else if (diffHour > 0) {
      const hourLabel = diffHour === 1 ? this._t('hour') : this._t('hours');
      return `${diffHour} ${hourLabel} ${this._t('ago')}`;
    } else if (diffMin > 0) {
      const minLabel = diffMin === 1 ? this._t('minute') : this._t('minutes');
      return `${diffMin} ${minLabel} ${this._t('ago')}`;
    } else {
      return this._t('now');
    }
  }

  _getPositionStyles(position) {
    const positions = {
      'top-left': { top: '8px', left: '8px' },
      'top-left-2': { top: '28px', left: '8px' },
      'top-right': { top: '8px', right: '8px' },
      'top-right-2': { top: '28px', right: '8px' },
      'bottom-left': { bottom: '8px', left: '8px' },
      'bottom-left-2': { bottom: '28px', left: '8px' },
      'bottom-right': { bottom: '8px', right: '8px' },
      'bottom-right-2': { bottom: '28px', right: '8px' }
    };

    if (!position || !(position in positions)) {
      console.warn(`Invalid position "${position}" received, using default "top-right"`);
      return positions['top-right'];
    }
    return positions[position];
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const entity = this.hass.states[this.config.entity];
    if (!entity) {
      return html`
        <ha-card>
          <div class="warning">
            <ha-icon icon="mdi:alert"></ha-icon>
            <span>${this._t('entity_not_found', { entity: this.config.entity })}</span>
          </div>
        </ha-card>
      `;
    }

    const stateConfig = this._getCurrentStateConfig();
    const stateName = stateConfig?.name || this.config.name || entity.state;
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;
    const isCustomImage = !!this.config.entity_picture;

    const stateStyles = stateConfig?.styles?.name || {};
    const activityIcon = this._getActivityIcon();
    const connectionIcon = this._connectionType === 'Wi-Fi' ? 'mdi:wifi' : 'mdi:signal';

    // Calculate aspect ratio
    const [widthRatio, heightRatio] = (this.config.aspect_ratio || '1/1')
      .split('/')
      .map(n => parseFloat(n));
    const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;

    // Element positions with safe fallback
    const batteryPos = this._getPositionStyles(this.config.battery_position) || {};
    const activityPos = this._getPositionStyles(this.config.activity_position) || {};
    const distancePos = this._getPositionStyles(this.config.distance_position) || {};
    const travelPos = this._getPositionStyles(this.config.travel_position) || {};
    const connectionPos = this._getPositionStyles(this.config.connection_position) || {};

    return html`
      <ha-card style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}">
        <div class="card-container" style="padding-bottom: ${paddingBottom}">
          <div class="card-content">
            ${this.config.show_entity_picture && entityPicture ? html`
              <div class="entity-picture" style="width: ${this.config.picture_size}%;">
                <img
                  src="${stateConfig?.entity_picture || entityPicture}"
                  alt="${entity.attributes?.friendly_name || this.config.name || 'Person'}"
                  class="${stateConfig?.entity_picture ? 'custom-state-image' : (isCustomImage ? 'custom-image' : '')}"
                />
              </div>
            ` : ''}

            ${this.config.show_name ? html`
              <div class="entity-name"
                   style="font-size: ${this.config.name_font_size};
                          color: ${stateStyles.color || 'inherit'}">
                ${stateName}
              </div>
            ` : ''}

            ${this.config.show_last_changed ? html`
              <div class="entity-state" style="font-size: ${this.config.state_font_size}">
                ${this._getRelativeTime(entity.last_changed)}
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
                <span>${Math.round(this._distanceFromHome)} km</span>
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
        justify-content: center;
        padding: 16px;
      }

      .entity-picture {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 16px auto; /* Adds 16px below the image */
        max-width: 100%;
        max-height: 100%;
      }


      .entity-picture img {
        display: block;
        margin: auto;
        width: 100%;       /* or a fixed size, e.g. 100px */
        height: 100%;      /* same measure to have a circle */
        max-width: 100%;
        border-radius: 50%;  /* makes the image circular */
        border: 3px solid var(--primary-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        background-color: white;
        object-fit: cover;   /* makes proportional cropping */
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
    '%c PERSON-TRACKER-CARD %c v2.1 FIXED %c Complete Editor! ',
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
  description: 'Advanced person tracking card with complete visual editor',
  preview: true
});
