// Person Tracker Card Editor - Fixed Version
// Fix for all reported bugs

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Editor translations
const editorTranslations = {
  en: {
    // Tabs
    tab_base: 'Base',
    tab_sensors: 'Sensors',
    tab_states: 'States',
    tab_style: 'Style',
    
    // Base tab
    section_base_config: 'Base Configuration',
    label_person_entity: 'Person Entity (required)',
    label_custom_name: 'Custom name (optional)',
    label_custom_image_url: 'Custom image URL',
    helper_custom_image: 'Ex: /local/photos/mario.jpg',
    label_aspect_ratio: 'Aspect ratio',
    helper_aspect_ratio: 'Format: width/height (ex: 1/0.7)',
    
    // Display options
    section_display_options: 'Display Options',
    label_show_picture: 'Show person picture',
    label_show_name: 'Show name',
    label_show_last_updated: 'Show last updated',
    
    // Sensors tab
    section_automatic_sensors: 'Automatic Sensors',
    text_sensors_auto_detect: 'Sensors are automatically detected based on the selected person entity.',
    text_sensor_pattern: 'Standard pattern: sensor.phone_{name}_*',
    sensor_battery: 'Battery',
    sensor_activity: 'Activity',
    sensor_connection: 'Connection',
    sensor_distance: 'Distance from Home',
    sensor_travel_time: 'Travel Time',
    label_battery_sensor: 'Battery sensor',
    label_activity_sensor: 'Activity sensor',
    label_connection_sensor: 'Connection sensor',
    label_distance_sensor: 'Distance sensor',
    label_travel_sensor: 'Travel time sensor',
    label_position: '{element} position',
    
    // States tab
    section_custom_states: 'Custom States',
    text_configure_states: 'Configure how different person states are displayed',
    label_state_value: 'State value (ex: home, not_home)',
    label_display_name: 'Display name',
    label_custom_image: 'Custom image (optional)',
    label_name_color: 'Name color',
    button_add_state: 'Add State',
    preview_default_states: 'Default States',
    button_add_default_states: 'Add Default States',
    
    // Style tab
    section_style_customization: 'Card Style Customization',
    label_name_font: 'Name font',
    label_state_font: 'State font',
    label_card_background: 'Card background',
    helper_card_background: 'Ex: rgba(255,255,255,0.05) or #1a1a2e',
    label_border_radius: 'Border radius',
    label_image_size: 'Image size (%)',
    
    // Position labels
    position_top_left: 'Top Left',
    position_top_right: 'Top Right',
    position_bottom_left: 'Bottom Left',
    position_bottom_right: 'Bottom Right',
    
    // Default state names
    state_home: '🏡 Home',
    state_not_home: '🏃‍♂️ Away from Home',
    state_office: '🏢 Office',
    state_unknown: '❓ Unknown'
  },
  it: {
    // Tabs
    tab_base: 'Base',
    tab_sensors: 'Sensori',
    tab_states: 'Stati',
    tab_style: 'Stile',
    
    // Base tab
    section_base_config: 'Configurazione Base',
    label_person_entity: 'Entità Persona (obbligatoria)',
    label_custom_name: 'Nome personalizzato (facoltativo)',
    label_custom_image_url: 'URL immagine personalizzata',
    helper_custom_image: 'Es: /local/photos/mario.jpg',
    label_aspect_ratio: 'Rapporto dimensioni',
    helper_aspect_ratio: 'Formato: larghezza/altezza (es: 1/0.7)',
    
    // Display options
    section_display_options: 'Opzioni Visualizzazione',
    label_show_picture: 'Mostra foto persona',
    label_show_name: 'Mostra nome',
    label_show_last_updated: 'Mostra ultimo aggiornamento',
    
    // Sensors tab
    section_automatic_sensors: 'Sensori Automatici',
    text_sensors_auto_detect: 'I sensori vengono rilevati automaticamente in base all\'entità persona selezionata.',
    text_sensor_pattern: 'Schema standard: sensor.phone_{name}_*',
    sensor_battery: 'Batteria',
    sensor_activity: 'Attività',
    sensor_connection: 'Connessione',
    sensor_distance: 'Distanza da Casa',
    sensor_travel_time: 'Tempo di Viaggio',
    label_battery_sensor: 'Sensore batteria',
    label_activity_sensor: 'Sensore attività',
    label_connection_sensor: 'Sensore connessione',
    label_distance_sensor: 'Sensore distanza',
    label_travel_sensor: 'Sensore tempo di viaggio',
    label_position: 'Posizione {element}',
    
    // States tab
    section_custom_states: 'Stati Personalizzati',
    text_configure_states: 'Configura come vengono visualizzati i diversi stati della persona',
    label_state_value: 'Valore stato (es: home, not_home)',
    label_display_name: 'Nome visualizzato',
    label_custom_image: 'Immagine personalizzata (facoltativo)',
    label_name_color: 'Colore nome',
    button_add_state: 'Aggiungi Stato',
    preview_default_states: 'Stati Predefiniti',
    button_add_default_states: 'Aggiungi Stati Predefiniti',
    
    // Style tab
    section_style_customization: 'Personalizzazione Stile Card',
    label_name_font: 'Font nome',
    label_state_font: 'Font stato',
    label_card_background: 'Sfondo card',
    helper_card_background: 'Es: rgba(255,255,255,0.05) o #1a1a2e',
    label_border_radius: 'Raggio bordo',
    label_image_size: 'Dimensione immagine (%)',
    
    // Position labels
    position_top_left: 'In Alto a Sinistra',
    position_top_right: 'In Alto a Destra',
    position_bottom_left: 'In Basso a Sinistra',
    position_bottom_right: 'In Basso a Destra',
    
    // Default state names
    state_home: '🏡 A Casa',
    state_not_home: '🏃‍♂️ Fuori Casa',
    state_office: '🏢 Ufficio',
    state_unknown: '❓ Sconosciuto'
  }
};

class PersonTrackerCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _helpers: {},
      _selectedTab: { type: String }
    };
  }

  constructor() {
    super();
    this._selectedTab = 'base';
  }

  // Get translated string
  _t(key, replacements = {}) {
    const lang = this.hass?.language || 'en';
    const translationSet = editorTranslations[lang] || editorTranslations['en'];
    let text = translationSet[key] || editorTranslations['en'][key] || key;
    
    // Replace placeholders
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    
    return text;
  }

  setConfig(config) {
    this._config = {
      show_entity_picture: true,
      show_name: true,
      show_last_changed: true,
      show_battery: true,
      show_activity: true,
      show_distance: true,
      show_travel_time: true,
      show_connection: true,
      aspect_ratio: '1/0.7',
      triggers_update: 'all',
      battery_position: 'top-right',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right',
      battery_font_size: '13px',
      activity_font_size: '13px',
      distance_font_size: '12px',
      travel_font_size: '12px',
      connection_font_size: '12px',
      ...config
    };

    // fallback for positions
    const positionDefaults = {
      battery_position: 'top-right',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right'
    };

    for (const key in positionDefaults) {
      if (!this._config[key]) {
        this._config[key] = positionDefaults[key];
      }
    }

    if (!this._config.triggers_update) {
      this._config.triggers_update = 'all';
    }
  }


  static get styles() {
    return css`
      .card-config {
        padding: 16px;
      }

      .tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--divider-color);
      }

      .tab {
        padding: 8px 16px;
        cursor: pointer;
        background: none;
        border: none;
        color: var(--primary-text-color);
        font-size: 14px;
        transition: all 0.3s;
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tab:hover {
        background: var(--secondary-background-color);
      }

      .tab.active {
        color: var(--primary-color);
      }

      .tab.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
      }

      .section {
        margin-bottom: 24px;
      }

      .section-title {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .config-row {
        display: flex;
        align-items: center;
        padding: 8px 0;
        min-height: 40px;
      }

      .config-row ha-switch {
        margin-left: auto;
      }

      .config-row ha-textfield,
      .config-row ha-select {
        width: 100%;
      }

      .config-label {
        flex: 1;
      }

      .config-value {
        flex: 2;
        margin-left: 16px;
      }

      .two-column {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      ha-entity-picker {
        display: block;
        margin: 8px 0;
      }

      ha-textfield {
        display: block;
        margin: 8px 0;
      }

      ha-select {
        display: block;
        margin: 8px 0;
        width: 100%;
      }

      .sensor-group {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
      }

      .sensor-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .sensor-icon {
        margin-right: 8px;
        color: var(--primary-color);
      }

      .sensor-title {
        font-weight: 500;
        flex: 1;
      }

      .state-item {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
      }

      .state-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      mwc-button {
        margin-top: 8px;
      }

      .add-button {
        width: 100%;
      }

      .remove-button {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        color: var(--error-color);
      }

      .preview-box {
        background: var(--secondary-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 16px 0;
      }

      .preview-title {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .color-picker {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        cursor: pointer;
        position: relative;
      }

      input[type="color"] {
        opacity: 0;
        position: absolute;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }

      .info-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        line-height: 1.4;
      }

      .position-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }

      pre {
        font-size: 11px;
        overflow-x: auto;
        background: var(--card-background-color);
        padding: 8px;
        border-radius: 4px;
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
      @media (max-width: 600px) {
        .tabs {
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .two-column {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="tabs">
          <button
            class="tab ${this._selectedTab === 'base' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'base'}">
            <ha-icon icon="mdi:card-account-details"></ha-icon>
            ${this._t('tab_base')}
          </button>
          <button
            class="tab ${this._selectedTab === 'sensors' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'sensors'}">
            <ha-icon icon="mdi:leak"></ha-icon>
            ${this._t('tab_sensors')}
          </button>
          <button
            class="tab ${this._selectedTab === 'states' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'states'}">
            <ha-icon icon="mdi:palette"></ha-icon>
            ${this._t('tab_states')}
          </button>
          <button
            class="tab ${this._selectedTab === 'style' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'style'}">
            <ha-icon icon="mdi:brush"></ha-icon>
            ${this._t('tab_style')}
          </button>
        </div>

        ${this._selectedTab === 'base' ? this._renderBaseTab() : ''}
        ${this._selectedTab === 'sensors' ? this._renderSensorsTab() : ''}
        ${this._selectedTab === 'states' ? this._renderStatesTab() : ''}
        ${this._selectedTab === 'style' ? this._renderStyleTab() : ''}
      </div>
    `;
  }

  _renderBaseTab() {
    if (!this._config) {
      return html`<div>Configuration not available.</div>`;
    }

    const entityValue = this._config.entity || '';

    return html`
      <div class="section">
        <div class="section-title">${this._t('section_base_config')}</div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${entityValue}
          .label=${this._t('label_person_entity')}
          .includeDomains=${['person']}
          .required=${true}
          @value-changed=${(e) => this._valueChanged(e, 'entity')}>
        </ha-entity-picker>

        <ha-textfield
          label="${this._t('label_custom_name')}"
          .value=${this._config.name || ''}
          @input=${(e) => this._valueChanged(e, 'name')}>
        </ha-textfield>

        <ha-textfield
          label="${this._t('label_custom_image_url')}"
          .value=${this._config.entity_picture || ''}
          @input=${(e) => this._valueChanged(e, 'entity_picture')}
          helper-text="${this._t('helper_custom_image')}">
        </ha-textfield>

        <ha-textfield
          label="${this._t('label_aspect_ratio')}"
          .value=${this._config.aspect_ratio || '1/0.7'}
          @input=${(e) => this._valueChanged(e, 'aspect_ratio')}
          helper-text="${this._t('helper_aspect_ratio')}">
        </ha-textfield>
      </div>

      <div class="section">
        <div class="section-title">${this._t('section_display_options')}</div>

        <div class="config-row">
          <span class="config-label">${this._t('label_show_picture')}</span>
          <ha-switch
            .checked=${this._config.show_entity_picture !== false}
            @change=${(e) => this._valueChanged(e, 'show_entity_picture')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._t('label_show_name')}</span>
          <ha-switch
            .checked=${this._config.show_name !== false}
            @change=${(e) => this._valueChanged(e, 'show_name')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._t('label_show_last_updated')}</span>
          <ha-switch
            .checked=${this._config.show_last_changed !== false}
            @change=${(e) => this._valueChanged(e, 'show_last_changed')}>
          </ha-switch>
        </div>
      </div>
    `;
  }


  _renderSensorsTab() {
  const entityBase = this._config.entity
    ? this._config.entity.replace('person.', '')
    : 'example';

  return html`
    <div class="section">
      <div class="section-title">${this._t('section_automatic_sensors')}</div>
      <p class="info-text">
        ${this._t('text_sensors_auto_detect')}
        ${this._t('text_sensor_pattern', { name: entityBase })}
      </p>

      <!-- Battery -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:battery" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._t('sensor_battery')}</span>
          <ha-switch
            .checked=${this._config.show_battery !== false}
            @change=${(e) => this._valueChanged(e, 'show_battery')}>
          </ha-switch>
        </div>

        ${this._config.show_battery !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.battery_sensor || `sensor.phone_${entityBase}_battery_level`}
            .label=${this._t('label_battery_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'battery_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('battery_position', this._t('label_position', { element: this._t('sensor_battery') }))}
        ` : ''}
      </div>

      <!-- Activity -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:walk" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._t('sensor_activity')}</span>
          <ha-switch
            .checked=${this._config.show_activity !== false}
            @change=${(e) => this._valueChanged(e, 'show_activity')}>
          </ha-switch>
        </div>

        ${this._config.show_activity !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.activity_sensor || `sensor.phone_${entityBase}_activity`}
            .label=${this._t('label_activity_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'activity_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('activity_position', this._t('label_position', { element: this._t('sensor_activity') }))}
        ` : ''}
      </div>

      <!-- Connection -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:wifi" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._t('sensor_connection')}</span>
          <ha-switch
            .checked=${this._config.show_connection !== false}
            @change=${(e) => this._valueChanged(e, 'show_connection')}>
          </ha-switch>
        </div>

        ${this._config.show_connection !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.connection_sensor || `sensor.phone_${entityBase}_connection_type`}
            .label=${this._t('label_connection_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'connection_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('connection_position', this._t('label_position', { element: this._t('sensor_connection') }))}
        ` : ''}
      </div>

      <!-- Distance -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:home-map-marker" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._t('sensor_distance')}</span>
          <ha-switch
            .checked=${this._config.show_distance !== false}
            @change=${(e) => this._valueChanged(e, 'show_distance')}>
          </ha-switch>
        </div>

        ${this._config.show_distance !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.distance_sensor || `sensor.waze_${entityBase}`}
            .label=${this._t('label_distance_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'distance_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('distance_position', this._t('label_position', { element: this._t('sensor_distance') }))}
        ` : ''}
      </div>

      <!-- Travel Time -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:car-clock" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._t('sensor_travel_time')}</span>
          <ha-switch
            .checked=${this._config.show_travel_time !== false}
            @change=${(e) => this._valueChanged(e, 'show_travel_time')}>
          </ha-switch>
        </div>

        ${this._config.show_travel_time !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.travel_sensor || `sensor.home_work_${entityBase}`}
            .label=${this._t('label_travel_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'travel_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('travel_position', this._t('label_position', { element: this._t('sensor_travel_time') }))}
        ` : ''}
      </div>
    </div>
  `;
}



  _renderStatesTab() {
    const states = this._config.state || [];

    return html`
      <div class="section">
        <div class="section-title">${this._t('section_custom_states')}</div>
        <p class="info-text">
          ${this._t('text_configure_states')}
        </p>

        ${states.map((state, index) => html`
          <div class="state-item">
            <div class="state-header">
              <span>${state.name || state.value || 'New state'}</span>
              <ha-icon-button
                icon="mdi:delete"
                class="remove-button"
                @click=${() => this._removeState(index)}>
              </ha-icon-button>
            </div>

            <ha-textfield
              label="${this._t('label_state_value')}"
              .value=${state.value || ''}
              @input=${(e) => this._updateState(index, 'value', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('label_display_name')}"
              .value=${state.name || ''}
              @input=${(e) => this._updateState(index, 'name', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('label_custom_image')}"
              .value=${state.entity_picture || ''}
              @input=${(e) => this._updateState(index, 'entity_picture', e.target.value)}>
            </ha-textfield>

            <div class="config-row">
              <span class="config-label">${this._t('label_name_color')}</span>
              <div class="color-picker">
                <div class="color-preview"
                     style="background-color: ${state.styles?.name?.color || '#7DDA9F'}">
                  <input type="color"
                         .value=${state.styles?.name?.color || '#7DDA9F'}
                         @input=${(e) => this._updateStateColor(index, e.target.value)}>
                </div>
                <ha-textfield
                  .value=${state.styles?.name?.color || '#7DDA9F'}
                  @input=${(e) => this._updateStateColor(index, e.target.value)}
                  pattern="^#[0-9A-Fa-f]{6}$">
                </ha-textfield>
              </div>
            </div>
          </div>
        `)}

        <mwc-button
          outlined
          icon="mdi:plus"
          class="add-button"
          @click=${this._addState}>
          ${this._t('button_add_state')}
        </mwc-button>
      </div>

      <div class="preview-box">
        <div class="preview-title">${this._t('preview_default_states')}</div>
        <mwc-button
          @click=${this._addDefaultStates}
          icon="mdi:magic">
          ${this._t('button_add_default_states')}
        </mwc-button>
      </div>
    `;
  }

  _renderStyleTab() {
    return html`
      <div class="section">
        <div class="section-title">${this._t('section_style_customization')}</div>

        <div class="two-column">
          <ha-textfield
            label="${this._t('label_name_font')}"
            .value=${this._config.name_font_size || '20px'}
            @input=${(e) => this._valueChanged(e, 'name_font_size')}>
          </ha-textfield>

          <ha-textfield
            label="${this._t('label_state_font')}"
            .value=${this._config.state_font_size || '14px'}
            @input=${(e) => this._valueChanged(e, 'state_font_size')}>
          </ha-textfield>
        </div>

        <ha-textfield
          label="${this._t('label_card_background')}"
          .value=${this._config.card_background || 'rgba(255,255,255,0.05)'}
          @input=${(e) => this._valueChanged(e, 'card_background')}
          helper-text="${this._t('helper_card_background')}">
        </ha-textfield>

        <ha-textfield
          label="${this._t('label_border_radius')}"
          .value=${this._config.card_border_radius || '15px'}
          @input=${(e) => this._valueChanged(e, 'card_border_radius')}>
        </ha-textfield>

        <ha-textfield
          label="${this._t('label_image_size')}"
          type="number"
          min="10"
          max="100"
          .value=${this._config.picture_size || '55'}
          @input=${(e) => this._valueChanged(e, 'picture_size')}>
        </ha-textfield>
      </div>


    `;
  }

  _renderPositionButtons(configKey, label) {
    const options = [
      { value: 'top-left', label: this._t('position_top_left') },
      { value: 'top-right', label: this._t('position_top_right') },
      { value: 'bottom-left', label: this._t('position_bottom_left') },
      { value: 'bottom-right', label: this._t('position_bottom_right') }
    ];
    const selected = this._config[configKey] || options[0].value;

    return html`
      <div class="sensor-group">
        <div class="sensor-header">
          <span class="sensor-title">${label}</span>
        </div>
        <div class="position-button-group buttons">
          ${options.map(opt => html`
            <button
              class="${selected === opt.value ? 'selected' : ''}"
              @click="${() => this._onSelectPosition(configKey, opt.value)}">
              ${opt.label}
            </button>
          `)}
        </div>
      </div>
    `;
  }



  _onSelectPosition(configKey, value) {
    this._config = { ...this._config, [configKey]: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _valueChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();
    ev.preventDefault();

    const target = ev.target || ev.currentTarget;
    let value;

    if (target.type === 'checkbox' || target.tagName === 'HA-SWITCH') {
      value = target.checked;
    } else if (target.tagName === 'HA-ENTITY-PICKER') {
      value = ev.detail?.value;
    } else {
      value = target.value;
    }

    console.log(`_valueChanged called with configValue=${configValue} and value=`, value);

    if (value === '' || value === undefined) {
      delete this._config[configValue];
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }


  _selectChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();
    ev.preventDefault();

    const value = ev.detail?.value;

    // Allowed values for triggers_update
    const validTriggerValues = ['all', 'entity', 'custom'];

    // Allowed values for positions
    const validPositions = [
      'top-left', 'top-right', 'bottom-left', 'bottom-right',
      'top-left-2', 'top-right-2', 'bottom-left-2', 'bottom-right-2'
    ];

    if (!value || typeof value !== 'string') {
      console.warn(`Invalid value (type or undefined) for ${configValue}:`, value);
      return;
    }

    if (configValue === 'triggers_update') {
      if (!validTriggerValues.includes(value)) {
        console.warn(`Invalid triggers_update value:`, value);
        return;
      }
    } else {
      if (!validPositions.includes(value)) {
        console.warn(`Invalid position value for ${configValue}:`, value);
        return;
      }
    }

    this._config = { ...this._config, [configValue]: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }





  _addState() {
    const states = this._config.state || [];
    states.push({
      value: '',
      name: '',
      styles: {
        name: {
          color: '#7DDA9F'
        }
      }
    });

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _removeState(index) {
    const states = [...(this._config.state || [])];
    states.splice(index, 1);

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateState(index, field, value) {
    const states = [...(this._config.state || [])];
    states[index] = { ...states[index], [field]: value };

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateStateColor(index, color) {
    const states = [...(this._config.state || [])];
    states[index] = {
      ...states[index],
      styles: {
        ...states[index].styles,
        name: {
          ...states[index].styles?.name,
          color: color
        }
      }
    };

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _addDefaultStates() {
    const defaultStates = [
      {
        value: 'home',
        name: this._t('state_home'),
        styles: { name: { color: '#7DDA9F' } }
      },
      {
        value: 'not_home',
        name: this._t('state_not_home'),
        styles: { name: { color: '#93ADCB' } }
      },
      {
        value: 'Office',
        name: this._t('state_office'),
        styles: { name: { color: '#FFD700' } }
      },
      {
        value: 'unknown',
        name: this._t('state_unknown'),
        styles: { name: { color: '#808080' } }
      }
    ];

    this._config = { ...this._config, state: defaultStates };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _fireEvent(type, detail) {
    const event = new CustomEvent(type, {
      detail: detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

// Register the editor
if (!customElements.get('person-tracker-card-editor')) {
  customElements.define('person-tracker-card-editor', PersonTrackerCardEditor);
  console.log('Person Tracker Card Editor registered (fixed version)');
}

// Export for the main card
window.PersonTrackerCardEditor = PersonTrackerCardEditor;
