// Render karuzel z linii poleceń: JSON → slajdy PNG + opis posta.
// Użycie (z katalogu kreator-karuzel):
//   node narzedzia/render.mjs przyklady/puste-terminy.json [katalog-wyjściowy]
//   node narzedzia/render.mjs --wszystkie [katalog-wyjściowy]   (cała biblioteka)
// Wymaga Playwright: npm install playwright && npx playwright install chromium
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const tu = dirname(fileURLToPath(import.meta.url));
const strona = pathToFileURL(join(tu, "..", "index.html")).href;

const args = process.argv.slice(2);
if (!args.length) {
  console.log("Użycie: node narzedzia/render.mjs <karuzela.json | --wszystkie> [katalog]");
  process.exit(1);
}
const wyjscie = resolve(args[1] || "wyniki");

const przegladarka = await chromium.launch();
const p = await przegladarka.newPage({ viewport: { width: 1400, height: 1000 } });
p.on("pageerror", (e) => console.error("Błąd strony:", e.message));
await p.goto(strona, { waitUntil: "domcontentloaded" });
await p.waitForFunction(() => window.KreatorAPI && document.fonts.status === "loaded", null, { timeout: 60000 });

const zadania =
  args[0] === "--wszystkie"
    ? await p.evaluate(() => window.Szablony.GOTOWE.map((g) => ({ nazwa: g.id, dane: g })))
    : [{ nazwa: basename(args[0], ".json"), dane: JSON.parse(readFileSync(args[0], "utf8")) }];

for (const z of zadania) {
  const kat = join(wyjscie, z.nazwa);
  mkdirSync(kat, { recursive: true });
  await p.evaluate((d) => window.KreatorAPI.wczytaj(d), z.dane);
  const n = await p.evaluate(() => window.KreatorAPI.ile());
  for (let i = 0; i < n; i++) {
    const url = await p.evaluate((i) => window.KreatorAPI.png(i), i);
    writeFileSync(join(kat, `${String(i + 1).padStart(2, "0")}.png`), Buffer.from(url.split(",")[1], "base64"));
  }
  writeFileSync(join(kat, "opis-posta.txt"), await p.evaluate(() => window.KreatorAPI.opis()));
  console.log(`✓ ${z.nazwa}: ${n} slajdów → ${kat}`);
}
await przegladarka.close();
