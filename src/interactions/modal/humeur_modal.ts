import { ModalSubmitInteraction } from 'discord.js';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { ensureDailyNote } from '../../function/bot/noteUtils';

export default {
  id: 'humeur_modal',
  async execute(interaction: ModalSubmitInteraction) {
    const humeur = interaction.fields.getTextInputValue('humeur');
    const energie = interaction.fields.getTextInputValue('energie');
    const meteo = interaction.fields.getTextInputValue('meteo');
    const cafe = interaction.fields.getTextInputValue('cafe');

    const date = new Date().toISOString().slice(0, 10);
    const filePath = await ensureDailyNote(date);

    let content = await readFile(filePath, 'utf-8');
    const humeurSection = [
      '## 📍- **Humeur & Énergie... :**',
      '',
      `- 😄 Humeur (1 à 5) : ${humeur}`,
      `- ⚡ Niveau d’énergie (1 à 5) : ${energie}`,
      `- 🌤 Météo : ${meteo}`,
      `- ☕ Café du matin ? : ${cafe}`,
      '',
    ].join('\n');

    const regex = /## 📍- \*\*Humeur & Énergie\.\.\. :\*\*[\s\S]*?(?=^## |\Z)/m;
    if (regex.test(content)) {
      content = content.replace(regex, humeurSection + '\n');
    } else {
      content = humeurSection + '\n' + content;
    }

    await writeFile(filePath, content, 'utf-8');

    await interaction.reply({
      content: `✅ Section "Humeur & Énergie" enregistrée dans \`${date}.md\` !`,
      ephemeral: true,
    });
  },
};