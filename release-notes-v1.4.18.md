# 🚀 Person Tracker Card v1.4.18

## ✨ Added

### 🎨 Global location text color — `location_color`

Until now, the only way to change the color of the zone/state text was to add a `state` entry for every single zone. That doesn't scale if you have dozens of zones, and the default grey text was hard to read on top of the animated weather background.

`location_color` sets **one color for every location**, in all 11 layouts:

```yaml
type: custom:person-tracker-card
entity: person.john
location_color: "#ffffff"
```

- A color set for a single state (`state[].styles.name.color`) still takes priority, so per-zone colors keep working.
- It overrides the weather-mode contrast defaults, so the text stays readable when `show_weather` is on.
- On the **Holo** layout it replaces the gradient text with a solid color.

### 📍 GPS address color — `geocoded_location_color`

Sets the color of the geocoded address shown when the person isn't home. If you leave it empty, it uses `location_color`, then the layout default.

```yaml
geocoded_location_color: "#ffd54f"
```

### 🛠️ Visual editor

Both options have a color picker in the **Style** tab, for every layout. Clear the field to go back to the default. Translated in all 6 languages (IT, EN, FR, DE, NL, PL).

---

## 🔧 Fixed

### 🐛 `not_home` color ignored (stayed orange)

Some trackers report the person's state as `away` instead of `not_home`. The card showed "Away", but a `state` entry with `value: not_home` never matched, so the card used the orange color meant for other zones.

State matching is now tolerant: case and extra spaces are ignored, and `away` and `not_home` count as the same state. Exact matches still take priority, and the built-in away colors of every layout now apply to `away` too.

---

## 🔗 Related
- Addresses #49

---

**Full changelog:** [CHANGELOG.md](CHANGELOG.md)

---

If you find this card useful, consider buying me a coffee ☕

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)
