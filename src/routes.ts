// 各ページコンポーネントをインポート
import Home from './lib/components/Home.svelte';
import BacklogConvert from './lib/components/tools/backlogConvert/BacklogConvert.svelte';
import UrlDecode from './lib/components/tools/urlDecode/UrlDecode.svelte';
import NotFound from './lib/components/NotFound.svelte';

// ルート定義
const routes = {
  // ホームページ
  '/': Home,
  
  // 各ツールページ
  '/backlog-convert': BacklogConvert,
  '/url-decode': UrlDecode,
  
  // 存在しないルートへのアクセス時
  '*': NotFound
};

export default routes;
