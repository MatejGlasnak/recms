import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'providers/index': 'src/providers/index.ts',
		'registries/index': 'src/registries/index.ts',
		'auth/index': 'src/auth/index.ts',
		'hooks/index': 'src/hooks/index.ts',
		'types/index': 'src/types/index.ts'
	},
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	outDir: 'dist',
	splitting: true,
	treeshake: true,
	external: ['react', 'react-dom', '@refinedev/core'],
	minify: false,
	tsconfig: './tsconfig.json'
})
