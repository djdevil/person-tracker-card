// Person Tracker Card Editor - Multilanguage Version
// Languages: Italian (default), English, French, German
// v1.4.20: No editor changes — version bump for the Marketplace release
// v1.4.19: Editor redesign + audit — own text field (ha-textfield was removed in HA 2026.5, fields were blank), no more ha-select/mwc-button/ha-icon-button;
//          visual layout picker, card sections, segmented choices, 10-slot position picker, unified color rows; fixes listed in CHANGELOG
// v1.4.18: location_color + geocoded_location_color pickers in Style tab (all layouts); 6 languages translated
// v1.4.17: No editor changes — bump only for card-side perf fix (PR #48)
// v1.4.16: home_icon_entity option for ink layout — read home state icon dynamically from a HA entity state
// v1.4.15: home_icon option for ink layout — customize home state location icon; "auto" uses device icon
//          Polish (pl) language support added — card + editor full translation (PR #43 by @zalexandr)
// v1.4.14: compact_stretch option — full-width compact layout (PR #41); translations IT/FR/DE/NL added
// v1.4.13: French/German relative time word order fix (il y a 2 heures, vor 2 Stunden); Dutch (nl) language support
// v1.4.12: travel time h:mm parsing + Xh Ym formatting; charging fix WxStation/Holo/Matrix/Orbital/Ink; wifi_ssid_sensor; classic/neon connection text
// v1.4.9: extra_chips config option — add any HA entity as custom chip in all 11 layouts
// v1.4.8: state_entity config option — override displayed location text with any HA sensor
// v1.4.7: Liquid Ink layout (ink) added to picker and validation whitelist
// v1.4.6: maps_provider dropdown added to Sensors tab; show_geocoded_location default true; editor switch/dropdown fixes
// v1.4.5: orbital layout added to picker and validation whitelist
// v1.4.4: show_geocoded_location toggle + geocoded_location_entity picker in Sensors tab (auto-detected)
// v1.4.3: matrix layout added to picker and validation whitelist
// v1.4.2: wxstation layout added to picker; device_2_battery_sensor entity pickers (auto-detect)
// v1.4.1: pair_travel_animation toggle (near smart mode); transparent_background toggle for Glass/Bio
// v1.4.0: weather_text_color picker in weather section; last_changed_color picker in style section
// v1.3.7: Version badge added to editor UI top-right
// v1.3.3: No editor changes
// v1.3.2: Full IT/EN/FR/DE translations for neon/weather sections; auto-detect sensors via mobile_app prefix; editor fields auto-populated
// v1.3.1: Animated weather background editor section (weather_entity + show_weather toggle)
// v1.3.0: Fix #20 load ha-entity-picker via hui-glance-card.getConfigElement(); distance_precision field added
// v1.2.4: Bug fix language, add hide state unknown activity status.

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Self-contained text field (v1.4.19). HA removed ha-textfield in 2026.5 (replaced by the internal
// ha-input), which left every text field in this editor blank. Same API the editor used:
// label, value, type, min, max, step, placeholder, pattern, helper / helper-text; fires input + change.
class PtcTextfield extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      value: {},
      type: { type: String },
      min: {},
      max: {},
      step: {},
      placeholder: { type: String },
      pattern: { type: String },
      helper: { type: String },
      helperText: { type: String, attribute: 'helper-text' },
    };
  }

  static get styles() {
    return css`
      :host { display: block; }
      label { display: block; font-size: 12px; line-height: 1.3; color: var(--secondary-text-color); margin: 0 0 5px 2px; }
      input {
        box-sizing: border-box; width: 100%; height: 40px; padding: 0 12px;
        font: inherit; font-size: 14px; color: var(--primary-text-color);
        background: var(--ha-color-form-background, var(--input-fill-color, rgba(127,127,127,0.1)));
        border: 1px solid var(--divider-color, rgba(127,127,127,0.3));
        border-radius: 10px; outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      input::placeholder { color: var(--secondary-text-color); opacity: 0.6; }
      input:hover { border-color: var(--secondary-text-color); }
      input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 1px var(--primary-color); }
      input:invalid { border-color: var(--error-color, #db4437); box-shadow: none; }
      .helper { font-size: 11px; line-height: 1.4; color: var(--secondary-text-color); margin: 4px 0 0 2px; }
    `;
  }

  render() {
    const helper = this.helper || this.helperText;
    return html`
      ${this.label ? html`<label for="i">${this.label}</label>` : ''}
      <input id="i"
        .type=${this.type || 'text'}
        .value=${this.value === undefined || this.value === null ? '' : String(this.value)}
        min=${this.min ?? ''} max=${this.max ?? ''} step=${this.step ?? 'any'}
        placeholder=${this.placeholder || ''}
        pattern=${this.pattern || '.*'}
        @input=${(e) => { this.value = e.target.value; }}
        @change=${(e) => { this.value = e.target.value; this.dispatchEvent(new Event('change', { bubbles: true, composed: true })); }}>
      ${helper ? html`<div class="helper">${helper}</div>` : ''}
    `;
  }
}
if (!customElements.get('ptc-textfield')) customElements.define('ptc-textfield', PtcTextfield);

const PTC_EDITOR_VERSION = '1.4.20';

// Layout picker tiles: id, display name and the palette of the mini preview
const PTC_LAYOUTS = [
  { id: 'classic',   name: 'Classic',         bg: 'linear-gradient(135deg,#3a4250,#2a303b)', accent: '#7DDA9F' },
  { id: 'compact',   name: 'Compact',         bg: 'linear-gradient(135deg,#2f3640,#232830)', accent: '#93ADCB' },
  { id: 'modern',    name: 'Modern',          bg: 'linear-gradient(135deg,#263238,#1c2529)', accent: '#50A14F' },
  { id: 'neon',      name: 'Neon',            bg: 'linear-gradient(160deg,#080810,#12202a)', accent: '#00ff88' },
  { id: 'glass',     name: 'Glass',           bg: 'linear-gradient(135deg,#1b2440,#3a2a5a)', accent: '#7fb3ff' },
  { id: 'bio',       name: 'Bioluminescence', bg: 'linear-gradient(160deg,#000a0d,#003340)', accent: '#00ffb4' },
  { id: 'holo',      name: 'Holographic 3D',  bg: 'linear-gradient(135deg,#0d1030,#3a1a6a 60%,#0a4a6a)', accent: '#00d4ff' },
  { id: 'wxstation', name: 'Weather Station', bg: 'linear-gradient(160deg,#1e4a7a,#4a90c8)', accent: '#ffd54f' },
  { id: 'matrix',    name: 'Matrix Rain',     bg: 'linear-gradient(180deg,#000,#001a06)', accent: '#00ff41' },
  { id: 'orbital',   name: 'Orbital',         bg: 'radial-gradient(circle at 30% 40%,#1a1040,#05050f)', accent: '#00d4aa' },
  { id: 'ink',       name: 'Liquid Ink',      bg: 'linear-gradient(135deg,#faf7f2,#e9e2d6)', accent: '#2d6a4f', light: true },
];

// Localization Helper for Editor
class EditorLocalizationHelper {
  constructor(hass) {
    this.hass = hass;
    this.translations = {};
    this.currentLanguage = 'en';
    this.loadTranslations();
  }

