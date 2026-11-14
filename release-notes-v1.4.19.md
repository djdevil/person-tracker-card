# 🚀 Person Tracker Card v1.4.19

## 🔧 Fixed

### 🐛 Editor fields missing on Home Assistant 2026.5 and later

Home Assistant removed its `ha-textfield` component. The card's editor used it for every text and number field, so on recent versions those fields simply disappeared: widths, sizes, font sizes, colors, max travel time and more. Only section titles and switches were left.

The editor now has its own text field and no longer depends on that component. **If the Style tab looked empty for you, this release fixes it.**

### 🐛 Modern layout: rings wrapping when the address is shown

A long GPS address widened the text column and pushed the rings onto a second row. The address now scrolls in the space available and the rings stay where they are.

### Other editor fixes

- **Position picker (Classic)** — the buttons were unstyled and the default positions (`top-right-2`, `top-left-2`) couldn't be selected. The new picker shows all 10 positions the card supports.
- **Add state** could fail when Home Assistant passed a read-only config.
- Changing layout while on the **Positions** tab no longer leaves you on a tab that doesn't exist.
- Remaining hardcoded English/Italian strings are translated; missing French key added.
- The editor does less work on every refresh.

## 🎨 Redesigned editor

- **Visual layout picker** — 11 preview tiles instead of a dropdown.
- Sections as cards with icons, pill tabs, and a header showing the person's picture.
- One-tap choices for tap action and maps provider instead of dropdowns.
- Color rows with a swatch, hex field and a clear button to go back to the layout default.
- Sensor groups collapse when their switch is off, so the Sensors tab is much shorter.
- Works in light and dark themes.

The editor also stops using several other internal Home Assistant components (`ha-select`, `mwc-button`, `ha-icon-button`), so future Home Assistant updates are less likely to break it.

No changes to your YAML.

---

**Full changelog:** [CHANGELOG.md](CHANGELOG.md)

---

If you find this card useful, consider buying me a coffee ☕

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)
