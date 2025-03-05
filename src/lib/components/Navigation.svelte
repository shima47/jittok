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
      <li class:active={isActive("/backlog-convert")}>
        <a href="/backlog-convert" use:link>
          <div class="icon-container">
            <svg
              class="icon backlog-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <!-- Background -->
              <rect width="512" height="512" fill="#3DD4A3" />

              <!-- Letter "b" - larger size and shifted right -->
              <path
                d="M170 100v312h85c70 0 130-52 130-117s-60-119-130-119h-20v-76h-65z"
                fill="#FFFFFF"
              />

              <!-- Inner cutout of the "b" -->
              <path
                d="M235 226h20c35 0 70 30 70 69s-35 63-70 63h-20v-132z"
                fill="#3DD4A3"
              />
            </svg>
            <svg
              class="icon convert-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="#000000"
                d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m4 12.5v-4l2 2l2-2v4h2v-7h-2l-2 2l-2-2H5v7zm11-3v-4h-2v4h-2l3 3l3-3z"
              />
            </svg>
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

  .convert-icon {
    height: 26px;
  }

  .backlog-icon {
    height: 20px;
  }
</style>
