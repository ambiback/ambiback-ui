# AmbiBack UI

**English** · [Deutsch](README.de.md)

Web interface for AmbiBack devices, built with React and Vite. It runs as a standalone web app and talks to the API of the [AmbiBack firmware](https://github.com/ambiback/ambiback-firmware) over the network.

It is part of the [AmbiBack project](https://github.com/ambiback). [AmbiBack Manager](https://github.com/ambiback/ambiback-manager) embeds this interface as its full-control view.

## Status

- The production build succeeds and is published on GitHub Pages.
- **The migrated state has not been tested against a real device.**
- `npm run lint` still reported errors at the time of migration.
- AmbiBack devices have not been on sale for around five years. This repository is for DIY use and further development, with no product support. More at [ambiback.de](https://www.ambiback.de/).

## Usage

The published version is at <https://ambiback.github.io/ambiback-ui/>. Select a device in the app or pass its address directly, for example with `?device=192.168.0.50`.

## Development

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

`npm run build` creates a production version in `dist/`. See [dev/README.md](dev/README.md) for the local proxy used to reach a real device.

Every push to `main` builds the app with GitHub Actions and publishes it to GitHub Pages.

## License

Copyright (C) 2026 Andre Lorbach

This program is free software under the [GNU General Public License version 3](LICENSE). It comes with no warranty. Dependencies installed through npm keep their own licenses.
