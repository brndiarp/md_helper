# Plán — Playwright E2E testy pro MD Helper

## Cíl
Vytvořit automatizované E2E testy v Playwright + TypeScript pro všechny 47 funkcí MD Helper.

## Rozhodnutí
- **Testovací prostředí:** Statický soubor (`file://`)
- **Lokátory:** Přidat `data-testid` atributy do HTML
- **Struktura testů:** Rozděleno podle sekcí (souborů)

---

## Fáze 1 — Inicializace projektu

### 1.1 Instalace Playwright
```bash
npm init -y
npm install -D @playwright/test
npx playwright install
```

### 1.2 Struktura souborů
```
md_helper/
├── md-helper.html              # Aplikace (rozšířená o data-testid)
├── tests/
│   ├── editor.spec.ts          # Editor funkce (TC 1-13)
│   ├── find-replace.spec.ts    # Find & Replace (TC 14-19)
│   ├── undo-redo.spec.ts       # Undo / Redo (TC 20-22)
│   ├── view-modes.spec.ts      # Zobrazení (TC 23-27)
│   ├── storage-export.spec.ts  # Ukládání a export (TC 28-35)
│   ├── drag-drop.spec.ts       # Drag & Drop (TC 36-38)
│   ├── toast.spec.ts           # Toast notifikace (TC 39-42)
│   ├── cheat-sheet.spec.ts     # Cheat sheet (TC 43-45)
│   └── responsive.spec.ts      # Responzivita (TC 46-47)
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

### 1.3 Playwright konfigurace (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'file://' + __dirname + '/md-helper.html',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## Fáze 2 — Přidání data-testid do HTML

### Seznam atributů k přidání
| Element | data-testid |
|---------|-------------|
| textarea editor | `data-testid="editor"` |
| preview div | `data-testid="preview"` |
| H1 button | `data-testid="btn-h1"` |
| H2 button | `data-testid="btn-h2"` |
| H3 button | `data-testid="btn-h3"` |
| Bold button | `data-testid="btn-bold"` |
| Italic button | `data-testid="btn-italic"` |
| Link button | `data-testid="btn-link"` |
| Bullet list button | `data-testid="btn-bullet"` |
| Numbered list button | `data-testid="btn-numbered"` |
| Checklist button | `data-testid="btn-checklist"` |
| Inline code button | `data-testid="btn-inline-code"` |
| Code block button | `data-testid="btn-code-block"` |
| Table button | `data-testid="btn-table"` |
| Undo button | `data-testid="btn-undo"` |
| Redo button | `data-testid="btn-redo"` |
| Copy button | `data-testid="btn-copy"` |
| Download button | `data-testid="btn-download"` |
| Export HTML button | `data-testid="btn-export-html"` |
| Clear button | `data-testid="btn-clear"` |
| Reset button | `data-testid="btn-reset"` |
| Filename input | `data-testid="filename-input"` |
| Split view button | `data-testid="btn-view-split"` |
| Editor view button | `data-testid="btn-view-editor"` |
| Preview view button | `data-testid="btn-view-preview"` |
| Resizable divider | `data-testid="resize-divider"` |
| Find dialog | `data-testid="find-dialog"` |
| Find input | `data-testid="find-input"` |
| Replace input | `data-testid="replace-input"` |
| Find next button | `data-testid="btn-find-next"` |
| Replace one button | `data-testid="btn-replace-one"` |
| Replace all button | `data-testid="btn-replace-all"` |
| Toast container | `data-testid="toast-container"` |
| Drag overlay | `data-testid="drag-overlay"` |
| Cheat sheet grid | `data-testid="cheatsheet-grid"` |

---

## Fáze 3 — Testovací scénáře

### 3.1 editor.spec.ts (13 test cases)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Editor - Formátování textu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Živý náhled Markdownu - Okamžité zobrazení změn', async ({ page }) => {
    const editor = page.getByTestId('editor');
    const preview = page.getByTestId('preview');
    
    await editor.fill('Vítej v MD Helper');
    await expect(preview).toContainText('Vítej v MD Helper');
    
    await editor.fill('**tučný text**');
    await expect(preview.locator('strong')).toContainText('tučný text');
  });

  test('Vložení nadpisu H1 - Tlačítkem', async ({ page }) => {
    await page.getByTestId('editor').fill('Nadpis');
    await page.getByTestId('editor').selectText();
    await page.getByTestId('btn-h1').click();
    
    await expect(page.getByTestId('editor')).toHaveValue('# Nadpis');
    await expect(page.getByTestId('preview').locator('h1')).toContainText('Nadpis');
  });

  test('Vložení nadpisu H2 a H3 - Klávesovou zkratkou', async ({ page }) => {
    await page.getByTestId('editor').fill('Podnadpis');
    await page.getByTestId('editor').press('Control+2');
    await expect(page.getByTestId('editor')).toHaveValue('## Podnadpis');
    
    await page.getByTestId('editor').press('Control+3');
    await expect(page.getByTestId('editor')).toHaveValue('### Podnadpis');
  });

  test('Tučný text - Ctrl+B', async ({ page }) => {
    await page.getByTestId('editor').fill('důležité');
    await page.getByTestId('editor').selectText();
    await page.getByTestId('editor').press('Control+b');
    
    await expect(page.getByTestId('editor')).toHaveValue('**důležité**');
  });

  test('Kurzíva - Ctrl+I', async ({ page }) => {
    await page.getByTestId('editor').fill('kurzíva');
    await page.getByTestId('editor').selectText();
    await page.getByTestId('editor').press('Control+i');
    
    await expect(page.getByTestId('editor')).toHaveValue('_kurzíva_');
  });

  test('Odkaz - Ctrl+K', async ({ page }) => {
    await page.getByTestId('editor').press('Control+k');
    await expect(page.getByTestId('editor')).toHaveValue('[text odkazu](https://)');
  });

  test('Odrážkový seznam', async ({ page }) => {
    await page.getByTestId('btn-bullet').click();
    await page.getByTestId('editor').press('End');
    await page.getByTestId('editor').type('Položka A');
    
    await expect(page.getByTestId('editor')).toHaveValue('- Položka A');
    await expect(page.getByTestId('preview').locator('ul li')).toContainText('Položka A');
  });

  test('Číslovaný seznam', async ({ page }) => {
    await page.getByTestId('btn-numbered').click();
    await page.getByTestId('editor').type('Krok 1');
    
    await expect(page.getByTestId('editor')).toHaveValue('1. Krok 1');
  });

  test('Checklist', async ({ page }) => {
    await page.getByTestId('btn-checklist').click();
    
    await expect(page.getByTestId('editor')).toContainText('- [ ] První úkol');
    await expect(page.getByTestId('preview').locator('input[type="checkbox"]')).toHaveCount(2);
  });

  test('Inline kód', async ({ page }) => {
    await page.getByTestId('editor').fill('npm install');
    await page.getByTestId('editor').selectText();
    await page.getByTestId('btn-inline-code').click();
    
    await expect(page.getByTestId('editor')).toHaveValue('`npm install`');
  });

  test('Blok kódu', async ({ page }) => {
    await page.getByTestId('btn-code-block').click();
    await page.getByTestId('editor').type('console.log("test");');
    
    await expect(page.getByTestId('preview').locator('pre code')).toContainText('console.log');
  });

  test('Tabulka', async ({ page }) => {
    await page.getByTestId('btn-table').click();
    
    await expect(page.getByTestId('preview').locator('table')).toBeVisible();
    await expect(page.getByTestId('preview').locator('th')).toHaveCount(3);
  });
});
```

