import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

function getLongDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export async function ensureDailyNote(date: string): Promise<string> {
  const notesDir = join(process.cwd(), 'notes');
  const filePath = join(notesDir, `${date}.md`);
  const templatePath = join(notesDir, 'daily-note-template.md');

  if (!existsSync(notesDir)) {
    await mkdir(notesDir, { recursive: true });
  }

  if (!existsSync(filePath)) {
    let template = await readFile(templatePath, 'utf-8');
    template = template
      .replace('{{date}}', date)
      .replace('{{date_long}}', getLongDate(date));
    await writeFile(filePath, template, 'utf-8');
  }

  return filePath;
}