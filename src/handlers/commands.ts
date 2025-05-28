import { Client, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Charger les variables d'environnement

declare module 'discord.js' {
  interface Client {
    commands: any;
  }
}

const loadCommands = (client: Client, directory: string, body: object[]) => {
  const files = readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const path = join(directory, file.name);

    if (file.isDirectory()) {
      loadCommands(client, path, body);
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
      const command = require(path).command;
      body.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
      console.log(`Commande ${command.data.name} chargée !`);
    }
  }
};

module.exports = async (client: Client) => {
  const body: object[] = [];
  const commandsDir = join(__dirname, '../commands/public');
  const token = process.env.token || '';
  const clientid = process.env.client || '';
  const guildid = process.env.guild || ''; // ID du serveur spécifique

  if (!guildid) {
    console.error('❌ L\'ID du serveur (guild) est manquant dans le fichier .env.');
    return;
  }

  loadCommands(client, commandsDir, body);

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('🔄 Enregistrement des commandes spécifiques au serveur...');
    await rest.put(Routes.applicationGuildCommands(clientid, guildid), { body: body });
    console.log('✔️  Commandes spécifiques au serveur enregistrées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement des commandes spécifiques au serveur :', error);
  }
};