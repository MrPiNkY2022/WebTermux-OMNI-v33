socket.on('ai-query', async (prompt) => {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROK_API_KEY}` },
    body: JSON.stringify({ model: 'grok-beta', messages: [{ role: 'user', content: prompt }] })
  });
  const data = await response.json();
  socket.emit('ai-response', data.choices[0].message.content);
});
