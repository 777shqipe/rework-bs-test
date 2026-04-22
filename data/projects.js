// Per-project static metadata (not translated). Localized name, desc, and tags come from the messages file.
export const projectMeta = [
  { key: 'cantina', categoryKey: 'management', year: '2025' },
  { key: 'crmMagazzino', categoryKey: 'management', year: '2024' },
  { key: 'bpres', categoryKey: 'management', year: '2024' },
  { key: 'autodemolizioni', categoryKey: 'crm', year: '2024' },
  { key: 'sevenLakes', categoryKey: 'website', year: '2024' },
  { key: 'saluteDomicilio', categoryKey: 'website', year: '2024' },
  { key: 'crmTask', categoryKey: 'management', year: '2024' },
  { key: 'myPlace', categoryKey: 'website', year: '2024' },
  { key: 'marazzato', categoryKey: 'website', year: '2024' },
  { key: 'villaKatia', categoryKey: 'marketing', year: '2024' },
  { key: 'quercia', categoryKey: 'marketing', year: '2024' },
  { key: 'gramsci', categoryKey: 'marketing', year: '2024' },
  { key: 'benissimo', categoryKey: 'marketing', year: '2024' },
  { key: 'anziani', categoryKey: 'marketing', year: '2024' },
];

export function buildProjects(projectMeta, t) {
  return projectMeta.map(({ key, categoryKey, year }) => {
    const rawTags = t(`projects.items.${key}.tags`);
    return {
      key,
      n: t(`projects.items.${key}.name`),
      desc: t(`projects.items.${key}.desc`),
      tags: Array.isArray(rawTags) ? rawTags : [],
      categoryKey,
      year,
      images: [],
    };
  });
}
