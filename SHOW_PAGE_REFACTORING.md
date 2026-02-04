# Show Page Refactoring - Block-based System

## Prehľad

Show screen bol zrefaktorovaný podľa vzoru list screenu na plne konfigurovateľný block-based systém.

## Hlavné zmeny

### 1. Nová architektúra

**Predtým:**
- Pevne zakódovaná štruktúra s tabs a groups
- ShowPage.tsx s vlastnou logikou pre rendering
- Konfigurácia cez ShowConfig (tabs, groups, items)

**Teraz:**
- Block-based systém podobný list page
- ShowPageNew.tsx používa BlockRenderer
- Konfigurácia cez PageConfig s blocks
- Použitie BlockRegistry a FieldRegistry

### 2. Nové bloky

#### Show Header Block (`show-header`)
Zobrazuje hlavičku show stránky s akciami.

**Konfigurácia:**
```typescript
{
  title?: string              // Override názvu stránky
  description?: string        // Override popisu
  showEdit?: boolean         // Zobraziť Edit tlačidlo (default: true)
  showDelete?: boolean       // Zobraziť Delete tlačidlo (default: false)
  showBack?: boolean         // Zobraziť Back tlačidlo (default: true)
}
```

**Umiestnenie:**
- `src/plugins/@blume/recms/components/blocks/show-header/`

#### Show Content Block (`show-content`)
Zobrazuje polia záznamu v konfigurovateľnom grid layoute.

**Konfigurácia:**
```typescript
{
  columns?: string           // Počet stĺpcov: '1', '2', '3', '4' (default: '2')
  fields?: ShowFieldConfig[] // Pole konfigurácie polí
  showCard?: boolean        // Zabaliť do karty (default: true)
  cardTitle?: string        // Názov karty
  cardDescription?: string  // Popis karty
}
```

**ShowFieldConfig:**
```typescript
{
  id: string
  field: string              // Názov poľa z dát
  label?: string            // Override labelu
  type: 'text' | 'number' | 'date' | 'richtext' | 'boolean' | 'badge' | 'json'
  colspan?: number          // Šírka poľa (1-4)
  format?: string           // Formát (pre dátumy, čísla)
  badgeVariant?: string     // Variant pre badge typ
}
```

**Umiestnenie:**
- `src/plugins/@blume/recms/components/blocks/show-content/`

### 3. Field Editor

Podobne ako ColumnEditor pre tabuľky, teraz máme **FieldEditor** pre konfiguráciu polí v show content bloku.

**Features:**
- Pridávanie/úprava/mazanie polí
- Drag & drop ordering
- Konfigurácia typu poľa
- Nastavenie colspan
- Visual preview polí

**Umiestnenie:**
- `src/plugins/@blume/recms/components/blocks/show-content/FieldEditor.tsx`

### 4. API Endpoint

API endpoint pre page konfiguráciu bol rozšírený o podporu show pages.

**Endpoint:** `/api/admin/config/pages/[resourceId]`

**Show page routing:**
- Použite `resourceId` s príponou `/show`
- Príklad: `/api/admin/config/pages/users/show`

**Databáza:**
- List pages: `app_resources_lists` kolekcia
- Show pages: `app_resources_show_pages` kolekcia

**Default konfigurácia:**
```json
{
  "id": null,
  "resourceId": "users",
  "blocks": [
    {
      "id": "header-1",
      "slug": "show-header",
      "config": {
        "title": "",
        "description": "",
        "showEdit": true,
        "showDelete": false,
        "showBack": true
      },
      "order": 0
    },
    {
      "id": "content-1",
      "slug": "show-content",
      "config": {
        "columns": "2",
        "fields": [],
        "showCard": true,
        "cardTitle": "",
        "cardDescription": ""
      },
      "order": 1
    }
  ]
}
```

### 5. ShowPageNew Component

Nový komponent `ShowPageNew.tsx` nahradil starý `ShowPage.tsx`.

**Hlavné rozdiely:**
- Používa `usePageConfig` hook s `resourceId/show` pattern
- Registruje show-specific bloky
- Používa `BlockRenderer` pre rendering blokov
- Podporuje edit mode pre konfiguráciu

