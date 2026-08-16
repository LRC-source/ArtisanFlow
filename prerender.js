import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');

// Use dynamic import so Node can load the ESM module
const { render } = await import('./dist-server/entry-server.js');

const routes = [
  '/',
  '/makers',
  '/apothecaries',
  '/scale',
  '/auth',
  '/overview'
];

(async () => {
  for (const url of routes) {
    const appHtml = render(url);
    const html = template.replace(`<!--app-html-->`, appHtml);

    const filePath = `dist${url === '/' ? '/index.html' : `${url}/index.html`}`;
    
    // Ensure directory exists
    const dir = path.dirname(toAbsolute(filePath));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(toAbsolute(filePath), html);
    console.log('pre-rendered:', filePath);
  }
})();
