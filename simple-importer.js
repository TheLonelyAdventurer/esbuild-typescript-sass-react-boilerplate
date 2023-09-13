import fs from 'fs/promises';
import path from 'path';
import { lookInYarnZipFS } from './builder.utils.js';

const plugins_dir = './importers/';
const plugins = await fs.readdir(plugins_dir)
const plugins_js = plugins.filter(f => f.endsWith('.js'));
const plugins_json = plugins.filter(f => f.endsWith('.json'));

/* A regular esbuild plugin.
 * Defines onResove and onLoad for JSON plugins (see the wiki)
 * and loads esbuild plugins passing the build context of setup() as an
 * argument.
 */
export default (
	{ name: 'simple-importer'
	, setup(build) {
		for(const p of plugins_json) {
			const namespace = 'simple-importer:' + p.module;

			build.onResolve(
				{ filter: p.resolve_filter
				, namespace
				},
				args => (
					{ path: path.join(p.import_path, args.path)
					, namespace
					, pluginData: { importer: args.importer }
					}
				)
			);

			build.onLoad(
				{ filter: p.load_filter
				, namespace
				},
				args => {
					const contents = lookInYarnZipFS(
						p.zipfs_path,
						args.pluginData.importer,
						p.lookup
					);

					return (
						{ contents
						, loader: p.loader
						}
					);
				}
			)
		}

		for(const p of plugins_js) {
			p(build);
		}
	}
	}
);
