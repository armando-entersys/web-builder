// Script para generar SQL de inserción de componentes
const fs = require('fs');
const path = require('path');

// Importar los datos (usando require dinámico)
const componentsDataPath = path.join(__dirname, 'packages/db/prisma/components-data.ts');
const content = fs.readFileSync(componentsDataPath, 'utf8');

// Extraer el array de datos usando regex simple
const match = content.match(/export const componentsData = (\[[\s\S]*?\]);?\s*$/m);
if (!match) {
  console.error('No se pudo extraer componentsData');
  process.exit(1);
}

// Evaluar el código para obtener el array
const componentsData = eval(match[1]);

console.log(`Found ${componentsData.length} components`);

// Generar SQL
let sql = `-- SQL Seed for ${componentsData.length} components
-- Generated: ${new Date().toISOString()}

BEGIN;

`;

componentsData.forEach((comp, index) => {
  const id = `gen_random_uuid()`;
  const name = comp.name.replace(/'/g, "''");
  const displayName = comp.displayName.replace(/'/g, "''");
  const slug = comp.slug;
  const category = comp.category;
  const subcategory = comp.subcategory ? `'${comp.subcategory}'` : 'NULL';
  const type = comp.type;
  const description = comp.description.replace(/'/g, "''");
  const icon = comp.icon || '';
  const tags = `ARRAY[${comp.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]`;
  const componentPath = comp.componentPath.replace(/'/g, "''");
  const thumbnail = comp.thumbnail ? `'${comp.thumbnail}'` : 'NULL';
  const demoUrl = comp.demoUrl ? `'${comp.demoUrl}'` : 'NULL';
  const variantId = comp.variantId || 1;
  const variantName = comp.variantName ? `'${comp.variantName.replace(/'/g, "''")}'` : 'NULL';
  const parentSlug = comp.parentSlug ? `'${comp.parentSlug}'` : 'NULL';
  const isActive = comp.isActive !== false ? 'true' : 'false';
  const isPremium = comp.isPremium === true ? 'true' : 'false';
  const isNew = comp.isNew === true ? 'true' : 'false';
  const props = comp.props ? `'${JSON.stringify(comp.props).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const styleConfig = comp.styleConfig ? `'${JSON.stringify(comp.styleConfig).replace(/'/g, "''")}'::jsonb` : 'NULL';

  sql += `INSERT INTO components (
  id, name, "displayName", slug, category, subcategory, type, description,
  icon, tags, "componentPath", thumbnail, "demoUrl", "variantId", "variantName",
  "parentSlug", "isActive", "isPremium", "isNew", props, "styleConfig", "usageCount",
  "createdAt", "updatedAt"
) VALUES (
  ${id}, '${name}', '${displayName}', '${slug}', '${category}', ${subcategory}, '${type}', '${description}',
  '${icon}', ${tags}, '${componentPath}', ${thumbnail}, ${demoUrl}, ${variantId}, ${variantName},
  ${parentSlug}, ${isActive}, ${isPremium}, ${isNew}, ${props}, ${styleConfig}, 0,
  NOW(), NOW()
);

`;
});

sql += `COMMIT;

-- Verify insertion
SELECT category, COUNT(*) as count
FROM components
GROUP BY category
ORDER BY category;
`;

// Guardar SQL
const outputPath = path.join(__dirname, 'seed-components.sql');
fs.writeFileSync(outputPath, sql);

console.log(`✅ SQL generated: ${outputPath}`);
console.log(`   Total statements: ${componentsData.length}`);
