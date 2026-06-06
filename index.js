require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/cpo-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/cpo-help", async ({ ack, respond }) => {
    await ack();
    await respond({
        text: `Available Commands:
/cpo-ping - Check bot latency
/cpo-joke - Get a random joke
/cpo-catfact - Get a cat fact
/cpo-knock - Knock something valuable off the table
/cpo-explode - Overstimulate the Chief and trigger a detonation`
    });
});

app.command("/cpo-catfact", async ({ ack, respond }) => {
    await ack();
    try {
        const response = await axios.get("https://catfact.ninja/fact");
        await respond({ text: `Cat Fact:\n${response.data.fact}` });
    } catch (err) {
        await respond({ text: "Failed to fetch a cat fact." });
    }
});

app.command("/cpo-joke", async ({ ack, respond }) => {
    await ack();
    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await respond({
            text: `${response.data.setup}\n\n${response.data.punchline}`
        });
    } catch (err) {
        await respond({ text: "Failed to fetch a joke." });
    }
});

app.command("/cpo-knock", async ({ command, ack, say }) => {
    await ack();
    const target = command.text || "this channel's productivity";

    await say(`_stares directly into your eyes_`);

    setTimeout(async () => {
        await say(`_slowly extends paw towards ${target}_`);
    }, 1500);

    setTimeout(async () => {
        await say(`💥 **SWIPE.** ${target} has been knocked off the table. It is now shattered on the floor. Look what you made me do.`);
    }, 3000);
});

app.command("/cpo-explode", async ({ command, ack, say }) => {
    await ack();

    const target = command.text || `<@${command.user_id}>`;

    await say(`🐱 *The Chief Purr-officer approaches ${target} while purring softly...*`);

    setTimeout(async () => {
        await say(`⚠️ *CRITICAL ERROR: OVERSTIMULATION DETECTED.* The tail begins to twitch violently. The purring sounds like a ticking time bomb.`);
    }, 1800);

    setTimeout(async () => {
        await say(`😾 *HIIIIISSSSSSSSSSSSSS—*`);
    }, 3500);

    setTimeout(async () => {
        await say(`💥 **KABOOM!** The Chief has absolutely detonated. ${target} is covered in flying fur, structural smoke, and pure unadulterated feline rage. Reverting to liquid state.`);
    }, 5000);
});

app.message(/(code|server|laptop|keyboard|working|deadline|pushed|build)/i, async ({ message, say }) => {

    if (Math.random() < 0.15) {

        const keys = "asdfghjkl;;;;;fffffvvvvvbbbbnnnnm";
        let mash = "";
        for (let i = 0; i < 28; i++) {
            mash += keys.charAt(Math.floor(Math.random() * keys.length));
        }

        await say(`\`${mash}\``);

        setTimeout(async () => {
            await say(`_“Apologies, humans. His Royal Highness was taking a shortcut across the warm keyboard to get to the sunny spot on the desk.”_ ☀️`);
        }, 1200);
    }
});

(async () => {
    await app.start();
    console.log("⚡️ His Royal Highness, the Chief Purr-officer, has awakened!");
})();