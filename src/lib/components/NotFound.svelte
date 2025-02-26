<script>
  import { push } from 'svelte-spa-router';
</script>

<div class="not-found">
  <h2>404</h2>
  <h3>ページが見つかりません</h3>
  <p>お探しのページは存在しないか、移動した可能性があります。</p>
  <button on:click={() => push('/')}>ホームに戻る</button>
</div>

<style>
  .not-found {
    text-align: center;
    padding: 3rem 1rem;
    max-width: 500px;
    margin: 0 auto;
  }
  
  h2 {
    font-size: 4rem;
    color: #4a76a8;
    margin: 0;
    line-height: 1;
  }
  
  h3 {
    margin-top: 0.5rem;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
  
  button {
    background-color: #4a76a8;
    color: white;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  button:hover {
    background-color: #3d6898;
  }
</style>