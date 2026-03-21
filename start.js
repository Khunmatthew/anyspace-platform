import { createServer } from 'vite';

process.chdir(new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));

const server = await createServer({
  root: '.',
  server: { host: '0.0.0.0', port: 5173 }
});
await server.listen();
server.printUrls();
