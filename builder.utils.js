import path from 'path';
import { fileURLToPath } from 'url';

import pnpapi from 'pnpapi';
import { PosixFS } from '@yarnpkg/fslib';
import libzip from '@yarnpkg/libzip';

/* We need this when travelling imports
 * because their path is reative to their parent foder.
 */
const sassImportStack = [];

// # Some utility definitions
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const identity = x => x;

// For a more compact version when I need a value anyway
const maybe = op => function may(ok, fail) {
	try {
		const res = op();

		return ok(res);
	}
	catch(e) {
		return fail(e);
	}
};
// --- #

// Builds the PnP request url to be read
function getTildeLoaderPnPResource(url, prev, extensions) {
	function recurse(module) {
		const oldPrev = sassImportStack.at(-2);
		sassImportStack.pop();

		return getTildeLoaderPnPResource(module, oldPrev, extensions);
	}

	if(url.startsWith('~')) {
		url = url.substring(1);
	}

	if(prev.startsWith('~')) {
		url = path.dirname(prev.substring(1))
			+ '/'
			+ url;
	}

	const maybeResource = maybe(() =>
		pnpapi.resolveRequest(
			url,
			__dirname + '/',
			{ extensions
			}
		)
	);

	// SASS also looks for _filename if it exists
	const maybeUnderscore = maybe(() =>
		pnpapi.resolveRequest(
			path.dirname(url)
				+ '/_'
				+ path.basename(url),
			__dirname + '/',
			{ extensions
			}
		)
	);

	return maybeResource(
		identity,
		() => maybeUnderscore(
			identity,
			() => recurse(url)
		)
	);
}

export function lookInYarnZipFS(module, importer, extensions) {
	const zipOpenFs = new libzip.ZipOpenFS(
		{ libzip: libzip.getLibzipSync()
		}
	);
	const crossFs = new PosixFS(zipOpenFs);

	const resource = getTildeLoaderPnPResource(
		module,
		importer,
		extensions
	);

	return crossFs.readFileSync(resource);
}

export function tildeLoader(module, importer) {
	if(!module.startsWith('~') && sassImportStack.length === 0) {
		return null;
	}

	if(sassImportStack.indexOf(importer) === -1) {
		sassImportStack.push(importer);
	}

	const file = lookInYarnZipFS(module, importer, ['.sass', '.scss']);

	return { contents: file.toString() };
}
