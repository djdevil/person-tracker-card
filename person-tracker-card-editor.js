// Person Tracker Card Editor - Fixed Version
// Fix for all reported bugs

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

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
    this._translations = null;
  }

  async _loadTranslations() {
    if (this._translations) {
      return this._translations;
    }

    const lang = this.hass?.language || 'en';
    const supportedLanguages = ['en', 'it'];
    const selectedLang = supportedLanguages.includes(lang) ? lang : 'en';

    // Try multiple possible paths
    const possiblePaths = [
      `/hacsfiles/person-tracker-card-1/translations/${selectedLang}.json`,
      `/local/community/person-tracker-card-1/translations/${selectedLang}.json`,
      `./translations/${selectedLang}.json`
    ];

    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          this._translations = await response.json();
          return this._translations;
        }
      } catch (error) {
        // Continue to next path
      }
    }

    // Fallback to English if selected language not found
    if (selectedLang !== 'en') {
      for (const path of possiblePaths) {
        try {
          const englishPath = path.replace(`${selectedLang}.json`, 'en.json');
          const response = await fetch(englishPath);
          if (response.ok) {
            this._translations = await response.json();
            return this._translations;
          }
        } catch (error) {
          // Continue to next path
        }
      }
    }

    console.error('Failed to load translations from any path');
    return null;
  }

  _localize(path) {
    if (!this._translations) {
      return path;
    }

    const keys = path.split('.');
    let value = this._translations;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return path;
      }
    }

    return value;
  }

  async setConfig(config) {
    await this._loadTranslations();

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
    if (!this.hass || !this._translations) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="tabs">
          <button
            class="tab ${this._selectedTab === 'base' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'base'}">
            <ha-icon icon="mdi:card-account-details"></ha-icon>
            ${this._localize('editor.tabs.base')}
          </button>
          <button
            class="tab ${this._selectedTab === 'sensori' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'sensori'}">
            <ha-icon icon="mdi:leak"></ha-icon>
            ${this._localize('editor.tabs.sensors')}
          </button>
          <button
            class="tab ${this._selectedTab === 'stati' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'stati'}">
            <ha-icon icon="mdi:palette"></ha-icon>
            ${this._localize('editor.tabs.states')}
          </button>
          <button
            class="tab ${this._selectedTab === 'stile' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'stile'}">
            <ha-icon icon="mdi:brush"></ha-icon>
            ${this._localize('editor.tabs.style')}
          </button>
        </div>

        ${this._selectedTab === 'base' ? this._renderBaseTab() : ''}
        ${this._selectedTab === 'sensori' ? this._renderSensoriTab() : ''}
        ${this._selectedTab === 'stati' ? this._renderStatiTab() : ''}
        ${this._selectedTab === 'stile' ? this._renderStileTab() : ''}
      </div>
    `;
  }

  _renderBaseTab() {
    if (!this._config) {
      return html`<div>${this._localize('common.invalid_configuration')}</div>`;
    }

    const entityValue = this._config.entity || '';

    return html`
      <div class="section">
        <div class="section-title">${this._localize('editor.sections.base_configuration')}</div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${entityValue}
          .label=${this._localize('editor.labels.person_entity')}
          .includeDomains=${['person']}
          .required=${true}
          @value-changed=${(e) => this._valueChanged(e, 'entity')}>
        </ha-entity-picker>

        <ha-textfield
          label="${this._localize('editor.labels.custom_name')}"
          .value=${this._config.name || ''}
          @input=${(e) => this._valueChanged(e, 'name')}>
        </ha-textfield>

        <ha-textfield
          label="${this._localize('editor.labels.custom_image')}"
          .value=${this._config.entity_picture || ''}
          @input=${(e) => this._valueChanged(e, 'entity_picture')}
          helper-text="${this._localize('editor.info.image_url_example')}">
        </ha-textfield>

        <ha-textfield
          label="${this._localize('editor.labels.aspect_ratio')}"
          .value=${this._config.aspect_ratio || '1/0.7'}
          @input=${(e) => this._valueChanged(e, 'aspect_ratio')}
          helper-text="${this._localize('editor.info.aspect_ratio_format')}">
        </ha-textfield>
      </div>

      <div class="section">
        <div class="section-title">${this._localize('editor.sections.display_options')}</div>

        <div class="config-row">
          <span class="config-label">${this._localize('editor.labels.show_entity_picture')}</span>
          <ha-switch
            .checked=${this._config.show_entity_picture !== false}
            @change=${(e) => this._valueChanged(e, 'show_entity_picture')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._localize('editor.labels.show_name')}</span>
          <ha-switch
            .checked=${this._config.show_name !== false}
            @change=${(e) => this._valueChanged(e, 'show_name')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._localize('editor.labels.show_last_changed')}</span>
          <ha-switch
            .checked=${this._config.show_last_changed !== false}
            @change=${(e) => this._valueChanged(e, 'show_last_changed')}>
          </ha-switch>
        </div>
      </div>
    `;
  }


  _renderSensoriTab() {
  const entityBase = this._config.entity
    ? this._config.entity.replace('person.', '')
    : 'example';

  return html`
    <div class="section">
      <div class="section-title">${this._localize('editor.sections.automatic_sensors')}</div>
      <p class="info-text">
        ${this._localize('editor.info.sensor_pattern').replace('{entity}', entityBase)}
      </p>

      <!-- Batteria -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:battery" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._localize('editor.labels.battery')}</span>
          <ha-switch
            .checked=${this._config.show_battery !== false}
            @change=${(e) => this._valueChanged(e, 'show_battery')}>
          </ha-switch>
        </div>

        ${this._config.show_battery !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.battery_sensor || `sensor.phone_${entityBase}_battery_level`}
            .label=${this._localize('editor.labels.battery_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'battery_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('battery_position', this._localize('editor.labels.battery_position'))}
        ` : ''}
      </div>

      <!-- Attività -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:walk" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._localize('editor.labels.activity')}</span>
          <ha-switch
            .checked=${this._config.show_activity !== false}
            @change=${(e) => this._valueChanged(e, 'show_activity')}>
          </ha-switch>
        </div>

        ${this._config.show_activity !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.activity_sensor || `sensor.phone_${entityBase}_activity`}
            .label=${this._localize('editor.labels.activity_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'activity_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('activity_position', this._localize('editor.labels.activity_position'))}
        ` : ''}
      </div>

      <!-- Connessione -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:wifi" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._localize('editor.labels.connection')}</span>
          <ha-switch
            .checked=${this._config.show_connection !== false}
            @change=${(e) => this._valueChanged(e, 'show_connection')}>
          </ha-switch>
        </div>

        ${this._config.show_connection !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.connection_sensor || `sensor.phone_${entityBase}_connection_type`}
            .label=${this._localize('editor.labels.connection_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'connection_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('connection_position', this._localize('editor.labels.connection_position'))}
        ` : ''}
      </div>

      <!-- Distanza -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:home-map-marker" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._localize('editor.labels.distance')}</span>
          <ha-switch
            .checked=${this._config.show_distance !== false}
            @change=${(e) => this._valueChanged(e, 'show_distance')}>
          </ha-switch>
        </div>

        ${this._config.show_distance !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.distance_sensor || `sensor.waze_${entityBase}`}
            .label=${this._localize('editor.labels.distance_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'distance_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('distance_position', this._localize('editor.labels.distance_position'))}
        ` : ''}
      </div>

      <!-- Tempo viaggio -->
      <div class="sensor-group">
        <div class="sensor-header">
          <ha-icon icon="mdi:car-clock" class="sensor-icon"></ha-icon>
          <span class="sensor-title">${this._localize('editor.labels.travel_time')}</span>
          <ha-switch
            .checked=${this._config.show_travel_time !== false}
            @change=${(e) => this._valueChanged(e, 'show_travel_time')}>
          </ha-switch>
        </div>

        ${this._config.show_travel_time !== false ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.travel_sensor || `sensor.casa_lavoro_${entityBase}`}
            .label=${this._localize('editor.labels.travel_sensor')}
            .includeDomains=${['sensor']}
            @value-changed=${(e) => this._valueChanged(e, 'travel_sensor')}>
          </ha-entity-picker>

          ${this._renderPositionButtons('travel_position', this._localize('editor.labels.travel_position'))}
        ` : ''}
      </div>
    </div>
  `;
}



  _renderStatiTab() {
    const states = this._config.state || [];

    return html`
      <div class="section">
        <div class="section-title">${this._localize('editor.sections.custom_states')}</div>
        <p class="info-text">
          ${this._localize('editor.info.custom_states_info')}
        </p>

        ${states.map((state, index) => html`
          <div class="state-item">
            <div class="state-header">
              <span>${state.name || state.value || this._localize('editor.states.new_state')}</span>
              <ha-icon-button
                icon="mdi:delete"
                class="remove-button"
                @click=${() => this._removeState(index)}>
              </ha-icon-button>
            </div>

            <ha-textfield
              label="${this._localize('editor.labels.state_value')}"
              .value=${state.value || ''}
              @input=${(e) => this._updateState(index, 'value', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._localize('editor.labels.display_name')}"
              .value=${state.name || ''}
              @input=${(e) => this._updateState(index, 'name', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._localize('editor.labels.custom_image_optional')}"
              .value=${state.entity_picture || ''}
              @input=${(e) => this._updateState(index, 'entity_picture', e.target.value)}>
            </ha-textfield>

            <div class="config-row">
              <span class="config-label">${this._localize('editor.labels.name_color')}</span>
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
          ${this._localize('editor.buttons.add_state')}
        </mwc-button>
      </div>

      <div class="preview-box">
        <div class="preview-title">${this._localize('editor.info.default_states')}</div>
        <mwc-button
          @click=${this._addDefaultStates}
          icon="mdi:magic">
          ${this._localize('editor.buttons.add_default_states')}
        </mwc-button>
      </div>
    `;
  }

  _renderStileTab() {
    return html`
      <div class="section">
        <div class="section-title">${this._localize('editor.sections.style_customization')}</div>

        <div class="two-column">
          <ha-textfield
            label="${this._localize('editor.labels.name_font')}"
            .value=${this._config.name_font_size || '20px'}
            @input=${(e) => this._valueChanged(e, 'name_font_size')}>
          </ha-textfield>

          <ha-textfield
            label="${this._localize('editor.labels.state_font')}"
            .value=${this._config.state_font_size || '14px'}
            @input=${(e) => this._valueChanged(e, 'state_font_size')}>
          </ha-textfield>
        </div>

        <ha-textfield
          label="${this._localize('editor.labels.card_background')}"
          .value=${this._config.card_background || 'rgba(255,255,255,0.05)'}
          @input=${(e) => this._valueChanged(e, 'card_background')}
          helper-text="${this._localize('editor.info.background_example')}">
        </ha-textfield>

        <ha-textfield
          label="${this._localize('editor.labels.border_radius')}"
          .value=${this._config.card_border_radius || '15px'}
          @input=${(e) => this._valueChanged(e, 'card_border_radius')}>
        </ha-textfield>

        <ha-textfield
          label="${this._localize('editor.labels.picture_size')}"
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
      { value: 'top-left', label: this._localize('editor.positions.top_left') },
      { value: 'top-right', label: this._localize('editor.positions.top_right') },
      { value: 'bottom-left', label: this._localize('editor.positions.bottom_left') },
      { value: 'bottom-right', label: this._localize('editor.positions.bottom_right') }
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

    console.log(`_valueChanged chiamato con configValue=${configValue} e value=`, value);

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

    // Valori ammessi per triggers_update
    const validTriggerValues = ['all', 'entity', 'custom'];

    // Valori ammessi per posizioni
    const validPositions = [
      'top-left', 'top-right', 'bottom-left', 'bottom-right',
      'top-left-2', 'top-right-2', 'bottom-left-2', 'bottom-right-2'
    ];

    if (!value || typeof value !== 'string') {
      console.warn(`Valore non valido (tipo o undefined) per ${configValue}:`, value);
      return;
    }

    if (configValue === 'triggers_update') {
      if (!validTriggerValues.includes(value)) {
        console.warn(`Valore triggers_update non valido:`, value);
        return;
      }
    } else {
      if (!validPositions.includes(value)) {
        console.warn(`Valore posizione non valido per ${configValue}:`, value);
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
        name: this._localize('editor.states.home'),
        styles: { name: { color: '#7DDA9F' } }
      },
      {
        value: 'not_home',
        name: this._localize('editor.states.not_home'),
        styles: { name: { color: '#93ADCB' } }
      },
      {
        value: 'office',
        name: this._localize('editor.states.office'),
        styles: { name: { color: '#FFD700' } }
      },
      {
        value: 'unknown',
        name: this._localize('editor.states.unknown'),
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

// Export for main card
window.PersonTrackerCardEditor = PersonTrackerCardEditor;
