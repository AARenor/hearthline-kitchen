# Hearthline Kitchen

An original one-chef dinner-service game that runs offline from static files. Pick ingredients from the crates, chop them at the board, fire the pan, build a three-part plate and serve it at the pass before the order tickets run out. The shift clock, tip score, streak and ticket timers all rise with the pressure.

## Run

```sh
node serve.ts
# open http://localhost:8080
```

Controls: click a crate or a station, or walk with WASD / arrow keys and press E. Keys 1 to 8 pick ingredients. R restarts after a shift.

## Layout

`game/index.html` loads the ES modules under `game/src/`. The renderer splits the kitchen art, food art, HUD and effects into separate files; `state.js` owns the rules, `orders.js` the recipes and tickets, `input.js` the controls and `audio.js` synthesized sound. `screenshots/` holds four renders taken from the game itself via the deterministic `?shot=` moments in `game/src/shots.js`. `main.ts` copies the game and screenshots to the output directory and writes the make.fun dossier with the vendored kit library.

MIT licensed.
