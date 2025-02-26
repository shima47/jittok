// 各ページコンポーネントをインポート
import Home from './lib/components/Home.svelte';
import Tool1 from './lib/components/tools/Tool1.svelte';
import NotFound from './lib/components/NotFound.svelte';

// ルート定義
const routes = {
  // ホームページ
  '/': Home,
  
  // 各ツールページ
  '/tool1': Tool1,
  
  // 存在しないルートへのアクセス時
  '*': NotFound
};

export default routes;