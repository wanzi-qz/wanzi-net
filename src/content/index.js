import excel from './notes/excel.md?raw';
import sql from './notes/sql.md?raw';
import sqlNowcoder from './notes/sql-nowcoder.md?raw';

// key 对应 src/data/portfolio.js 里 notes[].id
// 笔记原文通过 Vite 的 ?raw 直接打包进站点，线上无需访问 Obsidian
export const noteSources = {
  excel,
  sql,
  'sql-nowcoder': sqlNowcoder,
};