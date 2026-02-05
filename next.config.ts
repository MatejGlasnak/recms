import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	transpilePackages: ['@blume/recms', '@blume/recms-core', '@blume/recms-ui'],
	experimental: {
		// Disable build cache to always use fresh source from packages
		turbo: {
			resolveAlias: {
				'@blume/recms': './packages/recms/src/index.ts',
				'@blume/recms-core': './packages/recms-core/src/index.ts',
				'@blume/recms-ui': './packages/recms-ui/src/index.ts'
			}
		}
	}
}

export default nextConfig
