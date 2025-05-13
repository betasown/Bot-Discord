import { SlashCommandBuilder } from 'discord.js';
import pool from '../../database/mariadb';

export const command = {
  data: new SlashCommandBuilder()
    .setName('listtasks')
    .setDescription('Affiche toutes les tâches de la to-do list.'),
  async execute(interaction: any) {
    try {
      // Récupérer toutes les tâches depuis la base de données
      const [rows]: any = await pool.query('SELECT * FROM to_do');

      if (rows.length === 0) {
        return interaction.reply('📋 La to-do list est vide.');
      }

      // Construire un message avec les tâches
      const tasks = rows.map((task: any) => {
        return `**ID**: ${task.id}\n**Nom**: ${task.nom}\n**Description**: ${task.description || 'Aucune'}\n**Statut**: ${task.status}\n**Criticité**: ${task.criticite}\n**Deadline**: ${task.deadline || 'Aucune'}\n`;
      }).join('\n---\n');

      // Répondre avec la liste des tâches
      await interaction.reply(`📋 **Liste des tâches**:\n\n${tasks}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('❌ Une erreur est survenue lors de la récupération des tâches.');
    }
  },
};