import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const command = {
  data: new SlashCommandBuilder()
    .setName('viewnote')
    .setDescription('Affiche ta daily note du jour ou d\'une date précise')
    .addStringOption(option =>
      option.setName('date')
        .setDescription('Date au format YYYY-MM-DD (optionnel)')
        .setRequired(false)
    ),
  async execute(interaction: any) {
    const date = interaction.options.getString('date') || new Date().toISOString().slice(0, 10);
    // Utilise le chemin absolu depuis la racine du projet
    const filePath = join(process.cwd(), 'notes', `${date}.md`);

    try {
      const content = await readFile(filePath, 'utf-8');
      const embed = new EmbedBuilder()
        .setTitle(`📝 Daily Note du ${date}`)
        .setDescription(content.length > 4000 ? content.slice(0, 3990) + '...' : content)
        .setColor('#FFD700');
      await interaction.reply({ embeds: [embed]});
    } catch (err) {
      await interaction.reply({ content: `❌ Aucune note trouvée pour le ${date}.`});
    }
  },
};