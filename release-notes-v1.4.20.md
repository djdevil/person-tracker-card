# 🚀 Person Tracker Card v1.4.20

## 🛒 Ready for the Home Assistant Marketplace

Starting with **Home Assistant 2026.11**, HACS is built into Home Assistant as the **Marketplace** (Settings → Marketplace). This release gets the card ready for it.

### 🐛 Fixed: visual editor missing when installed from the Marketplace

The Marketplace installs only the main card file. The visual editor lives in a second file, `person-tracker-card-editor.js`, so on Home Assistant 2026.11 the card could install without its editor.

Both files are now attached to every release, and the Marketplace installs them together. **If the editor didn't open for you after installing from the Marketplace, update to this version.**

### ✅ Added

- HACS validation on every change, needed for the default catalog.
- Every release automatically includes both the card and the editor.

### 📖 Changed

- README: installation instructions for the Marketplace.

No changes to the card, the editor or your YAML.

---

**Full changelog:** [CHANGELOG.md](CHANGELOG.md)

---

If you find this card useful, consider buying me a coffee ☕

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)
