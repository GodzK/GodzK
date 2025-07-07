const axios = require('axios');
const fs = require('fs');

const key = process.env.OPENROUTER_KEY;
async function parseText(text) {
  const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model: 'openai/gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Parse Thai date/time/task into JSON: {date, time, task}.' },
      { role: 'user', content: text }
    ],
    response_format: {type:'json_object'}
  }, {
    headers: { Authorization: `Bearer ${key}` }
  });
  return res.data.choices[0].message.content;
}

(async () => {
  const input = process.argv[2];
  const parsed = await parseText(input);
  // อ่าน + update todolist.json
  const todo = JSON.parse(fs.readFileSync('todolist.json','utf8'));
  const d = parsed.date;
  todo[d] = todo[d]||[];
  todo[d].push({time:parsed.time,task:parsed.task});
  fs.writeFileSync('todolist.json', JSON.stringify(todo,null,2));
})();
