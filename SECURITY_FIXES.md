# Security Fixes and Date Formatting Improvements

## Security Issues Fixed

### 1. Removed Unsafe HTML Rendering

**Issue**: Multiple components were using `dangerouslySetInnerHTML` without sanitization, creating XSS vulnerabilities.

**Fixed Components**:
- `components/form/field-types/text-field/Component.tsx`
- `components/form/field-types/textarea-field/Component.tsx`
- `components/form/field-types/dropdown-field/Component.tsx`
- `components/form/field-types/checkbox-field/Component.tsx`
- `components/form/field-types/number-field/Component.tsx`

**Solution**: Removed the `commentHtml` feature entirely. Comments are now always rendered as plain text, preventing any HTML injection.

### 2. Sanitized Rich Text Content

**Issue**: Rich text fields were rendering HTML without sanitization.

**Fixed Components**:
- `components/show/ShowFieldValue.tsx`
- `components/show/field-types/RichTextField.tsx`

**Solution**: Implemented DOMPurify for HTML sanitization with strict whitelist:
- **Allowed tags**: `p`, `br`, `strong`, `em`, `u`, `a`, `ul`, `ol`, `li`, `h1`-`h6`, `blockquote`, `code`, `pre`
- **Allowed attributes**: `href`, `target`, `rel` (for links only)
- **Memoized**: Sanitization is cached using `useMemo` for performance

```typescript
const sanitizedHtml = useMemo(() => {
  if (value == null) return '-'
  const html = String(value)
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}, [value])
```

### 3. Code Audit

**Checked for**:
- `eval()` usage - None found ✅
- `Function()` constructor - None found ✅
- Direct `innerHTML` manipulation - None found ✅
- Unsafe `dangerouslySetInnerHTML` - All fixed ✅

## Date Formatting Improvements

### 1. Installed date-fns

```bash
pnpm add date-fns
```

### 2. Slovak Date Format

**Component**: `components/columns/column-date/Component.tsx`

**Default Formats**:
- Date only: `dd.MM.yyyy` (e.g., 24.12.2026)
- Date & time: `dd.MM.yyyy HH:mm` (e.g., 24.12.2026 16:30)

**Features**:
- Uses Slovak locale (`sk` from date-fns/locale)
- Proper date parsing with `parseISO` and validation with `isValid`
- Handles multiple date formats:
  - Date objects
  - ISO 8601 strings
  - Unix timestamps
- Graceful error handling

### 3. Updated Show Field Value

**Component**: `components/show/ShowFieldValue.tsx`

Now uses date-fns for consistent Slovak date formatting across all show pages.

## Dependencies Added

- `date-fns@4.1.0` - Modern date utility library
- `dompurify@3.3.1` - HTML sanitization library
- `@types/dompurify@3.2.0` - TypeScript types for DOMPurify

## Testing Recommendations

### Security Testing

1. **XSS Prevention**:
   ```typescript
   // Try to inject script in form comments
   comment: '<script>alert("XSS")</script>'
   // Should render as plain text
   ```

2. **Rich Text Sanitization**:
   ```typescript
   // Try to inject dangerous HTML in rich text
   value: '<script>alert("XSS")</script><p>Safe content</p>'
   // Should only render: <p>Safe content</p>
   ```

3. **Link Safety**:
   ```typescript
   // Try javascript: protocol
   value: '<a href="javascript:alert(\'XSS\')">Click</a>'
   // Should be sanitized (href removed or blocked)
   ```

### Date Formatting Testing

1. **Slovak Format**:
   ```typescript
   // ISO string
   value: '2026-12-24T16:30:00Z'
   // Should display: 24.12.2026 16:30
   ```

2. **Date Objects**:
   ```typescript
   value: new Date('2026-12-24')
   // Should display: 24.12.2026
   ```

3. **Invalid Dates**:
   ```typescript
   value: 'invalid-date'
   // Should display original value as fallback
   ```

## Migration Notes

### Breaking Changes

1. **commentHtml removed**: The `commentHtml` property is no longer supported in field definitions. All comments are now rendered as plain text.

2. **Date format change**: Dates now use Slovak format (dd.MM.yyyy) instead of locale-based formatting. This is consistent across all users.

### Non-Breaking Changes

- DOMPurify sanitization is applied automatically to rich text fields
- No configuration changes needed
- Existing data is unaffected

## Best Practices Going Forward

1. **Never use dangerouslySetInnerHTML** without sanitization
2. **Always use DOMPurify** for user-generated HTML content
3. **Use date-fns** for all date formatting instead of native Date methods
4. **Validate and sanitize** all user inputs
5. **Whitelist approach**: Only allow known-safe HTML tags and attributes
6. **Keep dependencies updated**: Regularly update DOMPurify and date-fns for security patches

## Security Checklist

- [x] All `dangerouslySetInnerHTML` usages are sanitized
- [x] No `eval()` or `Function()` constructors
- [x] No direct `innerHTML` manipulation
- [x] User input is validated
- [x] HTML content is sanitized with whitelist
- [x] Date parsing is secure and validated
- [x] Dependencies are up-to-date
- [x] No linter errors
