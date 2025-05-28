import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('habitudes')
    .setDescription('Remplir ou modifier la section Habitudes'),
  async execute(interaction: any) {
    const modal = new ModalBuilder()
      .setCustomId('habitudes_modal')
      .setTitle('Habitudes du jour');

    const sommeil = new TextInputBuilder()
      .setCustomId('sommeil')
      .setLabel('🛌 - 8h de sommeil (oui/non)')
      .setStyle(TextInputStyle.Short);

    const eau = new TextInputBuilder()
      .setCustomId('eau')
      .setLabel('🍶 - Nombre de gourdes (ex: 2)')
      .setStyle(TextInputStyle.Short);

    const lecture = new TextInputBuilder()
      .setCustomId('lecture')
      .setLabel('📖 - Lire 15 min (oui/non)')
      .setStyle(TextInputStyle.Short);

    const echecs = new TextInputBuilder()
      .setCustomId('echecs')
      .setLabel('♟️ - Leçon échec (oui/non)')
      .setStyle(TextInputStyle.Short);

    const ecran = new TextInputBuilder()
      .setCustomId('ecran')
      .setLabel('📱 - Temps d\'écran (ex: 2h30)')
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(sommeil),
      new ActionRowBuilder<TextInputBuilder>().addComponents(eau),
      new ActionRowBuilder<TextInputBuilder>().addComponents(lecture),
      new ActionRowBuilder<TextInputBuilder>().addComponents(echecs),
      new ActionRowBuilder<TextInputBuilder>().addComponents(ecran)
    );

    await interaction.showModal(modal);
  },
};