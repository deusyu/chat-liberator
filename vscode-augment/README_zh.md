方案 1 | Raw：最小必需，先把内容「捞」出来

特点：
• 不猜格式、不加围栏，完全保真；
• 输出 Markdown，以 ### 🙋‍♂️User / 🤖Augment 分段；
• Memory/Context 之类额外块也原样带走。

// ⇩ 粘进 Console，回车；然后右键 Console 输出 → Copy message
```js
(() => {
  const nodes = [...document.querySelectorAll(`
      .c-chat-message,
      .c-tool-memory-retrieval__details,
      .c-tool-memories__details
  `)];
  if (!nodes.length) { console.error('❌ nothing found'); return; }

  const md = nodes.map(n => {
    if (n.classList.contains('c-chat-message')) {
      const role = n.classList.contains('c-chat-message--user')
                     ? '🙋‍♂️ **User**' : '🤖 **Augment**';
      return `### ${role}\n\n${n.innerText.trim()}`;
    }
    // 其它块保持原样，注明来源
    const label = n.classList.contains('c-tool-memory-retrieval__details')
                    ? '📂 **Memory Retrieval**'
                  : n.classList.contains('c-tool-memories__details')
                    ? '🧠 **Context Memory**'
                  : '🔹 **Extra**';
    return `### ${label}\n\n${n.innerText.trim()}`;
  }).join('\n\n');

  console.log(md);          // ← 手动 Copy
})();
```
用法
	1.	聊天窗口滚到最顶 → Help › Toggle Developer Tools → Console
	2.	粘贴脚本 ⏎ → 右键 Console 输出 “Copy message”
	3.	粘到任何编辑器 (raw.md) —— 数据就安全落地了✅

⸻

方案 2 | Beautify：在 Raw 基础上自动加代码围栏

特点：
• 遇到明显的 SQL / Java / 缩进段落 → 自动包  ；
• 输出依然是 Markdown，可直接贴 Notion / Obsidian；
• 若判断失误，随时回退到方案 1 的原始文件。
```js
(() => {
  const nodes = [...document.querySelectorAll(`
      .c-chat-message,
      .c-tool-memory-retrieval__details,
      .c-tool-memories__details
  `)];
  if (!nodes.length) { console.error('❌ nothing found'); return; }

  /* — 判断是否像代码块 — */
  const looksCode = t =>
      /^ {2,}\S/m.test(t) ||                        // 行首多空格
      /CREATE\s+TABLE|INSERT|SELECT|public\s+class/.test(t);

  const fence = t => {
    if (!looksCode(t)) return t;
    const lang =
        /CREATE\s+TABLE|INSERT|SELECT/.test(t) ? 'sql' :
        /public\s+class|void\s+main/.test(t)   ? 'java' : '';
    return `\`\`\`${lang}\n${t}\n\`\`\``;
  };

  const md = nodes.map(n => {
    let body = fence(n.innerText.trim());

    if (n.classList.contains('c-chat-message')) {
      const role = n.classList.contains('c-chat-message--user')
                     ? '🙋‍♂️ **User**' : '🤖 **Augment**';
      return `### ${role}\n\n${body}`;
    }
    if (n.classList.contains('c-tool-memory-retrieval__details'))
      return `### 📂 **Memory Retrieval**\n\n${body}`;
    if (n.classList.contains('c-tool-memories__details'))
      return `### 🧠 **Context Memory**\n\n${body}`;
    return `### 🔹 **Extra**\n\n${body}`;
  }).join('\n\n');

  console.log(md);          // ← 手动 Copy
})();
```

⸻

建议的工作流
	1.	先跑方案 1 ➜ 保存 chat_raw.md —— 原汁原味，可随时复原。
	2.	再跑 方案 2 ➜ 得 chat_pretty.md —— 人类阅读友好。
	3.	如果美化脚本误把普通段落围成代码，只需在编辑器里删掉围栏即可。