  loadTranslations() {
    const haLanguage = this.hass?.language || this.hass?.locale?.language || 'en';

    const languageMap = {
      'it': 'it',
      'it-IT': 'it',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en',
      'fr': 'fr',
      'fr-FR': 'fr',
      'de': 'de',
      'de-DE': 'de',
      'nl': 'nl',
      'nl-NL': 'nl',
      'nl-BE': 'nl',
      'pl': 'pl',
      'pl-PL': 'pl'
    };

    this.currentLanguage = languageMap[haLanguage] || 'en';

    this.translations = {
      'it': {
        'editor.entity': 'Entità',
        'editor.name': 'Nome (opzionale)',
        'editor.show_last_changed': 'Mostra ultimo aggiornamento',
        'editor.show_last_updated': 'Mostra ultimo aggiornamento',
        'editor.show_distance': 'Mostra distanza',
        'editor.show_battery': 'Mostra batteria',
        'editor.show_speed': 'Mostra velocità ',
        'editor.show_direction': 'Mostra direzione',
        'editor.show_accuracy': 'Mostra precisione',
        'editor.show_gps_accuracy': 'Mostra precisione GPS',
        'editor.show_altitude': 'Mostra altitudine',
        'editor.show_source': 'Mostra fonte',
        'editor.show_entity_picture': 'Mostra immagine',
        'editor.show_name': 'Mostra stato',
        'editor.show_person_name': 'Mostra nome persona',
        'editor.show_activity': 'Mostra attività ',
        'editor.show_watch_battery': 'Mostra batteria smartwatch',
        'editor.show_travel_time': 'Mostra tempo di viaggio',
        'editor.show_connection': 'Mostra connessione',
        'editor.custom_icon': 'Icona personalizzata',
        'editor.icon_color': 'Colore icona',
        'editor.background_color': 'Colore sfondo',
        'editor.text_color': 'Colore testo',
        'editor.required': 'Obbligatorio',
        'editor.optional': 'Opzionale',
        'editor.layout': 'Layout',
        'editor.appearance': 'Aspetto',
        'editor.display_options': 'Opzioni visualizzazione',
        'editor.positions': 'Posizioni',
        'editor.advanced': 'Avanzate',
        'editor.compact_width': 'Larghezza compatta (px)',
        'editor.compact_stretch': 'Espandi a tutta larghezza',
        'editor.modern_width': 'Larghezza modern (px)',
        'editor.custom_image_url': 'URL immagine personalizzata',
        'editor.aspect_ratio': 'Proporzioni',
        'editor.state_value': 'Valore stato',
        'editor.displayed_name': 'Nome visualizzato',
        'editor.custom_image': 'Immagine personalizzata',
        'editor.name_font_size': 'Dimensione font nome',
        'editor.state_font_size': 'Dimensione font stato',
        'editor.last_changed_font_size': 'Dimensione font ultimo aggiornamento',
        'editor.card_background': 'Sfondo card',
        'editor.transparent_background': 'Sfondo trasparente (solo Glass/Bio)',
        'editor.show_particles': 'Mostra particelle animate (solo Glass/Bio)',
        'editor.show_geocoded_location': 'Mostra indirizzo GPS (geocoded location)',
        'editor.geocoded_location_description': 'Mostra l\'indirizzo leggibile ottenuto dal GPS tramite sensor.xxx_geocoded_location. Visibile solo quando la persona non è a casa.',
        'editor.geocoded_location_entity': 'Entità geocoded location (auto-rilevata se vuota)',
        'editor.maps_provider': 'Apri in Maps al click sulla posizione',
        'editor.maps_provider_description': 'Se impostato, cliccando sulla zona o sull\'indirizzo si apre la mappa con le coordinate GPS.',
        'editor.maps_provider_none': 'Disabilitato',
        'editor.state_entity': 'Sensore stato personalizzato',
        'editor.state_entity_description': 'Sovrascrive il testo della posizione visualizzata (es. sensor.mia_posizione). La logica home/away rimane invariata.',
        'editor.show_device_2_battery': 'Batteria secondo dispositivo (tablet/laptop)',
        'editor.device_2_battery_sensor': 'Sensore batteria secondo dispositivo',
        'editor.device_2_battery_state_sensor': 'Stato carica secondo dispositivo',
        'wx.battery': 'Batteria', 'wx.watch': 'Orologio', 'wx.wind': 'Vento',
        'wx.humidity': 'Umidità', 'wx.network': 'Rete', 'wx.activity': 'Attività',
        'wx.pressure': 'Press.', 'wx.feels': 'Percepita', 'wx.device2': 'Disp.2',
        'editor.border_radius': 'Raggio bordo',
        'editor.image_size': 'Dimensione immagine (%)',
        'editor.modern_picture_size': 'Dimensione immagine (px)',
        'editor.modern_name_font_size': 'Dimensione font nome',
        'editor.modern_state_font_size': 'Dimensione font stato',
        'editor.modern_show_battery_ring': 'Mostra anello batteria',
        'editor.modern_show_travel_ring': 'Mostra anello tempo viaggio',
        'editor.modern_travel_max_time': 'Tempo viaggio massimo (min)',
        'editor.modern_distance_max': 'Distanza massima (km)',
        'editor.modern_ring_size': 'Dimensione cerchi (px)',
        'editor.classic_icon_size': 'Dimensione icone (px)',
        'editor.compact_icon_size': 'Dimensione icone (px)',
        'editor.battery_font_size': 'Dimensione font batteria',
        'editor.activity_font_size': 'Dimensione font attività ',
        'editor.battery_state_sensor': 'Sensore stato carica telefono',
        'editor.battery_charging_value': 'Valore stato in carica (opzionale)',
        'editor.watch_battery_state_sensor': 'Sensore stato carica smartwatch',
        'editor.watch_battery_charging_value': 'Valore stato in carica watch (opzionale)',
        'editor.charging_helper': 'Lascia vuoto per rilevamento automatico (charging, full, on, true...)',
        'section.automatic_sensors': 'Sensori Automatici',
        'section.sensors_description': 'I sensori vengono rilevati automaticamente dall\'app mobile collegata all\'entità persona. Prefisso rilevato:',
        'section.auto_detect_btn': 'Rileva automaticamente',
        'section.auto_detect_found': 'sensori trovati',
        'section.auto_detect_none': 'Nessun sensore trovato',
        'section.element_positions': 'Posizioni Elementi',
        'section.positions_description': 'Configura la posizione di ogni elemento sulla card. Disponibile solo nel layout Classic.',
        'section.custom_states': 'Stati Personalizzati',
        'section.states_description': 'Configura come vengono visualizzati i diversi stati della persona',
        'section.card_style': 'Personalizzazione Stile Card',
        'section.modern_options': 'Opzioni Layout Modern',
        'section.classic_options': 'Opzioni Layout Classic',
        'section.compact_options': 'Opzioni Layout Compact',
        'section.neon_options': 'Opzioni Layout Neon',
        'section.neon_description': 'Tema cyberpunk scuro con anello luminoso animato e badge neon. I colori si adattano automaticamente allo stato della persona (verde = casa, rosso = fuori).',
        'section.glass_options': 'Opzioni Layout Glass',
        'section.glass_description': 'Tema glassmorphism scuro con chip traslucidi, orbs colorati e dot di stato animato. Il colore accent si adatta automaticamente alla zona corrente della persona.',
        'section.bio_options': 'Opzioni Layout Bioluminescenza',
        'section.bio_description': 'Tema oceano profondo con orbs bioluminescenti animati, particelle che salgono dal basso e doppio anello pulsante attorno all\'avatar. Il colore accent cambia automaticamente con la zona.',
        'section.holo_options': 'Opzioni Layout Holographic 3D',
        'section.holo_description': 'Tema olografico con card inclinata in 3D, anelli rotanti attorno all\'avatar, scanner animato e sfondo shimmer iridescente. Il colore accent cambia con lo stato della persona.',
        'section.weather': '🌤 Meteo',
        'editor.show_weather': 'Mostra meteo',
        'editor.weather_entity': 'Entità meteo',
        'editor.show_weather_background': 'Mostra sfondo meteo animato',
        'editor.show_weather_temperature': 'Mostra condizioni e temperatura',
        'editor.weather_text_color': 'Colore testo meteo',
        'editor.weather_text_color_description': 'Colore di temperatura, icona e condizione. Lascia vuoto per usare il colore predefinito del layout.',
        'editor.last_changed_color': 'Colore testo aggiornamento',
        'editor.last_changed_color_description': 'Colore del timestamp di ultimo aggiornamento. Lascia vuoto per usare il colore predefinito.',
        'editor.location_color': 'Colore testo posizione',
        'editor.location_color_description': 'Colore della zona/stato per tutte le posizioni. Un colore impostato per un singolo stato ha la priorità. Lascia vuoto per il colore predefinito del layout.',
        'editor.geocoded_location_color': 'Colore indirizzo GPS',
        'editor.geocoded_location_color_description': 'Colore dell\'indirizzo geocodificato. Lascia vuoto per usare il colore testo posizione (o il predefinito del layout).',
        'section.weather_description': 'Aggiunge uno sfondo animato alla card (pioggia, neve, sole, stelle, fulmini…). Funziona su tutti i layout.',
        'section.travel_sensor_2': '🏢 Sensori Casa ↔ Lavoro',
        'section.travel_sensor_2_description': 'Sensori 1 (casa→lavoro): visibili a casa e in transito, nascosti al lavoro. Sensori 2 (lavoro→casa): visibili al lavoro e in transito, nascosti a casa. Disattiva la modalità smart per mostrare sempre entrambi.',
        'editor.travel_sensor_2': 'Sensore tempo di viaggio (lavoro → casa)',
        'editor.zone_2': 'Zona lavoro',
        'editor.show_travel_time_2': 'Mostra tempo di viaggio (Lavoro → Casa)',
        'editor.smart_travel_mode': 'Modalità smart (nascondi in base alla posizione)',
        'editor.pair_travel_animation': 'Animazione alternata distanza/tempo (se disattivata, mostra entrambi separati)',
        'editor.distance_precision': 'Decimali distanza (0=intero, 1=un decimale, 2=due decimali)',
        'editor.distance_unit': 'Unità distanza (es. km, mi)',
        'editor.distance_unit_description': 'Lascia vuoto per rilevamento automatico. Per sensori Waze/Google usa km o mi.',
        'editor.direction_home_work': 'Casa → Lavoro',
        'editor.direction_work_home': 'Lavoro → Casa',
        'editor.travel_sensor_home_work': 'Sensore tempo viaggio (Casa → Lavoro)',
        'editor.travel_sensor_work_home': 'Sensore tempo viaggio (Lavoro → Casa)',
        'editor.distance_sensor_home_work': 'Sensore distanza (Casa → Lavoro)',
        'editor.distance_sensor_work_home': 'Sensore distanza (Lavoro → Casa)',
        'editor.show_distance_2': 'Mostra distanza',
        'section.distance_optional': '📍 Distanza (Opzionale)',
        'section.distance_optional_description': 'Mostra la distanza in km. Sempre visibile indipendentemente dalla posizione.',
        'position.battery': 'Posizione batteria',
        'position.watch_battery': 'Posizione batteria smartwatch',
        'position.activity': 'Posizione attività ',
        'position.distance': 'Posizione distanza',
        'position.travel': 'Posizione tempo viaggio',
        'position.connection': 'Posizione connessione',
        'state.name_color': 'Colore nome',
        'state.add_state': 'Aggiungi Stato',
        'default_state.home': '🏡 Casa',
        'default_state.away': '🏃‍♂️ Fuori Casa',
        'default_state.office': '🏢 Ufficio',
        'default_state.unknown': '❓ Sconosciuto',
        'state.default_states': 'Stati Predefiniti',
        'state.add_default_states': 'Aggiungi Stati Predefiniti',
        'tabs.base': 'Base',
        'tabs.layout': 'Layout',
        'tabs.display': 'Visualizzazione',
        'tabs.positions': 'Posizioni',
        'tabs.states': 'Stati',
        'tabs.sensors': 'Sensori',
        'tabs.style': 'Stile',
        'section.extra_chips': 'Chip extra personalizzati',
        'editor.extra_chips_description': 'Aggiungi entità extra come chip (Bluetooth, Android Auto, chiamata, modalità silenziosa…). Con show_when il chip appare solo quando lo stato corrisponde.',
        'editor.extra_chip_entity': 'Entità',
        'editor.extra_chip_show_when': 'Mostra quando (stato)',
        'editor.extra_chip_label': 'Etichetta (opzionale)',
        'editor.extra_chip_color': 'Colore icona e testo',
        'editor.extra_chip_add': '+ Aggiungi chip',
        'editor.extra_chip_tap_action': 'Azione al tocco',
        'editor.extra_chip_tap_more_info': 'Mostra info (more-info)',
        'editor.extra_chip_tap_call_service': 'Chiama servizio',
        'editor.extra_chip_tap_navigate': 'Naviga',
        'editor.extra_chip_tap_url': 'Apri URL',
        'editor.extra_chip_tap_none': 'Nessuna azione',
        'editor.extra_chip_icon_label': 'Icona (default: icona entità)',
        'editor.extra_chip_service': 'Servizio (es. light.turn_on)',
        'editor.extra_chip_service_data': 'Dati extra (JSON, opzionale)',
        'editor.extra_chip_nav_path': 'Percorso navigazione',
        'editor.extra_chip_url_path': 'URL',
        'editor.tap_entity': 'Entità (vuoto = entità persona)',
        'common.remove': 'Rimuovi',
        'editor.wifi_ssid_sensor': 'Sensore SSID Wi-Fi',
        'editor.wifi_ssid_sensor_description': 'Sensore che riporta il nome della rete Wi-Fi a cui è connesso il dispositivo (es. sensor.elliot_s_phone_wi_fi_connection). Quando impostato, il nome della rete viene mostrato al posto di "WiFi".',
        'editor.home_icon': 'Icona posizione casa (solo layout Ink)',
        'editor.home_icon_description': 'Icona MDI mostrata quando la persona è a casa. Lascia vuoto per il predefinito (mdi:home). Usa "auto" per rilevare automaticamente il tipo di dispositivo (cellulare/tablet/laptop). Es: mdi:cellphone, mdi:watch, mdi:devices',
        'editor.home_icon_entity': 'Entità icona casa dinamica (solo layout Ink)',
        'editor.home_icon_entity_description': 'Entità HA il cui stato viene usato come icona MDI a casa (es. sensor.tracking_source_icon → mdi:cellphone). Priorità su home_icon se impostata.'
      },
      'en': {
        'editor.entity': 'Entity',
        'editor.name': 'Name (optional)',
        'editor.show_last_changed': 'Show last changed',
        'editor.show_last_updated': 'Show last updated',
        'editor.show_distance': 'Show distance',
        'editor.show_battery': 'Show battery',
        'editor.show_speed': 'Show speed',
        'editor.show_direction': 'Show direction',
        'editor.show_accuracy': 'Show accuracy',
        'editor.show_gps_accuracy': 'Show GPS accuracy',
        'editor.show_altitude': 'Show altitude',
        'editor.show_source': 'Show source',
        'editor.show_entity_picture': 'Show picture',
        'editor.show_name': 'Show state',
        'editor.show_person_name': 'Show person name',
        'editor.show_activity': 'Show activity',
        'editor.show_watch_battery': 'Show watch battery',
        'editor.show_travel_time': 'Show travel time',
        'editor.show_connection': 'Show connection',
        'editor.custom_icon': 'Custom icon',
        'editor.icon_color': 'Icon color',
        'editor.background_color': 'Background color',
        'editor.text_color': 'Text color',
        'editor.required': 'Required',
        'editor.optional': 'Optional',
        'editor.layout': 'Layout',
        'editor.appearance': 'Appearance',
        'editor.display_options': 'Display options',
        'editor.positions': 'Positions',
        'editor.advanced': 'Advanced',
        'editor.compact_width': 'Compact width (px)',
        'editor.compact_stretch': 'Stretch to fill width',
        'editor.modern_width': 'Modern width (px)',
        'editor.custom_image_url': 'Custom image URL',
        'editor.aspect_ratio': 'Aspect ratio',
        'editor.state_value': 'State value',
        'editor.displayed_name': 'Displayed name',
        'editor.custom_image': 'Custom image',
        'editor.name_font_size': 'Name font size',
        'editor.state_font_size': 'State font size',
        'editor.last_changed_font_size': 'Last changed font size',
        'editor.card_background': 'Card background',
        'editor.transparent_background': 'Transparent background (Glass/Bio only)',
        'editor.show_particles': 'Show animated particles (Glass/Bio only)',
        'editor.show_geocoded_location': 'Show GPS address (geocoded location)',
        'editor.geocoded_location_description': 'Shows the human-readable address from GPS via sensor.xxx_geocoded_location. Only visible when the person is not home.',
        'editor.geocoded_location_entity': 'Geocoded location entity (auto-detected if empty)',
        'editor.maps_provider': 'Open in Maps on location click',
        'editor.maps_provider_description': 'When set, clicking the zone or address opens the map with GPS coordinates.',
        'editor.maps_provider_none': 'Disabled',
        'editor.state_entity': 'Custom state sensor',
        'editor.state_entity_description': 'Overrides the displayed location text (e.g. sensor.my_location). Home/away logic is unaffected.',
        'editor.show_device_2_battery': 'Second device battery (tablet/laptop)',
        'editor.device_2_battery_sensor': 'Second device battery sensor',
        'editor.device_2_battery_state_sensor': 'Second device charging state sensor',
        'wx.battery': 'Battery', 'wx.watch': 'Watch', 'wx.wind': 'Wind',
        'wx.humidity': 'Humidity', 'wx.network': 'Network', 'wx.activity': 'Activity',
        'wx.pressure': 'Press.', 'wx.feels': 'Feels like', 'wx.device2': 'Device 2',
        'editor.border_radius': 'Border radius',
        'editor.image_size': 'Image size (%)',
        'editor.modern_picture_size': 'Picture size (px)',
        'editor.modern_name_font_size': 'Name font size',
        'editor.modern_state_font_size': 'State font size',
        'editor.modern_show_battery_ring': 'Show battery ring',
        'editor.modern_show_travel_ring': 'Show travel time ring',
        'editor.modern_travel_max_time': 'Max travel time (min)',
        'editor.modern_distance_max': 'Max distance (km)',
        'editor.modern_ring_size': 'Ring size (px)',
        'editor.classic_icon_size': 'Icon size (px)',
        'editor.compact_icon_size': 'Icon size (px)',
        'editor.battery_font_size': 'Battery font size',
        'editor.activity_font_size': 'Activity font size',
        'editor.battery_state_sensor': 'Phone charging state sensor',
        'editor.battery_charging_value': 'Charging state value (optional)',
        'editor.watch_battery_state_sensor': 'Watch charging state sensor',
        'editor.watch_battery_charging_value': 'Watch charging state value (optional)',
        'editor.charging_helper': 'Leave empty for auto-detection (charging, full, on, true...)',
        'section.automatic_sensors': 'Automatic Sensors',
        'section.sensors_description': 'Sensors are auto-detected from the mobile app linked to the person entity. Detected prefix:',
        'section.auto_detect_btn': 'Auto-detect sensors',
        'section.auto_detect_found': 'sensors found',
        'section.auto_detect_none': 'No matching sensors found',
        'section.element_positions': 'Element Positions',
        'section.positions_description': 'Configure the position of each element on the card. Available only in Classic layout.',
        'section.custom_states': 'Custom States',
        'section.states_description': 'Configure how the different person states are displayed',
        'section.card_style': 'Card Style Customization',
        'section.modern_options': 'Modern Layout Options',
        'section.classic_options': 'Classic Layout Options',
        'section.compact_options': 'Compact Layout Options',
        'section.neon_options': 'Neon Layout Options',
        'section.neon_description': 'Dark cyberpunk theme with animated glow ring and neon badges. Colors adapt automatically to person state (green = home, red = away).',
        'section.glass_options': 'Glass Layout Options',
        'section.glass_description': 'Dark glassmorphism theme with translucent chips, colored orbs and animated status dot. Accent color adapts automatically to the person\'s current zone.',
        'section.bio_options': 'Bioluminescence Layout Options',
        'section.bio_description': 'Deep ocean theme with animated bioluminescent orbs, rising particles and double pulse ring around the avatar. Accent color changes automatically with the zone.',
        'section.holo_options': 'Holographic 3D Layout Options',
        'section.holo_description': 'Holographic theme with a 3D tilted card, rotating rings around the avatar, animated scanner and iridescent shimmer background. Accent color changes with person state.',
        'section.weather': '🌤 Weather',
        'editor.show_weather': 'Show weather',
        'editor.weather_entity': 'Weather entity',
        'editor.show_weather_background': 'Show animated weather background',
        'editor.show_weather_temperature': 'Show conditions and temperature',
        'editor.weather_text_color': 'Weather text color',
        'editor.weather_text_color_description': 'Color of temperature, icon and condition label. Leave empty to use the layout default.',
        'editor.last_changed_color': 'Last updated text color',
        'editor.last_changed_color_description': 'Color of the last-updated timestamp. Leave empty to use the layout default.',
        'editor.location_color': 'Location text color',
        'editor.location_color_description': 'Color of the zone/state text for every location. A color set for a single state takes priority. Leave empty to use the layout default.',
        'editor.geocoded_location_color': 'GPS address color',
        'editor.geocoded_location_color_description': 'Color of the geocoded address. Leave empty to use the location text color (or the layout default).',
        'section.weather_description': 'Adds an animated weather background to the card (rain, snow, sun, stars, lightning…). Works on all layouts.',
        'section.travel_sensor_2': '🏢 Home ↔ Work Sensors',
        'section.travel_sensor_2_description': 'Sensor 1 (home→work): visible at home and in transit, hidden at work. Sensor 2 (work→home): visible at work and in transit, hidden at home. Disable smart mode to always show both.',
        'editor.travel_sensor_2': 'Travel time sensor (work → home)',
        'editor.zone_2': 'Work zone',
        'editor.show_travel_time_2': 'Show travel time (Work → Home)',
        'editor.smart_travel_mode': 'Smart mode (hide based on location)',
        'editor.pair_travel_animation': 'Alternating distance/time animation (if disabled, shows both separately)',
        'editor.distance_precision': 'Distance decimal places (0=integer, 1=one decimal, 2=two decimals)',
        'editor.distance_unit': 'Distance unit (e.g. km, mi)',
        'editor.distance_unit_description': 'Leave empty for auto-detection. For Waze/Google sensors use km or mi.',
        'editor.direction_home_work': 'Home → Work',
        'editor.direction_work_home': 'Work → Home',
        'editor.travel_sensor_home_work': 'Travel time sensor (Home → Work)',
        'editor.travel_sensor_work_home': 'Travel time sensor (Work → Home)',
        'editor.distance_sensor_home_work': 'Distance sensor (Home → Work)',
        'editor.distance_sensor_work_home': 'Distance sensor (Work → Home)',
        'editor.show_distance_2': 'Show distance',
        'section.distance_optional': '📍 Distance (Optional)',
        'section.distance_optional_description': 'Show distance in km. Always visible regardless of position.',
        'position.battery': 'Battery position',
        'position.watch_battery': 'Watch battery position',
        'position.activity': 'Activity position',
        'position.distance': 'Distance position',
        'position.travel': 'Travel time position',
        'position.connection': 'Connection position',
        'state.name_color': 'Name color',
        'state.add_state': 'Add State',
        'default_state.home': '🏡 Home',
        'default_state.away': '🏃‍♂️ Away from Home',
        'default_state.office': '🏢 Office',
        'default_state.unknown': '❓ Unknown',
        'state.default_states': 'Default States',
        'state.add_default_states': 'Add Default States',
        'tabs.base': 'Base',
        'tabs.layout': 'Layout',
        'tabs.display': 'Display',
        'tabs.positions': 'Positions',
        'tabs.states': 'States',
        'tabs.sensors': 'Sensors',
        'tabs.style': 'Style',
        'section.extra_chips': 'Custom extra chips',
        'editor.extra_chips_description': 'Add extra entities as chips (Bluetooth, Android Auto, call state, ringer mode…). With show_when the chip only appears when the state matches.',
        'editor.extra_chip_entity': 'Entity',
        'editor.extra_chip_show_when': 'Show when (state)',
        'editor.extra_chip_label': 'Label (optional)',
        'editor.extra_chip_color': 'Icon and text color',
        'editor.extra_chip_add': '+ Add chip',
        'editor.extra_chip_tap_action': 'Tap action',
        'editor.extra_chip_tap_more_info': 'Show info (more-info)',
        'editor.extra_chip_tap_call_service': 'Call service',
        'editor.extra_chip_tap_navigate': 'Navigate',
        'editor.extra_chip_tap_url': 'Open URL',
        'editor.extra_chip_tap_none': 'No action',
        'editor.extra_chip_icon_label': 'Icon (default: entity icon)',
        'editor.extra_chip_service': 'Service (e.g. light.turn_on)',
        'editor.extra_chip_service_data': 'Extra data (JSON, optional)',
        'editor.extra_chip_nav_path': 'Navigation path',
        'editor.extra_chip_url_path': 'URL',
        'editor.tap_entity': 'Entity (empty = person entity)',
        'common.remove': 'Remove',
        'editor.wifi_ssid_sensor': 'Wi-Fi SSID sensor',
        'editor.wifi_ssid_sensor_description': 'Sensor that reports the Wi-Fi network name the device is connected to (e.g. sensor.elliot_s_phone_wi_fi_connection). When set, the network name is shown instead of "WiFi".',
        'editor.home_icon': 'Home location icon (Ink layout only)',
        'editor.home_icon_description': 'MDI icon shown next to the location when at home. Leave empty for the default (mdi:home). Use "auto" to automatically detect the device type (phone/tablet/laptop). E.g: mdi:cellphone, mdi:watch, mdi:devices',
        'editor.home_icon_entity': 'Dynamic home icon entity (Ink layout only)',
        'editor.home_icon_entity_description': 'HA entity whose state is used as the MDI icon when at home (e.g. sensor.tracking_source_icon → mdi:cellphone). Takes priority over home_icon when set.'
      },
      'fr': {
        'editor.entity': 'Entité',
        'editor.name': 'Nom (optionnel)',
        'editor.show_last_changed': 'Afficher dernière mise à jour',
        'editor.show_distance': 'Afficher distance',
        'editor.show_battery': 'Afficher batterie',
        'editor.show_speed': 'Afficher vitesse',
        'editor.show_direction': 'Afficher direction',
        'editor.show_accuracy': 'Afficher précision',
        'editor.show_gps_accuracy': 'Afficher précision GPS',
        'editor.show_altitude': 'Afficher altitude',
        'editor.show_source': 'Afficher source',
        'editor.show_entity_picture': 'Afficher image',
        'editor.show_name': 'Afficher l\'éat',
        'editor.show_person_name': 'Afficher nom de la personne',
        'editor.show_activity': 'Afficher activité',
        'editor.show_watch_battery': 'Afficher batterie montre',
        'editor.show_travel_time': 'Afficher temps de trajet',
        'editor.show_connection': 'Afficher connexion',
        'editor.custom_icon': 'Icône personnalisée',
        'editor.icon_color': "Couleur de l'icône",
        'editor.background_color': 'Couleur de fond',
        'editor.text_color': 'Couleur du texte',
        'editor.required': 'Requis',
        'editor.optional': 'Optionnel',
        'editor.layout': 'Disposition',
        'editor.appearance': 'Apparence',
        'editor.display_options': "Options d'affichage",
        'editor.positions': 'Positions',
        'editor.advanced': 'Avancé',
        'editor.show_last_updated': 'Afficher dernière mise à jour',
        'editor.compact_width': 'Largeur compacte (px)',
        'editor.compact_stretch': 'Étirer sur toute la largeur',
        'editor.modern_width': 'Largeur moderne (px)',
        'editor.custom_image_url': 'URL image personnalisée',
        'editor.aspect_ratio': 'Ratio d\'aspect',
        'editor.state_value': 'Valeur état',
        'editor.displayed_name': 'Nom affiché',
        'editor.custom_image': 'Image personnalisée',
        'editor.name_font_size': 'Taille police nom',
        'editor.state_font_size': 'Taille police état',
        'editor.last_changed_font_size': 'Taille police dernière mise à jour',
        'editor.card_background': 'Fond carte',
        'editor.transparent_background': 'Fond transparent (Glass/Bio uniquement)',
        'editor.show_particles': 'Afficher particules animées (Glass/Bio uniquement)',
        'editor.show_geocoded_location': 'Afficher adresse GPS (geocoded location)',
        'editor.geocoded_location_description': 'Affiche l\'adresse lisible obtenue via GPS grâce à sensor.xxx_geocoded_location. Visible uniquement quand la personne n\'est pas à la maison.',
        'editor.geocoded_location_entity': 'Entité geocoded location (auto-détectée si vide)',
        'editor.maps_provider': 'Ouvrir dans Maps au clic sur la position',
        'editor.maps_provider_description': 'Si défini, cliquer sur la zone ou l\'adresse ouvre la carte avec les coordonnées GPS.',
        'editor.maps_provider_none': 'Désactivé',
        'editor.state_entity': 'Capteur d\'état personnalisé',
        'editor.state_entity_description': 'Remplace le texte de localisation affiché. La logique home/away reste inchangée.',
        'editor.show_device_2_battery': 'Batterie 2e appareil (tablette/laptop)',
        'editor.device_2_battery_sensor': 'Capteur batterie 2e appareil',
        'editor.device_2_battery_state_sensor': 'Capteur état charge 2e appareil',
        'wx.battery': 'Batterie', 'wx.watch': 'Montre', 'wx.wind': 'Vent',
        'wx.humidity': 'Humidité', 'wx.network': 'Réseau', 'wx.activity': 'Activité',
        'wx.pressure': 'Press.', 'wx.feels': 'Ressenti', 'wx.device2': 'Appar.2',
        'editor.border_radius': 'Rayon bordure',
        'editor.image_size': 'Taille image (%)',
        'editor.modern_picture_size': 'Taille image (px)',
        'editor.modern_name_font_size': 'Taille police nom',
        'editor.modern_state_font_size': 'Taille police état',
        'editor.modern_show_battery_ring': 'Afficher anneau batterie',
        'editor.modern_show_travel_ring': 'Afficher anneau temps trajet',
        'editor.modern_travel_max_time': 'Temps trajet max (min)',
        'editor.modern_distance_max': 'Distance max (km)',
        'editor.modern_ring_size': 'Taille anneaux (px)',
        'editor.classic_icon_size': 'Taille icônes (px)',
        'editor.compact_icon_size': 'Taille icônes (px)',
        'editor.battery_font_size': 'Taille police batterie',
        'editor.activity_font_size': 'Taille police activité',
        'editor.battery_state_sensor': 'Capteur état charge téléphone',
        'editor.battery_charging_value': 'Valeur état en charge (optionnel)',
        'editor.watch_battery_state_sensor': 'Capteur état charge montre',
        'editor.watch_battery_charging_value': 'Valeur état en charge montre (optionnel)',
        'editor.charging_helper': 'Laisser vide pour détection auto (charging, full, on, true...)',
        'section.automatic_sensors': 'Capteurs Automatiques',
        'section.sensors_description': 'Les capteurs sont détectés automatiquement depuis l\'app mobile liée à l\'entité personne. Préfixe détecté:',
        'section.auto_detect_btn': 'Détecter automatiquement',
        'section.auto_detect_found': 'capteurs trouvés',
        'section.auto_detect_none': 'Aucun capteur trouvé',
        'section.element_positions': 'Positions éléments',
        'section.positions_description': 'Configurer la position de chaque élément sur la carte. Disponible uniquement en mode Classic.',
        'section.custom_states': 'États Personnalisés',
        'section.states_description': 'Configurer comment les différents états de la personne sont affichés',
        'section.card_style': 'Personnalisation Style Carte',
        'section.modern_options': 'Options Layout Moderne',
        'section.classic_options': 'Options Layout Classic',
        'section.compact_options': 'Options Layout Compact',
        'section.neon_options': 'Options Layout Néon',
        'section.neon_description': 'Thème cyberpunk sombre avec anneau lumineux animé et badges neon. Les couleurs s\'adaptent automatiquement à l\'état de la personne (vert = maison, rouge = absent).',
        'section.glass_options': 'Options Layout Glass',
        'section.glass_description': 'Thème glassmorphisme sombre avec chips translucides, orbes colorés et point de statut animé. La couleur accent s\'adapte automatiquement à la zone actuelle.',
        'section.bio_options': 'Options Layout Bioluminescence',
        'section.bio_description': 'Thème océan profond avec orbes bioluminescents animés, particules montantes et double anneau pulsant autour de l\'avatar. La couleur accent change automatiquement avec la zone.',
        'section.holo_options': 'Options Layout Holographique 3D',
        'section.holo_description': 'Thème holographique avec carte inclinée en 3D, anneaux rotatifs autour de l\'avatar, scanner animé et fond shimmer iridescent. La couleur accent change avec l\'état de la personne.',
        'section.weather': '🌤 Météo',
        'editor.show_weather': 'Afficher météo',
        'editor.weather_entity': 'Entité météo',
        'editor.show_weather_background': 'Afficher fond météo animé',
        'editor.show_weather_temperature': 'Afficher conditions et température',
        'editor.weather_text_color': 'Couleur du texte météo',
        'editor.weather_text_color_description': 'Couleur de la température, de l\'icône et de la condition. Laissez vide pour la couleur par défaut du layout.',
        'editor.last_changed_color': 'Couleur du texte de mise à jour',
        'editor.last_changed_color_description': 'Couleur du timestamp de dernière mise à jour. Laissez vide pour la couleur par défaut.',
        'editor.location_color': 'Couleur du texte de position',
        'editor.location_color_description': 'Couleur de la zone/état pour toutes les positions. Une couleur définie pour un état précis reste prioritaire. Laissez vide pour la couleur par défaut du layout.',
        'editor.geocoded_location_color': 'Couleur de l\'adresse GPS',
        'editor.geocoded_location_color_description': 'Couleur de l\'adresse géocodée. Laissez vide pour utiliser la couleur du texte de position (ou celle du layout).',
        'section.weather_description': 'Ajoute un fond animé à la carte (pluie, neige, soleil, étoiles, foudre…). Fonctionne sur tous les layouts.',
        'section.travel_sensor_2': '🏢 Capteurs Maison ↔ Travail',
        'section.travel_sensor_2_description': 'Capteur 1 (maison→travail): visible à la maison et en transit, masqué au travail. Capteur 2 (travail→maison): visible au travail et en transit, masqué à la maison. Désactivez le mode smart pour toujours afficher les deux.',
        'editor.travel_sensor_2': 'Capteur temps de trajet (travail → maison)',
        'editor.zone_2': 'Zone travail',
        'editor.show_travel_time_2': 'Afficher temps trajet (Travail → Maison)',
        'editor.smart_travel_mode': 'Mode smart (masquer selon la position)',
        'editor.pair_travel_animation': 'Animation alternée distance/temps (si désactivée, affiche les deux séparément)',
        'editor.distance_precision': 'Décimales distance (0=entier, 1=une décimale, 2=deux décimales)',
        'editor.distance_unit': 'Unité de distance (ex. km, mi)',
        'editor.distance_unit_description': 'Laisser vide pour détection auto. Pour Waze/Google utiliser km ou mi.',
        'editor.direction_home_work': 'Maison → Travail',
        'editor.direction_work_home': 'Travail → Maison',
        'editor.travel_sensor_home_work': 'Capteur temps trajet (Maison → Travail)',
        'editor.travel_sensor_work_home': 'Capteur temps trajet (Travail → Maison)',
        'editor.distance_sensor_home_work': 'Capteur distance (Maison → Travail)',
        'editor.distance_sensor_work_home': 'Capteur distance (Travail → Maison)',
        'editor.show_distance_2': 'Afficher distance',
        'section.distance_optional': '📍 Distance (Optionnel)',
        'section.distance_optional_description': 'Afficher la distance en km. Toujours visible quelle que soit la position.',
        'position.battery': 'Position batterie',
        'position.watch_battery': 'Position batterie montre',
        'position.activity': 'Position activité',
        'position.distance': 'Position distance',
        'position.travel': 'Position temps trajet',
        'position.connection': 'Position connexion',
        'state.name_color': 'Couleur nom',
        'state.add_state': 'Ajouter État',
        'default_state.home': '🏡 Maison',
        'default_state.away': '🏃‍♂️ Absent de la Maison',
        'default_state.office': '🏢 Bureau',
        'default_state.unknown': '❓ Inconnu',
        'state.default_states': 'États par Défaut',
        'state.add_default_states': 'Ajouter états par Défaut',
        'tabs.base': 'Base',
        'tabs.layout': 'Disposition',
        'tabs.display': 'Affichage',
        'tabs.positions': 'Positions',
        'tabs.states': 'États',
        'tabs.sensors': 'Capteurs',
        'tabs.style': 'Style',
        'section.extra_chips': 'Chips supplémentaires personnalisés',
        'editor.extra_chips_description': 'Ajoutez des entités supplémentaires comme chips. Avec show_when le chip n\'apparaît que lorsque l\'état correspond.',
        'editor.extra_chip_entity': 'Entité',
        'editor.extra_chip_show_when': 'Afficher quand (état)',
        'editor.extra_chip_label': 'Étiquette (optionnel)',
        'editor.extra_chip_color': 'Couleur icône et texte',
        'editor.extra_chip_add': '+ Ajouter chip',
        'editor.extra_chip_tap_action': 'Action au toucher',
        'editor.extra_chip_tap_more_info': 'Afficher infos (more-info)',
        'editor.extra_chip_tap_call_service': 'Appeler service',
        'editor.extra_chip_tap_navigate': 'Naviguer',
        'editor.extra_chip_tap_url': 'Ouvrir URL',
        'editor.extra_chip_tap_none': 'Aucune action',
        'editor.extra_chip_icon_label': 'Icône (défaut: icône entité)',
        'editor.extra_chip_service': 'Service (ex. light.turn_on)',
        'editor.extra_chip_service_data': 'Données extra (JSON, optionnel)',
        'editor.extra_chip_nav_path': 'Chemin de navigation',
        'editor.extra_chip_url_path': 'URL',
        'editor.tap_entity': 'Entité (vide = entité personne)',
        'common.remove': 'Supprimer',
        'editor.wifi_ssid_sensor': 'Capteur SSID Wi-Fi',
        'editor.wifi_ssid_sensor_description': 'Capteur indiquant le nom du réseau Wi-Fi auquel l\'appareil est connecté. Quand configuré, le nom du réseau s\'affiche à la place de "WiFi".',
        'editor.home_icon': 'Icône de localisation maison (layout Ink uniquement)',
        'editor.home_icon_description': 'Icône MDI affichée à côté de la localisation quand la personne est à la maison. Laisser vide pour la valeur par défaut (mdi:home). Utilisez "auto" pour détecter automatiquement le type d\'appareil (téléphone/tablette/ordinateur). Ex : mdi:cellphone, mdi:watch, mdi:devices',
        'editor.home_icon_entity': 'Entité icône maison dynamique (layout Ink uniquement)',
        'editor.home_icon_entity_description': 'Entité HA dont l\'état est utilisé comme icône MDI à la maison (ex. sensor.tracking_source_icon → mdi:cellphone). Prioritaire sur home_icon si définie.'
      },
      'de': {
        'editor.entity': 'Entität',
        'editor.name': 'Name (optional)',
        'editor.show_last_changed': 'Letzte Änderung anzeigen',
        'editor.show_distance': 'Entfernung anzeigen',
        'editor.show_battery': 'Batterie anzeigen',
        'editor.show_speed': 'Geschwindigkeit anzeigen',
        'editor.show_direction': 'Richtung anzeigen',
        'editor.show_accuracy': 'Genauigkeit anzeigen',
        'editor.show_gps_accuracy': 'GPS-Genauigkeit anzeigen',
        'editor.show_altitude': 'Höhe anzeigen',
        'editor.show_source': 'Quelle anzeigen',
        'editor.show_entity_picture': 'Bild anzeigen',
        'editor.show_name': 'Status anzeigen',
        'editor.show_person_name': 'Personenname anzeigen',
        'editor.show_activity': 'Aktivität anzeigen',
        'editor.show_watch_battery': 'Uhr-Batterie anzeigen',
        'editor.show_travel_time': 'Reisezeit anzeigen',
        'editor.show_connection': 'Verbindung anzeigen',
        'editor.custom_icon': 'Benutzerdefiniertes Symbol',
        'editor.icon_color': 'Symbolfarbe',
        'editor.background_color': 'Hintergrundfarbe',
        'editor.text_color': 'Textfarbe',
        'editor.required': 'Erforderlich',
        'editor.optional': 'Optional',
        'editor.layout': 'Layout',
        'editor.appearance': 'Erscheinungsbild',
        'editor.display_options': 'Anzeigeoptionen',
        'editor.positions': 'Positionen',
        'editor.advanced': 'Erweitert',
        'editor.show_last_updated': 'Letzte Aktualisierung anzeigen',
        'editor.compact_width': 'Kompakte Breite (px)',
        'editor.compact_stretch': 'Auf volle Breite dehnen',
        'editor.modern_width': 'Moderne Breite (px)',
        'editor.custom_image_url': 'Benutzerdefinierte Bild-URL',
        'editor.aspect_ratio': 'Seitenverhältnis',
        'editor.state_value': 'Statuswert',
        'editor.displayed_name': 'Angezeigter Name',
        'editor.custom_image': 'Benutzerdefiniertes Bild',
        'editor.name_font_size': 'Schriftgröße Name',
        'editor.state_font_size': 'Schriftgröße Status',
        'editor.last_changed_font_size': 'Schriftgröße Letzte Änderung',
        'editor.card_background': 'Kartenhintergrund',
        'editor.transparent_background': 'Transparenter Hintergrund (nur Glass/Bio)',
        'editor.show_particles': 'Animierte Partikel anzeigen (nur Glass/Bio)',
        'editor.show_geocoded_location': 'GPS-Adresse anzeigen (Geocoded Location)',
        'editor.geocoded_location_description': 'Zeigt die lesbare GPS-Adresse via sensor.xxx_geocoded_location an. Nur sichtbar wenn die Person nicht zu Hause ist.',
        'editor.geocoded_location_entity': 'Geocoded-Location-Entität (auto-erkannt wenn leer)',
        'editor.maps_provider': 'In Maps öffnen beim Klick auf Position',
        'editor.maps_provider_description': 'Wenn gesetzt, öffnet ein Klick auf Zone oder Adresse die Karte mit GPS-Koordinaten.',
        'editor.maps_provider_none': 'Deaktiviert',
        'editor.state_entity': 'Benutzerdefinierter Statussensor',
        'editor.state_entity_description': 'Überschreibt den angezeigten Standorttext. Die Home/Away-Logik bleibt unverändert.',
        'editor.show_device_2_battery': 'Zweitgerät-Akku (Tablet/Laptop)',
        'editor.device_2_battery_sensor': 'Akku-Sensor Zweitgerät',
        'editor.device_2_battery_state_sensor': 'Ladestatus-Sensor Zweitgerät',
        'wx.battery': 'Batterie', 'wx.watch': 'Uhr', 'wx.wind': 'Wind',
        'wx.humidity': 'Luftfeuchte', 'wx.network': 'Netzwerk', 'wx.activity': 'Aktivität',
        'wx.pressure': 'Druck', 'wx.feels': 'Gefühlt', 'wx.device2': 'Gerät 2',
        'editor.border_radius': 'Randradius',
        'editor.image_size': 'Bildgröße (%)',
        'editor.modern_picture_size': 'Bildgröße (px)',
        'editor.modern_name_font_size': 'Schriftgröße Name',
        'editor.modern_state_font_size': 'Schriftgröße Status',
        'editor.modern_show_battery_ring': 'Batteriering anzeigen',
        'editor.modern_show_travel_ring': 'Reisezeitring anzeigen',
        'editor.modern_travel_max_time': 'Max Reisezeit (min)',
        'editor.modern_distance_max': 'Max Entfernung (km)',
        'editor.modern_ring_size': 'Ringgröße (px)',
        'editor.classic_icon_size': 'Symbolgröße (px)',
        'editor.compact_icon_size': 'Symbolgröße (px)',
        'editor.battery_font_size': 'Schriftgröße Batterie',
        'editor.activity_font_size': 'Schriftgröße Aktivität',
        'editor.battery_state_sensor': 'Telefon-Ladezustandssensor',
        'editor.battery_charging_value': 'Ladezustandswert (optional)',
        'editor.watch_battery_state_sensor': 'Uhr-Ladezustandssensor',
        'editor.watch_battery_charging_value': 'Uhr-Ladezustandswert (optional)',
        'editor.charging_helper': 'Leer lassen für Auto-Erkennung (charging, full, on, true...)',
        'section.automatic_sensors': 'Automatische Sensoren',
        'section.sensors_description': 'Sensoren werden automatisch aus der mit der Personenentität verknüpften mobilen App erkannt. Erkanntes Präfix:',
        'section.auto_detect_btn': 'Automatisch erkennen',
        'section.auto_detect_found': 'Sensoren gefunden',
        'section.auto_detect_none': 'Keine passenden Sensoren gefunden',
        'section.element_positions': 'Elementpositionen',
        'section.positions_description': 'Konfigurieren Sie die Position jedes Elements auf der Karte. Nur im Classic-Layout verfügbar.',
        'section.custom_states': 'Benutzerdefinierte Zustände',
        'section.states_description': 'Konfigurieren Sie, wie die verschiedenen Personenzustände angezeigt werden',
        'section.card_style': 'Karten-Stil Anpassung',
        'section.modern_options': 'Moderne Layout-Optionen',
        'section.classic_options': 'Classic Layout-Optionen',
        'section.compact_options': 'Compact Layout-Optionen',
        'section.neon_options': 'Neon Layout-Optionen',
        'section.neon_description': 'Dunkles Cyberpunk-Thema mit animiertem Leuchtring und Neon-Badges. Farben passen sich automatisch dem Personenstatus an (grün = zuhause, rot = abwesend).',
        'section.glass_options': 'Glass Layout-Optionen',
        'section.glass_description': 'Dunkles Glassmorphismus-Thema mit durchscheinenden Chips, farbigen Orbs und animiertem Statuspunkt. Die Akzentfarbe passt sich automatisch der aktuellen Zone an.',
        'section.bio_options': 'Biolumineszenz Layout-Optionen',
        'section.bio_description': 'Tiefsee-Thema mit animierten biolumineszenten Orbs, aufsteigenden Partikeln und doppeltem Pulsring um den Avatar. Die Akzentfarbe ändert sich automatisch mit der Zone.',
        'section.holo_options': 'Holographic 3D Layout-Optionen',
        'section.holo_description': 'Holografisches Thema mit 3D-geneigter Karte, rotierenden Ringen um den Avatar, animiertem Scanner und irisierendem Shimmer-Hintergrund. Die Akzentfarbe ändert sich mit dem Personenstatus.',
        'section.weather': '🌤 Wetter',
        'editor.show_weather': 'Wetter anzeigen',
        'editor.weather_entity': 'Wetterentität',
        'editor.show_weather_background': 'Animierten Wetterhintergrund anzeigen',
        'editor.show_weather_temperature': 'Bedingungen und Temperatur anzeigen',
        'editor.weather_text_color': 'Wettertext-Farbe',
        'editor.weather_text_color_description': 'Farbe für Temperatur, Symbol und Wetterbedingung. Leer lassen für die Standard-Layout-Farbe.',
        'editor.last_changed_color': 'Farbe des Aktualisierungstexts',
        'editor.last_changed_color_description': 'Farbe des Zeitstempels der letzten Aktualisierung. Leer lassen für die Standard-Farbe.',
        'editor.location_color': 'Farbe des Standorttexts',
        'editor.location_color_description': 'Farbe des Zonen-/Statustexts für alle Standorte. Eine für einen einzelnen Status gesetzte Farbe hat Vorrang. Leer lassen für die Standard-Layout-Farbe.',
        'editor.geocoded_location_color': 'Farbe der GPS-Adresse',
        'editor.geocoded_location_color_description': 'Farbe der geokodierten Adresse. Leer lassen, um die Farbe des Standorttexts (oder die Layout-Farbe) zu verwenden.',
        'section.weather_description': 'Fügt der Karte einen animierten Wetterhintergrund hinzu (Regen, Schnee, Sonne, Sterne, Blitze…). Funktioniert auf allen Layouts.',
        'section.travel_sensor_2': '🏢 Zuhause ↔ Arbeit Sensoren',
        'section.travel_sensor_2_description': 'Sensor 1 (zuhause→arbeit): sichtbar zuhause und unterwegs, versteckt bei der Arbeit. Sensor 2 (arbeit→zuhause): sichtbar bei der Arbeit und unterwegs, versteckt zuhause. Smart-Modus deaktivieren um immer beide anzuzeigen.',
        'editor.travel_sensor_2': 'Reisezeitssensor (Arbeit → Zuhause)',
        'editor.zone_2': 'Arbeitszone',
        'editor.show_travel_time_2': 'Reisezeit anzeigen (Arbeit → Zuhause)',
        'editor.smart_travel_mode': 'Smart-Modus (je nach Standort ausblenden)',
        'editor.pair_travel_animation': 'Abwechselnde Entfernung/Zeit-Animation (deaktiviert = beide separat anzeigen)',
        'editor.distance_precision': 'Entfernungs-Dezimalstellen (0=ganz, 1=eine, 2=zwei)',
        'editor.distance_unit': 'Entfernungseinheit (z.B. km, mi)',
        'editor.distance_unit_description': 'Leer lassen für Auto-Erkennung. Für Waze/Google km oder mi verwenden.',
        'editor.direction_home_work': 'Zuhause → Arbeit',
        'editor.direction_work_home': 'Arbeit → Zuhause',
        'editor.travel_sensor_home_work': 'Reisezeitssensor (Zuhause → Arbeit)',
        'editor.travel_sensor_work_home': 'Reisezeitssensor (Arbeit → Zuhause)',
        'editor.distance_sensor_home_work': 'Entfernungssensor (Zuhause → Arbeit)',
        'editor.distance_sensor_work_home': 'Entfernungssensor (Arbeit → Zuhause)',
        'editor.show_distance_2': 'Entfernung anzeigen',
        'section.distance_optional': '📍 Entfernung (Optional)',
        'section.distance_optional_description': 'Entfernung in km anzeigen. Immer sichtbar unabhängig vom Standort.',
        'position.battery': 'Batterieposition',
        'position.watch_battery': 'Uhr-Batterieposition',
        'position.activity': 'Aktivitätsposition',
        'position.distance': 'Entfernungsposition',
        'position.travel': 'Reisezeitposition',
        'position.connection': 'Verbindungsposition',
        'state.name_color': 'Namensfarbe',
        'state.add_state': 'Zustand Hinzufügen',
        'default_state.home': '🏡 Zuhause',
        'default_state.away': '🏃‍♂️ Nicht Zuhause',
        'default_state.office': '🏢 Büro',
        'default_state.unknown': '❓ Unbekannt',
        'state.default_states': 'Standardzustände',
        'state.add_default_states': 'Standardzustände Hinzufügen',
        'tabs.base': 'Basis',
        'tabs.layout': 'Layout',
        'tabs.display': 'Anzeige',
        'tabs.positions': 'Positionen',
        'tabs.states': 'Zustände',
        'tabs.sensors': 'Sensoren',
        'tabs.style': 'Stil',
        'section.extra_chips': 'Benutzerdefinierte Extra-Chips',
        'editor.extra_chips_description': 'Fügen Sie zusätzliche Entitäten als Chips hinzu. Mit show_when erscheint der Chip nur, wenn der Status übereinstimmt.',
        'editor.extra_chip_entity': 'Entität',
        'editor.extra_chip_show_when': 'Anzeigen wenn (Status)',
        'editor.extra_chip_label': 'Bezeichnung (optional)',
        'editor.extra_chip_color': 'Symbol- und Textfarbe',
        'editor.extra_chip_add': '+ Chip hinzufügen',
        'editor.extra_chip_tap_action': 'Tippen-Aktion',
        'editor.extra_chip_tap_more_info': 'Info anzeigen (more-info)',
        'editor.extra_chip_tap_call_service': 'Dienst aufrufen',
        'editor.extra_chip_tap_navigate': 'Navigieren',
        'editor.extra_chip_tap_url': 'URL öffnen',
        'editor.extra_chip_tap_none': 'Keine Aktion',
        'editor.extra_chip_icon_label': 'Symbol (Standard: Entitätssymbol)',
        'editor.extra_chip_service': 'Dienst (z.B. light.turn_on)',
        'editor.extra_chip_service_data': 'Zusatzdaten (JSON, optional)',
        'editor.extra_chip_nav_path': 'Navigationspfad',
        'editor.extra_chip_url_path': 'URL',
        'editor.tap_entity': 'Entität (leer = Personen-Entität)',
        'common.remove': 'Entfernen',
        'editor.wifi_ssid_sensor': 'WLAN-SSID-Sensor',
        'editor.wifi_ssid_sensor_description': 'Sensor, der den Namen des WLAN-Netzwerks meldet, mit dem das Gerät verbunden ist. Wenn gesetzt, wird der Netzwerkname statt "WiFi" angezeigt.',
        'editor.home_icon': 'Heimsymbol (nur Ink-Layout)',
        'editor.home_icon_description': 'MDI-Symbol neben der Position, wenn die Person zu Hause ist. Leer lassen für den Standard (mdi:home). Verwenden Sie "auto" zur automatischen Erkennung des Gerätetyps (Handy/Tablet/Laptop). Z.B.: mdi:cellphone, mdi:watch, mdi:devices',
        'editor.home_icon_entity': 'Dynamisches Heim-Symbol Entität (nur Ink-Layout)',
        'editor.home_icon_entity_description': 'HA-Entität, deren Zustand als MDI-Symbol zu Hause verwendet wird (z.B. sensor.tracking_source_icon → mdi:cellphone). Hat Vorrang vor home_icon wenn gesetzt.'
      },
      'pl': {
        'editor.entity': 'Encja',
        'editor.name': 'Nazwa (opcjonalna)',
        'editor.show_last_changed': 'Pokaż ostatnią zmianę',
        'editor.show_last_updated': 'Pokaż ostatnią aktualizację',
        'editor.show_distance': 'Pokaż odległość',
        'editor.show_battery': 'Pokaż baterię',
        'editor.show_speed': 'Pokaż prędkość',
        'editor.show_direction': 'Pokaż kierunek',
        'editor.show_accuracy': 'Pokaż dokładność',
        'editor.show_gps_accuracy': 'Pokaż dokładność GPS',
        'editor.show_altitude': 'Pokaż wysokość',
        'editor.show_source': 'Pokaż źródło',
        'editor.show_entity_picture': 'Pokaż zdjęcie',
        'editor.show_name': 'Pokaż status',
        'editor.show_person_name': 'Pokaż imię osoby',
        'editor.show_activity': 'Pokaż aktywność',
        'editor.show_watch_battery': 'Pokaż baterię zegarka',
        'editor.show_travel_time': 'Pokaż czas podróży',
        'editor.show_connection': 'Pokaż połączenie',
        'editor.custom_icon': 'Niestandardowa ikona',
        'editor.icon_color': 'Kolor ikony',
        'editor.background_color': 'Kolor tła',
        'editor.text_color': 'Kolor tekstu',
        'editor.required': 'Wymagane',
        'editor.optional': 'Opcjonalne',
        'editor.layout': 'Układ',
        'editor.appearance': 'Wygląd',
        'editor.display_options': 'Opcje wyświetlania',
        'editor.positions': 'Pozycje',
        'editor.advanced': 'Zaawansowane',
        'editor.compact_width': 'Szerokość kompaktowa (px)',
        'editor.compact_stretch': 'Rozciągnij do pełnej szerokości',
        'editor.modern_width': 'Szerokość modern (px)',
        'editor.custom_image_url': 'Niestandardowy URL obrazu',
        'editor.aspect_ratio': 'Proporcje',
        'editor.state_value': 'Wartość stanu',
        'editor.displayed_name': 'Wyświetlana nazwa',
        'editor.custom_image': 'Niestandardowy obraz',
        'editor.name_font_size': 'Rozmiar czcionki nazwy',
        'editor.state_font_size': 'Rozmiar czcionki stanu',
        'editor.last_changed_font_size': 'Rozmiar czcionki ostatniej zmiany',
        'editor.card_background': 'Tło karty',
        'editor.transparent_background': 'Przezroczyste tło (tylko Glass/Bio)',
        'editor.show_particles': 'Pokaż animowane cząstki (tylko Glass/Bio)',
        'editor.show_geocoded_location': 'Pokaż adres GPS (geocoded location)',
        'editor.geocoded_location_description': 'Pokazuje czytelny adres z GPS przez sensor.xxx_geocoded_location. Widoczne tylko gdy osoba nie jest w domu.',
        'editor.geocoded_location_entity': 'Encja geocoded location (automatyczna gdy pusta)',
        'editor.maps_provider': 'Otwórz w mapach po kliknięciu lokalizacji',
        'editor.maps_provider_description': 'Gdy ustawione, kliknięcie na strefę lub adres otwiera mapę ze współrzędnymi GPS.',
        'editor.maps_provider_none': 'Wyłączone',
        'editor.state_entity': 'Niestandardowy sensor stanu',
        'editor.state_entity_description': 'Zastępuje wyświetlany tekst lokalizacji. Logika dom/poza domem pozostaje niezmieniona.',
        'editor.show_device_2_battery': 'Bateria drugiego urządzenia (tablet/laptop)',
        'editor.device_2_battery_sensor': 'Sensor baterii drugiego urządzenia',
        'editor.device_2_battery_state_sensor': 'Sensor stanu ładowania drugiego urządzenia',
        'wx.battery': 'Bateria', 'wx.watch': 'Zegarek', 'wx.wind': 'Wiatr',
        'wx.humidity': 'Wilgotność', 'wx.network': 'Sieć', 'wx.activity': 'Aktywność',
        'wx.pressure': 'Ciśn.', 'wx.feels': 'Odczuwalna', 'wx.device2': 'Urządz.2',
        'editor.border_radius': 'Promień narożnika',
        'editor.image_size': 'Rozmiar obrazu (%)',
        'editor.modern_picture_size': 'Rozmiar obrazu (px)',
        'editor.modern_name_font_size': 'Rozmiar czcionki nazwy',
        'editor.modern_state_font_size': 'Rozmiar czcionki stanu',
        'editor.modern_show_battery_ring': 'Pokaż pierścień baterii',
        'editor.modern_show_travel_ring': 'Pokaż pierścień czasu podróży',
        'editor.modern_travel_max_time': 'Maks. czas podróży (min)',
        'editor.modern_distance_max': 'Maks. odległość (km)',
        'editor.modern_ring_size': 'Rozmiar pierścienia (px)',
        'editor.classic_icon_size': 'Rozmiar ikony (px)',
        'editor.compact_icon_size': 'Rozmiar ikony (px)',
        'editor.battery_font_size': 'Rozmiar czcionki baterii',
        'editor.activity_font_size': 'Rozmiar czcionki aktywności',
        'editor.battery_state_sensor': 'Sensor stanu ładowania telefonu',
        'editor.battery_charging_value': 'Wartość stanu ładowania (opcjonalna)',
        'editor.watch_battery_state_sensor': 'Sensor stanu ładowania zegarka',
        'editor.watch_battery_charging_value': 'Wartość stanu ładowania zegarka (opcjonalna)',
        'editor.charging_helper': 'Zostaw puste dla auto-wykrywania (charging, full, on, true...)',
        'section.automatic_sensors': 'Automatyczne sensory',
        'section.sensors_description': 'Sensory są automatycznie wykrywane z aplikacji mobilnej powiązanej z encją osoby. Wykryty prefiks:',
        'section.auto_detect_btn': 'Automatycznie wykryj sensory',
        'section.auto_detect_found': 'sensorów znaleziono',
        'section.auto_detect_none': 'Nie znaleziono pasujących sensorów',
        'section.element_positions': 'Pozycje elementów',
        'section.positions_description': 'Skonfiguruj pozycję każdego elementu na karcie. Dostępne tylko w układzie Classic.',
        'section.custom_states': 'Niestandardowe stany',
        'section.states_description': 'Skonfiguruj sposób wyświetlania różnych stanów osoby',
        'section.card_style': 'Styl karty',
        'section.modern_options': 'Opcje układu Modern',
        'section.classic_options': 'Opcje układu Classic',
        'section.compact_options': 'Opcje układu Compact',
        'section.neon_options': 'Opcje układu Neon',
        'section.neon_description': 'Ciemny cyberpunk z animowanym świecącym pierścieniem i neon-badges. Kolory automatycznie dostosowują się do stanu osoby (zielony = w domu, czerwony = poza domem).',
        'section.glass_options': 'Opcje układu Glass',
        'section.glass_description': 'Ciemny glassmorphism z przezroczystymi chipami, kolorowymi kulami i animowaną kropką stanu. Kolor akcentu automatycznie dostosowuje się do bieżącej strefy.',
        'section.bio_options': 'Opcje układu Bioluminescent',
        'section.bio_description': 'Motyw głębokiego oceanu z animowanymi kulami bioluminescencyjnymi, unoszącymi się cząstkami i podwójnym pulsującym pierścieniem wokół awatara. Kolor akcentu zmienia się ze strefą.',
        'section.holo_options': 'Opcje układu Holographic 3D',
        'section.holo_description': 'Holograficzny motyw z trójwymiarową pochyloną kartą, obracającymi się pierścieniami wokół awatara, animowanym skanerem i iryzującym tłem. Kolor akcentu zmienia się ze stanem osoby.',
        'section.weather': '🌤 Pogoda',
        'editor.show_weather': 'Pokaż pogodę',
        'editor.weather_entity': 'Encja pogody',
        'editor.show_weather_background': 'Pokaż animowane tło pogody',
        'editor.show_weather_temperature': 'Pokaż warunki i temperaturę',
        'editor.weather_text_color': 'Kolor tekstu pogody',
        'editor.weather_text_color_description': 'Kolor temperatury, ikony i etykiety warunków. Pozostaw puste dla domyślnego koloru układu.',
        'editor.last_changed_color': 'Kolor tekstu aktualizacji',
        'editor.last_changed_color_description': 'Kolor znacznika czasu ostatniej aktualizacji. Pozostaw puste dla koloru domyślnego.',
        'editor.location_color': 'Kolor tekstu lokalizacji',
        'editor.location_color_description': 'Kolor tekstu strefy/stanu dla wszystkich lokalizacji. Kolor ustawiony dla pojedynczego stanu ma pierwszeństwo. Pozostaw puste dla domyślnego koloru układu.',
        'editor.geocoded_location_color': 'Kolor adresu GPS',
        'editor.geocoded_location_color_description': 'Kolor adresu geokodowanego. Pozostaw puste, aby użyć koloru tekstu lokalizacji (lub domyślnego koloru układu).',
        'section.weather_description': 'Dodaje animowane tło pogody do karty (deszcz, śnieg, słońce, gwiazdy, pioruny…). Działa na wszystkich układach.',
        'section.travel_sensor_2': '🏢 Sensory Dom ↔ Praca',
        'section.travel_sensor_2_description': 'Sensor 1 (dom→praca): widoczny w domu i w drodze, ukryty w pracy. Sensor 2 (praca→dom): widoczny w pracy i w drodze, ukryty w domu. Wyłącz tryb smart, aby zawsze pokazywać oba.',
        'editor.travel_sensor_2': 'Sensor czasu podróży (praca → dom)',
        'editor.zone_2': 'Strefa pracy',
        'editor.show_travel_time_2': 'Pokaż czas podróży (Praca → Dom)',
        'editor.smart_travel_mode': 'Tryb smart (ukryj na podstawie lokalizacji)',
        'editor.pair_travel_animation': 'Naprzemienna animacja odległość/czas (wyłączona = pokaż oba osobno)',
        'editor.distance_precision': 'Miejsca dziesiętne odległości (0=całkowita, 1=jedno, 2=dwa)',
        'editor.distance_unit': 'Jednostka odległości (np. km, mi)',
        'editor.distance_unit_description': 'Pozostaw puste dla auto-wykrywania. Dla sensorów Waze/Google użyj km lub mi.',
        'editor.direction_home_work': 'Dom → Praca',
        'editor.direction_work_home': 'Praca → Dom',
        'editor.travel_sensor_home_work': 'Sensor czasu podróży (Dom → Praca)',
        'editor.travel_sensor_work_home': 'Sensor czasu podróży (Praca → Dom)',
        'editor.distance_sensor_home_work': 'Sensor odległości (Dom → Praca)',
        'editor.distance_sensor_work_home': 'Sensor odległości (Praca → Dom)',
        'editor.show_distance_2': 'Pokaż odległość',
        'section.distance_optional': '📍 Odległość (opcjonalna)',
        'section.distance_optional_description': 'Wyświetl odległość w km. Zawsze widoczne niezależnie od pozycji.',
        'position.battery': 'Pozycja baterii',
        'position.watch_battery': 'Pozycja baterii zegarka',
        'position.activity': 'Pozycja aktywności',
        'position.distance': 'Pozycja odległości',
        'position.travel': 'Pozycja czasu podróży',
        'position.connection': 'Pozycja połączenia',
        'state.name_color': 'Kolor nazwy',
        'state.add_state': 'Dodaj stan',
        'default_state.home': '🏡 W domu',
        'default_state.away': '🏃‍♂️ Poza domem',
        'default_state.office': '🏢 Biuro',
        'default_state.unknown': '❓ Nieznany',
        'state.default_states': 'Domyślne stany',
        'state.add_default_states': 'Dodaj domyślne stany',
        'tabs.base': 'Podstawowe',
        'tabs.layout': 'Układ',
        'tabs.display': 'Wyświetlanie',
        'tabs.positions': 'Pozycje',
        'tabs.states': 'Stany',
        'tabs.sensors': 'Sensory',
        'tabs.style': 'Styl',
        'section.extra_chips': 'Niestandardowe chipy',
        'editor.extra_chips_description': 'Dodaj dodatkowe encje jako chipy. Z show_when chip pojawia się tylko gdy stan pasuje.',
        'editor.extra_chip_entity': 'Encja',
        'editor.extra_chip_show_when': 'Pokaż gdy (stan)',
        'editor.extra_chip_label': 'Etykieta (opcjonalna)',
        'editor.extra_chip_color': 'Kolor ikony i tekstu',
        'editor.extra_chip_add': '+ Dodaj chip',
        'editor.extra_chip_tap_action': 'Akcja dotknięcia',
        'editor.extra_chip_tap_more_info': 'Pokaż info (more-info)',
        'editor.extra_chip_tap_call_service': 'Wywołaj usługę',
        'editor.extra_chip_tap_navigate': 'Nawiguj',
        'editor.extra_chip_tap_url': 'Otwórz URL',
        'editor.extra_chip_tap_none': 'Brak akcji',
        'editor.extra_chip_icon_label': 'Ikona (domyślnie: ikona encji)',
        'editor.extra_chip_service': 'Usługa (np. light.turn_on)',
        'editor.extra_chip_service_data': 'Dodatkowe dane (JSON, opcjonalne)',
        'editor.extra_chip_nav_path': 'Ścieżka nawigacji',
        'editor.extra_chip_url_path': 'URL',
        'editor.tap_entity': 'Encja (puste = encja osoby)',
        'common.remove': 'Usuń',
        'editor.wifi_ssid_sensor': 'Sensor SSID Wi-Fi',
        'editor.wifi_ssid_sensor_description': 'Sensor raportujący nazwę sieci Wi-Fi, z którą połączone jest urządzenie. Gdy ustawiony, wyświetlana jest nazwa sieci zamiast "WiFi".',
        'editor.home_icon': 'Ikona lokalizacji domu (tylko układ Ink)',
        'editor.home_icon_description': 'Ikona MDI wyświetlana obok lokalizacji gdy osoba jest w domu. Pozostaw puste dla domyślnej (mdi:home). Użyj "auto" dla automatycznego wykrycia urządzenia (telefon/tablet/laptop). Np.: mdi:cellphone, mdi:watch, mdi:devices',
        'editor.home_icon_entity': 'Dynamiczna encja ikony domu (tylko układ Ink)',
        'editor.home_icon_entity_description': 'Encja HA, której stan jest używany jako ikona MDI w domu (np. sensor.tracking_source_icon → mdi:cellphone). Ma pierwszeństwo przed home_icon gdy ustawiona.'
      },
      'nl': {
        'editor.entity': 'Entiteit',
        'editor.name': 'Naam (optioneel)',
        'editor.show_last_changed': 'Laatste wijziging tonen',
        'editor.show_last_updated': 'Laatste update tonen',
        'editor.show_distance': 'Afstand tonen',
        'editor.show_battery': 'Batterij tonen',
        'editor.show_speed': 'Snelheid tonen',
        'editor.show_direction': 'Richting tonen',
        'editor.show_accuracy': 'Nauwkeurigheid tonen',
        'editor.show_gps_accuracy': 'GPS-nauwkeurigheid tonen',
        'editor.show_altitude': 'Hoogte tonen',
        'editor.show_source': 'Bron tonen',
        'editor.show_entity_picture': 'Afbeelding tonen',
        'editor.show_name': 'Status tonen',
        'editor.show_person_name': 'Persoonsnaam tonen',
        'editor.show_activity': 'Activiteit tonen',
        'editor.show_watch_battery': 'Horlogebatterij tonen',
        'editor.show_travel_time': 'Reistijd tonen',
        'editor.show_connection': 'Verbinding tonen',
        'editor.custom_icon': 'Aangepast pictogram',
        'editor.icon_color': 'Pictogramkleur',
        'editor.background_color': 'Achtergrondkleur',
        'editor.text_color': 'Tekstkleur',
        'editor.required': 'Verplicht',
        'editor.optional': 'Optioneel',
        'editor.layout': 'Lay-out',
        'editor.appearance': 'Uiterlijk',
        'editor.display_options': 'Weergaveopties',
        'editor.positions': 'Posities',
        'editor.advanced': 'Geavanceerd',
        'editor.compact_width': 'Compacte breedte (px)',
        'editor.compact_stretch': 'Uitrekken tot volledige breedte',
        'editor.modern_width': 'Moderne breedte (px)',
        'editor.custom_image_url': 'Aangepaste afbeeldings-URL',
        'editor.aspect_ratio': 'Beeldverhouding',
        'editor.state_value': 'Statuswaarde',
        'editor.displayed_name': 'Weergegeven naam',
        'editor.custom_image': 'Aangepaste afbeelding',
        'editor.name_font_size': 'Lettergrootte naam',
        'editor.state_font_size': 'Lettergrootte status',
        'editor.last_changed_font_size': 'Lettergrootte laatste wijziging',
        'editor.card_background': 'Kaartachtergrond',
        'editor.transparent_background': 'Transparante achtergrond (alleen Glass/Bio)',
        'editor.show_particles': 'Geanimeerde deeltjes tonen (alleen Glass/Bio)',
        'editor.show_geocoded_location': 'GPS-adres tonen (geocoded locatie)',
        'editor.geocoded_location_description': 'Toont het leesbare adres via GPS via sensor.xxx_geocoded_location. Alleen zichtbaar wanneer de persoon niet thuis is.',
        'editor.geocoded_location_entity': 'Geocoded locatie-entiteit (automatisch indien leeg)',
        'editor.maps_provider': 'Openen in Maps bij klikken op locatie',
        'editor.maps_provider_description': 'Indien ingesteld, opent een klik op de zone of het adres de kaart met GPS-coördinaten.',
        'editor.maps_provider_none': 'Uitgeschakeld',
        'editor.state_entity': 'Aangepaste statussensor',
        'editor.state_entity_description': 'Overschrijft de weergegeven locatietekst. Thuis/weg-logica blijft ongewijzigd.',
        'editor.show_device_2_battery': 'Tweede apparaat batterij (tablet/laptop)',
        'editor.device_2_battery_sensor': 'Batterijsensor tweede apparaat',
        'editor.device_2_battery_state_sensor': 'Laadstatussensor tweede apparaat',
        'wx.battery': 'Batterij', 'wx.watch': 'Horloge', 'wx.wind': 'Wind',
        'wx.humidity': 'Vochtigheid', 'wx.network': 'Netwerk', 'wx.activity': 'Activiteit',
        'wx.pressure': 'Druk', 'wx.feels': 'Gevoeld', 'wx.device2': 'Appar.2',
        'editor.border_radius': 'Randradius',
        'editor.image_size': 'Afbeeldingsgrootte (%)',
        'editor.modern_picture_size': 'Afbeeldingsgrootte (px)',
        'editor.modern_name_font_size': 'Lettergrootte naam',
        'editor.modern_state_font_size': 'Lettergrootte status',
        'editor.modern_show_battery_ring': 'Batterijring tonen',
        'editor.modern_show_travel_ring': 'Reistijdring tonen',
        'editor.modern_travel_max_time': 'Max reistijd (min)',
        'editor.modern_distance_max': 'Max afstand (km)',
        'editor.modern_ring_size': 'Ringgrootte (px)',
        'editor.classic_icon_size': 'Pictogramgrootte (px)',
        'editor.compact_icon_size': 'Pictogramgrootte (px)',
        'editor.battery_font_size': 'Lettergrootte batterij',
        'editor.activity_font_size': 'Lettergrootte activiteit',
        'editor.battery_state_sensor': 'Laadstatussensor telefoon',
        'editor.battery_charging_value': 'Laadstatuswaarde (optioneel)',
        'editor.watch_battery_state_sensor': 'Laadstatussensor horloge',
        'editor.watch_battery_charging_value': 'Laadstatuswaarde horloge (optioneel)',
        'editor.charging_helper': 'Leeg laten voor automatische detectie (charging, full, on, true...)',
        'section.automatic_sensors': 'Automatische sensoren',
        'section.sensors_description': 'Sensoren worden automatisch gedetecteerd vanuit de mobiele app gekoppeld aan de persoonsentiteit. Gedetecteerd voorvoegsel:',
        'section.auto_detect_btn': 'Sensoren automatisch detecteren',
        'section.auto_detect_found': 'sensoren gevonden',
        'section.auto_detect_none': 'Geen overeenkomende sensoren gevonden',
        'section.element_positions': 'Elementposities',
        'section.positions_description': 'Configureer de positie van elk element op de kaart. Alleen beschikbaar in het Classic-lay-out.',
        'section.custom_states': 'Aangepaste statussen',
        'section.states_description': 'Configureer hoe de verschillende persoonstatussen worden weergegeven',
        'section.card_style': 'Kaartstijl aanpassen',
        'section.modern_options': 'Modern lay-out opties',
        'section.classic_options': 'Classic lay-out opties',
        'section.compact_options': 'Compact lay-out opties',
        'section.neon_options': 'Neon lay-out opties',
        'section.neon_description': 'Donker cyberpunk-thema met geanimeerde gloeiende ring en neon-badges. Kleuren passen zich automatisch aan op persoonsstatus (groen = thuis, rood = weg).',
        'section.glass_options': 'Glass lay-out opties',
        'section.glass_description': 'Donker glassmorphisme-thema met doorschijnende chips, gekleurde bollen en geanimeerde statusstip. Accentkleur past zich automatisch aan op de huidige zone.',
        'section.bio_options': 'Bioluminescente lay-out opties',
        'section.bio_description': 'Diepzee-thema met geanimeerde bioluminescente bollen, opstijgende deeltjes en dubbele pulsring rond de avatar. Accentkleur verandert automatisch met de zone.',
        'section.holo_options': 'Holografische 3D lay-out opties',
        'section.holo_description': 'Holografisch thema met 3D gekantelde kaart, roterende ringen rond de avatar, geanimeerde scanner en iriserend shimmer-achtergrond. Accentkleur verandert met persoonsstatus.',
        'section.weather': '🌤 Weer',
        'editor.show_weather': 'Weer tonen',
        'editor.weather_entity': 'Weerentiteit',
        'editor.show_weather_background': 'Geanimeerde weerachtergrond tonen',
        'editor.show_weather_temperature': 'Omstandigheden en temperatuur tonen',
        'editor.weather_text_color': 'Weertekstkleur',
        'editor.weather_text_color_description': 'Kleur voor temperatuur, pictogram en weerconditielabel. Leeg laten voor de standaard lay-outkleur.',
        'editor.last_changed_color': 'Kleur van updatetekst',
        'editor.last_changed_color_description': 'Kleur van het tijdstempel van de laatste update. Leeg laten voor de standaardkleur.',
        'editor.location_color': 'Kleur van locatietekst',
        'editor.location_color_description': 'Kleur van de zone-/statustekst voor alle locaties. Een kleur die voor één status is ingesteld heeft voorrang. Leeg laten voor de standaard lay-outkleur.',
        'editor.geocoded_location_color': 'Kleur van GPS-adres',
        'editor.geocoded_location_color_description': 'Kleur van het gegeocodeerde adres. Leeg laten om de kleur van de locatietekst (of de lay-outstandaard) te gebruiken.',
        'section.weather_description': 'Voegt een geanimeerde weerachtergrond toe aan de kaart (regen, sneeuw, zon, sterren, bliksem…). Werkt op alle lay-outs.',
        'section.travel_sensor_2': '🏢 Thuis ↔ Werk sensoren',
        'section.travel_sensor_2_description': 'Sensor 1 (thuis→werk): zichtbaar thuis en onderweg, verborgen op het werk. Sensor 2 (werk→thuis): zichtbaar op het werk en onderweg, verborgen thuis. Schakel slimme modus uit om altijd beide te tonen.',
        'editor.travel_sensor_2': 'Reistijdsensor (werk → thuis)',
        'editor.zone_2': 'Werkzone',
        'editor.show_travel_time_2': 'Reistijd tonen (Werk → Thuis)',
        'editor.smart_travel_mode': 'Slimme modus (verberg op basis van locatie)',
        'editor.pair_travel_animation': 'Wisselende afstand/tijd-animatie (uitgeschakeld = beide afzonderlijk tonen)',
        'editor.distance_precision': 'Afstand decimalen (0=geheel, 1=één decimaal, 2=twee decimalen)',
        'editor.distance_unit': 'Afstandseenheid (bijv. km, mi)',
        'editor.distance_unit_description': 'Leeg laten voor automatische detectie. Gebruik km of mi voor Waze/Google sensoren.',
        'editor.direction_home_work': 'Thuis → Werk',
        'editor.direction_work_home': 'Werk → Thuis',
        'editor.travel_sensor_home_work': 'Reistijdsensor (Thuis → Werk)',
        'editor.travel_sensor_work_home': 'Reistijdsensor (Werk → Thuis)',
        'editor.distance_sensor_home_work': 'Afstandssensor (Thuis → Werk)',
        'editor.distance_sensor_work_home': 'Afstandssensor (Werk → Thuis)',
        'editor.show_distance_2': 'Afstand tonen',
        'section.distance_optional': '📍 Afstand (optioneel)',
        'section.distance_optional_description': 'Afstand in km tonen. Altijd zichtbaar ongeacht positie.',
        'position.battery': 'Batterijpositie',
        'position.watch_battery': 'Horlogebatterijpositie',
        'position.activity': 'Activiteitspositie',
        'position.distance': 'Afstandspositie',
        'position.travel': 'Reistijdpositie',
        'position.connection': 'Verbindingspositie',
        'state.name_color': 'Naamkleur',
        'state.add_state': 'Status toevoegen',
        'default_state.home': '🏡 Thuis',
        'default_state.away': '🏃‍♂️ Niet thuis',
        'default_state.office': '🏢 Kantoor',
        'default_state.unknown': '❓ Onbekend',
        'state.default_states': 'Standaardstatussen',
        'state.add_default_states': 'Standaardstatussen toevoegen',
        'tabs.base': 'Basis',
        'tabs.layout': 'Lay-out',
        'tabs.display': 'Weergave',
        'tabs.positions': 'Posities',
        'tabs.states': 'Statussen',
        'tabs.sensors': 'Sensoren',
        'tabs.style': 'Stijl',
        'section.extra_chips': 'Aangepaste extra chips',
        'editor.extra_chips_description': 'Voeg extra entiteiten toe als chips. Met show_when verschijnt de chip alleen wanneer de status overeenkomt.',
        'editor.extra_chip_entity': 'Entiteit',
        'editor.extra_chip_show_when': 'Tonen wanneer (status)',
        'editor.extra_chip_label': 'Label (optioneel)',
        'editor.extra_chip_color': 'Pictogram- en tekstkleur',
        'editor.extra_chip_add': '+ Chip toevoegen',
        'editor.extra_chip_tap_action': 'Tikactie',
        'editor.extra_chip_tap_more_info': 'Info tonen (more-info)',
        'editor.extra_chip_tap_call_service': 'Service aanroepen',
        'editor.extra_chip_tap_navigate': 'Navigeren',
        'editor.extra_chip_tap_url': 'URL openen',
        'editor.extra_chip_tap_none': 'Geen actie',
        'editor.extra_chip_icon_label': 'Pictogram (standaard: entiteitspictogram)',
        'editor.extra_chip_service': 'Service (bijv. light.turn_on)',
        'editor.extra_chip_service_data': 'Extra gegevens (JSON, optioneel)',
        'editor.extra_chip_nav_path': 'Navigatiepad',
        'editor.extra_chip_url_path': 'URL',
        'editor.tap_entity': 'Entiteit (leeg = persoonsentiteit)',
        'common.remove': 'Verwijderen',
        'editor.wifi_ssid_sensor': 'Wi-Fi SSID-sensor',
        'editor.wifi_ssid_sensor_description': 'Sensor die de naam meldt van het Wi-Fi-netwerk waarmee het apparaat verbonden is. Indien ingesteld, wordt de netwerknaam weergegeven in plaats van "WiFi".',
        'editor.home_icon': 'Thuispictogram locatie (alleen Ink-lay-out)',
        'editor.home_icon_description': 'MDI-pictogram naast de locatie wanneer de persoon thuis is. Leeg laten voor de standaard (mdi:home). Gebruik "auto" om het apparaattype automatisch te detecteren (telefoon/tablet/laptop). Bijv.: mdi:cellphone, mdi:watch, mdi:devices',
        'editor.home_icon_entity': 'Dynamische thuispictogram entiteit (alleen Ink-lay-out)',
        'editor.home_icon_entity_description': 'HA-entiteit waarvan de status als MDI-pictogram thuis wordt gebruikt (bijv. sensor.tracking_source_icon → mdi:cellphone). Heeft voorrang op home_icon indien ingesteld.'
      }
    };
  }

