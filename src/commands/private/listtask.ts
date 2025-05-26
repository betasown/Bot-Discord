import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
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

      // Construire un embed pour afficher les tâches
      const embed = new EmbedBuilder()
        .setTitle('📋 Liste des tâches')
        .setColor('#00AAFF')
        .setTimestamp();

      // Ajouter les tâches sous forme de tableau
      rows.forEach((task: any) => {
        embed.addFields({
          name: task.nom,
          value: `**Description**: ${task.description || 'Aucune'}\n**Statut**: ${task.status}\n**Criticité**: ${task.criticite}\n**Deadline**: ${task.deadline || 'Aucune'}`,
        });
      });

      // Répondre avec l'embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('❌ Une erreur est survenue lors de la récupération des tâches.');
    }
  },
};