// ⇩ 粘进 Console，回车；然后右键 Console 输出 → Copy message
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