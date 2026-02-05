#!/bin/bash

cd packages/recms-ui/src

echo "Fixing malformed imports in recms-ui..."

# Fix lines with syntax errors from previous sed (import { X } // from ...)
# Replace with proper comment
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -pi -e 's/^(import\s+\{[^}]+\})\s+\/\/\s+from\s+.*$/\/\/ $1 \/\/ TODO: Restore after moving to recms-core/g' {} \;

# Fix /recms-core imports (missing @blume/)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -pi -e "s|from '/recms-core'|from '@blume/recms-core'|g" {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -pi -e 's|from "/recms-core"|from "@blume/recms-core"|g' {} \;

# Fix imports from ../../../types -> @blume/recms-core
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -pi -e "s|from '\.\./\.\./\.\./types'|from '@blume/recms-core'|g" {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -pi -e "s|from '\.\./\.\./\.\./types/[^']*'|from '@blume/recms-core'|g" {} \;

# Fix imports from ../../../core/registries/types -> @blume/recms-core
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -pi -e "s|from '\.\./\.\./\.\./core/registries/types'|from '@blume/recms-core'|g" {} \;

# Fix imports from ../../hooks/useSelectableSystem -> local
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec perl -pi -e "s|from '\.\./\.\./hooks/useSelectableSystem'|from '../hooks/useSelectableSystem'|g" {} \;

echo "Done!"
