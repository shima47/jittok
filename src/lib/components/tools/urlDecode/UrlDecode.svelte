<script lang="ts">
  import copyIcon from "../../../icons/copy.svg?raw";
  
  // リアクティブな状態
  let encodedText = "";
  let decodedText = "";
  let encodedCopySuccess = "";
  let decodedCopySuccess = "";
  let errorMessage = "";
  let isUpdatingEncoded = false;
  let isUpdatingDecoded = false;
  let autoDetectedMethod = "component"; // 自動検出された方法

  // URLかどうかを判断する関数
  const isUrl = (text: string): boolean => {
    // URLの基本的なパターンを検出する正規表現
    // http(s):// の形式を持つ文字列をURLとみなす
    const urlPattern = /^https?:\/\//i;
    return urlPattern.test(text);
  };

  // 適切なエンコード方法を自動検出する関数
  const detectEncodeMethod = (text: string): string => {
    if (isUrl(text)) {
      autoDetectedMethod = "uri"; // URL全体の場合はencodeURIを使用
      return "uri";
    } else {
      autoDetectedMethod = "component"; // URLの一部の場合はencodeURIComponentを使用
      return "component";
    }
  };

  // URLエンコード関数
  const encodeText = (text: string) => {
    if (!text) return "";
    
    try {
      // 自動的にエンコード方法を決定
      const method = detectEncodeMethod(text);
      
      // 検出されたエンコード方法に基づいてエンコード
      if (method === "uri") {
        return encodeURI(text);
      } else {
        return encodeURIComponent(text);
      }
    } catch (error) {
      console.error('エンコードエラー:', error);
      errorMessage = 'エンコードエラー: 入力を確認してください。';
      return "";
    }
  };

  // URLデコード関数
  const decodeText = (text: string) => {
    if (!text) return "";
    
    try {
      // 自動検出された方法を使用してデコード
      if (autoDetectedMethod === "uri") {
        return decodeURI(text);
      } else {
        return decodeURIComponent(text);
      }
    } catch (error) {
      console.error('デコードエラー:', error);
      errorMessage = 'デコードエラー: 入力を確認してください。';
      return "";
    }
  };

  // エンコードテキストが変更されたときの処理
  const handleEncodedChange = () => {
    if (isUpdatingEncoded) return;
    
    isUpdatingDecoded = true;
    errorMessage = ""; // エラーメッセージをクリア
    
    if (encodedText === "") {
      // エンコードテキストが空の場合、デコードテキストも空にする
      decodedText = "";
    } else {
      const result = decodeText(encodedText);
      if (result !== "") {
        decodedText = result;
      }
    }
    
    isUpdatingDecoded = false;
  };

  // デコードテキストが変更されたときの処理
  const handleDecodedChange = () => {
    if (isUpdatingDecoded) return;
    
    isUpdatingEncoded = true;
    errorMessage = ""; // エラーメッセージをクリア
    
    if (decodedText === "") {
      // デコードテキストが空の場合、エンコードテキストも空にする
      encodedText = "";
    } else {
      const result = encodeText(decodedText);
      if (result !== "") {
        encodedText = result;
      }
    }
    
    isUpdatingEncoded = false;
  };

  // 変換ボタンの処理
  const convertText = () => {
    errorMessage = ""; // エラーメッセージをクリア
    
    if (encodedText) {
      const result = decodeText(encodedText);
      if (result !== "") {
        decodedText = result;
      }
    } else if (decodedText) {
      const result = encodeText(decodedText);
      if (result !== "") {
        encodedText = result;
      }
    }
  };

  // クリップボードにコピー
  const copyToClipboard = async (text: string, type: 'encoded' | 'decoded') => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'encoded') {
        encodedCopySuccess = "コピーしました！";
        setTimeout(() => {
          encodedCopySuccess = "";
        }, 2000);
      } else {
        decodedCopySuccess = "コピーしました！";
        setTimeout(() => {
          decodedCopySuccess = "";
        }, 2000);
      }
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
      if (type === 'encoded') {
        encodedCopySuccess = "コピーに失敗しました";
        setTimeout(() => {
          encodedCopySuccess = "";
        }, 2000);
      } else {
        decodedCopySuccess = "コピーに失敗しました";
        setTimeout(() => {
          decodedCopySuccess = "";
        }, 2000);
      }
    }
  };

  // エンコードテキストとデコードテキストの変更を監視
  $: encodedText !== undefined && handleEncodedChange();
  $: decodedText !== undefined && handleDecodedChange();
</script>

<div class="container">
  <h1 class="main-title">URL エンコード/デコード</h1>
  
  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}
  
  <div class="editor-container">
    <div class="editor-panel">
      <div class="panel-header">
        <h2 class="panel-title">エンコード済みテキスト</h2>
        <div class="copy-container">
          {#if encodedCopySuccess}
            <span class="copy-success">{encodedCopySuccess}</span>
          {/if}
          <button on:click={() => copyToClipboard(encodedText, 'encoded')} class="copy-button">
              {@html copyIcon}
            コピー
          </button>
        </div>
      </div>
      <textarea
        class="editor-textarea"
        bind:value={encodedText}
        placeholder="https://example.com/%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%83%9A%E3%83%BC%E3%82%B8"
      ></textarea>
    </div>

    <div class="controls-panel">
      <button class="control-button convert-button" on:click={convertText}>
        変換
      </button>
    </div>

    <div class="editor-panel">
      <div class="panel-header">
        <h2 class="panel-title">デコード済みテキスト</h2>
        <div class="copy-container">
          {#if decodedCopySuccess}
            <span class="copy-success">{decodedCopySuccess}</span>
          {/if}
          <button on:click={() => copyToClipboard(decodedText, 'decoded')} class="copy-button">
              {@html copyIcon}
            コピー
          </button>
        </div>
      </div>
      <textarea
        class="editor-textarea"
        bind:value={decodedText}
        placeholder="https://example.com/サンプルページ"
      ></textarea>
    </div>
  </div>
</div>

<style>
  /* 全体コンテナ */
  .container {
    padding: 1rem;
    margin: 0 auto;
  }

  .main-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  /* エディタコンテナ */
  .editor-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 768px) {
    .editor-container {
      flex-direction: row;
    }
  }

  /* エラーメッセージ */
  .error-message {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    border-left: 4px solid #ef4444;
  }

  /* エディタパネル */
  .editor-panel {
    flex: 1;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .panel-title {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .editor-textarea {
    width: 100%;
    height: 30vh;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    resize: vertical;
    font-family: inherit;
    font-size: 1rem;
  }

  /* コントロールパネル */
  .controls-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    gap: 0.5rem;
  }

  .control-button {
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-weight: 500;
  }

  .convert-button {
    background-color: #3b82f6;
    color: white;
  }

  .convert-button:hover {
    background-color: #2563eb;
  }

  /* コピーボタン */
  .copy-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .copy-success {
    color: #059669;
    font-size: 0.875rem;
  }

  .copy-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background-color: #e5e7eb;
    color: #4b5563;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .copy-button:hover {
    background-color: #d1d5db;
  }

</style>
