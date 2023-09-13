import { createRoot } from 'react-dom/client';
import React from 'react';

import './theme/index.scss';

window.addEventListener('load', () => {
	const main = document.querySelector('main');
	const root = createRoot(main);

	root.render(
		<React.StrictMode>
			Hello, World!
		</React.StrictMode>
	);
});
