const fs = require('fs');
const axios = require('axios');

const LINE_TOKEN = process.env.LINE_TOKEN;
const WEATHER_KEY = process.env.WEATHER_KEY;
const LAT = 13.736717;
const LON = 100.523186;

function getThaiDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getDayName() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Bangkok' });
}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${WEATHER_KEY}&units=metric&lang=th`;
  const res = await axios.get(url);
  const now = new Date();
  for (let item of res.data.list) {
    const dt = new Date(item.dt * 1000);
    if (dt.getHours() === 8 && dt.getDate() === now.getDate()) {
      return `เวลา 08:00 - ${item.weather[0].description}`;
    }
  }
  return 'ไม่พบข้อมูลอากาศช่วง 8 โมง';
}

function getToDo(date) {
  const data = JSON.parse(fs.readFileSync('./todolist.json', 'utf8'));
  const list = data[date] || [];
  return list.map(item => `• ${item.time} - ${item.task}`).join('\n') || 'ไม่มีงานวันนี้ 🎉';
}

function getSchedule(day) {
  const data = JSON.parse(fs.readFileSync('./schedule.json', 'utf8'));
  const list = data[day] || [];
  return list.map(item => `• ${item.time} - ${item.subject}`).join('\n') || 'ไม่มีตารางเรียนวันนี้ 📕';
}

async function sendToLINE(message) {
  await axios.post('https://api.line.me/v2/bot/message/push', {
    to: 'YOUR_USER_ID', // หรือ ใช้ broadcast message แทน
    messages: [{ type: 'text', text: message }]
  }, {
    headers: {
      'Authorization': `Bearer ${LINE_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}

(async () => {
  const date = getThaiDate();
  const day = getDayName();
  const weather = await getWeather();
  const todo = getToDo(date);
  const schedule = getSchedule(day);

  const msg = `🌤 สภาพอากาศวันนี้:\n${weather}\n\n📝 สิ่งที่ต้องทำวันนี้:\n${todo}\n\n📚 ตารางเรียน:\n${schedule}`;
  await sendToLINE(msg);
})();
