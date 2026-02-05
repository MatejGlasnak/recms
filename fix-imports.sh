#!/bin/bash

# Script to fix all imports in recms-ui package

cd packages/recms-ui/src

# Fix imports from ../core/registries -> @blume/recms-core
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/core\/registries['\"]|from '@blume/recms-core'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/core\/registries\/FieldRegistry['\"]|from '@blume/recms-core'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/core\/registries\/types['\"]|from '@blume/recms-core'|g"

# Fix imports from ../../../core/registries -> @blume/recms-core
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/core\/registries['\"]|from '@blume/recms-core'|g"

# Fix imports from ../core/SelectableRegistry (comment out for now)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/core\/SelectableRegistry['\"]|// from '../core/SelectableRegistry' // TODO|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/core\/SelectableRegistry['\"]|// from '../../../core/SelectableRegistry' // TODO|g"

# Fix imports from ../../hooks -> @blume/recms-core
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/hooks\/use-page-config['\"]|from '@blume/recms-core'|g"

# Fix imports from ../../ui -> relative paths
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/ui\/BlockRenderer['\"]|from '../renderers/BlockRenderer'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/ui\/FormField['\"]|from '../renderers/FormField'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/ui\/PageLoading['\"]|from '../components/PageLoading'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/ui\/PageError['\"]|from '../components/PageError'|g"

# Fix imports from ../../../ui -> relative paths
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/ui\/BlockRenderer['\"]|from '../../renderers/BlockRenderer'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/ui\/FormField['\"]|from '../../renderers/FormField'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/ui\/EditableWrapper['\"]|from '../../components/EditableWrapper'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/ui\/ConfigEmptyState['\"]|from '../../components/ConfigEmptyState'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/ui\/FormModal['\"]|from '../../components/FormModal'|g"
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/\.\.\/ui\/ShowFieldValue['\"]|from '../../components/ShowFieldValue'|g"

# Fix imports from ../../utils -> @blume/recms-core
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -pi -e "s|from ['\"]\.\.\/\.\.\/utils['\"]|from '@blume/recms-core'|g"

# Fix blocks/layouts exports
find ./blocks -name "index.ts" -print0 | xargs -0 perl -pi -e "s|export \* from ['\"]\.\/layouts['\"]||g"

echo "Import fixes complete!"