### 3.2 find-replace.spec.ts (6 test cases)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Find & Replace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('editor').fill('Markdown je skvělý. Markdown je jednoduchý.');
  });

  test('Otevření dialogu - Ctrl+F', async ({ page }) => {
    await page.getByTestId('editor').press('Control+f');
    await expect(page.getByTestId('find-dialog')).toBeVisible();
  });

  test('Otevření dialogu - Ctrl+H', async ({ page }) => {
    await page.getByTestId('editor').press('Control+h');
    await expect(page.getByTestId('find-dialog')).toBeVisible();
    await expect(page.getByTestId('replace-input')).toBeFocused();
  });

  test('Nalezení dalšího výskytu', async ({ page }) => {
    await page.getByTestId('editor').press('Control+f');
    await page.getByTestId('find-input').fill('Markdown');
    
    await expect(page.getByTestId('find-dialog')).toContainText('1 / 2');
    
    await page.getByTestId('btn-find-next').click();
    await expect(page.getByTestId('find-dialog')).toContainText('2 / 2');
  });

  test('Nahrazení jednoho výskytu', async ({ page }) => {
    await page.getByTestId('editor').press('Control+f');
    await page.getByTestId('find-input').fill('Markdown');
    await page.getByTestId('replace-input').fill('Editor');
    await page.getByTestId('btn-replace-one').click();
    
    await expect(page.getByTestId('editor')).toContainText('Editor je skvělý');
    await expect(page.getByTestId('editor')).toContainText('Markdown je jednoduchý');
  });

  test('Nahrazení všech výskytů', async ({ page }) => {
    await page.getByTestId('editor').fill('test test test');
    await page.getByTestId('editor').press('Control+f');
    await page.getByTestId('find-input').fill('test');
    await page.getByTestId('replace-input').fill('produkce');
    await page.getByTestId('btn-replace-all').click();
    
    await expect(page.getByTestId('editor')).toHaveValue('produkce produkce produkce');
    await expect(page.getByTestId('toast-container')).toContainText('Nahrazeno 3 výskytů');
  });

  test('Zobrazení počítadla', async ({ page }) => {
    await page.getByTestId('editor').press('Control+f');
    await page.getByTestId('find-input').fill('xyz12345');
    
    await expect(page.getByTestId('find-dialog')).toContainText('0 / 0');
  });
});
```

### 3.3 undo-redo.spec.ts (3 test cases)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Undo / Redo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Undo - Ctrl+Z', async ({ page }) => {
    const editor = page.getByTestId('editor');
    const originalText = await editor.inputValue();
    
    await editor.fill('Nový text');
    await page.waitForTimeout(1600); // počkat na auto-save
    
    await editor.press('Control+z');
    await expect(editor).toHaveValue(originalText);
  });

  test('Redo - Ctrl+Y', async ({ page }) => {
    const editor = page.getByTestId('editor');
    
    await editor.fill('Nový text');
    await page.waitForTimeout(1600);
    await editor.press('Control+z');
    await editor.press('Control+y');
    
    await expect(editor).toHaveValue('Nový text');
  });

  test('Redo - Ctrl+Shift+Z', async ({ page }) => {
    const editor = page.getByTestId('editor');
    
    await editor.fill('Nový text');
    await page.waitForTimeout(1600);
    await editor.press('Control+z');
    await editor.press('Control+Shift+z');
    
    await expect(editor).toHaveValue('Nový text');
  });
});
```

