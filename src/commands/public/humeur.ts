import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('humeur')
    .setDescription('Remplir la section Humeur & Énergie'),
  async execute(interaction: any) {
    const modal = new ModalBuilder()
      .setCustomId('humeur_modal')
      .setTitle('Humeur & Énergie');

    const humeur = new TextInputBuilder()
      .setCustomId('humeur')
      .setLabel('😄 Humeur (1 à 5)')
      .setStyle(TextInputStyle.Short);

    const energie = new TextInputBuilder()
      .setCustomId('energie')
      .setLabel('⚡ Niveau d’énergie (1 à 5)')
      .setStyle(TextInputStyle.Short);

    const meteo = new TextInputBuilder()
      .setCustomId('meteo')
      .setLabel('🌤 Météo')
      .setStyle(TextInputStyle.Short);

    const cafe = new TextInputBuilder()
      .setCustomId('cafe')
      .setLabel('☕ Café du matin ?')
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(humeur),
      new ActionRowBuilder<TextInputBuilder>().addComponents(energie),
      new ActionRowBuilder<TextInputBuilder>().addComponents(meteo),
      new ActionRowBuilder<TextInputBuilder>().addComponents(cafe)
    );

    await interaction.showModal(modal);
  },
};