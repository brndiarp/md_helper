# Manuální testovací scénáře — MD Helper

Seznam manuálních test cases pro ověření funkčnosti MD Helper.
Každý test case obsahuje: ID, název, předpoklady, kroky a očekávaný výsledek.

---

## 1. Editor — Formátování textu

### TC-001: Živý náhled Markdownu
- **Předpoklady:** Aplikace je otevřená ve výchozím stavu.
- **Kroky:**
  1. Do editoru napiš `Vítej v MD Helper`.
  2. Smaž obsah a napiš `**tučný text**`.
- **Očekávaný výsledek:** V náhledu se okamžitě zobrazí text „Vítej v MD Helper“, poté tučný text „tučný text“.

### TC-002: Vložení nadpisu H1 — tlačítkem
- **Předpoklady:** Editor obsahuje text „Nadpis“.
- **Kroky:**
  1. Označ text „Nadpis“.
  2. Klikni na tlačítko **H1** v toolbaru.
- **Očekávaný výsledek:** V editoru je `# Nadpis`, v náhledu se zobrazí jako `<h1>`.

### TC-003: Vložení nadpisu H2 a H3 — klávesovou zkratkou
- **Předpoklady:** Editor obsahuje text „Podnadpis“.
- **Kroky:**
  1. Stiskni `Ctrl+2`.
  2. Stiskni `Ctrl+3`.
- **Očekávaný výsledek:** Text se změní nejprve na `## Podnadpis`, pak na `### Podnadpis`.

### TC-004: Tučný text — Ctrl+B
- **Předpoklady:** Editor obsahuje text „důležité“.
- **Kroky:**
  1. Označ text „důležité“.
  2. Stiskni `Ctrl+B`.
- **Očekávaný výsledek:** V editoru je `**důležité**`.

### TC-005: Kurzíva — Ctrl+I
- **Předpoklady:** Editor obsahuje text „kurzíva“.
- **Kroky:**
  1. Označ text „kurzíva“.
  2. Stiskni `Ctrl+I`.
- **Očekávaný výsledek:** V editoru je `_kurzíva_`.

### TC-006: Odkaz — Ctrl+K
- **Předpoklady:** Editor je zaměřený.
- **Kroky:**
  1. Stiskni `Ctrl+K`.
- **Očekávaný výsledek:** Do editoru se vloží `[text odkazu](https://)`.

### TC-007: Odrážkový seznam
- **Předpoklady:** Editor je zaměřený a prázdný.
- **Kroky:**
  1. Klikni na tlačítko **• List**.
  2. Napiš `Položka A`.
- **Očekávaný výsledek:** V editoru je `- Položka A`, v náhledu se zobrazí jako odrážka.

### TC-008: Číslovaný seznam
- **Předpoklady:** Editor je zaměřený a prázdný.
- **Kroky:**
  1. Klikni na tlačítko **1. List**.
  2. Napiš `Krok 1`.
- **Očekávaný výsledek:** V editoru je `1. Krok 1`.

### TC-009: Checklist
- **Předpoklady:** Editor je zaměřený a prázdný.
- **Kroky:**
  1. Klikni na tlačítko **☐ Check**.
- **Očekávaný výsledek:** V editoru se vloží checklist s nezaškrtnutou a zaškrtnutou položkou. V náhledu jsou 2 checkboxy.

### TC-010: Inline kód
- **Předpoklady:** Editor obsahuje text „npm install“.
- **Kroky:**
  1. Označ text „npm install“.
  2. Klikni na tlačítko `` `kód` ``.
- **Očekávaný výsledek:** V editoru je `` `npm install` ``.

### TC-011: Blok kódu
- **Předpoklady:** Editor je zaměřený a prázdný.
- **Kroky:**
  1. Klikni na tlačítko **« »**.
  2. Napiš `console.log("test");`.
- **Očekávaný výsledek:** V náhledu se zobrazí blok kódu s textem `console.log`.

### TC-012: Tabulka
- **Předpoklady:** Editor je zaměřený a prázdný.
- **Kroky:**
  1. Klikni na tlačítko **☰ Table**.
- **Očekávaný výsledek:** V náhledu se zobrazí tabulka se 3 sloupci.

---

## 2. Find & Replace

### TC-013: Otevření dialogu — Ctrl+F
- **Předpoklady:** Editor je zaměřený.
- **Kroky:**
  1. Stiskni `Ctrl+F`.
- **Očekávaný výsledek:** Objeví se dialog Find & Replace v pravém horním rohu.

### TC-014: Otevření dialogu — Ctrl+H
- **Předpoklady:** Editor je zaměřený.
- **Kroky:**
  1. Stiskni `Ctrl+H`.
- **Očekávaný výsledek:** Dialog se otevře a pole „Nahradit za…“ je zaměřené.

### TC-015: Nalezení dalšího výskytu
- **Předpoklady:** Editor obsahuje text „Markdown je skvělý. Markdown je jednoduchý.“ Dialog je otevřený.
- **Kroky:**
  1. Do pole „Hledat…“ napiš `Markdown`.
  2. Klikni na **Najít další**.
