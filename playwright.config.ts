import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para testing E2E
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Tiempo máximo por test */
  timeout: 30 * 1000,

  /* Configuración de expect */
  expect: {
    timeout: 5000
  },

  /* Ejecutar tests en paralelo */
  fullyParallel: true,

  /* Fallar si dejas test.only en el código */
  forbidOnly: !!process.env.CI,

  /* Reintentar en CI */
  retries: process.env.CI ? 2 : 0,

  /* Número de workers */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: 'html',

  /* Configuración compartida para todos los proyectos */
  use: {
    /* URL base para usar en acciones como `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'https://web-builder.scram2k.com',

    /* Recoger trace on retry */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configurar proyectos para diferentes browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
