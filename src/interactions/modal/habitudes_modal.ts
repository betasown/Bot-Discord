import { ModalSubmitInteraction } from 'discord.js';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { ensureDailyNote } from '../../function/bot/noteUtils';

export default {
  id: 'habitudes_modal',
  async execute(interaction: ModalSubmitInteraction) {
    const sommeil = interaction.fields.getTextInputValue('sommeil');
    const eau = interaction.fields.getTextInputValue('eau');
    const lecture = interaction.fields.getTextInputValue('lecture');
    const echecs = interaction.fields.getTextInputValue('echecs');
    const ecran = interaction.fields.getTextInputValue('ecran');

    const date = new Date().toISOString().slice(0, 10);
    const filePath = await ensureDailyNote(date);

    let content = await readFile(filePath, 'utf-8');
    const habitudesSection = [
      '## 📍- **Habitudes :**',
      '',
      `- [${sommeil.toLowerCase() === 'oui' ? 'x' : ' '}] 🛌 - 8h de sommeil`,
      `- [${parseInt(eau) > 0 ? 'x' : ' '}] 🍶 - Boire 1,5 L d'eau - nombre de gourdes : ${eau}`,
      `- [${lecture.toLowerCase() === 'oui' ? 'x' : ' '}] 📖 - Lire 15 min`,
      `- [${echecs.toLowerCase() === 'oui' ? 'x' : ' '}] ♟️ - Leçon échec`,
      `- [${ecran ? 'x' : ' '}] 📱 - Temps d'écran : ${ecran}`,
      '',
    ].join('\n');

    // Remplace la section Habitudes
    const regex = /## 📍- \*\*Habitudes :\*\*[\s\S]*?(?=^## |\Z)/m;
    if (regex.test(content)) {
      content = content.replace(regex, habitudesSection + '\n');
    } else {
      content = content.trim() + '\n\n' + habitudesSection + '\n';
    }

    await writeFile(filePath, content.trim() + '\n', 'utf-8');

    await interaction.reply({
      content: `✅ Section "Habitudes" enregistrée dans \`${date}.md\` !`,
      ephemeral: true,
    });
  },
};