- **Očekávaný výsledek:** Počítadlo zobrazí `2 / 2`.

### TC-016: Nahrazení jednoho výskytu
- **Předpoklady:** Editor obsahuje text „Markdown je skvělý. Markdown je jednoduchý.“ Dialog je otevřený, hledaný text je „Markdown“.
- **Kroky:**
  1. Do pole „Nahradit za…“ napiš `Editor`.
  2. Klikni na **Nahradit**.
- **Očekávaný výsledek:** První výskyt se změní na „Editor je skvělý“, druhý zůstane „Markdown je jednoduchý“.

### TC-017: Nahrazení všech výskytů
- **Předpoklady:** Editor obsahuje text „test test test“. Dialog je otevřený.
- **Kroky:**
  1. Do pole „Hledat…“ napiš `test`.
  2. Do pole „Nahradit za…“ napiš `produkce`.
  3. Klikni na **Nahradit vše**.
- **Očekávaný výsledek:** Text v editoru je „produkce produkce produkce“. Zobrazí se toast „Nahrazeno 3 výskytů“.

### TC-018: Zobrazení počítadla — 0 výskytů
- **Předpoklady:** Dialog je otevřený.
- **Kroky:**
  1. Do pole „Hledat…“ napiš `xyz12345`.
- **Očekávaný výsledek:** Počítadlo zobrazí `0 / 0`.

---

## 3. Undo / Redo

### TC-019: Undo — Ctrl+Z
- **Předpoklady:** Editor obsahuje původní výchozí text.
- **Kroky:**
  1. Smaž výchozí text a napiš `Nový text`.
  2. Počkej ~2 sekundy (auto-save).
  3. Stiskni `Ctrl+Z`.
- **Očekávaný výsledek:** Editor vrátí původní výchozí text.

### TC-020: Redo — Ctrl+Y
- **Předpoklady:** Proveden Undo (TC-019).
- **Kroky:**
  1. Stiskni `Ctrl+Y`.
- **Očekávaný výsledek:** Editor znovu zobrazí „Nový text“.

### TC-021: Redo — Ctrl+Shift+Z
- **Předpoklady:** Proveden Undo (TC-019).
- **Kroky:**
  1. Stiskni `Ctrl+Shift+Z`.
- **Očekávaný výsledek:** Editor znovu zobrazí „Nový text“.

---

## 4. Zobrazení (View Modes)

### TC-022: Split režim — výchozí
- **Předpoklady:** Aplikace je otevřená.
- **Kroky:**
  1. Ověř viditelnost editoru a náhledu.
- **Očekávaný výsledek:** Editor i náhled jsou viditelné vedle sebe (na desktopu).

### TC-023: Editor only režim
- **Předpoklady:** Aplikace je ve split režimu.
- **Kroky:**
  1. Klikni na tlačítko **✎ Edit** v headeru.
- **Očekávaný výsledek:** Náhled zmizí, editor zabere celou šířku.

### TC-024: Preview only režim
- **Předpoklady:** Aplikace je ve split režimu.
- **Kroky:**
  1. Klikni na tlačítko **👁 View** v headeru.
- **Očekávaný výsledek:** Editor zmizí, náhled zabere celou šířku.

### TC-025: Perzistence režimu po obnovení
- **Předpoklady:** Aplikace je v „Editor only“ režimu.
- **Kroky:**
  1. Obnov stránku (F5).
- **Očekávaný výsledek:** Režim „Editor only“ zůstane zachován.

### TC-026: Resizable divider
- **Předpoklady:** Aplikace je ve split režimu, okno širší než 1024 px.
- **Kroky:**
  1. Přetáhni vertikální divider mezi editorem a náhledem doprava.
- **Očekávaný výsledek:** Šířka editoru se zvětší, šířka náhledu se zmenší. Po obnovení stránky se poměr zachová.

---

## 5. Ukládání a export

### TC-027: Auto-save do localStorage
- **Předpoklady:** Aplikace je otevřená.
- **Kroky:**
  1. Smaž výchozí obsah a napiš `Moje poznámky`.
  2. Počkej ~2 sekundy.
- **Očekávaný výsledek:** (DevTools → Application → Local Storage) Hodnota `md-helper-content` obsahuje „Moje poznámky“.

### TC-028: Načtení z localStorage po obnovení
- **Předpoklady:** Proveden TC-027.
- **Kroky:**
  1. Obnov stránku (F5).
- **Očekávaný výsledek:** Editor obsahuje „Moje poznámky“.

### TC-029: Kopírovat do schránky
- **Předpoklady:** Editor obsahuje text.
- **Kroky:**
  1. Klikni na tlačítko **Kopírovat** v pravém toolbaru.
- **Očekávaný výsledek:** Zobrazí se zelený toast „Markdown zkopírován do schránky“. Text je v clipboardu.

### TC-030: Stáhnout .md soubor
- **Předpoklady:** Editor obsahuje text.
- **Kroky:**
  1. Klikni na tlačítko **Stáhnout**.
