// Generuje js/zasoby.js: logo, sygnet i portret jako data URI,
// żeby kreator działał nawet po otwarciu index.html prosto z dysku.
// Użycie: node narzedzia/zasoby.mjs   (z katalogu kreator-karuzel)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const tu = dirname(fileURLToPath(import.meta.url));
const logo = join(tu, "..", "..", "brand", "logo");
const uri = (plik, typ) => `data:${typ};base64,${readFileSync(join(logo, plik)).toString("base64")}`;

const zasoby = {
  logo: uri("logo-podpis.png", "image/png"),
  sygnet: uri("sygnet.svg", "image/svg+xml"),
  portret: uri("portret.jpg", "image/jpeg"),
};
writeFileSync(
  join(tu, "..", "js", "zasoby.js"),
  "// Wygenerowane przez narzedzia/zasoby.mjs — nie edytuj ręcznie.\nwindow.ZASOBY = " + JSON.stringify(zasoby) + ";\n"
);
console.log("Zapisano js/zasoby.js");
