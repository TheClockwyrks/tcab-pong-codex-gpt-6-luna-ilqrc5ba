# Carom

Carom is a browser based paddle duel built around curved, spin driven shots and two fixed bank shot obstacles. Play Solo against the tracking AI or share the keyboard in Versus. The first player to eleven points must lead by two.

## Install

```sh
npm ci
```

## Run in development

```sh
npm run dev
```

## Build for production

```sh
npm run build
```

Vite writes the self contained static site to `dist/`; serve that directory from the root of any static host.

## Controls

- Solo: **W / S** moves player one. The AI controls the right paddle.
- Versus: **W / S** moves player one; **↑ / ↓** moves player two.
- **Enter** or **Space** selects; **↑ / ↓** navigates menus.
- **P** or **Esc** pauses and resumes. **M** toggles sound.
- Menus also respond to pointer and touch.