  localize(key) {
    const langTranslations = this.translations[this.currentLanguage];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }

    const defaultTranslations = this.translations['en'];
    if (defaultTranslations && defaultTranslations[key]) {
      return defaultTranslations[key];
    }

    return key;
  }
}

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
    this._localize = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    // Fix #20: load ha-entity-picker by requesting config element of hui-glance-card
    // hui-glance-card depends on ha-entity-picker, so this forces it to load.
    // See: https://community.home-assistant.io/t/re-using-existing-frontend-components-in-lovelace-card-editor/103415
    if (!customElements.get('ha-entity-picker')) {
      const GlanceCard = customElements.get('hui-glance-card');
      if (GlanceCard) {
        await GlanceCard.getConfigElement();
      } else {
        // hui-glance-card not yet registered — wait for it (with 3s timeout)
        await Promise.race([
          customElements.whenDefined('hui-glance-card').then(async () => {
            const Card = customElements.get('hui-glance-card');
            if (Card) await Card.getConfigElement();
          }),
          new Promise(resolve => setTimeout(resolve, 3000))
        ]);
      }
      this.requestUpdate();
    }
  }

  _initLocalization() {
    if (this.hass && !this._localize) {
      this._localize = new EditorLocalizationHelper(this.hass);
    }
  }

  _t(key) {
    this._initLocalization();
    return this._localize ? this._localize.localize(key) : key;
  }

  setConfig(config) {
    this._config = {
      layout: 'classic',
      compact_width: 300,
      modern_width: 300,
      show_entity_picture: true,
      show_person_name: true,
      show_name: true,
      show_last_changed: true,
      show_battery: true,
      show_watch_battery: true,
      show_activity: true,
      show_distance: true,
      show_travel_time: true,
      show_connection: true,
      aspect_ratio: '1/0.7',
      triggers_update: 'all',
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right',
      battery_font_size: '13px',
      watch_battery_font_size: '13px',
      activity_font_size: '13px',
      distance_font_size: '12px',
      travel_font_size: '12px',
      connection_font_size: '12px',
      // Modern layout defaults
      modern_picture_size: 40,
      modern_name_font_size: '14px',
      modern_state_font_size: '12px',
      modern_show_battery_ring: true,
      modern_show_travel_ring: true,
      modern_travel_max_time: 60,
      modern_distance_max: 100,
      // Geocoded location on by default
      show_geocoded_location: true,
      ...config
    };

    // fallback for positions
    const positionDefaults = {
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
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
      :host {
        display: block;
        --ptc-accent: var(--primary-color, #03a9f4);
        --ptc-on-accent: var(--text-primary-color, #fff);
        --ptc-text: var(--primary-text-color, #e1e1e1);
        --ptc-muted: var(--secondary-text-color, #9b9b9b);
        --ptc-line: var(--divider-color, rgba(127,127,127,0.25));
        --ptc-surface: rgba(127,127,127,0.08);
        --ptc-surface-2: rgba(127,127,127,0.16);
        --ptc-inner: var(--card-background-color, transparent);
        --ptc-accent-soft: rgba(3,169,244,0.16);
      }
      @supports (color: color-mix(in srgb, red, blue)) {
        :host { --ptc-accent-soft: color-mix(in srgb, var(--ptc-accent) 16%, transparent); }
      }

      .ptc { padding: 4px 0 16px; color: var(--ptc-text); }
      .pane { animation: ptc-in 0.22s ease; }
      @keyframes ptc-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .pane { animation: none; } * { transition: none !important; } }

      /* ── Header ── */
      .hero {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 16px; margin-bottom: 14px;
        border: 1px solid var(--ptc-line); border-radius: 16px;
        background: linear-gradient(135deg, var(--ptc-accent-soft), transparent 70%), var(--ptc-surface);
      }
      .hero-avatar {
        width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; object-fit: cover;
        display: flex; align-items: center; justify-content: center;
        background: var(--ptc-accent-soft); color: var(--ptc-accent);
        box-shadow: 0 0 0 2px var(--ptc-accent);
      }
      .hero-text { flex: 1; min-width: 0; }
      .hero-title { font-size: 16px; font-weight: 700; letter-spacing: 0.2px; }
      .hero-sub {
        font-size: 12px; color: var(--ptc-muted); margin-top: 2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .hero-ver {
        flex-shrink: 0; font-size: 11px; font-weight: 700; padding: 4px 10px;
        border-radius: 999px; background: var(--ptc-accent-soft); color: var(--ptc-accent);
      }

      /* ── Tabs ── */
      .tabs {
        display: flex; gap: 4px; padding: 4px; margin-bottom: 16px;
        border: 1px solid var(--ptc-line); border-radius: 14px; background: var(--ptc-surface);
      }
      .tab {
        flex: 1 1 0; min-width: 0;
        display: flex; flex-direction: column; align-items: center; gap: 3px;
        padding: 8px 4px; border: 0; border-radius: 10px; background: none;
        color: var(--ptc-muted); font: inherit; font-size: 11.5px; font-weight: 600;
        cursor: pointer; transition: background 0.2s, color 0.2s;
        --mdc-icon-size: 20px;
      }
      .tab span { max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tab:hover { color: var(--ptc-text); background: var(--ptc-surface); }
      .tab.active {
        background: var(--ptc-accent); color: var(--ptc-on-accent);
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      }

      /* ── Section card ── */
      .card {
        border: 1px solid var(--ptc-line); border-radius: 14px;
        background: var(--ptc-surface); padding: 14px; margin-bottom: 14px;
      }
      .card > :last-child { margin-bottom: 0; }
      .card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
      .card-title { font-size: 14px; font-weight: 700; }
      .badge {
        width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: var(--ptc-accent-soft); color: var(--ptc-accent);
        --mdc-icon-size: 18px;
      }
      .info { font-size: 12px; line-height: 1.45; color: var(--ptc-muted); margin: 0 0 10px; }
      .callout {
        font-size: 12px; line-height: 1.45; color: var(--ptc-text);
        padding: 10px 12px; margin: 10px 0; border-radius: 10px; background: var(--ptc-accent-soft);
      }
      .field-label { font-size: 12px; color: var(--ptc-muted); margin: 12px 0 0 2px; }

      /* ── Group (sub-card with optional switch) ── */
      .group {
        border: 1px solid var(--ptc-line); border-radius: 12px;
        background: var(--ptc-inner); margin: 10px 0; overflow: hidden;
      }
      .group-head { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
      .group-head .badge { width: 28px; height: 28px; border-radius: 8px; --mdc-icon-size: 16px; }
      .group-title { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 600; line-height: 1.3; }
      .group-body { padding: 4px 12px 12px; border-top: 1px solid var(--ptc-line); }
      .group-body > .info:first-child { margin-top: 10px; }
      .group.off .badge { filter: grayscale(1); opacity: 0.6; }
      .group.off .group-title { color: var(--ptc-muted); }

      /* ── Rows ── */
      .row { display: flex; align-items: center; gap: 12px; padding: 10px 0; min-height: 36px; }
      .row + .row, .row + .color-row, .color-row + .row, .color-row + .color-row { border-top: 1px solid var(--ptc-line); }
      .row-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .row-label { font-size: 13.5px; font-weight: 500; line-height: 1.3; }
      .row-desc { font-size: 11.5px; color: var(--ptc-muted); line-height: 1.4; }

      /* ── Fields ── */
      ptc-textfield, ha-entity-picker, ha-icon-picker, ha-service-control { display: block; margin: 10px 0; }
      .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
      .flex { display: flex; gap: 10px; align-items: flex-end; }
      .flex > * { flex: 1; min-width: 0; }

      /* ── Layout tiles ── */
      .layouts { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 10px; }
      .layout-tile {
        padding: 2px; border: 2px solid transparent; border-radius: 15px; background: none;
        font: inherit; color: inherit; cursor: pointer; transition: transform 0.15s, border-color 0.15s;
      }
      .layout-tile:hover { transform: translateY(-2px); }
      .layout-tile.active { border-color: var(--ptc-accent); }
      .lt-prev {
        position: relative; height: 54px; border-radius: 11px; overflow: hidden;
        display: flex; align-items: center; gap: 7px; padding: 0 10px;
        box-shadow: inset 0 0 0 1px rgba(127,127,127,0.25);
      }
      .lt-av {
        width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
        border: 2px solid var(--a); background: rgba(255,255,255,0.18); box-shadow: 0 0 8px var(--a);
      }
      .lt-lines { flex: 1; display: flex; flex-direction: column; gap: 4px; }
      .lt-lines i { display: block; height: 4px; border-radius: 2px; background: var(--fg); }
      .lt-lines i:first-child { width: 80%; opacity: 0.85; }
      .lt-lines i:last-child { width: 50%; background: var(--a); }
      .lt-check {
        position: absolute; top: 4px; right: 4px; width: 16px; height: 16px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: var(--ptc-accent); color: var(--ptc-on-accent); font-size: 10px; font-weight: 700;
      }
      .lt-name {
        font-size: 11.5px; font-weight: 600; padding: 5px 2px 3px; text-align: center;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .layout-tile.active .lt-name { color: var(--ptc-accent); }

      /* ── Segmented choice ── */
      .seg { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 10px; }
      .seg button {
        border: 1px solid var(--ptc-line); background: none; color: var(--ptc-text);
        font: inherit; font-size: 12.5px; font-weight: 500; padding: 7px 12px;
        border-radius: 999px; cursor: pointer; transition: all 0.15s;
      }
      .seg button:hover { border-color: var(--ptc-accent); }
      .seg button.active { background: var(--ptc-accent); border-color: var(--ptc-accent); color: var(--ptc-on-accent); }

      /* ── Color ── */
      .color-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; flex-wrap: wrap; }
      .color-ctl { display: flex; align-items: center; gap: 8px; margin-left: auto; }
      .swatch {
        position: relative; width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
        border: 2px solid var(--ptc-line); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.25);
      }
      .swatch.empty {
        border-style: dashed; box-shadow: none;
        background: repeating-conic-gradient(rgba(127,127,127,0.35) 0% 25%, transparent 0% 50%) 50% / 12px 12px;
      }
      .swatch input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: 0; padding: 0; }
      .color-ctl ptc-textfield { width: 104px; margin: 0; }

      /* ── Buttons ── */
      .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        border: 1px solid var(--ptc-line); background: none; color: var(--ptc-text);
        font: inherit; font-size: 13px; font-weight: 600; padding: 9px 14px;
        border-radius: 10px; cursor: pointer; transition: all 0.15s;
        --mdc-icon-size: 18px;
      }
      .btn:hover:not(:disabled) { border-color: var(--ptc-accent); color: var(--ptc-accent); }
      .btn.primary { background: var(--ptc-accent); border-color: var(--ptc-accent); color: var(--ptc-on-accent); }
      .btn.primary:hover:not(:disabled) { color: var(--ptc-on-accent); filter: brightness(1.1); }
      .btn.wide { width: 100%; border-style: dashed; margin-top: 4px; }
      .btn:disabled { opacity: 0.45; cursor: not-allowed; }
      .btn-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 4px 0 6px; }
      .msg { font-size: 12px; color: var(--ptc-muted); }
      .icon-btn {
        width: 32px; height: 32px; border-radius: 50%; border: 0; flex-shrink: 0;
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--ptc-surface-2); color: var(--ptc-muted);
        font-size: 13px; line-height: 1; cursor: pointer; transition: all 0.15s;
      }
      .icon-btn:hover { color: var(--ptc-text); }
      .icon-btn.danger:hover { background: rgba(244,67,54,0.18); color: var(--error-color, #f44336); }

      /* ── List items (states, chips) ── */
      .item {
        border: 1px solid var(--ptc-line); border-radius: 12px;
        background: var(--ptc-inner); padding: 12px; margin: 10px 0;
      }
      .item-head { display: flex; align-items: center; gap: 10px; }
      .item-head ha-icon { color: var(--ptc-accent); --mdc-icon-size: 20px; }
      .item-title {
        flex: 1; min-width: 0; font-size: 13.5px; font-weight: 600;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 0 2px var(--ptc-line); }

      /* ── Position picker ── */
      .pos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
      .pos { border: 1px solid var(--ptc-line); border-radius: 12px; padding: 10px; background: var(--ptc-inner); }
      .pos-title {
        display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
        font-size: 12.5px; font-weight: 600; line-height: 1.25; --mdc-icon-size: 16px;
      }
      .pos-title ha-icon { color: var(--ptc-accent); flex-shrink: 0; }
      .pos-map {
        position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 5px 0;
        padding: 8px; border-radius: 10px; background: var(--ptc-surface-2);
      }
      .pos-map::after {
        content: ''; position: absolute; left: 50%; top: 50%; width: 28px; height: 28px; margin: -14px;
        border-radius: 50%; border: 2px dashed var(--ptc-line); pointer-events: none;
      }
      .pos-cell {
        width: 32px; height: 16px; padding: 0; border-radius: 8px;
        border: 1px solid var(--ptc-line); background: none; cursor: pointer; transition: all 0.15s;
      }
      .pos-cell.r { justify-self: end; }
      .pos-cell:hover { border-color: var(--ptc-accent); }
      .pos-cell.active { background: var(--ptc-accent); border-color: var(--ptc-accent); box-shadow: 0 0 8px var(--ptc-accent); }
      .pos-gap { grid-column: 1 / -1; height: 8px; }

      /* ── Footer ── */
      .footer {
        display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
        margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--ptc-line);
        font-size: 12px; color: var(--ptc-muted);
      }
      .footer a { color: var(--ptc-accent); font-weight: 600; text-decoration: none; }
      .footer a:hover { text-decoration: underline; }
      .footer .heart { color: #e25555; }
      .footer .coffee {
        padding: 7px 14px; border-radius: 999px; background: #ffdd00; color: #1a1a1a;
        font-weight: 700; box-shadow: 0 1px 4px rgba(0,0,0,0.25); transition: transform 0.15s;
      }
      .footer .coffee:hover { text-decoration: none; transform: translateY(-1px); }

      @media (max-width: 420px) {
        .grid2 { grid-template-columns: 1fr; }
        .hero-ver { display: none; }
      }
    `;
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const layout = this._config.layout || 'classic';
    const tabs = [
      { id: 'base', icon: 'mdi:card-account-details-outline', label: this._t('tabs.base') },
      { id: 'sensors', icon: 'mdi:leak', label: this._t('tabs.sensors') },
      ...(layout === 'classic' ? [{ id: 'position', icon: 'mdi:view-grid-outline', label: this._t('tabs.positions') }] : []),
      { id: 'states', icon: 'mdi:palette-outline', label: this._t('tabs.states') },
      { id: 'style', icon: 'mdi:brush-variant', label: this._t('tabs.style') },
    ];
    // The Positions tab only exists for the classic layout — fall back when the layout changes
    const tab = tabs.some(t => t.id === this._selectedTab) ? this._selectedTab : 'base';

    const person = this.hass.states[this._config.entity];
    const picture = this._config.entity_picture || person?.attributes?.entity_picture;
    const layoutName = (PTC_LAYOUTS.find(l => l.id === layout) || {}).name || layout;
    const subtitle = [this._config.name || person?.attributes?.friendly_name || this._config.entity, layoutName]
      .filter(Boolean).join(' · ');

    return html`
      <div class="ptc">
        <div class="hero">
          ${picture
            ? html`<img class="hero-avatar" src="${picture}" alt="">`
            : html`<div class="hero-avatar"><ha-icon icon="mdi:account"></ha-icon></div>`}
          <div class="hero-text">
            <div class="hero-title">Person Tracker Card</div>
            <div class="hero-sub">${subtitle}</div>
          </div>
          <span class="hero-ver">v${PTC_EDITOR_VERSION}</span>
        </div>

        <div class="tabs">
          ${tabs.map(t => html`
            <button class="tab ${tab === t.id ? 'active' : ''}" @click=${() => { this._selectedTab = t.id; }}>
              <ha-icon icon="${t.icon}"></ha-icon>
              <span>${t.label}</span>
            </button>
          `)}
        </div>

        <div class="pane">
          ${tab === 'base' ? this._renderBaseTab() : ''}
          ${tab === 'sensors' ? this._renderSensorsTab() : ''}
          ${tab === 'position' ? this._renderPositionTab() : ''}
          ${tab === 'states' ? this._renderStatesTab() : ''}
          ${tab === 'style' ? this._renderStyleTab() : ''}
        </div>

        <div class="footer">
          <span>Made with <span class="heart">❤</span> by
            <a href="https://github.com/djdevil" target="_blank" rel="noopener noreferrer">djdevil</a></span>
          <a class="coffee" href="https://www.buymeacoffee.com/divil17f" target="_blank" rel="noopener noreferrer">☕ Buy me a coffee</a>
        </div>
      </div>
    `;
  }

  // ── UI building blocks ──────────────────────────────────────────────────

  // Section titles in the translations may start with an emoji; the badge icon replaces it
  _cleanTitle(title) {
    return String(title || '').replace(/^[^\p{L}\p{N}]+/u, '');
  }

  _section(icon, title, content, desc) {
    return html`
      <div class="card">
        <div class="card-head">
          <div class="badge"><ha-icon icon="${icon}"></ha-icon></div>
          <div class="card-title">${this._cleanTitle(title)}</div>
        </div>
        ${desc ? html`<p class="info">${desc}</p>` : ''}
        ${content}
      </div>
    `;
  }

  // Sub-card. With `key` it gets a switch in the header and the body shows only when enabled.
  _group({ icon, title, key, checked, body, desc }) {
    const on = key ? checked : true;
    const hasBody = on && (body || desc);
    return html`
      <div class="group ${on ? '' : 'off'}">
        <div class="group-head">
          <div class="badge"><ha-icon icon="${icon}"></ha-icon></div>
          <span class="group-title">${title}</span>
          ${key ? html`
            <ha-switch .checked=${!!checked} @change=${(e) => this._valueChanged(e, key)}></ha-switch>
          ` : ''}
        </div>
        ${hasBody ? html`
          <div class="group-body">
            ${desc ? html`<p class="info">${desc}</p>` : ''}
            ${body || ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  _toggle(key, label, checked, desc) {
    return html`
      <div class="row">
        <div class="row-text">
          <span class="row-label">${label}</span>
          ${desc ? html`<span class="row-desc">${desc}</span>` : ''}
        </div>
        <ha-switch .checked=${!!checked} @change=${(e) => this._valueChanged(e, key)}></ha-switch>
      </div>
    `;
  }

  _text(key, label, o = {}) {
    return html`
      <ptc-textfield
        .label=${label}
        .type=${o.type || 'text'}
        .min=${o.min}
        .max=${o.max}
        .placeholder=${o.placeholder || ''}
        .helper=${o.helper || ''}
        .value=${o.value !== undefined ? o.value : (this._config[key] || o.fallback || '')}
        @input=${(e) => this._valueChanged(e, key)}>
      </ptc-textfield>
    `;
  }

  _entity(key, o = {}) {
    return html`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${o.value !== undefined ? o.value : (this._config[key] || '')}
        .label=${o.label || ''}
        .includeDomains=${o.domains}
        allow-custom-entity
        @value-changed=${(e) => this._entityPickerChanged(e, key)}>
      </ha-entity-picker>
    `;
  }

  // Swatch + hex field. onInput('') clears the color (when clearable).
  _color(label, value, onInput, o = {}) {
    return html`
      <div class="color-row">
        <div class="row-text">
          <span class="row-label">${label}</span>
          ${o.desc ? html`<span class="row-desc">${o.desc}</span>` : ''}
        </div>
        <div class="color-ctl">
          <div class="swatch ${value ? '' : 'empty'}" style="${value ? `background:${value}` : ''}">
            <input type="color" .value=${value || o.fallback || '#ffffff'} @input=${(e) => onInput(e.target.value)}>
          </div>
          <ptc-textfield
            .value=${value || ''}
            .placeholder=${o.fallback || '#ffffff'}
            pattern="^#[0-9A-Fa-f]{6}$"
            @input=${(e) => onInput(e.target.value)}>
          </ptc-textfield>
          ${o.clearable !== false && value ? html`
            <button class="icon-btn" title="${this._t('common.remove')}" @click=${() => onInput('')}>✕</button>
          ` : ''}
        </div>
      </div>
    `;
  }

  _seg(options, value, onSelect) {
    return html`
      <div class="seg">
        ${options.map(o => html`
          <button class="${o.value === value ? 'active' : ''}" @click=${() => onSelect(o.value)}>${o.label}</button>
        `)}
      </div>
    `;
  }

  _tapOptions() {
    return ['more-info', 'navigate', 'url', 'call-service', 'none'].map(value => ({
      value,
      label: this._t(`editor.extra_chip_tap_${value.replace('-', '_')}`),
    }));
  }

  // ── Tabs ────────────────────────────────────────────────────────────────

  _renderBaseTab() {
    const layout = this._config.layout || 'classic';
    const tap = this._config.tap_action || {};
    const tapAction = tap.action || 'more-info';
    const layoutDescKey = `section.${layout}_description`;
    const layoutDesc = this._t(layoutDescKey);

    return html`
      ${this._section('mdi:account', this._t('tabs.base'), html`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity || ''}
          .label=${this._t('editor.entity') + ' (' + this._t('editor.required') + ')'}
          .includeDomains=${['person']}
          .required=${true}
          @value-changed=${(e) => this._valueChanged(e, 'entity')}>
        </ha-entity-picker>
        ${this._text('name', this._t('editor.name'))}
        ${this._text('entity_picture', this._t('editor.custom_image_url'), { placeholder: '/local/photos/mario.jpg' })}
      `)}

      ${this._section('mdi:view-dashboard-outline', this._t('editor.layout'), html`
        <div class="layouts">
          ${PTC_LAYOUTS.map(l => html`
            <button class="layout-tile ${layout === l.id ? 'active' : ''}" title="${l.name}" @click=${() => this._setLayout(l.id)}>
              <div class="lt-prev" style="background:${l.bg};--a:${l.accent};--fg:${l.light ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.8)'};">
                <span class="lt-av"></span>
                <span class="lt-lines"><i></i><i></i></span>
                ${layout === l.id ? html`<span class="lt-check">✓</span>` : ''}
              </div>
              <div class="lt-name">${l.name}</div>
            </button>
          `)}
        </div>

        ${layoutDesc !== layoutDescKey ? html`<div class="callout">${layoutDesc}</div>` : ''}

        ${layout === 'compact' ? html`
          ${this._text('compact_width', this._t('editor.compact_width'), { type: 'number', min: 200, max: 500, fallback: '300', helper: 'Default: 300' })}
          ${this._toggle('compact_stretch', this._t('editor.compact_stretch'), this._config.compact_stretch === true)}
        ` : ''}
        ${layout === 'modern' ? this._text('modern_width', this._t('editor.modern_width'), { type: 'number', min: 200, max: 500, fallback: '300', helper: 'Default: 300' }) : ''}
        ${layout === 'classic' ? this._text('aspect_ratio', this._t('editor.aspect_ratio'), { fallback: '1/0.7', helper: 'Default: 1/0.7' }) : ''}
      `)}

      ${this._section('mdi:eye-outline', this._t('editor.display_options'), html`
        ${this._toggle('show_entity_picture', this._t('editor.show_entity_picture'), this._config.show_entity_picture !== false)}
        ${this._toggle('show_person_name', this._t('editor.show_person_name'), this._config.show_person_name !== false)}
        ${this._toggle('show_name', this._t('editor.show_name'), this._config.show_name !== false)}
        ${layout !== 'modern' ? this._toggle('show_last_changed', this._t('editor.show_last_updated'), this._config.show_last_changed !== false) : ''}
      `)}

      ${this._section('mdi:gesture-tap', this._t('editor.extra_chip_tap_action'), html`
        ${this._seg(this._tapOptions(), tapAction, (v) => this._setTapAction(v))}

        ${tapAction === 'more-info' ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${tap.entity || ''}
            .label=${this._t('editor.tap_entity')}
            allow-custom-entity
            @value-changed=${(e) => this._updateTapAction('entity', e.detail?.value || '')}>
          </ha-entity-picker>
        ` : ''}

        ${tapAction === 'navigate' ? html`
          <ptc-textfield
            .label=${this._t('editor.extra_chip_nav_path')}
            .value=${tap.navigation_path || ''}
            placeholder="/lovelace/home"
            @input=${(e) => this._updateTapAction('navigation_path', e.target.value)}>
          </ptc-textfield>
        ` : ''}

        ${tapAction === 'url' ? html`
          <ptc-textfield
            .label=${this._t('editor.extra_chip_url_path')}
            .value=${tap.url_path || ''}
            placeholder="https://"
            @input=${(e) => this._updateTapAction('url_path', e.target.value)}>
          </ptc-textfield>
        ` : ''}

        ${tapAction === 'call-service' ? html`
          <ha-service-control
            .hass=${this.hass}
            .value=${{
              action: tap.service || '',
              target: tap.target || {},
              data: tap.service_data || {}
            }}
            .showAdvanced=${true}
            @value-changed=${(e) => {
              const v = e.detail.value || {};
              this._config = {
                ...this._config,
                tap_action: {
                  action: 'call-service',
                  service: v.action || v.service || undefined,
                  target: (v.target && Object.keys(v.target).length) ? v.target : undefined,
                  service_data: (v.data && Object.keys(v.data).length) ? v.data : undefined
                }
              };
              this._fireEvent('config-changed', { config: this._config });
            }}>
          </ha-service-control>
        ` : ''}
      `)}
    `;
  }

  _setLayout(value) {
    if (!PTC_LAYOUTS.some(l => l.id === value) || value === this._config.layout) return;
    this._config = { ...this._config, layout: value };
    this._fireEvent('config-changed', { config: this._config });
  }

  _setTapAction(value) {
    if (value === (this._config.tap_action?.action || 'more-info') && this._config.tap_action) return;
    this._config = { ...this._config, tap_action: { action: value } };
    this._fireEvent('config-changed', { config: this._config });
  }

  _updateTapAction(key, value) {
    const tapAction = { ...(this._config.tap_action || { action: 'more-info' }), [key]: value };
    this._config = { ...this._config, tap_action: tapAction };
    this._fireEvent('config-changed', { config: this._config });
  }

  _renderSensorsTab() {
    const entityBase = this._config.entity
      ? this._config.entity.replace('person.', '')
      : 'example';
    const p = this._config.entity ? this._resolveDevicePrefixEditor() : null;
    const auto = this._config.entity ? this._getAutoSensorIds() : {};
    const c = this._config;
    const mapsOptions = [
      { value: 'none', label: this._t('editor.maps_provider_none') },
      { value: 'google', label: 'Google Maps' },
      { value: 'apple', label: 'Apple Maps' },
      { value: 'osm', label: 'OpenStreetMap' },
    ];

    return html`
      ${this._section('mdi:radar', this._t('section.automatic_sensors'), html`
        <div class="btn-row">
          <button class="btn primary" ?disabled=${!c.entity} @click=${() => this._autoDetectSensors()}>
            <ha-icon icon="mdi:radar"></ha-icon>
            ${this._t('section.auto_detect_btn')}
          </button>
          ${this._autoDetectMsg ? html`<span class="msg">${this._autoDetectMsg}</span>` : ''}
        </div>

        ${this._group({
          icon: 'mdi:battery', title: this._t('editor.show_battery'),
          key: 'show_battery', checked: c.show_battery !== false,
          body: html`
            ${this._entity('battery_sensor', {
              value: c.battery_sensor || auto.battery_sensor || '',
              label: auto.battery_sensor || 'sensor.phone_' + entityBase + '_battery_level',
              domains: ['sensor', 'input_number'] })}
            ${this._entity('battery_state_sensor', {
              value: c.battery_state_sensor || auto.battery_state_sensor || '',
              label: auto.battery_state_sensor || 'sensor.phone_' + entityBase + '_battery_state',
              domains: ['sensor', 'binary_sensor'] })}
            ${this._text('battery_charging_value', this._t('editor.battery_charging_value'), { helper: this._t('editor.charging_helper') })}
          `
        })}

        ${this._group({
          icon: 'mdi:watch', title: this._t('editor.show_watch_battery'),
          key: 'show_watch_battery', checked: c.show_watch_battery !== false,
          body: html`
            ${this._entity('watch_battery_sensor', {
              value: c.watch_battery_sensor || auto.watch_battery_sensor || '',
              label: auto.watch_battery_sensor || 'sensor.watch_' + entityBase + '_battery_level',
              domains: ['sensor', 'input_number'] })}
            ${this._entity('watch_battery_state_sensor', {
              value: c.watch_battery_state_sensor || auto.watch_battery_state_sensor || '',
              label: auto.watch_battery_state_sensor || 'sensor.watch_' + entityBase + '_battery_state',
              domains: ['sensor', 'binary_sensor'] })}
            ${this._text('watch_battery_charging_value', this._t('editor.watch_battery_charging_value'), { helper: this._t('editor.charging_helper') })}
          `
        })}

        ${this._group({
          icon: 'mdi:devices', title: this._t('editor.show_device_2_battery'),
          key: 'show_device_2_battery', checked: c.show_device_2_battery !== false,
          body: html`
            ${this._entity('device_2_battery_sensor', {
              value: c.device_2_battery_sensor || auto.device_2_battery_sensor || '',
              label: auto.device_2_battery_sensor || this._t('editor.device_2_battery_sensor'),
              domains: ['sensor', 'input_number'] })}
            ${this._entity('device_2_battery_state_sensor', {
              value: c.device_2_battery_state_sensor || auto.device_2_battery_state_sensor || '',
              label: auto.device_2_battery_state_sensor || this._t('editor.device_2_battery_state_sensor'),
              domains: ['sensor', 'binary_sensor'] })}
          `
        })}

        ${this._group({
          icon: 'mdi:walk', title: this._t('editor.show_activity'),
          key: 'show_activity', checked: c.show_activity !== false,
          body: this._entity('activity_sensor', {
            value: c.activity_sensor || auto.activity_sensor || '',
            label: auto.activity_sensor || 'sensor.phone_' + entityBase + '_activity',
            domains: ['sensor'] })
        })}

        ${this._group({
          icon: 'mdi:wifi', title: this._t('editor.show_connection'),
          key: 'show_connection', checked: c.show_connection !== false,
          body: html`
            ${this._entity('connection_sensor', {
              value: c.connection_sensor || auto.connection_sensor || '',
              label: auto.connection_sensor || 'sensor.phone_' + entityBase + '_connection_type',
              domains: ['sensor', 'binary_sensor'] })}
            ${this._entity('wifi_ssid_sensor', { label: this._t('editor.wifi_ssid_sensor'), domains: ['sensor'] })}
            <p class="info">${this._t('editor.wifi_ssid_sensor_description')}</p>
          `
        })}

        ${this._group({
          icon: 'mdi:map-marker-account', title: this._t('editor.show_geocoded_location'),
          key: 'show_geocoded_location', checked: c.show_geocoded_location !== false,
          desc: this._t('editor.geocoded_location_description'),
          body: this._entity('geocoded_location_entity', {
            value: c.geocoded_location_entity || auto.geocoded_location_entity || '',
            label: auto.geocoded_location_entity || this._t('editor.geocoded_location_entity'),
            domains: ['sensor'] })
        })}

        ${this._group({
          icon: 'mdi:map-marker-radius', title: this._t('editor.maps_provider'),
          desc: this._t('editor.maps_provider_description'),
          body: this._seg(mapsOptions, c.maps_provider || 'none', (v) => this._updateConfig('maps_provider', v === 'none' ? null : v))
        })}

        ${this._group({
          icon: 'mdi:text-box-outline', title: this._t('editor.state_entity'),
          desc: this._t('editor.state_entity_description'),
          body: this._entity('state_entity', { domains: ['sensor', 'input_text', 'input_select'] })
        })}
      `, `${this._t('section.sensors_description')} ${p ? `sensor.${p}_*` : `sensor.phone_${entityBase}_* / sensor.watch_${entityBase}_*`}`)}

      ${this._section('mdi:shape-plus-outline', this._t('section.extra_chips'), html`
        ${(c.extra_chips || []).map((chip, idx) => this._renderExtraChip(chip, idx))}
        <button class="btn wide" @click=${() => this._addExtraChip()}>${this._t('editor.extra_chip_add')}</button>
      `, this._t('editor.extra_chips_description'))}

      ${this._section('mdi:car-clock', this._t('section.travel_sensor_2'), html`
        ${this._toggle('smart_travel_mode', this._t('editor.smart_travel_mode'), c.smart_travel_mode !== false)}
        ${this._toggle('pair_travel_animation', this._t('editor.pair_travel_animation'), c.pair_travel_animation !== false)}

        ${this._group({
          icon: 'mdi:home-export-outline',
          title: `${this._t('editor.show_travel_time')} (${this._t('editor.direction_home_work')})`,
          key: 'show_travel_time', checked: c.show_travel_time !== false,
          body: this._entity('travel_sensor', { label: this._t('editor.travel_sensor_home_work'), domains: ['sensor', 'input_number'] })
        })}

        ${this._group({
          icon: 'mdi:home-import-outline',
          title: `${this._t('editor.show_travel_time')} (${this._t('editor.direction_work_home')})`,
          key: 'show_travel_time_2', checked: c.show_travel_time_2 !== false,
          body: this._entity('travel_sensor_2', { label: this._t('editor.travel_sensor_work_home'), domains: ['sensor', 'input_number'] })
        })}

        ${this._entity('zone_2', { label: this._t('editor.zone_2'), domains: ['zone'] })}
      `, this._t('section.travel_sensor_2_description'))}

      ${this._section('mdi:map-marker-distance', this._t('section.distance_optional'), html`
        ${this._group({
          icon: 'mdi:home-export-outline',
          title: `${this._t('editor.show_distance')} (${this._t('editor.direction_home_work')})`,
          key: 'show_distance', checked: c.show_distance !== false,
          body: this._entity('distance_sensor', { label: this._t('editor.distance_sensor_home_work'), domains: ['sensor', 'input_number'] })
        })}

        ${this._group({
          icon: 'mdi:home-import-outline',
          title: `${this._t('editor.show_distance_2')} (${this._t('editor.direction_work_home')})`,
          key: 'show_distance_2', checked: c.show_distance_2 !== false,
          body: this._entity('distance_sensor_2', { label: this._t('editor.distance_sensor_work_home'), domains: ['sensor', 'input_number'] })
        })}

        ${this._text('distance_precision', this._t('editor.distance_precision'), { type: 'number', min: 0, max: 3, value: String(c.distance_precision ?? 1) })}
        ${this._text('distance_unit', this._t('editor.distance_unit'), { placeholder: 'km', helper: this._t('editor.distance_unit_description') })}
      `, this._t('section.distance_optional_description'))}
    `;
  }

  _renderExtraChip(chip, idx) {
    const ta = chip.tap_action || {};
    const taAction = ta.action || 'more-info';
    const ent = chip.entity ? this.hass.states[chip.entity] : null;
    const showLabel = this._config.layout !== 'modern' && this._config.layout !== 'compact';

    return html`
      <div class="item">
        <div class="item-head">
          <ha-icon icon="${chip.icon || 'mdi:shape-outline'}" style="${chip.color ? `color:${chip.color}` : ''}"></ha-icon>
          <span class="item-title">${chip.label || ent?.attributes?.friendly_name || chip.entity || `#${idx + 1}`}</span>
          <button class="icon-btn danger" title="${this._t('common.remove')}" @click=${() => this._removeExtraChip(idx)}>✕</button>
        </div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${chip.entity || ''}
          .label=${this._t('editor.extra_chip_entity')}
          allow-custom-entity
          @value-changed=${(e) => this._updateExtraChip(idx, 'entity', e.detail.value)}>
        </ha-entity-picker>

        <ha-icon-picker
          .hass=${this.hass}
          .value=${chip.icon || ''}
          .label=${this._t('editor.extra_chip_icon_label')}
          @value-changed=${(e) => this._updateExtraChip(idx, 'icon', e.detail.value || undefined)}>
        </ha-icon-picker>

        <div class="${showLabel ? 'grid2' : ''}">
          <ptc-textfield
            .label=${this._t('editor.extra_chip_show_when')}
            .value=${chip.show_when !== undefined ? chip.show_when : ''}
            @change=${(e) => this._updateExtraChip(idx, 'show_when', e.target.value || undefined)}>
          </ptc-textfield>
          ${showLabel ? html`
            <ptc-textfield
              .label=${this._t('editor.extra_chip_label')}
              .value=${chip.label !== undefined ? chip.label : ''}
              @change=${(e) => this._updateExtraChip(idx, 'label', e.target.value !== '' ? e.target.value : undefined)}>
            </ptc-textfield>
          ` : ''}
        </div>

        ${this._color(this._t('editor.extra_chip_color'), chip.color, (v) => {
          if (v && !/^#[0-9A-Fa-f]{6}$/.test(v)) return;
          this._updateExtraChip(idx, 'color', v || undefined);
        }, { fallback: '#4a9eff' })}

        <div class="field-label">${this._t('editor.extra_chip_tap_action')}</div>
        ${this._seg(this._tapOptions(), taAction, (v) =>
          this._updateExtraChip(idx, 'tap_action', v === 'more-info' ? undefined : { action: v }))}

        ${taAction === 'call-service' ? html`
          <ha-service-control
            .hass=${this.hass}
            .value=${{
              action: ta.service || this._getDefaultServiceForEntity(chip.entity),
              target: ta.target || {},
              data: ta.service_data || {}
            }}
            .showAdvanced=${true}
            @value-changed=${(e) => {
              const v = e.detail.value || {};
              this._updateExtraChip(idx, 'tap_action', {
                action: 'call-service',
                service: v.action || v.service || undefined,
                target: (v.target && Object.keys(v.target).length) ? v.target : undefined,
                service_data: (v.data && Object.keys(v.data).length) ? v.data : undefined
              });
            }}>
          </ha-service-control>
        ` : ''}
        ${taAction === 'navigate' ? html`
          <ptc-textfield
            .label=${this._t('editor.extra_chip_nav_path')}
            .value=${ta.navigation_path || ''}
            placeholder="/lovelace/home"
            @change=${(e) => this._updateExtraChip(idx, 'tap_action', { ...ta, action: 'navigate', navigation_path: e.target.value || undefined })}>
          </ptc-textfield>
        ` : ''}
        ${taAction === 'url' ? html`
          <ptc-textfield
            .label=${this._t('editor.extra_chip_url_path')}
            .value=${ta.url_path || ''}
            placeholder="https://"
            @change=${(e) => this._updateExtraChip(idx, 'tap_action', { ...ta, action: 'url', url_path: e.target.value || undefined })}>
          </ptc-textfield>
        ` : ''}
      </div>
    `;
  }

  _renderPositionTab() {
    const c = this._config;
    const items = [
      ['show_battery', 'battery_position', 'position.battery', 'mdi:battery'],
      ['show_watch_battery', 'watch_battery_position', 'position.watch_battery', 'mdi:watch'],
      ['show_activity', 'activity_position', 'position.activity', 'mdi:walk'],
      ['show_connection', 'connection_position', 'position.connection', 'mdi:wifi'],
      ['show_distance', 'distance_position', 'position.distance', 'mdi:map-marker-distance'],
      ['show_travel_time', 'travel_position', 'position.travel', 'mdi:car-clock'],
    ].filter(([showKey]) => c[showKey] !== false);

    return this._section('mdi:view-grid-outline', this._t('section.element_positions'), html`
      <div class="pos-grid">
        ${items.map(([, key, labelKey, icon]) => this._renderPositionPicker(key, this._t(labelKey), icon))}
      </div>
    `, this._t('section.positions_description'));
  }

  // Mini card diagram: 5 slots per side, matching the positions the card supports
  _renderPositionPicker(configKey, label, icon) {
    const selected = this._config[configKey];
    const rows = [['top', ''], ['top', '-2'], ['top', '-3'], null, ['bottom', '-2'], ['bottom', '']];
    const cell = (v, side, suffix) => {
      const id = `${v}-${side}${suffix}`;
      return html`
        <button class="pos-cell ${side === 'right' ? 'r' : ''} ${selected === id ? 'active' : ''}"
                title="${id}" @click=${() => this._onSelectPosition(configKey, id)}></button>
      `;
    };

    return html`
      <div class="pos">
        <div class="pos-title"><ha-icon icon="${icon}"></ha-icon><span>${label}</span></div>
        <div class="pos-map">
          ${rows.map(r => r === null
            ? html`<div class="pos-gap"></div>`
            : html`${cell(r[0], 'left', r[1])}${cell(r[0], 'right', r[1])}`)}
        </div>
      </div>
    `;
  }

  _onSelectPosition(configKey, value) {
    this._config = { ...this._config, [configKey]: value };
    this._fireEvent('config-changed', { config: this._config });
  }

  _renderStatesTab() {
    const states = this._config.state || [];

    return this._section('mdi:palette-outline', this._t('section.custom_states'), html`
      ${states.map((state, index) => {
        const color = state.styles?.name?.color || '#7DDA9F';
        return html`
          <div class="item">
            <div class="item-head">
              <span class="dot" style="background:${color}"></span>
              <span class="item-title">${state.name || state.value || `#${index + 1}`}</span>
              <button class="icon-btn danger" title="${this._t('common.remove')}" @click=${() => this._removeState(index)}>✕</button>
            </div>

            <div class="grid2">
              <ptc-textfield
                .label=${this._t('editor.state_value')}
                .value=${state.value || ''}
                placeholder="home, not_home…"
                @input=${(e) => this._updateState(index, 'value', e.target.value)}>
              </ptc-textfield>
              <ptc-textfield
                .label=${this._t('editor.displayed_name')}
                .value=${state.name || ''}
                @input=${(e) => this._updateState(index, 'name', e.target.value)}>
              </ptc-textfield>
            </div>

            <ptc-textfield
              .label=${`${this._t('editor.custom_image')} (${this._t('editor.optional')})`}
              .value=${state.entity_picture || ''}
              placeholder="/local/photos/mario.jpg"
              @input=${(e) => this._updateState(index, 'entity_picture', e.target.value)}>
            </ptc-textfield>

            ${this._color(this._t('state.name_color'), color, (v) => this._updateStateColor(index, v), { clearable: false, fallback: '#7DDA9F' })}
          </div>
        `;
      })}

      <div class="btn-row">
        <button class="btn primary" @click=${() => this._addState()}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this._t('state.add_state')}
        </button>
        <button class="btn" @click=${() => this._addDefaultStates()}>
          <ha-icon icon="mdi:auto-fix"></ha-icon>
          ${this._t('state.add_default_states')}
        </button>
      </div>
    `, this._t('section.states_description'));
  }

  _renderStyleTab() {
    const c = this._config;
    const layout = c.layout || 'classic';
    const configColor = (key, fallback) => this._color(
      this._t(`editor.${key}`), c[key], (v) => this._updateConfigColor(key, v),
      { fallback, desc: this._t(`editor.${key}_description`) });

    return html`
      ${this._section('mdi:format-color-fill', this._t('section.card_style'), html`
        ${layout !== 'modern' ? configColor('last_changed_color', '#888888') : ''}
        ${configColor('location_color', '#ffffff')}
        ${configColor('geocoded_location_color', '#ffffff')}

        ${['glass', 'bio'].includes(layout) ? html`
          ${this._toggle('transparent_background', this._t('editor.transparent_background'), c.transparent_background === true)}
          ${this._toggle('show_particles', this._t('editor.show_particles'), c.show_particles !== false)}
        ` : ''}

        <div class="grid2">
          ${this._text('card_background', this._t('editor.card_background'), { fallback: 'rgba(255,255,255,0.05)' })}
          ${this._text('card_border_radius', this._t('editor.border_radius'), { fallback: '15px' })}
        </div>

        ${layout === 'ink' ? html`
          ${this._text('home_icon', this._t('editor.home_icon'), { placeholder: 'mdi:home', helper: this._t('editor.home_icon_description') })}
          ${this._entity('home_icon_entity', { label: this._t('editor.home_icon_entity') })}
          <p class="info">${this._t('editor.home_icon_entity_description')}</p>
        ` : ''}
      `)}

      ${layout === 'classic' ? this._section('mdi:tune-variant', this._t('section.classic_options'), html`
        <div class="grid2">
          ${this._text('picture_size', this._t('editor.image_size'), { type: 'number', min: 10, max: 100, fallback: '40', helper: 'Default: 40' })}
          ${this._text('classic_icon_size', this._t('editor.classic_icon_size'), { type: 'number', min: 12, max: 32, fallback: '16', helper: 'Default: 16' })}
          ${this._text('name_font_size', this._t('editor.name_font_size'), { fallback: '20px', helper: 'Default: 20px' })}
          ${this._text('state_font_size', this._t('editor.state_font_size'), { fallback: '14px', helper: 'Default: 14px' })}
          ${this._text('last_changed_font_size', this._t('editor.last_changed_font_size'), { fallback: '12px', helper: 'Default: 12px' })}
          ${this._text('battery_font_size', this._t('editor.battery_font_size'), { fallback: '13px', helper: 'Default: 13px' })}
          ${this._text('activity_font_size', this._t('editor.activity_font_size'), { fallback: '13px', helper: 'Default: 13px' })}
        </div>
      `) : ''}

      ${layout === 'compact' ? this._section('mdi:tune-variant', this._t('section.compact_options'), html`
        ${this._text('compact_icon_size', this._t('editor.compact_icon_size'), { type: 'number', min: 12, max: 32, fallback: '16', helper: 'Default: 16' })}
      `) : ''}

      ${layout === 'modern' ? this._section('mdi:tune-variant', this._t('section.modern_options'), html`
        <div class="grid2">
          ${this._text('modern_picture_size', this._t('editor.modern_picture_size'), { type: 'number', min: 30, max: 80, fallback: '40', helper: 'Default: 40' })}
          ${this._text('modern_ring_size', this._t('editor.modern_ring_size'), { type: 'number', min: 28, max: 60, fallback: '38', helper: 'Default: 38' })}
          ${this._text('modern_name_font_size', this._t('editor.modern_name_font_size'), { fallback: '14px', helper: 'Default: 14px' })}
          ${this._text('modern_state_font_size', this._t('editor.modern_state_font_size'), { fallback: '12px', helper: 'Default: 12px' })}
          ${this._text('modern_travel_max_time', this._t('editor.modern_travel_max_time'), { type: 'number', min: 10, max: 180, fallback: '60', helper: 'Default: 60' })}
          ${this._text('modern_distance_max', this._t('editor.modern_distance_max'), { type: 'number', min: 1, max: 5000, fallback: '100', helper: 'Default: 100' })}
        </div>
      `) : ''}

      ${this._section('mdi:weather-partly-cloudy', this._t('section.weather'), html`
        ${this._group({
          icon: 'mdi:weather-partly-rainy', title: this._t('editor.show_weather'),
          key: 'show_weather', checked: c.show_weather === true,
          body: html`
            ${this._entity('weather_entity', { label: this._t('editor.weather_entity'), domains: ['weather'] })}
            ${layout !== 'matrix' ? this._toggle('show_weather_background', this._t('editor.show_weather_background'), c.show_weather_background !== false) : ''}
            ${this._toggle('show_weather_temperature', this._t('editor.show_weather_temperature'), c.show_weather_temperature !== false)}
            ${configColor('weather_text_color', '#cccccc')}
          `
        })}
      `, this._t('section.weather_description'))}
    `;
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
    } else if (target.type === 'number') {
      value = target.value === '' ? undefined : parseFloat(target.value);
    } else {
      value = target.value;
    }

    // Prevent infinite loops - check if value actually changed
    const currentValue = this._config[configValue];
    if (value === currentValue) {
      return;
    }

    // Also check for empty string vs undefined equivalence
    if ((value === '' || value === undefined || value === null) &&
        (currentValue === '' || currentValue === undefined || currentValue === null)) {
      return;
    }

    if (value === '' || value === undefined) {
      const newConfig = { ...this._config };
      delete newConfig[configValue];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();

    // Auto-detect sensors when a person entity is newly selected and no sensors are configured yet
    if (configValue === 'entity' && value) {
      const noSensors = !['battery_sensor', 'watch_battery_sensor', 'activity_sensor',
                          'connection_sensor']
        .some(k => this._config[k]);
      if (noSensors) setTimeout(() => this._autoDetectSensors(), 0);
    }
  }

  // Dedicated handler for entity pickers to avoid infinite loops
  _entityPickerChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();

    const value = ev.detail?.value || '';
    const currentValue = this._config[configValue] || '';

    // Skip if value hasn't changed
    if (value === currentValue) {
      return;
    }

    if (value === '') {
      const newConfig = { ...this._config };
      delete newConfig[configValue];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    this._fireEvent('config-changed', { config: this._config });
  }


  _addState() {
    const states = [...(this._config.state || [])];
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
    if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) return;
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

  _updateConfigColor(key, color) {
    // Allow empty string to clear the color (restore layout default)
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) return;
    if (!color) {
      const newConfig = { ...this._config };
      delete newConfig[key];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [key]: color };
    }
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _addDefaultStates() {
    const defaultStates = [
      {
        value: 'home',
        name: this._t('default_state.home'),
        styles: { name: { color: '#7DDA9F' } }
      },
      {
        value: 'not_home',
        name: this._t('default_state.away'),
        styles: { name: { color: '#93ADCB' } }
      },
      {
        value: 'office',
        name: this._t('default_state.office'),
        styles: { name: { color: '#FFD700' } }
      },
      {
        value: 'unknown',
        name: this._t('default_state.unknown'),
        styles: { name: { color: '#808080' } }
      }
    ];

    this._config = { ...this._config, state: defaultStates };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  // Resolve mobile_app device prefix from person entity's device_trackers attribute.
  // Returns e.g. "iphonedavide" from device_tracker.iphonedavide when that device
  // has a corresponding battery sensor in hass states.
  _resolveDevicePrefixEditor() {
    if (!this.hass || !this._config?.entity) return null;
    const personEntity = this.hass.states[this._config.entity];
    if (!personEntity) return null;

    const deviceTrackers = personEntity.attributes?.device_trackers || [];
    for (const dt of deviceTrackers) {
      const prefix = dt.replace('device_tracker.', '');
      if (this.hass.states[`sensor.${prefix}_battery_level`]) return prefix;
    }

    // Fallback: scan all device_trackers whose name contains the person name.
    // Editor-only, and cached for a few seconds: render() asks for the prefix several times.
    const cacheKey = `${this._config.entity}|${deviceTrackers.join(',')}`;
    const cached = this._prefixScanCache;
    if (cached && cached.key === cacheKey && Date.now() - cached.at < 5000) return cached.value;

    let found = null;
    const personName = this._config.entity.replace('person.', '');
    for (const entityId of Object.keys(this.hass.states)) {
      if (!entityId.startsWith('device_tracker.')) continue;
      const prefix = entityId.replace('device_tracker.', '');
      if (prefix.includes(personName) && this.hass.states[`sensor.${prefix}_battery_level`]) {
        found = prefix;
        break;
      }
    }
    this._prefixScanCache = { key: cacheKey, at: Date.now(), value: found };
    return found;
  }

  // Returns a map of auto-detected sensor IDs using the resolved device prefix.
  // Falls back to the old sensor.phone_* / sensor.waze_* patterns.
  _getAutoSensorIds() {
    const entityBase = this._config?.entity?.replace('person.', '') || '';
    const p = this._resolveDevicePrefixEditor();
    const s = this.hass?.states || {};
    const connection = p
      ? (s[`sensor.${p}_connection_type`] ? `sensor.${p}_connection_type` : `sensor.${p}_network_type`)
      : (s[`sensor.phone_${entityBase}_connection_type`] ? `sensor.phone_${entityBase}_connection_type` : `sensor.phone_${entityBase}_network_type`);
    const p2 = this._resolveDevicePrefix2Editor();
    return {
      battery_sensor:              p ? `sensor.${p}_battery_level`        : `sensor.phone_${entityBase}_battery_level`,
      battery_state_sensor:        p ? `sensor.${p}_battery_state`        : `sensor.phone_${entityBase}_battery_state`,
      watch_battery_sensor:        p ? `sensor.${p}_watch_battery_level`  : `sensor.watch_${entityBase}_battery_level`,
      watch_battery_state_sensor:  p ? `sensor.${p}_watch_battery_state`  : `sensor.watch_${entityBase}_battery_state`,
      activity_sensor:             p ? `sensor.${p}_activity`             : `sensor.phone_${entityBase}_activity`,
      connection_sensor:           connection,
      device_2_battery_sensor:     p2 ? `sensor.${p2}_battery_level` : null,
      device_2_battery_state_sensor: p2 ? `sensor.${p2}_battery_state` : null,
      geocoded_location_entity:    p ? `sensor.${p}_geocoded_location` : null,
    };
  }

  _resolveDevicePrefix2Editor() {
    if (!this.hass || !this._config?.entity) return null;
    const personEntity = this.hass.states[this._config.entity];
    if (!personEntity) return null;
    const skip = this._resolveDevicePrefixEditor();
    const deviceTrackers = personEntity.attributes?.device_trackers || [];
    for (const dt of deviceTrackers) {
      const prefix = dt.replace('device_tracker.', '');
      if (prefix === skip) continue;
      if (this.hass.states[`sensor.${prefix}_battery_level`]) return prefix;
    }
    return null;
  }

  _autoDetectSensors() {
    if (!this.hass || !this._config?.entity) return;
    const s = this.hass.states;
    const auto = this._getAutoSensorIds();

    const candidates = {
      battery_sensor:               [auto.battery_sensor],
      battery_state_sensor:         [auto.battery_state_sensor],
      watch_battery_sensor:         [auto.watch_battery_sensor],
      watch_battery_state_sensor:   [auto.watch_battery_state_sensor],
      activity_sensor:              [auto.activity_sensor],
      connection_sensor:            [auto.connection_sensor],
      device_2_battery_sensor:      [auto.device_2_battery_sensor],
      device_2_battery_state_sensor:[auto.device_2_battery_state_sensor],
      geocoded_location_entity:     [auto.geocoded_location_entity],
    };

    let updated = { ...this._config };
    let count = 0;

    for (const [field, ids] of Object.entries(candidates)) {
      if (updated[field]) continue;
      for (const id of ids) {
        if (id && s[id]) {
          updated[field] = id;
          count++;
          break;
        }
      }
    }

    if (count > 0) {
      this._config = updated;
      this._fireEvent('config-changed', { config: this._config });
    }
    this._autoDetectMsg = count > 0
      ? `✔ ${count} ${this._t('section.auto_detect_found')}`
      : `✘ ${this._t('section.auto_detect_none')}`;
    this.requestUpdate();
    setTimeout(() => { this._autoDetectMsg = null; this.requestUpdate(); }, 4000);
  }

  _updateConfig(key, value) {
    if (!this._config) return;
    if (value === undefined) {
      const newConfig = { ...this._config };
      delete newConfig[key];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [key]: value };
    }
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _inferEntityIcon(entityId, ent) {
    const id = entityId.toLowerCase();
    const dc = (ent?.attributes?.device_class || '').toLowerCase();
    if (id.includes('bluetooth')) return 'mdi:bluetooth';
    if (id.includes('android_auto') || id.includes('androidauto')) return 'mdi:car-wireless';
    if (id.includes('phone_state') || id.includes('in_call')) return 'mdi:phone';
    if (id.includes('ringer')) return 'mdi:volume-medium';
    if (id.includes('wifi') || id.includes('wi_fi')) return 'mdi:wifi';
    if (id.includes('charging')) return 'mdi:battery-charging';
    if (id.includes('battery')) return 'mdi:battery';
    if (id.includes('screen') || id.includes('display')) return 'mdi:cellphone';
    if (id.includes('nfc')) return 'mdi:nfc';
    if (id.includes('hotspot')) return 'mdi:wifi-plus';
    if (id.includes('silent') || id.includes('mute')) return 'mdi:volume-off';
    if (id.includes('dnd') || id.includes('do_not_disturb')) return 'mdi:minus-circle';
    const domain = entityId.split('.')[0];
    if (domain === 'binary_sensor') return dc === 'motion' ? 'mdi:motion-sensor' : dc === 'battery_charging' ? 'mdi:battery-charging' : 'mdi:checkbox-marked-circle';
    if (domain === 'sensor') return dc === 'temperature' ? 'mdi:thermometer' : dc === 'humidity' ? 'mdi:water-percent' : dc === 'battery' ? 'mdi:battery' : 'mdi:eye';
    if (domain === 'switch') return 'mdi:toggle-switch';
    if (domain === 'light') return 'mdi:lightbulb';
    return null;
  }

  _getDefaultServiceForEntity(entityId) {
    if (!entityId) return 'homeassistant.toggle';
    const domain = entityId.split('.')[0];
    const map = {
      light: 'light.toggle',
      switch: 'switch.toggle',
      input_boolean: 'input_boolean.toggle',
      media_player: 'media_player.media_play_pause',
      script: 'script.turn_on',
      automation: 'automation.trigger',
      scene: 'scene.turn_on',
      cover: 'cover.toggle',
      fan: 'fan.toggle',
      lock: 'lock.toggle',
      climate: 'climate.toggle',
      vacuum: 'vacuum.start',
      button: 'button.press',
      input_button: 'input_button.press'
    };
    return map[domain] || 'homeassistant.toggle';
  }

  _addExtraChip() {
    const chips = [...(this._config.extra_chips || []), { entity: '' }];
    this._updateConfig('extra_chips', chips);
  }

  _removeExtraChip(idx) {
    const chips = [...(this._config.extra_chips || [])];
    chips.splice(idx, 1);
    this._updateConfig('extra_chips', chips.length ? chips : undefined);
  }

  _updateExtraChip(idx, key, value) {
    const chips = JSON.parse(JSON.stringify(this._config.extra_chips || []));
    if (value === undefined) {
      delete chips[idx][key];
    } else {
      chips[idx][key] = value;
    }
    // When entity is set for the first time on an empty chip, copy the real HA entity icon
    if (key === 'entity' && value && !chips[idx].icon && this.hass) {
      const ent = this.hass.states[value];
      if (ent?.attributes?.icon) chips[idx].icon = ent.attributes.icon;
    }
    this._updateConfig('extra_chips', chips);
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
  console.log('Person Tracker Card Editor registered');
}

// Export for the main card
window.PersonTrackerCardEditor = PersonTrackerCardEditor;
