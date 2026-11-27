# 🚀 Person Tracker Card v1.4.21

## 🧹 Removed: automatic resource rewrite and page reload

Until now, every time an admin opened a dashboard, the card rewrote its own Lovelace resource URLs (adding `?v=<version>`) and then reloaded the whole page.

That behavior is gone:

- It changed Home Assistant configuration without being asked.
- It removed the `hacstag` parameter that HACS and the Marketplace use to make sure your browser loads the new version after an update.
- It could match another resource with a similar URL.
- It reloaded the frontend under you.

HACS and the Marketplace already take care of loading the new version after an update, and the visual editor follows along.

**Manual installs:** after updating the files, change `?v=` on the resource URL (e.g. `/local/person-tracker-card/person-tracker-card.js?v=1.4.21`) or do a hard refresh (Ctrl+Shift+R).

No changes to how the card looks or to your YAML.

---

**Full changelog:** [CHANGELOG.md](CHANGELOG.md)

---

If you find this card useful, consider buying me a coffee ☕

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)
