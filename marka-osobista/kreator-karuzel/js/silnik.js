/*
 * Silnik Kreatora Karuzel — rysuje slajdy na <canvas> w stylu Twojej siatki na Instagramie:
 * ciężki szeryf w nagłówkach, podpis-logo w rogu, miękkie światło z cieniem liści,
 * cienkie łuki, a na dole linia z kółkiem „1/9” i strzałką.
 *
 * Karuzela to JEDNA długa panorama (szerokość = N × slajd). Cienie liści, łuki i nić
 * liczymy we współrzędnych panoramy, więc płynnie przechodzą przez krawędzie slajdów
 * (trend „seamless carousel”). Treść slajdu rysujemy we współrzędnych tego slajdu.
 */
(function (root) {
  const M = root.MARKA;
  const Z = root.ZASOBY || {};
  const K = M.kolory;
  const MARG = M.margines;

  // ---------- obrazy ----------
  const obrazy = new Map();
  function obraz(src) {
    if (!src) return null;
    if (src === "portret") src = Z.portret;
    if (!obrazy.has(src)) {
      const img = new Image();
      const p = new Promise((ok) => {
        img.onload = () => ok(img);
        img.onerror = () => ok(null);
      });
      img.src = src;
      obrazy.set(src, { img, p });
    }
    return obrazy.get(src);
  }
  function gotowy(src) {
    const o = obraz(src);
    return o && o.img.complete && o.img.naturalWidth ? o.img : null;
  }
  async function przygotuj(k) {
    const lista = [Z.logo, Z.portret];
    for (const s of k.slajdy) if (s.obraz) lista.push(s.obraz);
    await Promise.all(lista.filter(Boolean).map((s) => obraz(s).p));
    if (document.fonts) {
      await Promise.all(
        [
          `700 100px ${M.fonty.naglowek}`,
          `italic 700 100px ${M.fonty.naglowek}`,
          `400 40px ${M.fonty.naglowek}`,
          `italic 400 40px ${M.fonty.naglowek}`,
          `500 40px ${M.fonty.display}`,
          `italic 500 40px ${M.fonty.display}`,
          `600 30px ${M.fonty.tekst}`,
          `700 30px ${M.fonty.tekst}`,
        ].map((f) => document.fonts.load(f))
      ).catch(() => {});
    }
  }

  // Logo-podpis w dowolnym kolorze (oryginał jest bordowy)
  const logoCache = new Map();
  function logoWKolorze(kolor) {
    const img = gotowy(Z.logo);
    if (!img) return null;
    if (logoCache.has(kolor)) return logoCache.get(kolor);
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    x.globalCompositeOperation = "source-in";
    x.fillStyle = kolor;
    x.fillRect(0, 0, c.width, c.height);
    logoCache.set(kolor, c);
    return c;
  }

  function losowe(ziarno) {
    let s = ziarno % 2147483647 || 1;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }
  let ziarno = null;
  function wzorZiarna(ctx) {
    if (!ziarno) {
      ziarno = document.createElement("canvas");
      ziarno.width = ziarno.height = 220;
      const x = ziarno.getContext("2d");
      const d = x.createImageData(220, 220);
      const r = losowe(1337);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i] = d.data[i + 1] = d.data[i + 2] = Math.floor(r() * 255);
        d.data[i + 3] = 255;
      }
      x.putImageData(d, 0, 0);
    }
    return ctx.createPattern(ziarno, "repeat");
  }

  // ---------- typografia ----------
  const F = {
    nag: (r, w = 700, it = false) => `${it ? "italic " : ""}${w} ${r}px ${M.fonty.naglowek}`,
    disp: (r, w = 500, it = false) => `${it ? "italic " : ""}${w} ${r}px ${M.fonty.display}`,
    txt: (r, w = 600) => `${w} ${r}px ${M.fonty.tekst}`,
  };
  const fNag = (r, a) => F.nag(r, 700, a);
  const fTresc = (r, a) => F.nag(r, 400, a);
  function odstep(ctx, px) {
    if ("letterSpacing" in ctx) ctx.letterSpacing = px + "px";
  }

  // "*słowo*" = akcent. "\n" = nowa linia.
  function tokeny(tekst) {
    const out = [];
    let akc = false;
    let spacjaPrzed = true;
    String(tekst || "")
      .split(/(\*|\n)/)
      .forEach((kaw) => {
        if (kaw === "*") return void (akc = !akc);
        if (kaw === "\n") {
          out.push({ br: true });
          spacjaPrzed = true;
          return;
        }
        if (!kaw) return;
        kaw.split(/ +/).forEach((w, i) => {
          if (!w) return;
          // „*druga*.” — kropka przykleja się do słowa, bez spacji
          const doklej = i === 0 && !spacjaPrzed && out.length > 0 && !out[out.length - 1].br;
          out.push({ t: w, akc, doklej });
        });
        spacjaPrzed = / $/.test(kaw);
      });
    return out;
  }
  function zlam(ctx, tok, maxW, font) {
    const linie = [{ el: [], w: 0 }];
    ctx.font = font(false);
    const spacja = ctx.measureText(" ").width;
    for (const t of tok) {
      if (t.br) {
        linie.push({ el: [], w: 0 });
        continue;
      }
      ctx.font = font(t.akc);
      const w = ctx.measureText(t.t).width;
      let l = linie[linie.length - 1];
      if (t.doklej && l.el.length) {
        l.el.push({ ...t, w, x: l.w });
        l.w += w;
        continue;
      }
      if (l.el.length && l.w + spacja + w > maxW) {
        l = { el: [], w: 0 };
        linie.push(l);
      }
      const x = l.el.length ? l.w + spacja : 0;
      l.el.push({ ...t, w, x });
      l.w = x + w;
    }
    return linie.filter((l) => l.el.length);
  }
  // Dopasuj rozmiar tak, by tekst zmieścił się w ramce
  function dopasuj(ctx, tekst, { maxW, maxH, start, min, lh, font, ls = 0, wersaliki = false }) {
    const tok = tokeny(wersaliki ? String(tekst || "").toLocaleUpperCase("pl") : tekst);
    for (let r = start; r >= min; r -= 2) {
      odstep(ctx, ls * r);
      const linie = zlam(ctx, tok, maxW, (a) => font(r, a));
      const h = linie.length * r * lh;
      if (h <= maxH && linie.every((l) => l.w <= maxW + 1)) return { linie, r, h, lh, ls };
    }
    odstep(ctx, ls * min);
    const linie = zlam(ctx, tok, maxW, (a) => font(min, a));
    return { linie, r: min, h: linie.length * min * lh, lh, ls };
  }
  function pisz(ctx, blok, x, y, { font, kolor, akcent, wyrownaj = "left", szer = 0 }) {
    const { linie, r, lh, ls } = blok;
    odstep(ctx, ls * r);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    linie.forEach((l, i) => {
      const by = y + r * 0.8 + i * r * lh;
      const dx = wyrownaj === "center" ? (szer - l.w) / 2 : 0;
      for (const e of l.el) {
        ctx.font = font(r, e.akc);
        ctx.fillStyle = e.akc ? akcent : kolor;
        ctx.fillText(e.t, x + dx + e.x, by);
      }
    });
    odstep(ctx, 0);
    return blok.h;
  }

  function etykieta(ctx, tekst, x, y, kolor, { r = 20, wyrownaj = "left", szer = 0 } = {}) {
    ctx.save();
    ctx.font = F.txt(r, 700);
    odstep(ctx, r * 0.24);
    const t = String(tekst).toLocaleUpperCase("pl");
    const w = ctx.measureText(t).width;
    ctx.fillStyle = kolor;
    ctx.textBaseline = "middle";
    ctx.fillText(t, wyrownaj === "center" ? x + (szer - w) / 2 : x, y + 1);
    ctx.restore();
    return w;
  }
  function kreska(ctx, x, y, kolor, dl = 64, gr = 3) {
    ctx.fillStyle = kolor;
    ctx.fillRect(x, y, dl, gr);
  }

  function slowa(t) {
    return String(t || "").replace(/\*/g, "").split(/\s+/).filter(Boolean).length;
  }

  // ---------- geometria ----------
  function wymiary(k) {
    const f = M.formaty[k.format] || M.formaty["3:4"];
    return { W: f.w, H: f.h };
  }
  function motywSlajdu(k, s) {
    return M.motywy[s.motyw || k.motyw] || M.motywy.papier;
  }

  // ---------- tło: światło, cień liści, łuki, nić (cache) ----------
  const tlaCache = new Map();
  function warstwaTla(k, i, W, H, m) {
    const n = k.slajdy.length;
    const klucz = [i, n, m.tlo, W, H, k.ciaglosc !== false, k.liscie !== false].join("|");
    if (tlaCache.has(klucz)) return tlaCache.get(klucz);
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    ctx.fillStyle = m.tlo;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(-i * W, 0);
    // miękkie światło padające z okna (płynnie przez całą panoramę)
    for (let j = -1; j <= n; j++) {
      const x = j * W + W * 0.35;
      const g = ctx.createRadialGradient(x, H * 0.25, 40, x, H * 0.3, W * 0.95);
      g.addColorStop(0, m.ciemny ? "rgba(139,69,85,0.38)" : "rgba(255,251,246,0.85)");
      g.addColorStop(1, "rgba(255,251,246,0)");
      ctx.fillStyle = g;
      ctx.fillRect(j * W - W, 0, W * 3, H);
    }
    // cień liści — rozmyte gałązki w panoramie. Rysowane w 1/8 rozdzielczości
    // i powiększane: miękkie jak rozmycie, a wielokrotnie szybsze.
    if (k.liscie !== false) {
      const sk = 8;
      const mc = document.createElement("canvas");
      mc.width = Math.ceil(W / sk);
      mc.height = Math.ceil(H / sk);
      const mx = mc.getContext("2d");
      mx.filter = "blur(3px)";
      mx.scale(1 / sk, 1 / sk);
      mx.translate(-i * W, 0);
      mx.fillStyle = m.ciemny ? "rgba(10,2,4,0.30)" : "rgba(53,16,24,0.075)";
      mx.strokeStyle = mx.fillStyle;
      for (let j = Math.max(0, i - 1); j <= Math.min(n, i + 1); j++) {
        const r = losowe(97 + j * 31);
        for (let g = 0; g < 2; g++) {
          const x0 = j * W + (g === 0 ? -60 + r() * 200 : W * 0.55 + r() * 280);
          const y0 = g === 0 ? -40 : -60 + r() * 120;
          galazka(mx, x0, y0, 0.9 + r() * 0.8, r);
        }
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(mc, 0, 0, W, H);
      ctx.restore();
    }
    // cienkie łuki na granicach slajdów (połowa na każdym slajdzie)
    ctx.strokeStyle = m.linia;
    ctx.lineWidth = 1.6;
    for (let g = 1; g < n; g++) {
      const gora = g % 2 === 1;
      const r = 300 + (g % 3) * 70;
      ctx.beginPath();
      ctx.arc(g * W, gora ? 120 : H - 300, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // nić łącząca slajdy
    if (k.ciaglosc !== false && n > 1) {
      const pts = punktyNici(n, W, H);
      ctx.strokeStyle = m.akcent;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2;
      sciezka(ctx, pts);
      ctx.stroke();
      ctx.globalAlpha = 1;
      for (let j = 0; j < n; j++) {
        const x = j * W + W * 0.5;
        const y = yNici(pts, x);
        ctx.fillStyle = j === i ? K.brudnyRoz : m.tlo;
        ctx.strokeStyle = m.akcent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, j === i ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();

    ctx.globalAlpha = m.ciemny ? 0.06 : 0.04;
    ctx.globalCompositeOperation = m.ciemny ? "screen" : "multiply";
    ctx.fillStyle = wzorZiarna(ctx);
    ctx.fillRect(0, 0, W, H);
    if (tlaCache.size > 80) tlaCache.clear();
    tlaCache.set(klucz, c);
    return c;
  }
  function galazka(ctx, x0, y0, skala, r) {
    const kat = 0.6 + r() * 0.9;
    const dl = 520 * skala;
    const x1 = x0 + Math.cos(kat) * dl;
    const y1 = y0 + Math.sin(kat) * dl;
    ctx.lineWidth = 6 * skala;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1);
    ctx.stroke();
    const liscie = 9;
    for (let l = 0; l < liscie; l++) {
      const t = 0.12 + (l / liscie) * 0.88;
      const lx = x0 + (x1 - x0) * t;
      const ly = y0 + (y1 - y0) * t;
      const strona = l % 2 ? 1 : -1;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(kat + strona * (0.9 + r() * 0.4));
      ctx.beginPath();
      ctx.ellipse(60 * skala, 0, 66 * skala, 22 * skala, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  function punktyNici(n, W, H) {
    const pts = [[-W / 2, H - 210]];
    for (let i = 0; i <= n * 2; i++) {
      pts.push([(i * W) / 2, H - 210 + Math.sin(i * 1.7 + 0.6) * 26 + Math.cos(i * 0.9) * 12]);
    }
    pts.push([n * W + W / 2, H - 210]);
    return pts;
  }
  function sciezka(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) {
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
    }
  }
  function yNici(pts, x) {
    for (let i = 0; i < pts.length - 1; i++) {
      if (x >= pts[i][0] && x <= pts[i + 1][0]) {
        const t = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
        return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
      }
    }
    return pts[pts.length - 1][1];
  }

  // ---------- nagłówek i stopka (jak na Twoich postach) ----------
  function naglowek(ctx, k, i, W, m, s) {
    const n = k.slajdy.length;
    const logo = logoWKolorze(m.tekst);
    const srodek = s.typ === "okladka" && ukladOkladki(s) === "tekst";
    if (logo) {
      const lw = srodek ? 400 : 300;
      const lh = (logo.height / logo.width) * lw;
      ctx.drawImage(logo, srodek ? (W - lw) / 2 : MARG - 14, srodek ? 120 : 64, lw, lh);
    }
    if (!srodek) {
      ctx.save();
      ctx.font = F.txt(21, 600);
      odstep(ctx, 3);
      ctx.fillStyle = m.tekst;
      ctx.globalAlpha = 0.8;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`${String(i + 1).padStart(2, "0")}/${String(n).padStart(2, "0")}`, W - MARG, 98);
      ctx.restore();
    }
  }

  function stopka(ctx, k, i, W, H, m) {
    const n = k.slajdy.length;
    const y = H - 92;
    const ostatni = i === n - 1;
    ctx.save();
    ctx.font = F.txt(17, 700);
    odstep(ctx, 3.5);
    ctx.fillStyle = m.tekst;
    ctx.globalAlpha = 0.75;
    ctx.textBaseline = "middle";
    const tekst = (ostatni ? M.instagram : k.stopka || "Sylwia Ida Różańska | Marketing Beauty").toLocaleUpperCase("pl");
    ctx.fillText(ostatni ? M.instagram : tekst, MARG, y + 1);
    const wt = ctx.measureText(ostatni ? M.instagram : tekst).width;
    // linia → kółko z numerem → strzałka
    const r = 34;
    const cx = W - MARG - (ostatni ? r : 76 + r);
    ctx.globalAlpha = 0.55;
    ctx.fillRect(MARG + wt + 28, y, cx - r - 16 - (MARG + wt + 28), 1.5);
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = m.tekst;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = F.nag(22, 400);
    odstep(ctx, 0);
    ctx.textAlign = "center";
    ctx.fillText(`${i + 1}/${n}`, cx, y + 2);
    ctx.restore();
    if (!ostatni) strzalka(ctx, cx + r + 18, y, 50, m.tekst);
  }
  function strzalka(ctx, x, y, dl, kolor, gr = 2) {
    ctx.save();
    ctx.strokeStyle = kolor;
    ctx.lineWidth = gr;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dl, y);
    ctx.moveTo(x + dl - 12, y - 10);
    ctx.lineTo(x + dl, y);
    ctx.lineTo(x + dl - 12, y + 10);
    ctx.stroke();
    ctx.restore();
  }

  // ---------- zdjęcia ----------
  function wpisz(ctx, img, x, y, w, h, ogniskoY = 0.3, ogniskoX = 0.5) {
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const iw = img.naturalWidth * s;
    const ih = img.naturalHeight * s;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, x + (w - iw) * ogniskoX, y + (h - ih) * ogniskoY, iw, ih);
    ctx.restore();
  }
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }
  // Zdjęcie z prawej, rozmyte w tło po lewej (jak „Masz leady, ale gdzie rezerwacje?”)
  function zdjecieBok(ctx, img, W, H, m, szer = 0.6) {
    const x = W * (1 - szer);
    ctx.save();
    wpisz(ctx, img, x, 0, W * szer, H, 0.25, 0.5);
    const g = ctx.createLinearGradient(x, 0, x + W * szer * 0.55, 0);
    g.addColorStop(0, rgba(m.tlo, 1));
    g.addColorStop(0.35, rgba(m.tlo, 0.75));
    g.addColorStop(1, rgba(m.tlo, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - 1, 0, W * szer * 0.55 + 1, H);
    const d = ctx.createLinearGradient(0, H * 0.78, 0, H);
    d.addColorStop(0, rgba(m.tlo, 0));
    d.addColorStop(1, rgba(m.tlo, 0.85));
    ctx.fillStyle = d;
    ctx.fillRect(x, H * 0.78, W * szer, H * 0.22);
    ctx.restore();
  }
  // Zdjęcie na całym slajdzie, tekst na dole (jak „Rabat nie uratuje słabej oferty”)
  function zdjecieTlo(ctx, img, W, H, m) {
    ctx.save();
    wpisz(ctx, img, 0, 0, W, H, 0.2, 0.5);
    ctx.fillStyle = rgba(m.tlo, 0.18);
    ctx.fillRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, H * 0.35, 0, H);
    g.addColorStop(0, rgba(m.tlo, 0));
    g.addColorStop(0.55, rgba(m.tlo, 0.82));
    g.addColorStop(1, rgba(m.tlo, 0.96));
    ctx.fillStyle = g;
    ctx.fillRect(0, H * 0.35, W, H * 0.65);
    const t = ctx.createLinearGradient(0, 0, 0, 260);
    t.addColorStop(0, rgba(m.tlo, 0.6));
    t.addColorStop(1, rgba(m.tlo, 0));
    ctx.fillStyle = t;
    ctx.fillRect(0, 0, W, 260);
    ctx.restore();
  }

  // ---------- układy slajdów ----------
  const UKLADY = {};
  const OBSZAR = (W, H) => ({ x: MARG, y: 210, w: W - 2 * MARG, dol: H - 170 });
  const ukladOkladki = (s) => s.uklad || (s.obraz ? "bok" : "tekst");
  const wersal = (s, domyslnie) => (s.wersaliki === undefined ? domyslnie : !!s.wersaliki);

  UKLADY.okladka = (ctx, s, c) => {
    const { W, H, m, o } = c;
    const img = s.obraz ? gotowy(s.obraz) : null;
    const uklad = img ? ukladOkladki(s) : "tekst";
    const caps = wersal(s, uklad !== "bok");

    if (uklad === "tekst") {
      // wyśrodkowana okładka tekstowa z logo na górze
      const sz = o.w - 40;
      const b = dopasuj(ctx, s.tytul, { maxW: sz, maxH: H * 0.42, start: caps ? 128 : 140, min: 56, lh: caps ? 1.0 : 0.98, font: fNag, ls: -0.02, wersaliki: caps });
      const pb = s.podtytul ? dopasuj(ctx, s.podtytul, { maxW: sz * 0.85, maxH: 230, start: 40, min: 28, lh: 1.35, font: fTresc }) : null;
      const et = s.etykieta ? 70 : 0;
      const calosc = et + b.h + (pb ? pb.h + 90 : 0);
      let y = Math.max(330, (H - calosc) / 2 + 10);
      if (s.etykieta) {
        etykieta(ctx, s.etykieta, o.x, y, m.akcent, { wyrownaj: "center", szer: o.w });
        y += et;
      }
      pisz(ctx, b, o.x + 20, y, { font: fNag, kolor: m.tekst, akcent: m.akcent, wyrownaj: "center", szer: sz });
      y += b.h + 40;
      if (pb) {
        kreska(ctx, W / 2 - 40, y, m.akcent, 80, 2);
        y += 44;
        ctx.globalAlpha = 0.9;
        pisz(ctx, pb, o.x + (o.w - sz * 0.85) / 2, y, { font: fTresc, kolor: m.tekst, akcent: m.akcent, wyrownaj: "center", szer: sz * 0.85 });
        ctx.globalAlpha = 1;
      }
      return;
    }
    if (uklad === "tlo") {
      zdjecieTlo(ctx, img, W, H, m);
      const pb = s.podtytul ? dopasuj(ctx, s.podtytul, { maxW: o.w * 0.78, maxH: 170, start: 36, min: 26, lh: 1.35, font: fTresc }) : null;
      const b = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: H * 0.33, start: caps ? 124 : 132, min: 56, lh: 0.98, font: fNag, ls: -0.02, wersaliki: caps });
      let y = o.dol - 40 - (pb ? pb.h + 70 : 0) - b.h;
      if (s.etykieta) etykieta(ctx, s.etykieta, o.x, y - 50, m.akcent);
      pisz(ctx, b, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
      y += b.h + 34;
      if (pb) {
        kreska(ctx, o.x, y, m.akcent, 64, 2);
        pisz(ctx, pb, o.x, y + 36, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
      }
      return;
    }
    // „bok”: zdjęcie po prawej, tekst po lewej
    zdjecieBok(ctx, img, W, H, m, 0.56);
    const sz = W * 0.5 - MARG;
    let y = o.y + 70;
    if (s.etykieta) {
      etykieta(ctx, s.etykieta, o.x, y, m.akcent);
      y += 60;
    }
    const b = dopasuj(ctx, s.tytul, { maxW: sz, maxH: H * 0.48, start: caps ? 112 : 124, min: 52, lh: 0.97, font: fNag, ls: -0.025, wersaliki: caps });
    pisz(ctx, b, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
    y += b.h + 40;
    if (s.podtytul) {
      kreska(ctx, o.x, y, m.akcent, 64, 2);
      y += 40;
      const pb = dopasuj(ctx, s.podtytul, { maxW: sz * 0.85, maxH: o.dol - y - 60, start: 36, min: 24, lh: 1.35, font: fTresc });
      pisz(ctx, pb, o.x, y, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
    }
  };

  UKLADY.teza = (ctx, s, c) => {
    const { m, o } = c;
    const caps = wersal(s, false);
    const srodek = s.wyrownanie === "srodek";
    const b = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: (o.dol - o.y) * 0.55, start: 112, min: 52, lh: 1.0, font: fNag, ls: -0.02, wersaliki: caps });
    const tb = s.tekst ? dopasuj(ctx, s.tekst, { maxW: o.w * 0.86, maxH: 300, start: 40, min: 26, lh: 1.4, font: fTresc }) : null;
    const total = b.h + (tb ? tb.h + 90 : 0) + (s.etykieta ? 70 : 0);
    let y = o.y + Math.max(40, (o.dol - o.y - total) / 2 - 20);
    const al = srodek ? "center" : "left";
    if (s.etykieta) {
      etykieta(ctx, s.etykieta, o.x, y, m.akcent, { wyrownaj: al, szer: o.w });
      y += 70;
    }
    pisz(ctx, b, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent, wyrownaj: al, szer: o.w });
    y += b.h + 44;
    if (tb) {
      kreska(ctx, srodek ? o.x + o.w / 2 - 32 : o.x, y, m.akcent, 64, 2);
      y += 44;
      ctx.globalAlpha = 0.9;
      pisz(ctx, tb, srodek ? o.x + o.w * 0.07 : o.x, y, { font: fTresc, kolor: m.tekst, akcent: m.akcent, wyrownaj: al, szer: o.w * 0.86 });
      ctx.globalAlpha = 1;
    }
  };

  UKLADY.punkt = (ctx, s, c) => {
    const { W, m, o } = c;
    const nr = String(s._nr || 1).padStart(2, "0");
    let y = o.y + 40;
    // numer w kółku, jak „1/9” w stopce
    ctx.save();
    ctx.strokeStyle = m.akcent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(o.x + 62, y + 62, 62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = F.nag(58, 400, true);
    ctx.fillStyle = m.akcent;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nr, o.x + 62, y + 66);
    ctx.restore();
    etykieta(ctx, `${s.etykieta || "Punkt"} ${s._nr || 1} z ${s._z || 1}`, o.x + 160, y + 62, m.tekst);
    y += 210;
    const b = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: 420, start: 96, min: 50, lh: 1.02, font: fNag, ls: -0.02, wersaliki: wersal(s, false) });
    pisz(ctx, b, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
    y += b.h + 44;
    if (s.tekst) {
      kreska(ctx, o.x, y, m.akcent, 64, 2);
      y += 44;
      const tb = dopasuj(ctx, s.tekst, { maxW: o.w * 0.92, maxH: o.dol - y - 90, start: 40, min: 26, lh: 1.4, font: fTresc });
      ctx.globalAlpha = 0.9;
      pisz(ctx, tb, o.x, y, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
      ctx.globalAlpha = 1;
    }
  };

  UKLADY.mitfakt = (ctx, s, c) => {
    const { W, m, o } = c;
    const pol = o.y + (o.dol - o.y - 80) * 0.46;
    let y = o.y + 50;
    pigulka(ctx, "Mit", o.x, y, m, false);
    y += 64;
    const mb = dopasuj(ctx, s.mit, { maxW: o.w, maxH: pol - y - 40, start: 64, min: 34, lh: 1.15, font: fTresc });
    ctx.globalAlpha = 0.6;
    pisz(ctx, mb, o.x, y, { font: fTresc, kolor: m.tekst, akcent: m.tekst });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = m.akcent;
    ctx.lineWidth = 3;
    mb.linie.forEach((l, i) => {
      const ly = y + mb.r * 0.52 + i * mb.r * mb.lh;
      ctx.beginPath();
      ctx.moveTo(o.x - 6, ly + 2);
      ctx.lineTo(o.x + l.w + 6, ly - 3);
      ctx.stroke();
    });
    ctx.fillStyle = m.linia;
    ctx.fillRect(o.x, pol, W - 2 * MARG, 1.5);
    y = pol + 60;
    pigulka(ctx, "Fakt", o.x, y, m, true);
    y += 64;
    const fb = dopasuj(ctx, s.fakt, { maxW: o.w, maxH: o.dol - y - 90, start: 80, min: 38, lh: 1.04, font: fNag, ls: -0.02 });
    pisz(ctx, fb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
  };
  function pigulka(ctx, tekst, x, y, m, pelna) {
    ctx.save();
    ctx.font = F.txt(20, 800);
    odstep(ctx, 5);
    const t = tekst.toLocaleUpperCase("pl");
    const w = ctx.measureText(t).width + 40;
    const h = 44;
    if (pelna) {
      ctx.fillStyle = m.ciemny ? K.puder : K.bordo;
      ctx.fillRect(x, y - h / 2, w, h);
      ctx.fillStyle = m.ciemny ? K.wino : K.krem;
    } else {
      ctx.strokeStyle = m.tekst;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(x + 1, y - h / 2 + 1, w - 2, h - 2);
      ctx.fillStyle = m.tekst;
    }
    ctx.textBaseline = "middle";
    ctx.fillText(t, x + 20, y + 2);
    ctx.restore();
    return w;
  }

  UKLADY.przedpo = (ctx, s, c) => {
    const { W, m, o } = c;
    let y = o.y + 30;
    if (s.tytul) {
      const tb = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: 190, start: 72, min: 42, lh: 1.02, font: fNag, ls: -0.02 });
      pisz(ctx, tb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
      y += tb.h + 46;
    }
    const wys = (o.dol - 80 - y - 50) / 2;
    karta(ctx, s.etykietaPrzed || "Zamiast", s.przed, o.x, y, W - 2 * MARG - 16, wys, m, false);
    karta(ctx, s.etykietaPo || "Napisz tak", s.po, o.x, y + wys + 50, W - 2 * MARG - 16, wys, m, true);
  };
  function karta(ctx, et, tekst, x, y, w, h, m, dobra) {
    ctx.save();
    if (dobra) {
      ctx.fillStyle = m.ciemny ? K.roza : K.puder;
      ctx.fillRect(x + 14, y + 14, w, h);
      ctx.fillStyle = K.krem;
      ctx.fillRect(x, y, w, h);
    } else {
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = m.tekst;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
    const kol = dobra ? K.wino : m.tekst;
    etykieta(ctx, et, x + 40, y + 50, dobra ? K.roza : m.tekst);
    ctx.strokeStyle = dobra ? K.roza : m.tekst;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (dobra) {
      ctx.moveTo(x + w - 84, y + 50);
      ctx.lineTo(x + w - 70, y + 64);
      ctx.lineTo(x + w - 44, y + 34);
    } else {
      ctx.globalAlpha = 0.6;
      ctx.moveTo(x + w - 78, y + 36);
      ctx.lineTo(x + w - 50, y + 64);
      ctx.moveTo(x + w - 50, y + 36);
      ctx.lineTo(x + w - 78, y + 64);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    const tb = dopasuj(ctx, tekst, { maxW: w - 80, maxH: h - 120, start: 42, min: 24, lh: 1.38, font: fTresc });
    ctx.globalAlpha = dobra ? 1 : 0.72;
    pisz(ctx, tb, x + 40, y + 94, { font: fTresc, kolor: kol, akcent: K.roza });
    ctx.restore();
  }

  UKLADY.wiadomosc = (ctx, s, c) => {
    const { W, m, o } = c;
    let y = o.y + 30;
    etykieta(ctx, s.etykieta || "Gotowa wiadomość", o.x, y, m.akcent);
    y += 56;
    if (s.tytul) {
      const tb = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: 220, start: 76, min: 42, lh: 1.02, font: fNag, ls: -0.02 });
      pisz(ctx, tb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
      y += tb.h + 50;
    }
    const w = W - 2 * MARG - 24;
    const tb = dopasuj(ctx, s.tekst, { maxW: w - 100, maxH: o.dol - 80 - y - 160, start: 40, min: 24, lh: 1.42, font: fTresc });
    const h = tb.h + 150;
    ctx.fillStyle = m.ciemny ? K.roza : K.puder;
    ctx.fillRect(o.x + 16, y + 16, w, h);
    ctx.fillStyle = K.krem;
    ctx.fillRect(o.x, y, w, h);
    ctx.beginPath();
    ctx.moveTo(o.x + 60, y + h - 1);
    ctx.lineTo(o.x + 60, y + h + 38);
    ctx.lineTo(o.x + 108, y + h - 1);
    ctx.fill();
    pisz(ctx, tb, o.x + 50, y + 52, { font: fTresc, kolor: K.atrament, akcent: K.roza });
    kreska(ctx, o.x + 50, y + h - 60, K.roza, 40, 2);
    etykieta(ctx, s.podpis || "Zapisz i użyj u siebie", o.x + 106, y + h - 59, K.roza, { r: 18 });
  };

  UKLADY.lista = (ctx, s, c) => {
    const { W, m, o } = c;
    let y = o.y + 30;
    const tb = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: 280, start: 92, min: 46, lh: 1.02, font: fNag, ls: -0.02, wersaliki: wersal(s, false) });
    pisz(ctx, tb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
    y += tb.h + 50;
    const poz = (s.pozycje || []).filter(Boolean);
    const krok = Math.min(150, (o.dol - 90 - y) / Math.max(1, poz.length));
    poz.forEach((p, i) => {
      const py = y + i * krok;
      ctx.fillStyle = m.linia;
      ctx.fillRect(o.x, py, W - 2 * MARG, 1.5);
      ctx.strokeStyle = m.akcent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(o.x + 22, py + 50, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(o.x + 12, py + 51);
      ctx.lineTo(o.x + 20, py + 59);
      ctx.lineTo(o.x + 33, py + 42);
      ctx.stroke();
      const pb = dopasuj(ctx, p, { maxW: o.w - 80, maxH: krok - 34, start: 38, min: 22, lh: 1.28, font: fTresc });
      pisz(ctx, pb, o.x + 74, py + 28, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
    });
  };

  UKLADY.liczba = (ctx, s, c) => {
    const { W, m, o } = c;
    let y = o.y + 30;
    if (s.etykieta) {
      etykieta(ctx, s.etykieta, o.x, y, m.akcent);
      y += 40;
    }
    const fL = (r, a) => F.nag(r, a ? 400 : 700, a);
    const lb = dopasuj(ctx, s.liczba, { maxW: o.w, maxH: 380, start: 300, min: 110, lh: 0.95, font: fL, ls: -0.03 });
    pisz(ctx, lb, o.x - 6, y, { font: fL, kolor: m.akcent, akcent: m.tekst });
    y += lb.h + 30;
    ctx.fillStyle = m.linia;
    ctx.fillRect(o.x, y, W - 2 * MARG, 1.5);
    y += 50;
    const tb = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: 240, start: 72, min: 40, lh: 1.04, font: fNag, ls: -0.02 });
    pisz(ctx, tb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
    y += tb.h + 34;
    if (s.tekst) {
      const pb = dopasuj(ctx, s.tekst, { maxW: o.w * 0.9, maxH: o.dol - 90 - y, start: 38, min: 24, lh: 1.4, font: fTresc });
      ctx.globalAlpha = 0.9;
      pisz(ctx, pb, o.x, y, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
      ctx.globalAlpha = 1;
    }
  };

  UKLADY.cytat = (ctx, s, c) => {
    const { m, o } = c;
    const srodek = s.wyrownanie !== "lewo";
    const al = srodek ? "center" : "left";
    const fC = (r, a) => F.nag(r, a ? 700 : 400, !a);
    const b = dopasuj(ctx, s.tekst, { maxW: o.w - 40, maxH: (o.dol - o.y) * 0.55, start: 84, min: 42, lh: 1.12, font: fC, ls: -0.01 });
    let y = o.y + Math.max(60, (o.dol - o.y - b.h - 260) / 2);
    ctx.save();
    ctx.font = F.nag(220, 700);
    ctx.fillStyle = m.akcent;
    ctx.textAlign = srodek ? "center" : "left";
    ctx.fillText("“", srodek ? o.x + o.w / 2 : o.x - 10, y + 170);
    ctx.restore();
    y += 180;
    pisz(ctx, b, o.x + 20, y, { font: fC, kolor: m.tekst, akcent: m.akcent, wyrownaj: al, szer: o.w - 40 });
    y += b.h + 50;
    kreska(ctx, srodek ? o.x + o.w / 2 - 32 : o.x + 20, y, m.akcent, 64, 2);
    etykieta(ctx, s.autor || M.nazwa, o.x + 20, y + 50, m.tekst, { wyrownaj: al, szer: o.w - 40 });
  };

  // Opinia klientki — tekst po lewej, opcjonalnie zdjęcie po prawej
  UKLADY.opinia = (ctx, s, c) => {
    const { W, H, m, o } = c;
    const img = s.obraz ? gotowy(s.obraz) : null;
    if (img) zdjecieBok(ctx, img, W, H, m, 0.5);
    const sz = img ? W * 0.52 - MARG : o.w;
    let y = o.y + 40;
    etykieta(ctx, s.etykieta || "Opinia klientki", o.x, y, m.akcent);
    y += 40;
    ctx.font = F.nag(200, 700);
    ctx.fillStyle = m.akcent;
    ctx.fillText("“", o.x - 8, y + 150);
    y += 150;
    const b = dopasuj(ctx, s.tekst, { maxW: sz, maxH: o.dol - y - 250, start: 50, min: 28, lh: 1.32, font: (r, a) => F.nag(r, 400, a) });
    pisz(ctx, b, o.x, y, { font: (r, a) => F.nag(r, 400, a), kolor: m.tekst, akcent: m.akcent });
    y += b.h + 40;
    ctx.save();
    ctx.font = F.nag(44, 400);
    ctx.fillStyle = m.akcent;
    ctx.fillText("♡", o.x, y + 30);
    ctx.restore();
    if (s.autor) etykieta(ctx, s.autor, o.x, y + 90, m.tekst);
  };

  UKLADY.zdjecie = (ctx, s, c) => {
    const { W, H, m, o } = c;
    const img = s.obraz ? gotowy(s.obraz) : null;
    const hz = H * 0.6;
    if (img) {
      ctx.save();
      wpisz(ctx, img, 0, 0, W, hz, 0.25);
      const g = ctx.createLinearGradient(0, hz * 0.55, 0, hz);
      g.addColorStop(0, rgba(m.tlo, 0));
      g.addColorStop(1, rgba(m.tlo, 1));
      ctx.fillStyle = g;
      ctx.fillRect(0, hz * 0.55, W, hz * 0.45 + 1);
      const t = ctx.createLinearGradient(0, 0, 0, 240);
      t.addColorStop(0, rgba(m.tlo, 0.55));
      t.addColorStop(1, rgba(m.tlo, 0));
      ctx.fillStyle = t;
      ctx.fillRect(0, 0, W, 240);
      ctx.restore();
    }
    let y = hz - 30;
    if (s.tytul) {
      const tb = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: 220, start: 88, min: 44, lh: 1.02, font: fNag, ls: -0.02 });
      pisz(ctx, tb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
      y += tb.h + 34;
    }
    if (s.podpis) {
      kreska(ctx, o.x, y, m.akcent, 64, 2);
      y += 40;
      const pb = dopasuj(ctx, s.podpis, { maxW: o.w * 0.92, maxH: o.dol - 90 - y, start: 38, min: 24, lh: 1.38, font: fTresc });
      pisz(ctx, pb, o.x, y, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
    }
  };

  UKLADY.sciaga = (ctx, s, c, k) => {
    const { W, m, o } = c;
    let poz = (s.pozycje || []).filter(Boolean);
    if (!poz.length) poz = k.slajdy.filter((x) => x.typ === "punkt").map((x) => x.tytul);
    let y = o.y + 30;
    etykieta(ctx, s.etykieta || "Zapisz na później", o.x, y, m.akcent);
    y += 56;
    const tb = dopasuj(ctx, s.tytul || "Ściąga", { maxW: o.w, maxH: 200, start: 88, min: 44, lh: 1.02, font: fNag, ls: -0.02, wersaliki: wersal(s, false) });
    pisz(ctx, tb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
    y += tb.h + 40;
    const krok = Math.min(140, (o.dol - 90 - y) / Math.max(1, poz.length));
    poz.forEach((p, i) => {
      const py = y + i * krok;
      ctx.fillStyle = m.linia;
      ctx.fillRect(o.x, py, W - 2 * MARG, 1.5);
      ctx.font = F.nag(50, 400, true);
      ctx.fillStyle = m.akcent;
      ctx.textAlign = "left";
      ctx.fillText(String(i + 1).padStart(2, "0"), o.x, py + 66);
      const pb = dopasuj(ctx, p, { maxW: o.w - 110, maxH: krok - 30, start: 38, min: 22, lh: 1.25, font: fTresc });
      pisz(ctx, pb, o.x + 100, py + 26, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
    });
  };

  UKLADY.cta = (ctx, s, c) => {
    const { W, H, m, o } = c;
    let y = o.y + 40;
    if (s.portret !== false) {
      const d = 230;
      const img = gotowy(Z.portret);
      ctx.save();
      ctx.strokeStyle = m.akcent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(o.x + d / 2, y + d / 2, d / 2 + 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(o.x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2);
      ctx.clip();
      if (img) wpisz(ctx, img, o.x, y, d, d, 0.18, 0.5);
      ctx.restore();
      y += d + 70;
    }
    const tb = dopasuj(ctx, s.tytul, { maxW: o.w, maxH: 300, start: 100, min: 48, lh: 1.0, font: fNag, ls: -0.02, wersaliki: wersal(s, false) });
    pisz(ctx, tb, o.x, y, { font: fNag, kolor: m.tekst, akcent: m.akcent });
    y += tb.h + 50;
    if (s.slowo || s.przycisk) {
      const tekst = s.slowo ? `Napisz „${s.slowo}” w komentarzu` : s.przycisk;
      ctx.font = F.txt(30, 700);
      odstep(ctx, 0.5);
      const w = Math.min(o.w, ctx.measureText(tekst).width + 150);
      const h = 96;
      ctx.fillStyle = m.ciemny ? K.puder : K.bordo;
      ctx.fillRect(o.x, y, w, h);
      ctx.fillStyle = m.ciemny ? K.wino : K.krem;
      ctx.textBaseline = "middle";
      ctx.fillText(tekst, o.x + 44, y + h / 2 + 2);
      odstep(ctx, 0);
      strzalka(ctx, o.x + w - 84, y + h / 2, 42, m.ciemny ? K.wino : K.krem, 2.5);
      y += h + 46;
    }
    if (s.tekst) {
      const pb = dopasuj(ctx, s.tekst, { maxW: o.w * 0.9, maxH: 170, start: 36, min: 24, lh: 1.4, font: fTresc });
      ctx.globalAlpha = 0.9;
      pisz(ctx, pb, o.x, y, { font: fTresc, kolor: m.tekst, akcent: m.akcent });
      ctx.globalAlpha = 1;
      y += pb.h + 34;
    }
    if (s.wyslij) {
      const fW = (r) => F.nag(r, 400, true);
      const pb = dopasuj(ctx, s.wyslij, { maxW: o.w * 0.9, maxH: 120, start: 36, min: 24, lh: 1.3, font: fW });
      pisz(ctx, pb, o.x, y, { font: fW, kolor: m.akcent, akcent: m.akcent });
    }
  };

  // ---------- API ----------
  function numeruj(k) {
    const punkty = k.slajdy.filter((s) => s.typ === "punkt");
    punkty.forEach((s, i) => {
      s._nr = i + 1;
      s._z = punkty.length;
    });
  }

  function rysuj(ctx, k, i, skala = 1) {
    const { W, H } = wymiary(k);
    numeruj(k);
    const s = k.slajdy[i];
    const m = motywSlajdu(k, s);
    ctx.save();
    ctx.setTransform(skala, 0, 0, skala, 0, 0);
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.clip();
    ctx.drawImage(warstwaTla(k, i, W, H, m), 0, 0);
    ctx.save();
    (UKLADY[s.typ] || UKLADY.teza)(ctx, s, { W, H, m, o: OBSZAR(W, H) }, k);
    ctx.restore();
    naglowek(ctx, k, i, W, m, s);
    stopka(ctx, k, i, W, H, m);
    ctx.restore();
  }

  function plotno(k, i, skala = 1, cel) {
    const { W, H } = wymiary(k);
    const c = cel || document.createElement("canvas");
    c.width = Math.round(W * skala);
    c.height = Math.round(H * skala);
    rysuj(c.getContext("2d"), k, i, skala);
    return c;
  }

  // Uwagi redakcyjne zgodne z trendami 2026
  function uwagi(k) {
    const u = [];
    const n = k.slajdy.length;
    if (n < 5) u.push("Mniej niż 5 slajdów: krótkie karuzele zwykle słabiej przytrzymują uwagę. Celuj w 7–10.");
    if (n > 20) u.push("Instagram przyjmie maksymalnie 20 slajdów.");
    if (k.slajdy[0] && k.slajdy[0].typ !== "okladka") u.push("Pierwszy slajd powinien być okładką z hakiem.");
    if (k.slajdy[1] && k.slajdy[1].typ === "zdjecie") u.push("Slajd 2 od razu dowozi wartość — zacznij od tezy, a zdjęcie przesuń dalej.");
    if (k.slajdy[n - 1] && k.slajdy[n - 1].typ !== "cta") u.push("Ostatni slajd: daj jasne CTA (słowo w komentarzu, zapis, wysyłka).");
    if (!k.slajdy.some((s) => ["sciaga", "lista", "wiadomosc"].includes(s.typ)))
      u.push("Dodaj slajd do zapisania (ściąga, checklista, gotowa wiadomość). Zapisy i udostępnienia napędzają zasięg.");
    if (k.slajdy[0] && !k.slajdy[0].obraz)
      u.push("Na Twojej siatce najlepiej działają okładki z Twoim zdjęciem. Rozważ zdjęcie na okładce.");
    k.slajdy.forEach((s, i) => {
      const w = ["tytul", "tekst", "podtytul", "mit", "fakt", "przed", "po"].reduce((a, p) => a + slowa(s[p]), 0) + (s.pozycje || []).reduce((a, p) => a + slowa(p), 0);
      const lim = ["wiadomosc", "przedpo", "lista", "sciaga", "opinia"].includes(s.typ) ? 70 : 32;
      if (w > lim) u.push(`Slajd ${i + 1}: ${w} słów. Jedna myśl na slajd — skróć albo podziel na dwa.`);
    });
    return u;
  }

  root.Silnik = { rysuj, plotno, przygotuj, wymiary, uwagi, slowa, UKLADY: Object.keys(UKLADY) };
})(typeof window !== "undefined" ? window : globalThis);
