import { SlashCommandBuilder } from 'discord.js';
import pool from '../../database/mariadb';

export const command = {
  data: new SlashCommandBuilder()
    .setName('addtask')
    .setDescription('Ajoute une tâche à la to-do list.')
    .addStringOption(option =>
      option.setName('nom')
        .setDescription('Le nom de la tâche')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Le statut de la tâche')
        .addChoices(
          { name: 'Pas commencé', value: 'pas commencé' },
          { name: 'En cours', value: 'en cours' },
          { name: 'Terminé', value: 'terminer' }
        )
        .setRequired(true))
    .addStringOption(option =>
      option.setName('criticite')
        .setDescription('La criticité de la tâche')
        .addChoices(
          { name: 'Normal', value: 'normal' },
          { name: 'Haut', value: 'haut' },
          { name: 'Critique', value: 'critique' }
        )
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('La description de la tâche')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('deadline')
        .setDescription('La date limite (YYYY-MM-DD)')
        .setRequired(false)),
  async execute(interaction: any) {
    const nom = interaction.options.getString('nom');
    const description = interaction.options.getString('description') || null;
    const status = interaction.options.getString('status');
    const criticite = interaction.options.getString('criticite');
    const deadline = interaction.options.getString('deadline') || null;

    try {
      const [result] = await pool.query(
        `INSERT INTO to_do (nom, description, status, criticite, deadline) VALUES (?, ?, ?, ?, ?)`,
        [nom, description, status, criticite, deadline]
      );

      await interaction.reply(`✅ Tâche "${nom}" ajoutée avec succès !`);
    } catch (error) {
      console.error(error);
      await interaction.reply('❌ Une erreur est survenue lors de l\'ajout de la tâche.');
    }
  },
};