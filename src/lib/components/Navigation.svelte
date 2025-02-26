<script lang="ts">
  import { link, location } from "svelte-spa-router";

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
        <a href="/" use:link>ホーム</a>
      </li>
      <li class:active={isActive("/tool1")}>
        <a href="/tool1" use:link>ツール1</a>
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
    gap: 1rem;
  }

  nav li {
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  nav li.active {
    background-color: #e9ecef;
  }

  nav a {
    display: block;
    padding: 0.5rem 1rem;
    color: #212529;
    text-decoration: none;
    font-weight: 500;
  }

  nav a:hover {
    color: #007bff;
  }
</style>
