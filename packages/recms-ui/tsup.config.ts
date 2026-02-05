import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: false, // Temporarily disabled while fixing imports
	sourcemap: true,
	clean: true,
	outDir: 'dist',
	splitting: true,
	treeshake: true,
	external: [
		'react',
		'react-dom',
		'@refinedev/core',
		'@refinedev/react-hook-form',
		'@blume/recms-core',
		/^@\// // All @/ imports are external (host app)
	],
	minify: false,
	tsconfig: './tsconfig.json'
})
