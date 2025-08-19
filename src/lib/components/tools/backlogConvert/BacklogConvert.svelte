<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import copyIcon from "../../../icons/copy.svg?raw";

  // リアクティブな状態
  let markdown = "";
  let backlog = "";
  let autoConvert = true;
  let copySuccess = "";
  let syncScroll = true;
  
  // 箇条書きの設定
  let indentType = "tab"; // "space" または "tab"
  let spacesPerLevel = 2; // スペースの場合、階層あたりのスペース数

  // DOM参照
  let markdownRef: HTMLTextAreaElement;
  let backlogRef: HTMLTextAreaElement;
  let isScrolling = false; // スクロール処理中フラグを追加
  let scrollTimeout: number | null = null;

  // スクロール同期機能
  let markdownScrollHandler: () => void;
  let backlogScrollHandler: () => void;

  onMount(() => {
    updateScrollHandlers();
  });

  // クリーンアップ
  onDestroy(() => {
    if (markdownRef && markdownScrollHandler) {
      markdownRef.removeEventListener("scroll", markdownScrollHandler);
    }
    if (backlogRef && backlogScrollHandler) {
      backlogRef.removeEventListener("scroll", backlogScrollHandler);
    }
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  });

  // スクロールハンドラを更新
  function updateScrollHandlers() {
    // 既存のハンドラを削除
    if (markdownRef && markdownScrollHandler) {
      markdownRef.removeEventListener("scroll", markdownScrollHandler);
    }
    if (backlogRef && backlogScrollHandler) {
      backlogRef.removeEventListener("scroll", backlogScrollHandler);
    }

    // マークダウンからBacklogへのスクロール同期
    markdownScrollHandler = () => {
      if (!syncScroll || !markdownRef || !backlogRef || isScrolling) return;

      isScrolling = true; // スクロール処理開始

      const scrollPercentage =
        markdownRef.scrollTop /
        (markdownRef.scrollHeight - markdownRef.clientHeight);

      const backlogScrollPosition =
        scrollPercentage * (backlogRef.scrollHeight - backlogRef.clientHeight);

      backlogRef.scrollTop = backlogScrollPosition;

      // スクロール処理終了タイマーをセット
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 50) as unknown as number;
    };

    // Backlogからマークダウンへのスクロール同期
    backlogScrollHandler = () => {
      if (!syncScroll || !markdownRef || !backlogRef || isScrolling) return;

      isScrolling = true; // スクロール処理開始

      const scrollPercentage =
        backlogRef.scrollTop /
        (backlogRef.scrollHeight - backlogRef.clientHeight);

      const markdownScrollPosition =
        scrollPercentage *
        (markdownRef.scrollHeight - markdownRef.clientHeight);

      markdownRef.scrollTop = markdownScrollPosition;

      // スクロール処理終了タイマーをセット
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 50) as unknown as number;
    };

    // イベントリスナーを設定
    if (syncScroll) {
      if (markdownRef) {
        markdownRef.addEventListener("scroll", markdownScrollHandler);
      }
      if (backlogRef) {
        backlogRef.addEventListener("scroll", backlogScrollHandler);
      }
    }
  }

  // syncScroll変更時にハンドラを更新
  $: if (syncScroll !== undefined) {
    updateScrollHandlers();
  }

  // コピー機能
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(backlog);
      copySuccess = "コピーしました！";
      setTimeout(() => {
        copySuccess = "";
      }, 2000);
    } catch (err) {
      copySuccess = "コピーに失敗しました";
      setTimeout(() => {
        copySuccess = "";
      }, 2000);
    }
  }

  // マークダウン変更ハンドラ
  function handleMarkdownChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    markdown = target.value;

    if (autoConvert) {
      backlog = convertMarkdownToBacklog(markdown);
    }
  }

  // 手動変換
  function convertToBacklog() {
    backlog = convertMarkdownToBacklog(markdown);
  }

  // マークダウンからBacklog記法への変換関数
  function convertMarkdownToBacklog(text: string) {
    if (!text) return "";

    // 一時プレースホルダーの定義
    const PLACEHOLDER = {
      CODEBLOCK: "___CODEBLOCK_PLACEHOLDER___",
      TABLE: "___TABLE_PLACEHOLDER___",
      BLOCKQUOTE: "___BLOCKQUOTE_PLACEHOLDER___",
      LINK: "___LINK_PLACEHOLDER___",
      HEADING: "___HEADING_PLACEHOLDER___",
    };

    // プレースホルダーとその内容を保存するマップ
    interface PlaceholderItem {
      placeholder: string;
      content: string;
    }

    const placeholders: {
      codeBlocks: PlaceholderItem[];
      inlineCodes: PlaceholderItem[];
      tables: PlaceholderItem[];
      blockquotes: PlaceholderItem[];
      links: PlaceholderItem[];
      headings: PlaceholderItem[];
    } = {
      codeBlocks: [],
      inlineCodes: [],
      tables: [],
      blockquotes: [],
      links: [],
      headings: [],
    };

    // 段階1: コードブロックを保存・置換（最も広範囲の要素から）
    let result = text;

    // 言語指定ありのコードブロック
    result = result.replace(
      /```(\w+)\n([\s\S]+?)```/g,
      (match: string, lang: string, code: string) => {
        const placeholder = `${PLACEHOLDER.CODEBLOCK}${placeholders.codeBlocks.length}`;
        placeholders.codeBlocks.push({
          placeholder,
          content: `{code:${lang}}\n${code}\n{/code}`,
        });
        return placeholder;
      },
    );

    // 言語指定なしのコードブロック
    result = result.replace(
      /```\n([\s\S]+?)```/g,
      (match: string, code: string) => {
        const placeholder = `${PLACEHOLDER.CODEBLOCK}${placeholders.codeBlocks.length}`;
        placeholders.codeBlocks.push({
          placeholder,
          content: `{code}\n${code}\n{/code}`,
        });
        return placeholder;
      },
    );

    // 残りのコードブロックのパターン (```で始まるもの)
    result = result.replace(
      /```([\s\S]+?)```/g,
      (match: string, code: string) => {
        const placeholder = `${PLACEHOLDER.CODEBLOCK}${placeholders.codeBlocks.length}`;
        placeholders.codeBlocks.push({
          placeholder,
          content: `{code}\n${code}\n{/code}`,
        });
        return placeholder;
      },
    );

    // 段階3: 見出しを先に処理して保護
    result = result.replace(
      /^(#+)\s+(.+)$/gm,
      (match: string, hashes: string, content: string) => {
        const level = hashes.length;
        const placeholder = `${PLACEHOLDER.HEADING}${placeholders.headings.length}`;
        const stars = "*".repeat(level);
        placeholders.headings.push({
          placeholder,
          content: `${stars} ${content}`,
        });
        return placeholder;
      },
    );

    // 段階4: テーブル置換
    const tableRegex =
      /^\|(.+)\|\r?\n\|\s*[-:]+[-|\s:]*\r?\n((.*\|.*\r?\n)+)/gm;
    result = result.replace(
      tableRegex,
      (match: string, header: string, bodyWithNewlines: string) => {
        // ヘッダー行を処理 (カラム名を取得)
        const headerRow = `|${header}|h\n`;

        // bodyの行を処理
        const bodyRows = bodyWithNewlines.replace(/\r?\n$/, ""); // 最後の改行を削除

        const placeholder = `${PLACEHOLDER.TABLE}${placeholders.tables.length}`;
        placeholders.tables.push({
          placeholder,
          content: `${headerRow}${bodyRows}`,
        });
        return placeholder;
      },
    );

    // 段階5: 複数行引用ブロック置換
    result = result.replace(/((?:^>\s.+\r?\n)+)/gm, (match: string) => {
      // 引用内容を取得（> プレフィックスを削除）
      let quoteContent = match.replace(/^>\s/gm, "");

      // 引用内のインライン書式を処理
      quoteContent = quoteContent
        .replace(/\*\*(.+?)\*\*/g, "''$1''")
        .replace(/\*(.+?)\*/g, "'''$1'''")
        .replace(/~~(.+?)~~/g, "%%$1%%");

      const placeholder = `${PLACEHOLDER.BLOCKQUOTE}${placeholders.blockquotes.length}`;
      placeholders.blockquotes.push({
        placeholder,
        content: `{quote}\n${quoteContent}{/quote}\n`,
      });
      return placeholder;
    });

    // 段階6: リンク置換
    result = result.replace(
      /\[([^\]]+?)\]\(([^)]+?)\)/g,
      (match: string, text: string, url: string) => {
        const placeholder = `${PLACEHOLDER.LINK}${placeholders.links.length}`;
        placeholders.links.push({
          placeholder,
          content: `[[${text}>${url}]]`,
        });
        return placeholder;
      },
    );

    // 段階7: 基本的な変換を適用

    // まず太字を処理（箇条書きの*と混同しないように先に処理）
    result = result.replace(/\*\*([^*]+?)\*\*/g, "''$1''");

    // リスト（マークダウン - または * → Backlog -）
    const listRegex = /^(\s*)[-*]\s+([^*][^\n]*|\*[^*][^\n]*|\*\*[^\n]*)$/gm;
    result = result.replace(listRegex, (match, indent, content) => {
      let level;
      if (indentType === "tab") {
        // タブの場合、タブの数でレベルを計算
        level = (indent.match(/\t/g) || []).length + 1;
      } else {
        // スペースの場合、設定されたスペース数でレベルを計算
        level = Math.floor(indent.length / spacesPerLevel) + 1;
      }
      return "-".repeat(level) + " " + content;
    });

    // 番号付きリスト (マークダウン 1. → Backlog +)
    result = result.replace(/^(\d+)\.\s+(.+)$/gm, "+ $2");

    // チェックリストは同じ形式なので変換不要

    // 斜体 (マークダウン * → Backlog ''')
    result = result.replace(/\*([^*\n]+?)\*/g, "'''$1'''");

    // 打ち消し線 (マークダウン ~~ → Backlog %%)
    result = result.replace(/~~([^~]+?)~~/g, "%%$1%%");

    // 単一行引用 (残った引用)
    result = result.replace(/^>\s(.+)$/gm, "> $1");

    // URLの自動リンク (まだリンクになっていないURLだけ対象)
    const urlRegex = /(?<!["\[\]])(\bhttps?:\/\/[^\s<]+[^<.,:;"'\]\s])/g;
    result = result.replace(urlRegex, "[[" + "$1" + "]]");

    // 段階8: プレースホルダーを元の変換後コンテンツに戻し、見出しの前後の空行を削除

    // 見出し復元（最初に処理して他の変換に影響を与えないようにする）
    placeholders.headings.forEach((item) => {
      result = result.replace(item.placeholder, item.content);
    });
    
    // 空行の整理
    result = result
      // 1. 見出しの前後の空行を完全に削除
      .replace(/\n+(\*+\s[^\n]+)/g, "\n$1")  // 見出しの前のすべての空行を削除して改行1つに
      .replace(/(\*+\s[^\n]+)\n+/g, "$1\n")  // 見出しの後のすべての空行を削除して改行1つに
      // 2. 最後に文書全体の先頭と末尾の空行を処理
      .replace(/^\n+/, '')  // 文書先頭の空行を完全に削除
      .replace(/\n+$/, '\n');  // 文書末尾は改行1つにする

    // コードブロック復元
    placeholders.codeBlocks.forEach((item) => {
      result = result.replace(item.placeholder, item.content);
    });

    // インラインコード復元
    placeholders.inlineCodes.forEach((item) => {
      result = result.replace(item.placeholder, item.content);
    });

    // テーブル復元
    placeholders.tables.forEach((item) => {
      result = result.replace(item.placeholder, item.content);
    });

    // 引用ブロック復元
    placeholders.blockquotes.forEach((item) => {
      result = result.replace(item.placeholder, item.content);
    });

    // リンク復元
    placeholders.links.forEach((item) => {
      result = result.replace(item.placeholder, item.content);
    });

    return result;
  }
</script>

<div class="container">
  <div class="editor-container">
    <div class="editor-panel">
      <div class="panel-header">
        <h2 class="panel-title">マークダウン</h2>
      </div>
      <textarea
        bind:this={markdownRef}
        class="editor-textarea"
        value={markdown}
        on:input={handleMarkdownChange}
        placeholder="ここにマークダウン記法のテキストを入力してください"
      ></textarea>
    </div>

    <div class="controls-panel">
      <button class="convert-button" on:click={convertToBacklog}>
        変換 →
      </button>
      <div class="options">
        <div class="option-item">
          <input
            type="checkbox"
            id="autoConvert"
            bind:checked={autoConvert}
            class="option-checkbox"
          />
          <label for="autoConvert" class="option-label">自動変換</label>
        </div>
        <div class="option-item">
          <input
            type="checkbox"
            id="syncScroll"
            bind:checked={syncScroll}
            class="option-checkbox"
          />
          <label for="syncScroll" class="option-label">スクロール同期</label>
        </div>
        <div class="option-item">
          <label for="indentType" class="option-label">インデントの種類:</label>
          <select id="indentType" bind:value={indentType} class="select-input">
            <option value="space">スペース</option>
            <option value="tab">タブ</option>
          </select>
        </div>
        {#if indentType === "space"}
          <div class="option-item">
            <label for="spacesPerLevel" class="option-label">階層あたりのスペース数:</label>
            <input
              type="number"
              id="spacesPerLevel"
              bind:value={spacesPerLevel}
              min="1"
              max="8"
              class="number-input"
            />
          </div>
        {/if}
      </div>
    </div>

    <div class="editor-panel">
      <div class="panel-header">
        <h2 class="panel-title">Backlog記法</h2>
        <div class="copy-container">
          {#if copySuccess}
            <span class="copy-success">{copySuccess}</span>
          {/if}
          <button on:click={copyToClipboard} class="copy-button">
            {@html copyIcon}
            コピー
          </button>
        </div>
      </div>
      <textarea
        bind:this={backlogRef}
        class="editor-textarea output-textarea"
        value={backlog}
        readonly
        placeholder="変換されたBacklog記法のテキストがここに表示されます"
      ></textarea>
    </div>
  </div>

  <div class="conversion-table-container">
    <h3 class="table-title">変換対応表</h3>
    <div class="table-wrapper">
      <table class="conversion-table">
        <thead>
          <tr>
            <th>種類</th>
            <th>マークダウン記法</th>
            <th>Backlog記法</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-label">見出し1</td>
            <td class="table-code"># 見出し1</td>
            <td class="table-code">* 見出し1</td>
          </tr>
          <tr>
            <td class="table-label">見出し2</td>
            <td class="table-code">## 見出し2</td>
            <td class="table-code">** 見出し2</td>
          </tr>
          <tr>
            <td class="table-label">太字</td>
            <td class="table-code">**太字**</td>
            <td class="table-code">''太字''</td>
          </tr>
          <tr>
            <td class="table-label">斜体</td>
            <td class="table-code">*斜体*</td>
            <td class="table-code">'''斜体'''</td>
          </tr>
          <tr>
            <td class="table-label">打ち消し線</td>
            <td class="table-code">~~打ち消し線~~</td>
            <td class="table-code">%%打ち消し線%%</td>
          </tr>
          <tr>
            <td class="table-label">リスト</td>
            <td class="table-code">- リスト項目</td>
            <td class="table-code">- リスト項目</td>
          </tr>
          <tr>
            <td class="table-label">ネストリスト</td>
            <td class="table-code"><pre>  - サブ項目</pre></td>
            <td class="table-code">-- サブ項目</td>
          </tr>
          <tr>
            <td class="table-label">チェックリスト</td>
            <td class="table-code">- [ ] チェック項目</td>
            <td class="table-code">- [ ] チェック項目</td>
          </tr>
          <tr>
            <td class="table-label">完了チェック</td>
            <td class="table-code">- [x] 完了項目</td>
            <td class="table-code">- [x] 完了項目</td>
          </tr>
          <tr>
            <td class="table-label">番号付きリスト</td>
            <td class="table-code">1. 番号付き項目</td>
            <td class="table-code">+ 番号付き項目</td>
          </tr>
          <tr>
            <td class="table-label">リンク</td>
            <td class="table-code">[リンク](URL)</td>
            <td class="table-code">[[リンク>URL]]</td>
          </tr>
          <tr>
            <td class="table-label">インラインコード</td>
            <td class="table-code">`コード`</td>
            <td class="table-code">x</td>
          </tr>
          <tr>
            <td class="table-label">コードブロック</td>
            <td class="table-code">```java<br />コード<br />```</td>
            <td class="table-code">
              {"{code:java}"}<br />コード<br />{"{/code}"}
            </td>
          </tr>
          <tr>
            <td class="table-label">引用</td>
            <td class="table-code">> 引用テキスト</td>
            <td class="table-code">> 引用テキスト</td>
          </tr>
          <tr>
            <td class="table-label">複数行引用</td>
            <td class="table-code">> 行1<br />> 行2</td>
            <td class="table-code">
              {"{quote}"}<br />行1<br />行2<br />{"{/quote}"}
            </td>
          </tr>
          <tr>
            <td class="table-label">表</td>
            <td class="table-code"
              >| 列1 | 列2 |<br />| --- | --- |<br />| 値1 | 値2 |</td
            >
            <td class="table-code">| 列1 | 列2 |h<br />| 値1 | 値2 |</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  /* 全体コンテナ */
  .container {
    padding: 1rem;
    margin: 0 auto;
  }

  /* エディタコンテナ */
  .editor-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .editor-container {
      flex-direction: row;
    }
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
    height: 60vh;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    resize: vertical;
  }

  .output-textarea {
    background-color: #f9fafb;
  }

  /* コントロールパネル */
  .controls-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
  }

  .convert-button {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  .convert-button:hover {
    background-color: #2563eb;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .option-checkbox {
    height: 1rem;
    width: 1rem;
    color: #3b82f6;
  }

  .option-label {
    font-size: 0.875rem;
    color: #4b5563;
  }

  .select-input {
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .number-input {
    width: 4rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #4b5563;
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

  textarea {
    font-family: inherit;
    font-size: 1rem;
  }

  /* 変換対応表 */
  .conversion-table-container {
    margin-top: 2rem;
  }

  .table-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .conversion-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #d1d5db;
  }

  .conversion-table th,
  .conversion-table td {
    border: 1px solid #d1d5db;
    padding: 0.5rem 1rem;
    text-align: left;
  }

  .conversion-table th {
    background-color: #f3f4f6;
  }

  .table-label {
    font-weight: 500;
  }

  .table-code {
    font-family: monospace;
    font-size: 0.875rem;
  }
</style>
