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