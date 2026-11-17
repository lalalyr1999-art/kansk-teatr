import { defineConfig } from 'vite';
import { resolve } from 'path';
// Новая страница: добавить файл .html в корень и строку в input
export default defineConfig({
  build: { rollupOptions: { input: { main: resolve('index.html'), notfound: resolve('404.html'), privacy: resolve('privacy.html'), zritelyam: resolve('zritelyam.html'), ca: resolve('concept-a.html'), cb: resolve('concept-b.html'), cc: resolve('concept-c.html'), cd: resolve('concept-d.html'), old: resolve('old.html') } } }
});
