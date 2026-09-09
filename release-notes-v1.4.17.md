# 🚀 Person Tracker Card v1.4.17

## 🔧 Fixed

### ⚡ Removed full `hass.states` scan from `_resolveDevicePrefix()`

The device-prefix resolver had a fallback path that enumerated **every entity on the system** via `Object.keys(hass.states)`, on every `hass` update, for every card instance on a dashboard.

That access pattern is exactly what Home Assistant's own frontend — and third-party clients like [Kiosk Satellite](https://github.com/jxlarrea/kiosk-satellite) — use to detect "this view needs every entity," which permanently disables their **client-side entity-update filtering** for the page. Any dashboard including this card lost that filtering, with no way to opt out.

**The fix:** the resolver now relies solely on the person entity's own `device_trackers` attribute (the officially tracked list of a person's devices), which is both cheaper and more correct than guessing via substring match against unrelated device_trackers.

### 🎯 Impact

- **No behavior change** for the normal case — the primary path (reading from `person.attributes.device_trackers`) was already tried first and returned the correct match.
- **Restored performance** on dashboards with many cards — client-side entity-update filtering now works as expected.
- **Better correctness** — no more guessing by substring match against unrelated entities.

### 🧪 Tested

Verified against a live Home Assistant instance with 8+ `person-tracker-card` instances on one dashboard view (mix of explicit and auto-detected configs). Kiosk Satellite's "reads all entity states" flag went away after the change, with no visible change to card output.

---

## 🔗 Related
- Merges #48 — fix by @davidcoulson

---

**Full changelog:** [CHANGELOG.md](CHANGELOG.md)

---

If you find this card useful, consider buying me a coffee ☕

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)
