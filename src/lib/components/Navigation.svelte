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
        <a href="/" use:link aria-label="ホーム">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1024 165l941 942l-90 90l-83-82v805h-640v-640H896v640H256v-805l-83 82l-90-90zm640 1627V987l-640-640l-640 640v805h384v-640h512v640z"/></svg>
          </div>
        </a>
      </li>
      <li class:active={isActive("/backlog-convert")}>
        <a href="/backlog-convert" use:link aria-label="Backlog変換">
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
      <li class:active={isActive("/url-decode")}>
        <a href="/url-decode" use:link aria-label="URLデコード">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16">
              <path fill="currentColor" d="M12.5 4a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-1 0v.755A6.96 6.96 0 0 0 8.538 1.02a.5.5 0 0 0-.076.998c1.05.08 2.026.43 2.856.982H10.5a.5.5 0 0 0 0 1z"/>
              <circle cx="2.5" cy="3" r="1" fill="none" stroke="currentColor" stroke-width="1"/>
              <line x1="6.3" y1="2" x2="2" y2="7" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              <circle cx="6" cy="6" r="1" fill="none" stroke="currentColor" stroke-width="1"/>
              <path fill="currentColor" d="M11.486 6.105a.5.5 0 0 0-.978-.21q-.105.494-.185.956c-.442.016-.878.012-1.292-.017a.5.5 0 1 0-.068.998c.39.027.797.034 1.21.024q-.075.603-.107 1.142c-.907.424-1.51 1.027-1.83 1.673c-.395.802-.36 1.725.2 2.299c.38.386.924.428 1.398.322q.324-.072.651-.238l.044.12a.5.5 0 0 0 .937-.349a5 5 0 0 1-.122-.37c.716-.65 1.338-1.643 1.564-2.916q.155.04.285.096c.44.19.705.527.808.915c.206.774-.225 1.922-1.683 2.483a.5.5 0 0 0 .359.934c1.834-.706 2.653-2.308 2.29-3.673a2.36 2.36 0 0 0-1.377-1.577a3 3 0 0 0-.593-.182V8.5a.5.5 0 0 0-1-.018a5 5 0 0 0-.901.151q.034-.4.093-.838a14 14 0 0 0 1.923-.308a.5.5 0 0 0-.229-.974c-.484.114-1.003.202-1.53.26q.06-.326.133-.668m-2.353 5.009c.158-.32.446-.664.906-.962c.012.751.084 1.382.184 1.903c-.22.136-.428.222-.607.261c-.298.067-.425-.005-.464-.046c-.176-.18-.289-.609-.019-1.156m2.765-1.618a4.24 4.24 0 0 1-.789 1.743a12 12 0 0 1-.07-1.55l.121-.036q.4-.118.738-.157"/>
              <path fill="currentColor" d="M4.682 13H5.5a.5.5 0 0 0 0-1h-2a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-.755a6.96 6.96 0 0 0 3.462 1.235a.5.5 0 1 0 .076-.997A5.96 5.96 0 0 1 4.682 13"/>
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
