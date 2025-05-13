// src/events/ready.ts
import { Client, Events, ActivityType } from 'discord.js';
import websocketRouter, { websocketHandler } from '../../api/routes/websocket';
import app from '../../api';
import pool from '../../database/mariadb'; // Import MariaDB connection

export default {
  name: Events.ClientReady,
  once: true,

  execute: async (client: Client) => {
    const PORT = process.env.port || 3000;

    const guildCount = client.guilds.cache.size;
    const time = new Date().toLocaleString("fr-FR", {
      hour12: false,
      timeZone: "Europe/Paris"
    });

    const banner = [
      "╔══════════════════════════════════════════════════╗",
      "║              🤖 BOT CONNECTED – BETA 🤖          ║",
      "╚══════════════════════════════════════════════════╝"
    ].join("\n");

    console.clear();

    console.log(
      "%c" + banner,
      "background:#222; color:#61dafb; font-size:14px; padding:6px 12px; border-radius:6px;"
    );

    // MariaDB connection check
    try {
      const connection = await pool.getConnection();
      console.log(
        "%c✔️  MariaDB connected",
        "color:#0a0; font-size:12px;"
      );
      connection.release();
    } catch (err) {
      console.error(
        "%c❌  MariaDB connection error: " + err,
        "color:#a00; font-size:12px;"
      );
    }

    const server = app.listen(PORT, () => {
      console.log(`%c🌐  Server started on port http://localhost:${PORT}`, "color:#888; font-size:12px;");
    });

    server.on('upgrade', (request, socket, head) => {
      websocketHandler.handleUpgrade(request, socket, head);
    });

    console.log(
      "%c✔️  Toutes les commandes slash ont été ajoutées sur les serveurs !",
      "color:#0a0; font-size:12px;"
    );

    console.log(
      "%c🕒  Time :%c " + time,
      "color:#888; font-size:12px;",
      ""
    );

    console.log(
      "%c🤝  Servers :%c " + guildCount,
      "color:#888; font-size:12px;",
      ""
    );

    console.groupCollapsed(
      "%c🔍  Server details",
      "color:#555; font-size:12px;"
    );
    client.guilds.cache.forEach(guild => {
      console.log(`• ${guild.name} (${guild.id}) (shard: ${guild.shardId})`);
    });
    console.groupEnd();

    console.log(
      "%c✔️  Ready for action!",
      "color:#0a0; font-style:italic; font-size:13px;"
    );

    client.user?.setPresence({
      status: "dnd",
      activities: [
        {
          name: "Beta Bot",
          type: ActivityType.Streaming,
          url: "https://www.twitch.tv/betasown"
        }
      ]
    });
  },
};