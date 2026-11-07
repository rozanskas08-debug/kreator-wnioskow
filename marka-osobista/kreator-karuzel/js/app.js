/* Interfejs Kreatora Karuzel. */
(function () {
  const M = window.MARKA;
  const S = window.Szablony;
  const $ = (id) => document.getElementById(id);
  const KLUCZ = "kreator-karuzel:szkic";

  const kopia = (o) => JSON.parse(JSON.stringify(o));
  const nowa = (wzor) => ({ ...kopia(wzor), format: "4:5" });

  let k = null;
  let wybrany = 0;
  let wzorId = null;

  // ---------- start ----------
  $("sygnet").src = window.ZASOBY.sygnet;
  for (const [id, f] of Object.entries(M.formaty)) $("format").add(new Option(`${id} · ${f.w}×${f.h}`, id));
  for (const f of M.filary) $("ai-filar").add(new Option(`${f.nazwa} (${f.udzial}%)`, f.id));
  $("ai-oferta").add(new Option("Dobierz automatycznie", ""));
  for (const o of M.oferta) $("ai-oferta").add(new Option(o.nazwa, `${o.nazwa} — CTA: ${o.cta}`));
  for (const [id, t] of Object.entries(S.TYPY)) {
    $("typ").add(new Option(t.nazwa, id));
    $("nowy-typ").add(new Option(t.nazwa, id));
  }
  $("nowy-typ").value = "punkt";

  const filarNazwa = (id) => (M.filary.find((f) => f.id === id) || {}).nazwa || "Własna";
  function rysujBiblioteke() {
    const ul = $("biblioteka");
    ul.innerHTML = "";
    [...S.GOTOWE, S.PUSTA].forEach((g) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-current", String(g.id === wzorId));
      const t = document.createElement("b");
      t.textContent = g.nazwa;
      const s = document.createElement("span");
      s.textContent = g.id === "pusta" ? "Zacznij od zera" : `${filarNazwa(g.filar)} · ${g.slajdy.length} slajdów`;
      b.append(t, s);
      b.onclick = () => {
        wzorId = g.id;
        ustaw(nowa(g));
      };
      li.append(b);
      ul.append(li);
    });
  }

  function wczytajSzkic() {
    try {
      const s = localStorage.getItem(KLUCZ);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return null;
  }
  let zapisTimer;
  function zapiszSzkic() {
    clearTimeout(zapisTimer);
    zapisTimer = setTimeout(() => {
      try {
        localStorage.setItem(KLUCZ, JSON.stringify({ k, wzorId }));
      } catch (e) {}
    }, 400);
  }

  async function ustaw(nowaK, idx = 0) {
    k = nowaK;
    if (!M.formaty[k.format]) k.format = "4:5"; // zawsze 4:5, także w starych szkicach
    wybrany = Math.min(idx, k.slajdy.length - 1);
    $("format").value = k.format;
    $("motyw").value = k.motyw || "papier";
    $("ciaglosc").checked = k.ciaglosc === true;
    $("ramka").value = k.ramka || "";
    $("stopka").value = k.stopka || "";
    $("seria").value = k.seria || "";
    $("nr").value = k.nr || "";
    $("opis").value = k.opis || S.opis(k);
    rysujBiblioteke();
    await Silnik.przygotuj(k);
    odswiezWszystko();
  }

  // ---------- rysowanie ----------
  const miniatury = [];
  function rysujTasme() {
    const t = $("tasma");
    t.innerHTML = "";
    miniatury.length = 0;
    t.style.setProperty("--szczelina", $("bez-przerw").checked ? "0px" : "10px");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { W } = Silnik.wymiary(k);
    k.slajdy.forEach((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "miniatura";
      b.setAttribute("aria-current", String(i === wybrany));
      b.setAttribute("aria-label", `Slajd ${i + 1}: ${S.TYPY[s.typ]?.nazwa || s.typ}`);
      const c = Silnik.plotno(k, i, (150 / W) * dpr);
      const nr = document.createElement("span");
      nr.className = "nr";
      nr.textContent = String(i + 1).padStart(2, "0");
      b.append(c, nr);
      b.onclick = () => wybierz(i);
      t.append(b);
      miniatury.push(c);
    });
  }
  function odswiezMiniature(i) {
    const c = miniatury[i];
    if (!c) return rysujTasme();
    const { W } = Silnik.wymiary(k);
    Silnik.plotno(k, i, (150 / W) * Math.min(2, window.devicePixelRatio || 1), c);
  }
  function rysujPodglad() {
    const c = $("podglad");
    const { W } = Silnik.wymiary(k);
    const szer = c.clientWidth || 480;
    Silnik.plotno(k, wybrany, (szer / W) * Math.min(2, window.devicePixelRatio || 1), c);
  }
  function rysujUwagi() {
    const ul = $("uwagi");
    ul.innerHTML = "";
    const u = Silnik.uwagi(k);
    if (!u.length) u.push({ ok: "Struktura zgodna z dobrymi praktykami: hak, wartość, coś do zapisania i CTA." });
    for (const x of u) {
      const li = document.createElement("li");
      if (x.ok) {
        li.className = "ok";
        li.textContent = x.ok;
      } else li.textContent = x;
      ul.append(li);
    }
  }
  function odswiezWszystko() {
    $("tytul-karuzeli").textContent = k.seria || "Karuzela";
    rysujTasme();
    rysujPodglad();
    rysujEdytor();
    rysujUwagi();
    zapiszSzkic();
  }
  let ramka = null;
  function poZmianie() {
    if (ramka) return;
    ramka = requestAnimationFrame(() => {
      ramka = null;
      // numeracja/ściąga/nić zależą od innych slajdów — odśwież wszystkie miniatury
      k.slajdy.forEach((_, i) => odswiezMiniature(i));
      rysujPodglad();
      rysujUwagi();
      zapiszSzkic();
    });
  }
  function wybierz(i) {
    wybrany = i;
    document.querySelectorAll(".miniatura").forEach((b, j) => b.setAttribute("aria-current", String(j === i)));
    rysujPodglad();
    rysujEdytor();
  }

  // ---------- edytor slajdu ----------
  function rysujEdytor() {
    const s = k.slajdy[wybrany];
    $("edytor-etk").textContent = `Slajd ${String(wybrany + 1).padStart(2, "0")} z ${String(k.slajdy.length).padStart(2, "0")}`;
    $("typ").value = s.typ;
    $("motyw-slajdu").value = s.motyw || "";
    const box = $("pola");
    box.innerHTML = "";
    for (const p of S.TYPY[s.typ].pola) {
      const def = S.POLA[p];
      const id = "pole-" + p;
      if (def.przelacznik) {
        const l = document.createElement("label");
        l.className = "przelacznik";
        l.htmlFor = id;
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = id;
        cb.checked = s[p] === undefined ? !!(def.domyslnie && def.domyslnie(s)) : !!s[p];
        cb.onchange = () => {
          s[p] = cb.checked;
          poZmianie();
        };
        l.append(cb, document.createTextNode(def.nazwa));
        box.append(l);
        continue;
      }
      const l = document.createElement("label");
      l.className = "pole";
      l.htmlFor = id;
      const sp = document.createElement("span");
      sp.textContent = def.nazwa;
      l.append(sp);
      if (def.wybor) {
        const sel = document.createElement("select");
        sel.id = id;
        for (const [v, n] of def.wybor) sel.add(new Option(n, v));
        sel.value = s[p] || "";
        sel.onchange = () => {
          if (sel.value) s[p] = sel.value;
          else delete s[p];
          poZmianie();
        };
        l.append(sel);
        box.append(l);
        continue;
      }
      if (def.obraz) {
        const rz = document.createElement("div");
        rz.className = "rzad";
        const plik = document.createElement("input");
        plik.type = "file";
        plik.accept = "image/*";
        plik.id = id;
        plik.onchange = async () => {
          if (!plik.files[0]) return;
          s[p] = await zmniejsz(plik.files[0]);
          await Silnik.przygotuj(k);
          poZmianie();
        };
        const port = document.createElement("button");
        port.type = "button";
        port.className = "btn";
        port.textContent = "Moje zdjęcie";
        port.onclick = async () => {
          s[p] = "portret";
          await Silnik.przygotuj(k);
          poZmianie();
        };
        const bez = document.createElement("button");
        bez.type = "button";
        bez.className = "btn";
        bez.textContent = "Bez zdjęcia";
        bez.onclick = () => {
          delete s[p];
          poZmianie();
        };
        rz.append(plik, port, bez);
        l.append(rz);
        box.append(l);
        continue;
      }
      let el;
      if (def.lista) {
        el = document.createElement("textarea");
        el.rows = 5;
        el.value = (s[p] || []).join("\n");
        el.oninput = () => {
          s[p] = el.value.split("\n").map((x) => x.trim()).filter(Boolean);
          licz();
          poZmianie();
        };
        const podp = {
          sciaga: "Puste = ściąga zbierze tytuły punktów automatycznie.",
          ikony: "Ikona dobiera się sama z treści. Możesz ją wskazać na początku: {kalendarz} Tekst. Ikony: " + Silnik.IKONY.join(", ") + ".",
          koszty: "Jedna pozycja w linii: Etykieta | Wartość, np. Budżet reklamowy | 1 500 zł. Ostatnia linia to suma.",
        }[s.typ];
        if (podp) {
          const pm = document.createElement("p");
          pm.className = "pomoc";
          pm.textContent = podp;
          l.append(el, pm);
        }
      } else if (def.dlugie) {
        el = document.createElement("textarea");
        el.rows = p === "tekst" && s.typ === "wiadomosc" ? 5 : 2;
        el.value = s[p] || "";
        el.oninput = () => {
          s[p] = el.value;
          licz();
          poZmianie();
        };
      } else {
        el = document.createElement("input");
        el.type = "text";
        el.value = s[p] ?? def.domyslnie ?? "";
        el.oninput = () => {
          s[p] = el.value;
          poZmianie();
        };
      }
      el.id = id;
      if (!l.contains(el)) l.append(el);
      const licznik = document.createElement("span");
      licznik.className = "licznik";
      const licz = () => {
        const w = def.lista ? (s[p] || []).reduce((a, x) => a + Silnik.slowa(x), 0) : Silnik.slowa(s[p]);
        const lim = p === "tytul" ? 12 : s.typ === "wiadomosc" ? 60 : 24;
        licznik.textContent = `${w} słów`;
        licznik.classList.toggle("za-duzo", w > lim);
      };
      if (def.dlugie || def.lista) {
        licz();
        l.append(licznik);
      }
      box.append(l);
    }
  }

  async function zmniejsz(plik) {
    const url = URL.createObjectURL(plik);
    const img = await new Promise((ok, zle) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = zle;
      i.src = url;
    });
    const max = 1600;
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    return c.toDataURL("image/jpeg", 0.9);
  }

  $("typ").onchange = () => {
    k.slajdy[wybrany].typ = $("typ").value;
    rysujEdytor();
    poZmianie();
  };
  $("motyw-slajdu").onchange = () => {
    const v = $("motyw-slajdu").value;
    if (v) k.slajdy[wybrany].motyw = v;
    else delete k.slajdy[wybrany].motyw;
    poZmianie();
  };
  document.querySelectorAll("[data-akcja]").forEach((b) => {
    b.onclick = () => {
      const a = b.dataset.akcja;
      const sl = k.slajdy;
      if (a === "gora" && wybrany > 0) {
        [sl[wybrany - 1], sl[wybrany]] = [sl[wybrany], sl[wybrany - 1]];
        wybrany--;
      } else if (a === "dol" && wybrany < sl.length - 1) {
        [sl[wybrany + 1], sl[wybrany]] = [sl[wybrany], sl[wybrany + 1]];
        wybrany++;
      } else if (a === "kopia") {
        sl.splice(wybrany + 1, 0, kopia(sl[wybrany]));
        wybrany++;
      } else if (a === "usun" && sl.length > 1) {
        sl.splice(wybrany, 1);
        wybrany = Math.min(wybrany, sl.length - 1);
      } else return;
      odswiezWszystko();
    };
  });
  $("dodaj").onclick = () => {
    const typ = $("nowy-typ").value;
    const s = { typ, tytul: "Nowy *slajd*" };
    if (typ === "mitfakt") Object.assign(s, { mit: "Mit do obalenia.", fakt: "Fakt, który *zmienia* perspektywę." });
    if (typ === "lista" || typ === "sciaga") s.pozycje = typ === "lista" ? ["Pierwsza rzecz", "Druga rzecz", "Trzecia rzecz"] : [];
    if (typ === "cytat") s.tekst = "Twoja myśl, którą warto *zapamiętać*.";
    if (typ === "liczba") Object.assign(s, { liczba: "15 min", tytul: "co oznacza ta *liczba*" });
    if (typ === "przedpo") Object.assign(s, { przed: "Słaba wersja", po: "Lepsza wersja" });
    if (typ === "wiadomosc") s.tekst = "Treść wiadomości do skopiowania.";
    if (typ === "cta") Object.assign(s, { tytul: "Co *dalej*?", slowo: "WORKBOOK", portret: true });
    if (typ === "artykul") Object.assign(s, { tytul: "Nagłówek z *akcentem*", tekst: "Pierwszy akapit.\n\nDrugi akapit.", wniosek: "{zarowka} Puenta, którą klientka ma zapamiętać." });
    if (typ === "ikony") Object.assign(s, { tytul: "Lista z *ikonami*", pozycje: ["{kalendarz} Pierwsza rzecz", "{dymek} Druga rzecz", "{serce} Trzecia rzecz"] });
    if (typ === "koszty") Object.assign(s, { tytul: "Załóżmy:", pozycje: ["Pierwsza pozycja | 1 800 zł", "Druga pozycja | 1 500 zł", "Razem | 3 300 zł"] });
    k.slajdy.splice(wybrany + 1, 0, s);
    wybrany++;
    odswiezWszystko();
  };

  // ---------- ustawienia karuzeli ----------
  $("format").onchange = () => {
    k.format = $("format").value;
    odswiezWszystko();
  };
  $("motyw").onchange = () => {
    k.motyw = $("motyw").value;
    poZmianie();
  };
  $("ciaglosc").onchange = () => {
    k.ciaglosc = $("ciaglosc").checked;
    poZmianie();
  };
  $("bez-przerw").onchange = () => rysujTasme();
  $("ramka").onchange = () => {
    if ($("ramka").value) k.ramka = $("ramka").value;
    else delete k.ramka;
    poZmianie();
  };
  $("stopka").oninput = () => {
    k.stopka = $("stopka").value;
    poZmianie();
  };
  $("tlo-plik").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    k.tlo = await zmniejsz(f);
    await Silnik.przygotuj(k);
    e.target.value = "";
    poZmianie();
  };
  $("tlo-usun").onclick = () => {
    delete k.tlo;
    poZmianie();
  };
  $("seria").oninput = () => {
    k.seria = $("seria").value;
    $("tytul-karuzeli").textContent = k.seria || "Karuzela";
    poZmianie();
  };
  $("nr").oninput = () => {
    k.nr = $("nr").value;
    poZmianie();
  };
  $("opis").oninput = () => {
    k.opis = $("opis").value;
    zapiszSzkic();
  };
  $("odswiez-opis").onclick = () => {
    k.opis = S.opis(k);
    $("opis").value = k.opis;
    zapiszSzkic();
  };
  $("kopiuj-opis").onclick = () => kopiuj($("opis"), $("stan-opisu"), "Opis skopiowany.");

  async function kopiuj(pole, stan, ok) {
    try {
      await navigator.clipboard.writeText(pole.value);
      stan.textContent = ok;
    } catch (e) {
      pole.focus();
      pole.select();
      stan.textContent = "Tekst zaznaczony. Skopiuj go skrótem Ctrl+C (Cmd+C).";
    }
  }

  // ---------- eksport ----------
  let pobieranie = null;
  if (window.claude && window.claude.use) {
    window.claude.use("downloads").then((d) => (pobieranie = d)).catch(() => {});
  }
  async function zapiszPlik(nazwa, blob) {
    if (pobieranie) {
      try {
        await pobieranie.save({ filename: nazwa, data: blob });
        return "Zapisano: " + nazwa;
      } catch (e) {
        if (e && e.code === "declined") return "Pobieranie anulowane.";
        if (e && e.code !== "unavailable") return "Nie udało się zapisać pliku (" + (e.code || "błąd") + ").";
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nazwa;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return "Pobrano: " + nazwa;
  }
  const slug = () =>
    (k.seria || "karuzela")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ł/g, "l")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "karuzela";
  const doBlob = (c) => new Promise((ok) => c.toBlob(ok, "image/png"));

  $("eksport-png").onclick = async () => {
    const b = await doBlob(Silnik.plotno(k, wybrany, 1));
    $("stan-eksportu").textContent = await zapiszPlik(`${slug()}-${String(wybrany + 1).padStart(2, "0")}.png`, b);
  };
  $("eksport-zip").onclick = async (ev) => {
    const btn = ev.currentTarget;
    btn.disabled = true;
    $("stan-eksportu").textContent = "Przygotowuję slajdy…";
    try {
      const pliki = [];
      for (let i = 0; i < k.slajdy.length; i++) {
        const b = await doBlob(Silnik.plotno(k, i, 1));
        pliki.push({ nazwa: `${slug()}-${String(i + 1).padStart(2, "0")}.png`, dane: new Uint8Array(await b.arrayBuffer()) });
      }
      pliki.push({ nazwa: "opis-posta.txt", dane: new TextEncoder().encode($("opis").value) });
      $("stan-eksportu").textContent = await zapiszPlik(`${slug()}.zip`, Zip.zip(pliki));
    } catch (e) {
      $("stan-eksportu").textContent = "Eksport nie powiódł się: " + e.message;
    } finally {
      btn.disabled = false;
    }
  };
  $("zapisz-json").onclick = async () => {
    $("stan-eksportu").textContent = await zapiszPlik(`${slug()}.json`, new Blob([JSON.stringify(k, null, 2)], { type: "application/json" }));
  };
  $("wczytaj-plik").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      wczytajJSON(await f.text());
      $("stan-eksportu").textContent = "Wczytano projekt.";
    } catch (err) {
      $("stan-eksportu").textContent = "To nie jest plik projektu karuzeli: " + err.message;
    }
    e.target.value = "";
  };

  // ---------- JSON / AI ----------
  function wczytajJSON(tekst) {
    const m = String(tekst).match(/\{[\s\S]*\}/);
    if (!m) throw new Error("brak obiektu JSON");
    const d = JSON.parse(m[0]);
    if (!Array.isArray(d.slajdy) || !d.slajdy.length) throw new Error("brak listy „slajdy”");
    d.slajdy = d.slajdy.filter((s) => s && S.TYPY[s.typ]);
    if (!d.slajdy.length) throw new Error("żaden slajd nie ma znanego typu");
    if (!M.motywy[d.motyw]) d.motyw = "papier";
    wzorId = null;
    ustaw(nowa({ nr: "09", ...d, opis: d.opis || "" }));
  }
  $("json-wczytaj").onclick = () => {
    try {
      wczytajJSON($("json-wklej").value);
      $("ai-stan").textContent = "Wczytano karuzelę.";
      $("ai-stan").classList.remove("blad");
    } catch (e) {
      $("ai-stan").textContent = "Nie udało się wczytać: " + e.message;
      $("ai-stan").classList.add("blad");
    }
  };
  const parametryAI = () => ({
    temat: $("ai-temat").value.trim(),
    filar: $("ai-filar").selectedOptions[0].textContent,
    slajdow: $("ai-ile").value,
    oferta: $("ai-oferta").value,
    motyw: $("motyw").value,
  });
  const ukrytyPrompt = document.createElement("textarea");
  ukrytyPrompt.className = "ukryty";
  ukrytyPrompt.setAttribute("aria-hidden", "true");
  document.body.append(ukrytyPrompt);
  $("ai-prompt").onclick = async () => {
    ukrytyPrompt.value = S.prompt(parametryAI());
    try {
      await navigator.clipboard.writeText(ukrytyPrompt.value);
      $("ai-stan").textContent = "Prompt skopiowany. Wklej go w rozmowie z Claude, a odpowiedź (JSON) wklej poniżej.";
    } catch (e) {
      $("json-wklej").value = ukrytyPrompt.value;
      $("json-wklej").closest("details").open = true;
      $("ai-stan").textContent = "Prompt jest w polu poniżej — zaznacz i skopiuj go ręcznie.";
    }
  };

  let sample = null;
  $("ai-generuj").hidden = true;
  if (window.claude && window.claude.use) {
    window.claude
      .use("sample")
      .then((s) => {
        sample = s;
        $("ai-generuj").hidden = !s;
      })
      .catch(() => {});
  }
  $("ai-generuj").onclick = async () => {
    const p = parametryAI();
    if (!p.temat) {
      $("ai-stan").textContent = "Wpisz temat karuzeli.";
      return;
    }
    const btn = $("ai-generuj");
    btn.disabled = true;
    $("ai-stan").classList.remove("blad");
    $("ai-stan").textContent = "Claude pisze karuzelę… to zwykle trwa do minuty.";
    try {
      const d = await sample.json(S.prompt(p), { modelTier: "default", cache: false });
      wczytajJSON(JSON.stringify(d));
      $("ai-stan").textContent = "Gotowe. Przejrzyj slajdy i popraw, co chcesz.";
    } catch (e) {
      $("ai-stan").classList.add("blad");
      const kody = {
        not_granted: "Brak zgody na użycie Claude. Użyj przycisku „Kopiuj prompt”.",
        rate_limited: "Za dużo zapytań naraz. Spróbuj za chwilę.",
      };
      $("ai-stan").textContent = kody[e && e.code] || "Nie udało się napisać karuzeli" + (e && e.message ? ": " + e.message : ".");
    } finally {
      btn.disabled = false;
    }
  };

  window.addEventListener("resize", () => k && rysujPodglad());

  // Start: ostatni szkic albo pierwsza gotowa karuzela
  const szkic = wczytajSzkic();
  if (szkic && szkic.k && Array.isArray(szkic.k.slajdy) && szkic.k.slajdy.length) {
    wzorId = szkic.wzorId || null;
    ustaw(szkic.k);
  } else {
    wzorId = S.GOTOWE[0].id;
    ustaw(nowa(S.GOTOWE[0]));
  }
  // Fonty z Google mogą dojść po pierwszym rysowaniu — przerysuj
  if (document.fonts) document.fonts.ready.then(() => k && odswiezWszystko());

  // Dla renderu z linii poleceń (narzedzia/render.mjs)
  window.KreatorAPI = {
    async wczytaj(dane) {
      await ustaw(nowa(dane));
      await document.fonts.ready;
    },
    async png(i) {
      const c = Silnik.plotno(k, i, 1);
      return c.toDataURL("image/png");
    },
    ile: () => k.slajdy.length,
    opis: () => S.opis(k),
  };
})();
