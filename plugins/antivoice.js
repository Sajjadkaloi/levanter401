const { bot, isAdmin, getBuffer } = require('../lib');
const { getAntiVoice, setAntiVoice } = require('../lib/db'); // yeh aap ko banana hoga

bot(
  {
    pattern: 'antivoice ?(.*)',
    desc: 'Enable or disable voice note deletion for group',
    onlyGroup: true,
    type: 'group',
  },
  async (message, match) => {
    const status = await getAntiVoice(message.jid);
    if (!['on', 'off'].includes(match)) {
      return await message.send(
        `Antivoice is currently *${status ? 'activated' : 'deactivated'}*\nUse: antivoice on/off`
      );
    }
    await setAntiVoice(message.jid, match === 'on');
    return await message.send(`Antivoice has been *${match === 'on' ? 'activated' : 'deactivated'}*`);
  }
);

// Voice message listener
bot(
  {
    on: 'message',
    type: 'group',
  },
  async (message) => {
    const status = await getAntiVoice(message.jid);
    if (!status) return;

    if (message.type === 'audioMessage' || message.type === 'ptt') {
      const is_sender_admin = await isAdmin(message.jid, message.participant);
      if (!is_sender_admin) {
        await message.delete();
      }
    }
  }
);