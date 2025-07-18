const axios = require('axios');
const fs = require('fs');

const LINE_TOKEN = process.env.LINE_TOKEN;
const WEATHER_KEY = process.env.WEATHER_KEY;

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Bangkok&APPID=13b66952a0d21f7e74831f37aa0433d8&units=metric&lang=th`;
  const res = await axios.get(url);
  const w = res.data.weather[0].description;
  const temp = res.data.main.temp;
  return `สภาพอากาศวันนี้: ${w}, อุณหภูมิประมาณ ${temp}°C`;
}

async function sendLineMessage(message) {
  await axios.post('https://api.line.me/v2/bot/message/push', {
    to: process.env.USER_ID,
    messages: [{ type: "text", text: message }]
  }, {
    headers: {
      'Authorization': `Bearer ${LINE_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}

async function main() {
  try {
    const todo = JSON.parse(fs.readFileSync('todolist.json','utf8'));
    const today = new Date().toISOString().slice(0,10);
    let msg = await getWeather() + '\n\n';
    if(todo[today]) {
      msg += 'รายการที่ต้องทำวันนี้:\n';
      todo[today].forEach(e => {
        msg += `- เวลา ${e.time}: ${e.task}\n`;
      });
    } else {
      msg += 'วันนี้ไม่มีงานที่บันทึกไว้ครับ';
    }
    await sendLineMessage(msg);
    console.log("Message sent.");
  } catch(e) {
    console.error(e);
  }
}

main();
