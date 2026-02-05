import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: 'src/index.ts'
	},
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	outDir: 'dist',
	treeshake: true,
	external: ['react', 'react-dom', '@refinedev/core', '@blume/recms-core', '@blume/recms-ui'],
	minify: false,
	tsconfig: './tsconfig.json'
})
