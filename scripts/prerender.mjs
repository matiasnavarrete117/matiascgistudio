import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

// Render the same React page into the built HTML so crawlers and link previews
// receive the portfolio content without waiting for client-side JavaScript.
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: App } = await server.ssrLoadModule('/App.tsx');
  const rendered = renderToString(createElement(App));
  const outputPath = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(outputPath, 'utf8');
  if (!html.includes('<!--app-html-->')) {
    throw new Error('Missing prerender placeholder in dist/index.html');
  }
  await writeFile(outputPath, html.replace('<!--app-html-->', rendered));
} finally {
  await server.close();
}
