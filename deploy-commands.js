import { REST, Routes, SlashCommandBuilder } from "discord.js"
import "dotenv/config"

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot"),

  new SlashCommandBuilder()
    .setName("request")
    .setDescription("Send an HTTP request")
    .addStringOption(option =>
      option
        .setName("method")
        .setDescription("HTTP method")
        .setRequired(true)
        .addChoices(
          { name: "GET", value: "get" },
          { name: "POST", value: "post" },
          { name: "PUT", value: "put" },
          { name: "DELETE", value: "delete" }
        )
    )
    .addStringOption(option =>
      option
        .setName("url")
        .setDescription("Request URL")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("headers")
        .setDescription("JSON headers")
    )
    .addStringOption(option =>
      option
        .setName("body")
        .setDescription("JSON body")
    )
].map(cmd => cmd.toJSON())

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN)

await rest.put(
  Routes.applicationGuildCommands(
    process.env.CLIENT_ID,
    process.env.GUILD_ID
  ),
  { body: commands }
)

console.log("✅ Slash commands registered")