- **Očekávaný výsledek:** Prohlížeč stáhne soubor `note.md`.

### TC-031: Export HTML souboru
- **Předpoklady:** Editor obsahuje text.
- **Kroky:**
  1. Klikni na tlačítko **HTML**.
- **Očekávaný výsledek:** Prohlížeč stáhne soubor `note.html` s kompletním HTML obsahem.

### TC-032: Název souboru — perzistence
- **Předpoklady:** Aplikace je otevřená.
- **Kroky:**
  1. Do pole „Soubor“ napiš `muj-soubor`.
  2. Obnov stránku (F5).
- **Očekávaný výsledek:** Pole „Soubor“ obsahuje `muj-soubor`.

### TC-033: Ochrana před zavřením — beforeunload
- **Předpoklady:** Editor byl upraven (obsahuje jiný text než výchozí).
- **Kroky:**
  1. Zkus zavřít/znovu načíst záložku.
- **Očekávaný výsledek:** Prohlížeč zobrazí varovný dialog „Opravdu chceš opustit stránku?“.

---

## 6. Drag & Drop

### TC-034: Načtení .md souboru
- **Předpoklady:** Máš připravený soubor `test.md` s obsahem `# Test`.
- **Kroky:**
  1. Přetáhni soubor `test.md` do okna prohlížeče.
  2. Pusť tlačítko myši.
- **Očekávaný výsledek:** Editor načte obsah souboru `# Test`. Zobrazí se toast „Soubor test.md načten“.

### TC-035: Vložení obrázku — base64
- **Předpoklady:** Máš připravený malý obrázek (např. PNG < 1 MB).
- **Kroky:**
  1. Přetáhni obrázek do okna prohlížeče.
- **Očekávaný výsledek:** Do editoru se vloží `![název](data:image/png;base64,...)`. Zobrazí se toast „Obrázek ... vložen“.

### TC-036: Odmítnutí nepodporovaného souboru
- **Předpoklady:** Máš připravený soubor `test.pdf`.
- **Kroky:**
  1. Přetáhni PDF do okna prohlížeče.
- **Očekávaný výsledek:** Zobrazí se červený toast „Podporované formáty: .md, .png, ...“.

---

## 7. Toast notifikace

### TC-037: Success toast
- **Předpoklady:** Editor obsahuje text.
- **Kroky:**
  1. Klikni na **Kopírovat**.
- **Očekávaný výsledek:** Zobrazí se zelený toast s ikonou ✓.

### TC-038: Error toast
- **Předpoklady:** —
- **Kroky:**
  1. Přetáhni nepodporovaný soubor (např. `.pdf`).
- **Očekávaný výsledek:** Zobrazí se červený toast s ikonou ✗.

### TC-039: Toast zmizí po 3 sekundách
- **Předpoklady:** —
- **Kroky:**
  1. Vyvoľ jakýkoliv toast (např. Kopírovat).
  2. Počkej ~3,5 sekundy.
- **Očekávaný výsledek:** Toast zmizí.

### TC-040: Limit 5 toastů
- **Předpoklady:** —
- **Kroky:**
  1. Rychle 6× klikni na **Kopírovat** (s pauzou ~0,5 s mezi kliknutími).
- **Očekávaný výsledek:** Viditelných je maximálně 5 toastů. Nejstarší se odstraní.

---

## 8. Cheat Sheet

### TC-041: Kopírování syntaxe kliknutím
- **Předpoklady:** Aplikace je otevřená, sekce Cheat Sheet je viditelná.
- **Kroky:**
  1. Klikni na první syntax box (např. `# Nadpis`).
- **Očekávaný výsledek:** Syntax se zkopíruje do schránky. Box se na okamžik zvýrazní.

### TC-042: Klávesová dostupnost — Enter
- **Předpoklady:** Aplikace je otevřená.
- **Kroky:**
  1. Tabulátorem zaměř první syntax box.
  2. Stiskni `Enter`.
- **Očekávaný výsledek:** Syntax se zkopíruje do schránky.

---

## 9. Responzivní design

### TC-043: Desktop layout — 2 sloupce
- **Předpoklady:** Okno prohlížeče je širší než 1024 px.
- **Kroky:**
  1. Ověř uspořádání editoru a náhledu.
- **Očekávaný výsledek:** Editor a náhled jsou vedle sebe (2 sloupce).

### TC-044: Mobile layout — sloupce pod sebou
- **Předpoklady:** Okno prohlížeče je užší než 1024 px (nebo použij mobilní zařízení).
- **Kroky:**
  1. Ověř uspořádání editoru a náhledu.
- **Očekávaný výsledek:** Editor a náhled jsou pod sebou (1 sloupec).

---

## Shrnutí

| Sekce | Počet TC |
|-------|----------|
| Editor — Formátování textu | 12 |
| Find & Replace | 6 |
| Undo / Redo | 3 |
| Zobrazení | 5 |
| Ukládání a export | 7 |
| Drag & Drop | 3 |
| Toast notifikace | 4 |
| Cheat Sheet | 2 |
| Responzivní design | 2 |
| **Celkem** | **44** |
