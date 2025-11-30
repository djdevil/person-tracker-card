// Person Tracker Card Editor - Multilanguage Version
// Languages: Italian (default), English, French, German
// v1.2.2: Bug fix, battery state, animation,fixed light theme

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

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
      'de-DE': 'de'
    };

    this.currentLanguage = languageMap[haLanguage] || 'en';

    this.translations = {
      'it': {
        'editor.entity': 'EntitÃ ',
        'editor.name': 'Nome (opzionale)',
        'editor.show_last_changed': 'Mostra ultimo aggiornamento',
        'editor.show_last_updated': 'Mostra ultimo aggiornamento',
        'editor.show_distance': 'Mostra distanza',
        'editor.show_battery': 'Mostra batteria',
        'editor.show_speed': 'Mostra velocitÃ ',
        'editor.show_direction': 'Mostra direzione',
        'editor.show_accuracy': 'Mostra precisione',
        'editor.show_gps_accuracy': 'Mostra precisione GPS',
        'editor.show_altitude': 'Mostra altitudine',
        'editor.show_source': 'Mostra fonte',
        'editor.show_entity_picture': 'Mostra immagine',
        'editor.show_name': 'Mostra stato',
        'editor.show_person_name': 'Mostra nome persona',
        'editor.show_activity': 'Mostra attivitÃ ',
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
        'editor.border_radius': 'Raggio bordo',
        'editor.image_size': 'Dimensione immagine (%)',
        'editor.modern_picture_size': 'Dimensione immagine (px)',
        'editor.modern_name_font_size': 'Dimensione font nome',
        'editor.modern_state_font_size': 'Dimensione font stato',
        'editor.modern_show_battery_ring': 'Mostra anello batteria',
        'editor.modern_show_travel_ring': 'Mostra anello tempo viaggio',
        'editor.modern_travel_max_time': 'Tempo viaggio massimo (min)',
        'editor.modern_ring_size': 'Dimensione cerchi (px)',
        'editor.classic_icon_size': 'Dimensione icone (px)',
        'editor.compact_icon_size': 'Dimensione icone (px)',
        'editor.battery_font_size': 'Dimensione font batteria',
        'editor.activity_font_size': 'Dimensione font attivitÃ ',
        'editor.battery_state_sensor': 'Sensore stato carica telefono',
        'editor.battery_charging_value': 'Valore stato in carica (opzionale)',
        'editor.watch_battery_state_sensor': 'Sensore stato carica smartwatch',
        'editor.watch_battery_charging_value': 'Valore stato in carica watch (opzionale)',
        'editor.charging_helper': 'Lascia vuoto per rilevamento automatico (charging, full, on, true...)',
        'section.automatic_sensors': 'Sensori Automatici',
        'section.sensors_description': 'I sensori vengono rilevati automaticamente in base all\'entitÃ  persona selezionata. Pattern predefinito: sensor.phone_',
        'section.element_positions': 'Posizioni Elementi',
        'section.positions_description': 'Configura la posizione di ogni elemento sulla card. Disponibile solo nel layout Classic.',
        'section.custom_states': 'Stati Personalizzati',
        'section.states_description': 'Configura come vengono visualizzati i diversi stati della persona',
        'section.card_style': 'Personalizzazione Stile Card',
        'section.modern_options': 'Opzioni Layout Modern',
        'section.classic_options': 'Opzioni Layout Classic',
        'section.compact_options': 'Opzioni Layout Compact',
        'position.battery': 'Posizione batteria',
        'position.watch_battery': 'Posizione batteria smartwatch',
        'position.activity': 'Posizione attivitÃ ',
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
        'tabs.style': 'Stile'
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
        'editor.border_radius': 'Border radius',
        'editor.image_size': 'Image size (%)',
        'editor.modern_picture_size': 'Picture size (px)',
        'editor.modern_name_font_size': 'Name font size',
        'editor.modern_state_font_size': 'State font size',
        'editor.modern_show_battery_ring': 'Show battery ring',
        'editor.modern_show_travel_ring': 'Show travel time ring',
        'editor.modern_travel_max_time': 'Max travel time (min)',
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
        'section.sensors_description': 'Sensors are detected automatically based on the selected person entity. Default pattern: sensor.phone_',
        'section.element_positions': 'Element Positions',
        'section.positions_description': 'Configure the position of each element on the card. Available only in Classic layout.',
        'section.custom_states': 'Custom States',
        'section.states_description': 'Configure how the different person states are displayed',
        'section.card_style': 'Card Style Customization',
        'section.modern_options': 'Modern Layout Options',
        'section.classic_options': 'Classic Layout Options',
        'section.compact_options': 'Compact Layout Options',
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
        'tabs.style': 'Style'
      },
      'fr': {
        'editor.entity': 'EntitÃ©',
        'editor.name': 'Nom (optionnel)',
        'editor.show_last_changed': 'Afficher derniÃ¨re mise Ã  jour',
        'editor.show_distance': 'Afficher distance',
        'editor.show_battery': 'Afficher batterie',
        'editor.show_speed': 'Afficher vitesse',
        'editor.show_direction': 'Afficher direction',
        'editor.show_accuracy': 'Afficher prÃ©cision',
        'editor.show_gps_accuracy': 'Afficher prÃ©cision GPS',
        'editor.show_altitude': 'Afficher altitude',
        'editor.show_source': 'Afficher source',
        'editor.show_entity_picture': 'Afficher image',
        'editor.show_name': 'Afficher l\'Ã©tat',
        'editor.show_person_name': 'Afficher nom de la personne',
        'editor.show_activity': 'Afficher activitÃ©',
        'editor.show_watch_battery': 'Afficher batterie montre',
        'editor.show_travel_time': 'Afficher temps de trajet',
        'editor.show_connection': 'Afficher connexion',
        'editor.custom_icon': 'IcÃ´ne personnalisÃ©e',
        'editor.icon_color': "Couleur de l'icÃ´ne",
        'editor.background_color': 'Couleur de fond',
        'editor.text_color': 'Couleur du texte',
        'editor.required': 'Requis',
        'editor.optional': 'Optionnel',
        'editor.layout': 'Disposition',
        'editor.appearance': 'Apparence',
        'editor.display_options': "Options d'affichage",
        'editor.positions': 'Positions',
        'editor.advanced': 'AvancÃ©',
        'editor.show_last_updated': 'Afficher derniÃ¨re mise Ã  jour',
        'editor.compact_width': 'Largeur compacte (px)',
        'editor.modern_width': 'Largeur moderne (px)',
        'editor.custom_image_url': 'URL image personnalisÃ©e',
        'editor.aspect_ratio': 'Ratio d\'aspect',
        'editor.state_value': 'Valeur Ã©tat',
        'editor.displayed_name': 'Nom affichÃ©',
        'editor.custom_image': 'Image personnalisÃ©e',
        'editor.name_font_size': 'Taille police nom',
        'editor.state_font_size': 'Taille police Ã©tat',
        'editor.last_changed_font_size': 'Taille police derniÃ¨re mise Ã  jour',
        'editor.card_background': 'Fond carte',
        'editor.border_radius': 'Rayon bordure',
        'editor.image_size': 'Taille image (%)',
        'editor.modern_picture_size': 'Taille image (px)',
        'editor.modern_name_font_size': 'Taille police nom',
        'editor.modern_state_font_size': 'Taille police Ã©tat',
        'editor.modern_show_battery_ring': 'Afficher anneau batterie',
        'editor.modern_show_travel_ring': 'Afficher anneau temps trajet',
        'editor.modern_travel_max_time': 'Temps trajet max (min)',
        'editor.modern_ring_size': 'Taille anneaux (px)',
        'editor.classic_icon_size': 'Taille icÃ´nes (px)',
        'editor.compact_icon_size': 'Taille icÃ´nes (px)',
        'editor.battery_font_size': 'Taille police batterie',
        'editor.activity_font_size': 'Taille police activitÃ©',
        'editor.battery_state_sensor': 'Capteur Ã©tat charge tÃ©lÃ©phone',
        'editor.battery_charging_value': 'Valeur Ã©tat en charge (optionnel)',
        'editor.watch_battery_state_sensor': 'Capteur Ã©tat charge montre',
        'editor.watch_battery_charging_value': 'Valeur Ã©tat en charge montre (optionnel)',
        'editor.charging_helper': 'Laisser vide pour dÃ©tection auto (charging, full, on, true...)',
        'section.automatic_sensors': 'Capteurs Automatiques',
        'section.sensors_description': 'Les capteurs sont dÃ©tectÃ©s automatiquement selon l\'entitÃ© personne sÃ©lectionnÃ©e. ModÃ¨le par dÃ©faut: sensor.phone_',
        'section.element_positions': 'Positions Ã‰lÃ©ments',
        'section.positions_description': 'Configurer la position de chaque Ã©lÃ©ment sur la carte. Disponible uniquement en mode Classic.',
        'section.custom_states': 'Ã‰tats PersonnalisÃ©s',
        'section.states_description': 'Configurer comment les diffÃ©rents Ã©tats de la personne sont affichÃ©s',
        'section.card_style': 'Personnalisation Style Carte',
        'section.modern_options': 'Options Layout Moderne',
        'section.classic_options': 'Options Layout Classic',
        'section.compact_options': 'Options Layout Compact',
        'position.battery': 'Position batterie',
        'position.watch_battery': 'Position batterie montre',
        'position.activity': 'Position activitÃ©',
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
        'state.add_default_states': 'Ajouter Ã‰tats par DÃ©faut',
        'tabs.base': 'Base',
        'tabs.layout': 'Disposition',
        'tabs.display': 'Affichage',
        'tabs.positions': 'Positions',
        'tabs.states': 'Ã‰tats',
        'tabs.sensors': 'Capteurs',
        'tabs.style': 'Style'
      },
      'de': {
        'editor.entity': 'EntitÃ¤t',
        'editor.name': 'Name (optional)',
        'editor.show_last_changed': 'Letzte Ã„nderung anzeigen',
        'editor.show_distance': 'Entfernung anzeigen',
        'editor.show_battery': 'Batterie anzeigen',
        'editor.show_speed': 'Geschwindigkeit anzeigen',
        'editor.show_direction': 'Richtung anzeigen',
        'editor.show_accuracy': 'Genauigkeit anzeigen',
        'editor.show_gps_accuracy': 'GPS-Genauigkeit anzeigen',
        'editor.show_altitude': 'HÃ¶he anzeigen',
        'editor.show_source': 'Quelle anzeigen',
        'editor.show_entity_picture': 'Bild anzeigen',
        'editor.show_name': ' Status anzeigen',
        'editor.show_person_name': 'Personenname anzeigen',
        'editor.show_activity': 'AktivitÃ¤t anzeigen',
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
        'editor.modern_width': 'Moderne Breite (px)',
        'editor.custom_image_url': 'Benutzerdefinierte Bild-URL',
        'editor.aspect_ratio': 'SeitenverhÃ¤ltnis',
        'editor.state_value': 'Statuswert',
        'editor.displayed_name': 'Angezeigter Name',
        'editor.custom_image': 'Benutzerdefiniertes Bild',
        'editor.name_font_size': 'SchriftgrÃ¶ÃŸe Name',
        'editor.state_font_size': 'SchriftgrÃ¶ÃŸe Status',
        'editor.last_changed_font_size': 'SchriftgrÃ¶ÃŸe Letzte Ã„nderung',
        'editor.card_background': 'Kartenhintergrund',
        'editor.border_radius': 'Randradius',
        'editor.image_size': 'BildgrÃ¶ÃŸe (%)',
        'editor.modern_picture_size': 'BildgrÃ¶ÃŸe (px)',
        'editor.modern_name_font_size': 'SchriftgrÃ¶ÃŸe Name',
        'editor.modern_state_font_size': 'SchriftgrÃ¶ÃŸe Status',
        'editor.modern_show_battery_ring': 'Batteriering anzeigen',
        'editor.modern_show_travel_ring': 'Reisezeitring anzeigen',
        'editor.modern_travel_max_time': 'Max Reisezeit (min)',
        'editor.modern_ring_size': 'RinggrÃ¶ÃŸe (px)',
        'editor.classic_icon_size': 'SymbolgrÃ¶ÃŸe (px)',
        'editor.compact_icon_size': 'SymbolgrÃ¶ÃŸe (px)',
        'editor.battery_font_size': 'SchriftgrÃ¶ÃŸe Batterie',
        'editor.activity_font_size': 'SchriftgrÃ¶ÃŸe AktivitÃ¤t',
        'editor.battery_state_sensor': 'Telefon-Ladezustandssensor',
        'editor.battery_charging_value': 'Ladezustandswert (optional)',
        'editor.watch_battery_state_sensor': 'Uhr-Ladezustandssensor',
        'editor.watch_battery_charging_value': 'Uhr-Ladezustandswert (optional)',
        'editor.charging_helper': 'Leer lassen fÃ¼r Auto-Erkennung (charging, full, on, true...)',
        'section.automatic_sensors': 'Automatische Sensoren',
        'section.sensors_description': 'Sensoren werden automatisch basierend auf der ausgewÃ¤hlten PersonenentitÃ¤t erkannt. Standardmuster: sensor.phone_',
        'section.element_positions': 'Elementpositionen',
        'section.positions_description': 'Konfigurieren Sie die Position jedes Elements auf der Karte. Nur im Classic-Layout verfÃ¼gbar.',
        'section.custom_states': 'Benutzerdefinierte ZustÃ¤nde',
        'section.states_description': 'Konfigurieren Sie, wie die verschiedenen PersonenzustÃ¤nde angezeigt werden',
        'section.card_style': 'Karten-Stil Anpassung',
        'section.modern_options': 'Moderne Layout-Optionen',
        'section.classic_options': 'Classic Layout-Optionen',
        'section.compact_options': 'Compact Layout-Optionen',
        'position.battery': 'Batterieposition',
        'position.watch_battery': 'Uhr-Batterieposition',
        'position.activity': 'AktivitÃ¤tsposition',
        'position.distance': 'Entfernungsposition',
        'position.travel': 'Reisezeitposition',
        'position.connection': 'Verbindungsposition',
        'state.name_color': 'Namensfarbe',
        'state.add_state': 'Zustand HinzufÃ¼gen',
        'default_state.home': '🏡 Zuhause',
        'default_state.away': '🏃‍♂️ Nicht Zuhause',
        'default_state.office': '🏢 Büro',
        'default_state.unknown': '❓ Unbekannt',
        'state.default_states': 'StandardzustÃ¤nde',
        'state.add_default_states': 'StandardzustÃ¤nde HinzufÃ¼gen',
        'tabs.base': 'Basis',
        'tabs.layout': 'Layout',
        'tabs.display': 'Anzeige',
        'tabs.positions': 'Positionen',
        'tabs.states': 'ZustÃ¤nde',
        'tabs.sensors': 'Sensoren',
        'tabs.style': 'Stil'
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
            ${this._t('tabs.base')}
          </button>
          <button
            class="tab ${this._selectedTab === 'sensors' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'sensors'}">
            <ha-icon icon="mdi:leak"></ha-icon>
            ${this._t('tabs.sensors')}
          </button>
          ${this._config.layout === 'classic' ? html`
            <button
              class="tab ${this._selectedTab === 'position' ? 'active' : ''}"
              @click="${() => this._selectedTab = 'position'}">
              <ha-icon icon="mdi:grid"></ha-icon>
              ${this._t('tabs.positions')}
            </button>
          ` : ''}
          <button
            class="tab ${this._selectedTab === 'states' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'states'}">
            <ha-icon icon="mdi:palette"></ha-icon>
            ${this._t('tabs.states')}
          </button>
          <button
            class="tab ${this._selectedTab === 'style' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'style'}">
            <ha-icon icon="mdi:brush"></ha-icon>
            ${this._t('tabs.style')}
          </button>
        </div>

        ${this._selectedTab === 'base' ? this._renderBaseTab() : ''}
        ${this._selectedTab === 'sensors' ? this._renderSensorsTab() : ''}
        ${this._selectedTab === 'position' ? this._renderPositionTab() : ''}
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
        <div class="section-title">${this._t('tabs.base')}</div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${entityValue}
          .label=${this._t('editor.entity') + ' (' + this._t('editor.required') + ')'}
          .includeDomains=${['person']}
          .required=${true}
          @value-changed=${(e) => this._valueChanged(e, 'entity')}>
        </ha-entity-picker>

        <ha-select
          label="${this._t('editor.layout')}"
          .value=${this._config.layout || 'classic'}
          @closed=${(e) => this._handleLayoutChange(e)}>
          <mwc-list-item value="classic">Classic</mwc-list-item>
          <mwc-list-item value="compact">Compact</mwc-list-item>
          <mwc-list-item value="modern">Modern</mwc-list-item>
        </ha-select>

        ${this._config.layout === 'compact' ? html`
          <ha-textfield
            label="${this._t('editor.compact_width')}"
            type="number"
            min="200"
            max="500"
            .value=${this._config.compact_width || '300'}
            @input=${(e) => this._valueChanged(e, 'compact_width')}
            helper-text="Maximum width in pixels (default: 300px)">
          </ha-textfield>
        ` : ''}

        ${this._config.layout === 'modern' ? html`
          <ha-textfield
            label="${this._t('editor.modern_width')}"
            type="number"
            min="200"
            max="500"
            .value=${this._config.modern_width || '300'}
            @input=${(e) => this._valueChanged(e, 'modern_width')}
            helper-text="Maximum width in pixels (default: 300px)">
          </ha-textfield>
        ` : ''}

        <ha-textfield
          label="${this._t('editor.name')}"
          .value=${this._config.name || ''}
          @input=${(e) => this._valueChanged(e, 'name')}>
        </ha-textfield>

        <ha-textfield
          label="${this._t('editor.custom_image_url')}"
          .value=${this._config.entity_picture || ''}
          @input=${(e) => this._valueChanged(e, 'entity_picture')}
          helper-text="E.g.: /local/photos/mario.jpg">
        </ha-textfield>

        ${this._config.layout === 'classic' ? html`
          <ha-textfield
            label="${this._t('editor.aspect_ratio')}"
            .value=${this._config.aspect_ratio || '1/0.7'}
            @input=${(e) => this._valueChanged(e, 'aspect_ratio')}
            helper-text="Format: width/height (e.g., 1/0.7)">
          </ha-textfield>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">${this._t('editor.display_options')}</div>

        <div class="config-row">
          <span class="config-label">${this._t('editor.show_entity_picture')}</span>
          <ha-switch
            .checked=${this._config.show_entity_picture !== false}
            @change=${(e) => this._valueChanged(e, 'show_entity_picture')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._t('editor.show_person_name')}</span>
          <ha-switch
            .checked=${this._config.show_person_name !== false}
            @change=${(e) => this._valueChanged(e, 'show_person_name')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._t('editor.show_name')}</span>
          <ha-switch
            .checked=${this._config.show_name !== false}
            @change=${(e) => this._valueChanged(e, 'show_name')}>
          </ha-switch>
        </div>

        ${this._config.layout !== 'modern' ? html`
          <div class="config-row">
            <span class="config-label">${this._t('editor.show_last_updated')}</span>
            <ha-switch
              .checked=${this._config.show_last_changed !== false}
              @change=${(e) => this._valueChanged(e, 'show_last_changed')}>
            </ha-switch>
          </div>
        ` : ''}
      </div>
    `;
  }


  _renderSensorsTab() {
    const entityBase = this._config.entity
      ? this._config.entity.replace('person.', '')
      : 'example';

    return html`
      <div class="section">
        <div class="section-title">${this._t('section.automatic_sensors')}</div>
        <p class="info-text">
          ${this._t('section.sensors_description')}${entityBase}_* e sensor.watch_${entityBase}_*
        </p>

        <!-- Battery -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:battery" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_battery')}</span>
            <ha-switch
              .checked=${this._config.show_battery !== false}
              @change=${(e) => this._valueChanged(e, 'show_battery')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.battery_sensor || ''}
            .label=${'sensor.phone_' + entityBase + '_battery_level'}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'battery_sensor')}>
          </ha-entity-picker>

          <!-- Battery charging state sensor -->
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.battery_state_sensor || ''}
            .label=${'sensor.phone_' + entityBase + '_battery_state'}
            .includeDomains=${['sensor', 'binary_sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._entityPickerChanged(e, 'battery_state_sensor')}>
          </ha-entity-picker>

          <ha-textfield
            .value=${this._config.battery_charging_value || ''}
            .label=${this._t('editor.battery_charging_value')}
            .helper=${this._t('editor.charging_helper')}
            @input=${(e) => this._valueChanged(e, 'battery_charging_value')}>
          </ha-textfield>
        </div>

        <!-- Watch Battery -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:watch" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_watch_battery')}</span>
            <ha-switch
              .checked=${this._config.show_watch_battery !== false}
              @change=${(e) => this._valueChanged(e, 'show_watch_battery')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.watch_battery_sensor || ''}
            .label=${'sensor.watch_' + entityBase + '_battery_level'}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'watch_battery_sensor')}>
          </ha-entity-picker>

          <!-- Watch battery charging state sensor -->
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.watch_battery_state_sensor || ''}
            .label=${'sensor.watch_' + entityBase + '_battery_state'}
            .includeDomains=${['sensor', 'binary_sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._entityPickerChanged(e, 'watch_battery_state_sensor')}>
          </ha-entity-picker>

          <ha-textfield
            .value=${this._config.watch_battery_charging_value || ''}
            .label=${this._t('editor.watch_battery_charging_value')}
            .helper=${this._t('editor.charging_helper')}
            @input=${(e) => this._valueChanged(e, 'watch_battery_charging_value')}>
          </ha-textfield>
        </div>

        <!-- Activity -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:walk" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_activity')}</span>
            <ha-switch
              .checked=${this._config.show_activity !== false}
              @change=${(e) => this._valueChanged(e, 'show_activity')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.activity_sensor || ''}
            .label=${'sensor.phone_' + entityBase + '_activity'}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'activity_sensor')}>
          </ha-entity-picker>
        </div>

        <!-- Connection -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:wifi" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_connection')}</span>
            <ha-switch
              .checked=${this._config.show_connection !== false}
              @change=${(e) => this._valueChanged(e, 'show_connection')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.connection_sensor || ''}
            .label=${'sensor.phone_' + entityBase + '_connection_type'}
            .includeDomains=${['sensor', 'binary_sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'connection_sensor')}>
          </ha-entity-picker>
        </div>

        <!-- Distance -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:home-map-marker" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_distance')}</span>
            <ha-switch
              .checked=${this._config.show_distance !== false}
              @change=${(e) => this._valueChanged(e, 'show_distance')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.distance_sensor || ''}
            .label=${'sensor.waze_' + entityBase}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'distance_sensor')}>
          </ha-entity-picker>
        </div>

        <!-- Travel Time -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:car-clock" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_travel_time')}</span>
            <ha-switch
              .checked=${this._config.show_travel_time !== false}
              @change=${(e) => this._valueChanged(e, 'show_travel_time')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.travel_sensor || ''}
            .label=${'sensor.home_work_' + entityBase}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'travel_sensor')}>
          </ha-entity-picker>
        </div>
      </div>
    `;
  }


  _renderPositionTab() {
    if (!this._config) {
      return html`<div>Configuration not available.</div>`;
    }

    return html`
      <div class="section">
        <div class="section-title">${this._t('section.element_positions')}</div>
        <p class="info-text">
          ${this._t('section.positions_description')}
        </p>

        ${this._config.show_battery !== false ? html`
          ${this._renderPositionButtons('battery_position', this._t('position.battery'))}
        ` : ''}

        ${this._config.show_watch_battery !== false ? html`
          ${this._renderPositionButtons('watch_battery_position', this._t('position.watch_battery'))}
        ` : ''}

        ${this._config.show_activity !== false ? html`
          ${this._renderPositionButtons('activity_position', this._t('position.activity'))}
        ` : ''}

        ${this._config.show_connection !== false ? html`
          ${this._renderPositionButtons('connection_position', this._t('position.connection'))}
        ` : ''}

        ${this._config.show_distance !== false ? html`
          ${this._renderPositionButtons('distance_position', this._t('position.distance'))}
        ` : ''}

        ${this._config.show_travel_time !== false ? html`
          ${this._renderPositionButtons('travel_position', this._t('position.travel'))}
        ` : ''}
      </div>
    `;
  }



  _renderStatesTab() {
    const states = this._config.state || [];

    return html`
      <div class="section">
        <div class="section-title">${this._t('section.custom_states')}</div>
        <p class="info-text">
          ${this._t('section.states_description')}
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
              label="${this._t('editor.state_value')} (e.g., home, not_home)"
              .value=${state.value || ''}
              @input=${(e) => this._updateState(index, 'value', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.displayed_name')}"
              .value=${state.name || ''}
              @input=${(e) => this._updateState(index, 'name', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.custom_image')} (${this._t('editor.optional')})"
              .value=${state.entity_picture || ''}
              @input=${(e) => this._updateState(index, 'entity_picture', e.target.value)}>
            </ha-textfield>

            <div class="config-row">
              <span class="config-label">${this._t('state.name_color')}</span>
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
          ${this._t('state.add_state')}
        </mwc-button>
      </div>

      <div class="preview-box">
        <div class="preview-title">${this._t('state.default_states')}</div>
        <mwc-button
          @click=${this._addDefaultStates}
          icon="mdi:magic">
          ${this._t('state.add_default_states')}
        </mwc-button>
      </div>
    `;
  }

  _renderStyleTab() {
    return html`
      <div class="section">
        <div class="section-title">${this._t('section.card_style')}</div>

        ${this._config.layout === 'classic' ? html`
          <div class="two-column">
            <ha-textfield
              label="${this._t('editor.name_font_size')}"
              .value=${this._config.name_font_size || '20px'}
              @input=${(e) => this._valueChanged(e, 'name_font_size')}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.state_font_size')}"
              .value=${this._config.state_font_size || '14px'}
              @input=${(e) => this._valueChanged(e, 'state_font_size')}>
            </ha-textfield>
          </div>

          <ha-textfield
            label="${this._t('editor.last_changed_font_size')}"
            .value=${this._config.last_changed_font_size || '12px'}
            @input=${(e) => this._valueChanged(e, 'last_changed_font_size')}
            helper-text="E.g.: 12px, 0.9em, 14px">
          </ha-textfield>
        ` : ''}

        <ha-textfield
          label="${this._t('editor.card_background')}"
          .value=${this._config.card_background || 'rgba(255,255,255,0.05)'}
          @input=${(e) => this._valueChanged(e, 'card_background')}
          helper-text="E.g.: rgba(255,255,255,0.05) or #1a1a2e">
        </ha-textfield>

        <ha-textfield
          label="${this._t('editor.border_radius')}"
          .value=${this._config.card_border_radius || '15px'}
          @input=${(e) => this._valueChanged(e, 'card_border_radius')}>
        </ha-textfield>

        ${this._config.layout === 'classic' ? html`
          <ha-textfield
            label="${this._t('editor.image_size')}"
            type="number"
            min="10"
            max="100"
            .value=${this._config.picture_size || '55'}
            @input=${(e) => this._valueChanged(e, 'picture_size')}>
          </ha-textfield>
        ` : ''}
      </div>

      <!-- Classic Layout Options -->
      ${this._config.layout === 'classic' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.classic_options')}</div>

          <ha-textfield
            label="${this._t('editor.classic_icon_size')}"
            type="number"
            min="12"
            max="32"
            .value=${this._config.classic_icon_size || '16'}
            @input=${(e) => this._valueChanged(e, 'classic_icon_size')}
            helper-text="Default: 16px (icon size for indicators)">
          </ha-textfield>

          <ha-textfield
            label="${this._t('editor.battery_font_size')}"
            .value=${this._config.battery_font_size || '13px'}
            @input=${(e) => this._valueChanged(e, 'battery_font_size')}
            helper-text="Default: 13px">
          </ha-textfield>

          <ha-textfield
            label="${this._t('editor.activity_font_size')}"
            .value=${this._config.activity_font_size || '13px'}
            @input=${(e) => this._valueChanged(e, 'activity_font_size')}
            helper-text="Default: 13px">
          </ha-textfield>
        </div>
      ` : ''}

      <!-- Compact Layout Options -->
      ${this._config.layout === 'compact' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.compact_options')}</div>

          <ha-textfield
            label="${this._t('editor.compact_icon_size')}"
            type="number"
            min="12"
            max="32"
            .value=${this._config.compact_icon_size || '16'}
            @input=${(e) => this._valueChanged(e, 'compact_icon_size')}
            helper-text="Default: 16px (scales entire card proportionally)">
          </ha-textfield>
        </div>
      ` : ''}

      <!-- Modern Layout Options -->
      ${this._config.layout === 'modern' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.modern_options')}</div>

          <ha-textfield
            label="${this._t('editor.modern_picture_size')}"
            type="number"
            min="30"
            max="80"
            .value=${this._config.modern_picture_size || '40'}
            @input=${(e) => this._valueChanged(e, 'modern_picture_size')}
            helper-text="Default: 40px">
          </ha-textfield>

          <ha-textfield
            label="${this._t('editor.modern_ring_size')}"
            type="number"
            min="28"
            max="60"
            .value=${this._config.modern_ring_size || '38'}
            @input=${(e) => this._valueChanged(e, 'modern_ring_size')}
            helper-text="Default: 38px (size of circular indicators)">
          </ha-textfield>

          <div class="two-column">
            <ha-textfield
              label="${this._t('editor.modern_name_font_size')}"
              .value=${this._config.modern_name_font_size || '14px'}
              @input=${(e) => this._valueChanged(e, 'modern_name_font_size')}
              helper-text="Default: 14px">
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.modern_state_font_size')}"
              .value=${this._config.modern_state_font_size || '12px'}
              @input=${(e) => this._valueChanged(e, 'modern_state_font_size')}
              helper-text="Default: 12px">
            </ha-textfield>
          </div>

          <ha-textfield
            label="${this._t('editor.modern_travel_max_time')}"
            type="number"
            min="10"
            max="180"
            .value=${this._config.modern_travel_max_time || '60'}
            @input=${(e) => this._valueChanged(e, 'modern_travel_max_time')}
            helper-text="Default: 60 min (used for progress ring calculation)">
          </ha-textfield>
        </div>
      ` : ''}
    `;
  }

  _renderPositionButtons(configKey, label) {
    const options = [
      { value: 'top-left', label: 'Top Left' },
      { value: 'top-right', label: 'Top Right' },
      { value: 'bottom-left', label: 'Bottom Left' },
      { value: 'bottom-right', label: 'Bottom Right' }
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


  _handleLayoutChange(ev) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();

    const target = ev.target;
    const value = target.value;

    if (!value || (value !== 'classic' && value !== 'compact' && value !== 'modern')) {
      console.warn('Invalid layout value:', value);
      return;
    }

    this._config = { ...this._config, layout: value };
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

    // Allowed values for layout
    const validLayoutValues = ['classic', 'compact', 'modern'];

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
    } else if (configValue === 'layout') {
      if (!validLayoutValues.includes(value)) {
        console.warn(`Invalid layout value:`, value);
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
