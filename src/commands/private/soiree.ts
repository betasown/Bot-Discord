import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('soiree')
    .setDescription('Remplir ou modifier la section Soirée / Fin de journée'),
  async execute(interaction: any) {
    const modal = new ModalBuilder()
      .setCustomId('soiree_modal')
      .setTitle('Soirée / Fin de journée');

    const coucher = new TextInputBuilder()
      .setCustomId('coucher')
      .setLabel('🛏️ Heure de coucher prévue')
      .setStyle(TextInputStyle.Short);

    const satisfaction = new TextInputBuilder()
      .setCustomId('satisfaction')
      .setLabel('😌 Niveau de satisfaction globale (1 à 10)')
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(coucher),
      new ActionRowBuilder<TextInputBuilder>().addComponents(satisfaction)
    );

    await interaction.showModal(modal);
  },
};