### 3.4 view-modes.spec.ts (5 test cases)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Zobrazení', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Split režim - výchozí', async ({ page }) => {
    await expect(page.getByTestId('editor')).toBeVisible();
    await expect(page.getByTestId('preview')).toBeVisible();
  });

  test('Editor only režim', async ({ page }) => {
    await page.getByTestId('btn-view-editor').click();
    await expect(page.getByTestId('editor')).toBeVisible();
    await expect(page.getByTestId('preview')).not.toBeVisible();
  });

  test('Preview only režim', async ({ page }) => {
    await page.getByTestId('btn-view-preview').click();
    await expect(page.getByTestId('editor')).not.toBeVisible();
    await expect(page.getByTestId('preview')).toBeVisible();
  });

  test('Perzistence režimu po obnovení', async ({ page }) => {
    await page.getByTestId('btn-view-editor').click();
    await page.reload();
    await expect(page.getByTestId('preview')).not.toBeVisible();
  });

  test('Resizable divider', async ({ page }) => {
    await page.getByTestId('btn-view-split').click();
    const divider = page.getByTestId('resize-divider');
    await expect(divider).toBeVisible();
    
    const box = await divider.boundingBox();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + 200, box!.y + box!.height / 2);
    await page.mouse.up();
    
    // Ověřit že se šířka změnila
    const editorWidth = await page.getByTestId('editor').evaluate(el => el.offsetWidth);
    expect(editorWidth).toBeGreaterThan(300);
  });
});
```

### 3.5 storage-export.spec.ts (7 test cases)
```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Ukládání a export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Auto-save do localStorage', async ({ page }) => {
    await page.getByTestId('editor').fill('Moje poznámky');
    await page.waitForTimeout(500);
    
    const saved = await page.evaluate(() => localStorage.getItem('md-helper-content'));
    expect(saved).toBe('Moje poznámky');
  });

  test('Načtení z localStorage po obnovení', async ({ page }) => {
    await page.getByTestId('editor').fill('Uložený text');
    await page.waitForTimeout(500);
    await page.reload();
    await expect(page.getByTestId('editor')).toHaveValue('Uložený text');
  });

  test('Kopírovat do schránky', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByTestId('editor').fill('Text ke zkopírování');
    await page.getByTestId('btn-copy').click();
    
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe('Text ke zkopírování');
  });

  test('Stáhnout .md soubor', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('btn-download').click(),
    ]);
    
    expect(download.suggestedFilename()).toBe('note.md');
  });

  test('Export HTML souboru', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('btn-export-html').click(),
    ]);
    
    expect(download.suggestedFilename()).toBe('note.html');
  });

  test('Název souboru - perzistence', async ({ page }) => {
    await page.getByTestId('filename-input').fill('muj-soubor');
    await page.waitForTimeout(500);
    await page.reload();
    await expect(page.getByTestId('filename-input')).toHaveValue('muj-soubor');
  });

  test('Ochrana před zavřením - beforeunload', async ({ page }) => {
    await page.getByTestId('editor').fill('Upravený text');
    
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('beforeunload');
      await dialog.accept();
    });
    
    await page.close({ runBeforeUnload: true });
  });
});
```

### 3.6 drag-drop.spec.ts (3 test cases)
```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Drag & Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Načtení .md souboru', async ({ page }) => {
    const filePath = path.join(__dirname, '..', 'test-file.md');
    fs.writeFileSync(filePath, '# Testovací soubor\n\nObsah');
    
    const fileInput = await page.$('input[type="file"]');
    // Simulace drag-drop přes file chooser
    
    await page.getByTestId('drag-overlay').evaluate((el, filePath) => {
      // Simulace drop eventu
    }, filePath);
    
    await expect(page.getByTestId('editor')).toContainText('Testovací soubor');
    fs.unlinkSync(filePath);
  });

  test('Vložení obrázku - base64', async ({ page }) => {
    // Vytvořit malý testovací obrázek nebo použít existující
    const imagePath = path.join(__dirname, '..', 'test-image.png');
    
    // Simulace drop
    await expect(page.getByTestId('editor')).toContainText('data:image');
  });

  test('Odmítnutí nepodporovaného souboru', async ({ page }) => {
    // Simulace drop .pdf souboru
    await expect(page.getByTestId('toast-container')).toContainText('Podporované formáty');
  });
});
```

### 3.7 toast.spec.ts (4 test cases)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Toast notifikace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Success toast', async ({ page }) => {
    await page.getByTestId('btn-copy').click();
    await expect(page.getByTestId('toast-container')).toContainText('zkopírován');
    await expect(page.getByTestId('toast-container').locator('.toast.success')).toBeVisible();
  });

  test('Error toast', async ({ page }) => {
    // Vyvolat chybu (např. nepodporovaný drag-drop)
    await expect(page.getByTestId('toast-container').locator('.toast.error')).toBeVisible();
  });

  test('Toast zmizí po 3 sekundách', async ({ page }) => {
    await page.getByTestId('btn-copy').click();
    await expect(page.getByTestId('toast-container').locator('.toast')).toBeVisible();
    await page.waitForTimeout(3500);
    await expect(page.getByTestId('toast-container').locator('.toast')).not.toBeVisible();
  });

  test('Limit 5 toastů', async ({ page }) => {
    // Rychle vyvolat 6 toastů
    for (let i = 0; i < 6; i++) {
      await page.getByTestId('btn-copy').click();
      await page.waitForTimeout(2000);
    }
    
    const toasts = await page.getByTestId('toast-container').locator('.toast').count();
    expect(toasts).toBeLessThanOrEqual(5);
  });
});
```

