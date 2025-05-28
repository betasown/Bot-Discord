import { ModalSubmitInteraction } from 'discord.js';
import { writeFile, readFile } from 'fs/promises';
import { ensureDailyNote } from '../../function/bot/noteUtils';

export default {
  id: 'soiree_modal',
  async execute(interaction: ModalSubmitInteraction) {
    const coucher = interaction.fields.getTextInputValue('coucher');
    const satisfaction = interaction.fields.getTextInputValue('satisfaction');

    const date = new Date().toISOString().slice(0, 10);
    const filePath = await ensureDailyNote(date);

    let content = await readFile(filePath, 'utf-8');
    const soireeSection = [
      '## 🌙 **Soirée / Fin de journée :**',
      '',
      `- 🛏️ Heure de coucher prévue : ${coucher}`,
      `- 😌 Niveau de satisfaction globale (1 à 10) : ${satisfaction}`,
      '',
    ].join('\n');

    // Supprime toutes les occurrences existantes de la section
    const regex = /## 🌙 \*\*Soirée \/ Fin de journée :\*\*[\s\S]*?(?=^## |\Z)/gm;
    content = content.replace(regex, '');

    // Ajoute la section à la bonne place (à la fin du fichier)
    content = content.trim() + '\n\n' + soireeSection + '\n';

    await writeFile(filePath, content.trim() + '\n', 'utf-8');

    await interaction.reply({
      content: `✅ Section "Soirée / Fin de journée" enregistrée dans \`${date}.md\` !`,
      ephemeral: true,
    });
  },
};