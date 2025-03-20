<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import homeIcon from "../icons/home.svg?raw";
  import backlogIcon from "../icons/backlog.svg?raw";
  import convertIcon from "../icons/convert.svg?raw";
  import urlDecodeIcon from "../icons/url-decode.svg?raw";

  // アクティブなルートを判定するヘルパー関数
  function isActive(path: string) {
    // $locationはリアクティブな値なので、変更があると自動的にUIが更新される
    return $location === path;
  }
</script>

<header>
  <nav>
    <ul>
      <li class:active={isActive("/")}>
        <a href="/" use:link aria-label="ホーム">
          <div class="icon-container">
            {@html homeIcon}
          </div>
        </a>
      </li>
      <li class:active={isActive("/backlog-convert")}>
        <a href="/backlog-convert" use:link aria-label="Backlog変換">
          <div class="icon-container">
            {@html backlogIcon}
            {@html convertIcon}
          </div>
        </a>
      </li>
      <li class:active={isActive("/url-decode")}>
        <a href="/url-decode" use:link aria-label="URLデコード">
          <div class="icon-container">
            {@html urlDecodeIcon}
          </div>
        </a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    width: 100%;
    padding: 1rem;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 2rem;
  }

  nav {
    width: 100%;
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 1rem;
  }

  nav ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 0.5rem;
  }

  nav li {
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  nav li.active {
    background-color: #e9ecef;
  }

  nav a {
    display: flex;
    padding: 0.5rem 1rem;
    color: #212529;
    text-decoration: none;
    font-weight: 500;
    align-items: center;
  }

  nav a:hover {
    color: #007bff;
  }

  /* アイコン全体の高さを調整 */
  .icon-container {
    display: flex;
    align-items: center;
    height: 24px; /* この値を調整してみる */
  }
</style>