### 3.8 cheat-sheet.spec.ts (2 test cases)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Cheat Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Kopírování syntaxe kliknutím', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const cheatCard = page.getByTestId('cheatsheet-grid').locator('.cheat-card').first();
    await cheatCard.locator('.cheat-syntax').click();
    
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('#');
  });

  test('Klávesová dostupnost - Enter', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const syntax = page.getByTestId('cheatsheet-grid').locator('.cheat-syntax').first();
    await syntax.focus();
    await syntax.press('Enter');
    
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBeTruthy();
  });
});
```

### 3.9 responsive.spec.ts (2 test cases)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Responzivní design', () => {
  test('Desktop layout - 2 sloupce', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    await expect(page.getByTestId('editor')).toBeVisible();
    await expect(page.getByTestId('preview')).toBeVisible();
    
    // Ověřit že jsou vedle sebe
    const editorBox = await page.getByTestId('editor').boundingBox();
    const previewBox = await page.getByTestId('preview').boundingBox();
    expect(editorBox!.x).toBeLessThan(previewBox!.x);
  });

  test('Mobile layout - sloupce pod sebou', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.getByTestId('editor')).toBeVisible();
    await expect(page.getByTestId('preview')).toBeVisible();
    
    // Ověřit že jsou pod sebou
    const editorBox = await page.getByTestId('editor').boundingBox();
    const previewBox = await page.getByTestId('preview').boundingBox();
    expect(editorBox!.y).toBeLessThan(previewBox!.y);
  });
});
```

---

## Fáze 4 — Spuštění testů

### 4.1 Příkazy
```bash
# Spustit všechny testy
npx playwright test

# Spustit konkrétní soubor
npx playwright test editor.spec.ts

# Spustit s UI režimem
npx playwright test --ui

# Spustit s debuggerem
npx playwright test --debug

# Generovat report
npx playwright test --reporter=html
```

### 4.2 CI/CD integrace
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

---

## Odhad náročnosti

| Fáze | Odhad času |
|------|-----------|
| 1. Inicializace projektu | 15 min |
| 2. Přidání data-testid | 30 min |
| 3. Psaní testů | 2-3 hodiny |
| 4. Ladění a stabilizace | 1 hodina |
| **Celkem** | **4-5 hodin** |

---

## Otevřené otázky

1. **Drag & Drop testy:** Playwright má omezenou podporu pro drag-drop souborů. Máme použít `page.evaluate()` pro simulaci, nebo přeskočit?
2. **Clipboard testy:** Vyžadují speciální permissions v prohlížeči. Fungují ve všech prohlížečích?
3. **Download testy:** Playwright umí zachytit download event. Chceš ověřovat i obsah staženého souboru?
