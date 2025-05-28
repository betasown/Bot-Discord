import { ModalSubmitInteraction } from 'discord.js';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export default {
  id: 'humeur_modal',
  async execute(interaction: ModalSubmitInteraction) {
    const humeur = interaction.fields.getTextInputValue('humeur');
    const energie = interaction.fields.getTextInputValue('energie');
    const meteo = interaction.fields.getTextInputValue('meteo');
    const cafe = interaction.fields.getTextInputValue('cafe');

    // Détermine la date du jour
    const date = new Date().toISOString().slice(0, 10);
    const notesDir = join(__dirname, '../../../notes');
    const filePath = join(notesDir, `${date}.md`);

    // Crée le dossier notes/ s'il n'existe pas
    if (!existsSync(notesDir)) {
      await mkdir(notesDir, { recursive: true });
    }

    // Prépare le contenu à écrire/remplacer
    const humeurSection = [
      '## 📍- **Humeur & Énergie... :**',
      '',
      `- 😄 Humeur (1 à 5) : ${humeur}`,
      `- ⚡ Niveau d’énergie (1 à 5) : ${energie}`,
      `- 🌤 Météo : ${meteo}`,
      `- ☕ Café du matin ? : ${cafe}`,
      '',
    ].join('\n');

    let content = '';
    if (existsSync(filePath)) {
      // Si le fichier existe, on remplace la section Humeur & Énergie
      content = await readFile(filePath, 'utf-8');
      const regex = /## 📍- \*\*Humeur & Énergie\.\.\. :\*\*[\s\S]*?(?=^## |\Z)/m;
      if (regex.test(content)) {
        content = content.replace(regex, humeurSection + '\n');
      } else {
        content = humeurSection + '\n' + content;
      }
    } else {
      // Nouveau fichier avec juste la section humeur
      content = `# Daily Note - ${date}\n\n${humeurSection}`;
    }

    await writeFile(filePath, content, 'utf-8');

    await interaction.reply({
      content: `✅ Section "Humeur & Énergie" enregistrée dans \`${date}.md\` !`,
      ephemeral: true,
    });
  },
};