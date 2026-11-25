// Hearthline Kitchen entry program. Node 22, standard library only.
// Copies the static game and its real browser screenshots to the output
// directory, then writes the dossier the judge reads with the kit library.
// Final pass: the plate is ready before the judge ever sees the sheet.
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(output, { recursive: true });
cpSync(join(here, 'game'), join(output, 'game'), { recursive: true });

mkdirSync(join(output, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(output, 'screenshots'), { recursive: true });
}

// The gate wants three or four real renders; fail here if that is not what ships.
const shippedShots = readdirSync(join(output, 'screenshots')).filter((name) => /\.(png|jpe?g)$/i.test(name));
if (shippedShots.length < 3 || shippedShots.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shippedShots.length}`);
}

const dossier = buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(output, 'dossier.json'), dossier);
