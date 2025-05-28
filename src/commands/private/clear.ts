import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime un nombre de messages dans le salon')
    .addIntegerOption(option =>
      option.setName('nombre')
        .setDescription('Nombre de messages à supprimer (max 100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction: any) {
    const amount = interaction.options.getInteger('nombre');
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'Merci de choisir un nombre entre 1 et 100.', ephemeral: true });
    }

    await interaction.channel.bulkDelete(amount, true)
      .then((deleted: import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').Message>) => {
        interaction.reply({ content: `🧹 ${deleted.size} messages supprimés !`, ephemeral: true });
      })
      .catch(() => {
        interaction.reply({ content: 'Erreur lors de la suppression des messages.', ephemeral: true });
      });
  },
};