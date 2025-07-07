const axios = require('axios');
const fs = require('fs');

async function parseText(text) {
  const body = {
    model: "openai/gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that extracts date, time and task from Thai sentences into JSON format {date: string, time: string, task: string}." },
      { role: "user", content: text }
    ]
  };
  const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', body);
  return JSON.parse(res.data.choices[0].message.content);
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("Please provide input text as argument");
    process.exit(1);
  }

  try {
    const parsed = await parseText(input);
    const todo = JSON.parse(fs.readFileSync('todolist.json','utf8'));
    if (!todo[parsed.date]) todo[parsed.date] = [];
    todo[parsed.date].push({ time: parsed.time, task: parsed.task });
    fs.writeFileSync('todolist.json', JSON.stringify(todo, null, 2));
    console.log("Updated todolist.json:", todo);
  } catch(e) {
    console.error("Error:", e.message);
  }
}

main();
