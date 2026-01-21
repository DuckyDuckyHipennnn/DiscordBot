import express from "express"
import {
  Client,
  GatewayIntentBits,
  ActivityType,
  AttachmentBuilder
} from "discord.js"
import axios from "axios"
import "dotenv/config"

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`)

  const statuses = [
    "Sending HTTP requests",
    "GET / POST / DELETE",
    "24/7 Online",
    "API Power"
  ]

  let i = 0
  setInterval(() => {
    client.user.setActivity(
      statuses[i++ % statuses.length],
      { type: ActivityType.Playing }
    )
  }, 10000)
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "ping") {
    return interaction.reply(`Pong! ${client.ws.ping}ms`)
  }

  if (interaction.commandName === "request") {
    const method = interaction.options.getString("method")
    const url = interaction.options.getString("url")
    const headers = interaction.options.getString("headers")
    const body = interaction.options.getString("body")

    try {
      const res = await axios({
        method,
        url,
        headers: headers ? JSON.parse(headers) : {},
        data: body ? JSON.parse(body) : undefined
      })

      const data =
        typeof res.data === "object"
          ? JSON.stringify(res.data, null, 2)
          : String(res.data)

      if (data.length > 1900) {
        const buffer = Buffer.from(data, "utf-8")
        const file = new AttachmentBuilder(buffer, {
          name: "response.txt"
        })

        await interaction.reply({
          content: `Status: ${res.status} (response sent as file)`,
          files: [file]
        })
      } else {
        await interaction.reply(
          `Status: ${res.status}\n\`\`\`${data}\`\`\``
        )
      }

    } catch (err) {
      await interaction.reply(
        `❌ Error\n\`\`\`${err.message}\`\`\``
      )
    }
  }
})
const app = express()

app.get("/", (req, res) => {
  res.send("Bot is alive 🚀")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`)
})

client.login(process.env.TOKEN)