**Props:**
```typescript
{
  resourceId?: string  // Resource identifier
  id?: string         // Record ID
}
```

**Umiestnenie:**
- `src/plugins/@blume/recms/pages/resources/ShowPageNew.tsx`

### 6. Route Update

Show page route bol aktualizovaný na použitie nového ShowPageNew:

**Súbor:** `src/app/admin/resources/[resourceName]/show/[id]/page.tsx`
```typescript
export { ShowPageNew as default } from '@blume/recms'
```

### 7. Backward Compatibility

Starý ShowPage je stále dostupný pre backward compatibility:
```typescript
export { ShowPage } from '@blume/recms' // Legacy
```

## Výhody nového systému

1. **Konzistentnosť** - Rovnaký pattern ako list page
2. **Flexibilita** - Ľubovoľné bloky v ľubovoľnom poradí
3. **Modularita** - Bloky sú nezávislé komponenty
4. **Rozšíriteľnosť** - Jednoduché pridanie nových blokov
5. **Konfigurovateľnosť** - Všetko cez UI/API bez kódu
6. **Type Safety** - Plná TypeScript podpora

## Migrácia zo starého systému

### Automatická migrácia (TODO)

Vytvorte migration script pre konverziu starých show configs na nové block-based.

### Manuálna migrácia

1. **Vytvorte show header block:**
   - Skopírujte title/description z meta

2. **Vytvorte show content bloky:**
   - Pre každý tab vytvorte show-content blok
   - Pre každú group v tabe vytvorte samostatný show-content blok
   - Konvertujte items na fields konfiguráciu

3. **Nastavte order:**
   - Header má order: 0
   - Content bloky majú order: 1, 2, 3...

## Príklad použitia

```typescript
// Default konfigurácia pre users show page
{
  blocks: [
    {
      id: 'header-1',
      slug: 'show-header',
      config: {
        showEdit: true,
        showDelete: true
      }
    },
    {
      id: 'content-basic',
      slug: 'show-content',
      config: {
        columns: '2',
        cardTitle: 'Basic Information',
        fields: [
          { id: '1', field: 'name', label: 'Name', type: 'text', colspan: 2 },
          { id: '2', field: 'email', label: 'Email', type: 'text', colspan: 2 },
          { id: '3', field: 'created_at', label: 'Created', type: 'date', colspan: 1 },
          { id: '4', field: 'updated_at', label: 'Updated', type: 'date', colspan: 1 }
        ]
      }
    },
    {
      id: 'content-details',
      slug: 'show-content',
      config: {
        columns: '1',
        cardTitle: 'Biography',
        fields: [
          { id: '1', field: 'bio', label: 'Bio', type: 'richtext', colspan: 1 }
        ]
      }
    }
  ]
}
```

## Budúce vylepšenia

1. **Migration script** - Automatická migrácia zo starých configs
2. **Viac field typov** - Image, File, Relation, atď.
3. **Tabs support** - Show-tabs blok pre organizáciu obsahu
4. **Custom renderers** - Možnosť pridať vlastné field renderery
5. **Conditional display** - Zobrazenie polí podľa podmienok
6. **Actions blok** - Samostatný blok pre akcie (edit, delete, custom)

## Testovanie

1. Otvorte ľubovoľný show screen
2. Kliknite na Settings icon pre vstup do edit mode
3. Kliknite na blok pre editáciu konfigurácie
4. Pridajte/upravte polia v show-content bloku
5. Uložte zmeny
6. Overte, že sa dáta zobrazujú správne

## Súbory

**Nové súbory:**
- `src/plugins/@blume/recms/components/blocks/show-header/*`
- `src/plugins/@blume/recms/components/blocks/show-content/*`
- `src/plugins/@blume/recms/pages/resources/ShowPageNew.tsx`

**Upravené súbory:**
- `src/lib/mongo.ts` - pridaný helper pre show pages kolekciu
- `src/app/api/admin/config/pages/[resourceId]/route.ts` - rozšírený o show support
- `src/app/admin/resources/[resourceName]/show/[id]/page.tsx` - používa ShowPageNew
- `src/plugins/@blume/recms/index.ts` - exporty nových komponentov
- `src/plugins/@blume/recms/components/blocks/index.ts` - exporty show blokov
