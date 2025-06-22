const { getData, saveData } = require('./db-utils'); // depends on your db system

const file = 'antivoice.json';

async function getAntiVoice(jid) {
  const data = await getData(file);
  return data[jid] || false;
}

async function setAntiVoice(jid, value) {
  const data = await getData(file);
  data[jid] = value;
  await saveData(file, data);
}

module.exports = { getAntiVoice, setAntiVoice };