# AmbiBack UI

[English](README.md) · **Deutsch**

Weboberfläche für AmbiBack-Geräte, gebaut mit React und Vite. Sie läuft als eigenständige Web-App und spricht über das Netzwerk mit der API der [AmbiBack-Firmware](https://github.com/ambiback/ambiback-firmware).

Sie gehört zum [AmbiBack-Projekt](https://github.com/ambiback). Der [AmbiBack Manager](https://github.com/ambiback/ambiback-manager) bindet diese Oberfläche als Full-Control-Ansicht ein.

## Status

- Der Produktions-Build läuft durch und ist auf GitHub Pages veröffentlicht.
- **Der migrierte Stand wurde nicht mit einem echten Gerät getestet.**
- `npm run lint` meldete zum Zeitpunkt der Migration noch Fehler.
- AmbiBack-Geräte werden seit rund fünf Jahren nicht mehr verkauft. Dieses Repository dient dem Eigenbau und der Weiterentwicklung, ohne Produktsupport. Mehr auf [ambiback.de](https://www.ambiback.de/).

## Nutzung

Die veröffentlichte Version liegt unter <https://ambiback.github.io/ambiback-ui/>. Ein Gerät lässt sich in der App auswählen oder direkt über die Adresse vorgeben, zum Beispiel mit `?device=192.168.0.50`.

## Entwicklung

Voraussetzung ist Node.js 20 oder neuer.

```sh
npm ci
npm run dev
```

`npm run build` erzeugt eine Produktionsversion in `dist/`. Hinweise zum lokalen Proxy für den Zugriff auf ein echtes Gerät stehen in [dev/README.md](dev/README.md).

Bei jedem Push auf `main` baut GitHub Actions die App und veröffentlicht sie auf GitHub Pages.

## Lizenz

Copyright (C) 2026 Andre Lorbach

Dieses Programm ist freie Software und steht unter der [GNU General Public License Version 3](LICENSE). Es wird ohne jede Gewährleistung bereitgestellt. Die über npm eingebundenen Abhängigkeiten behalten ihre eigenen Lizenzen.
