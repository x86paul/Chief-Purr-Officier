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

app.command("/cpo-knock", async ({ command, ack, respond }) => {
    await ack();
    const target = command.text || "this channel's productivity";

    await respond({
        text: `_stares directly into your eyes_`,
        response_type: "in_channel"
    });

    setTimeout(async () => {
        await respond({
            text: `_slowly extends paw towards ${target}_`,
            response_type: "in_channel"
        });
    }, 1500);

    setTimeout(async () => {
        await respond({
            text: `**SWIPE.** ${target} has been knocked off the table. It is now shattered on the floor. Look what you made me do.`,
            response_type: "in_channel"
        });
    }, 3000);
});
app.command("/cpo-explode", async ({ command, ack, respond }) => {
    await ack();
    const target = command.text || `<@${command.user_id}>`;

    await respond({
        text: `*The Chief Purr-officer approaches ${target} while purring softly...*`,
        response_type: "in_channel"
    });

    setTimeout(async () => {
        await respond({
            text: `*CRITICAL ERROR: OVERSTIMULATION DETECTED.* The tail begins to twitch violently. The purring sounds like a ticking time bomb.`,
            response_type: "in_channel"
        });
    }, 1800);

    setTimeout(async () => {
        await respond({
            text: `*HIIIIISSSSSSSSSCCCHHHHHHH—*`,
            response_type: "in_channel"
        });
    }, 3500);

    setTimeout(async () => {
        await respond({
            text: ` **KABOOM!** The Chief has absolutely detonated. ${target} is covered in flying fur, structural smoke, and pure unadulterated feline rage. Reverting to liquid state.`,
            response_type: "in_channel"
        });
    }, 5000);
});
(async () => {
    await app.start();
    console.log("⚡️ His Royal Highness, the Chief Purr-officer, has awakened!");
})();