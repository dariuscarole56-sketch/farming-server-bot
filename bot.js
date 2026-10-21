
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Bot conectat: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith("!djoin")) return;

  const serverId = message.content.trim().split(/\s+/)[1];

  if (!serverId) {
    return message.reply("Folosește !djoin ID_SERVER");
  }

  const guild = client.guilds.cache.get(serverId);

  if (!guild) {
    return message.reply("Nu găsesc serverul sau botul nu este membru.");
  }

  const channel = guild.channels.cache.find(
    c => c.type === 0 &&
    c.permissionsFor(client.user)?.has("CreateInstantInvite")
  );

  if (!channel) {
    return message.reply("Nu pot crea invitația. Verifică permisiunile.");
  }

  try {
    const invite = await channel.createInvite({
      maxAge: 86400,
      maxUses: 0
    });

    await message.reply(`Invitație pentru membri reali: ${invite.url}`);
  } catch {
    await message.reply("Nu am putut crea invitația.");
  }
});

client.login(process.env.DISCORD_TOKEN);
