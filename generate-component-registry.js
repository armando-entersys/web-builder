// Script para generar el component registry completo
const fs = require('fs');
const path = require('path');

// Leer los datos de componentes
const componentsDataPath = path.join(__dirname, 'packages/db/prisma/components-data.ts');
const content = fs.readFileSync(componentsDataPath, 'utf8');

// Extraer el array de datos usando regex
const match = content.match(/export const componentsData = (\[[\s\S]*?\]);?\s*$/m);
if (!match) {
  console.error('No se pudo extraer componentsData');
  process.exit(1);
}

// Evaluar el código para obtener el array
const componentsData = eval(match[1]);

console.log(`Found ${componentsData.length} components`);

// Generar el archivo TypeScript del registry
let registryCode = `// Registro dinámico de componentes
// Este archivo mapea los componentPath de la base de datos a los imports dinámicos
// GENERADO AUTOMÁTICAMENTE - No editar manualmente

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Tipo para los componentes cargados dinámicamente
export type DynamicComponent = ComponentType<any>

// Mapa de componentes con lazy loading
const componentMap: Record<string, () => Promise<{ default: DynamicComponent }>> = {
`;

// Generar las entradas del mapa
componentsData.forEach((comp, index) => {
  const componentPath = comp.componentPath;

  // Convertir el path de la base de datos al path de import
  // components/animations/backgrounds/Aurora.tsx -> @/components/animations/backgrounds/Aurora/Aurora
  const importPath = componentPath
    .replace(/^components\//, '@/components/')
    .replace(/\.tsx$/, '')
    .replace(/\/([^/]+)$/, '/$1/$1'); // Duplicar el nombre final (Aurora.tsx -> Aurora/Aurora)

  registryCode += `  '${componentPath}': () => import('${importPath}'),\n`;
});

registryCode += `}

/**
 * Obtiene un componente de forma dinámica basado en su path
 * @param componentPath - El path del componente en la base de datos
 * @returns Un componente de React cargado dinámicamente
 */
export function getComponent(componentPath: string): ReturnType<typeof dynamic> | null {
  const loader = componentMap[componentPath]

  if (!loader) {
    console.warn(\`Component not found: \${componentPath}\`)
    return null
  }

  return dynamic(loader, {
    loading: () => <div className="animate-pulse bg-muted h-32 rounded-lg" />,
    ssr: false,
  })
}

/**
 * Verifica si un componente existe en el registro
 */
export function hasComponent(componentPath: string): boolean {
  return componentPath in componentMap
}

/**
 * Obtiene todos los paths de componentes registrados
 */
export function getAllComponentPaths(): string[] {
  return Object.keys(componentMap)
}
`;

// Guardar el archivo
const outputPath = path.join(__dirname, 'apps/web/lib/component-registry.ts');
fs.writeFileSync(outputPath, registryCode);

console.log(`✅ Component registry generated: ${outputPath}`);
console.log(`   Total components: ${componentsData.length}`);
