import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const evidenceDir = path.resolve('output/evidencias/flujos');

test.beforeAll(async () => {
  await mkdir(evidenceDir, { recursive: true });
});

async function openLogin(page: import('@playwright/test').Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#username')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('#submit-login')).toBeVisible();
}

async function login(
  page: import('@playwright/test').Page,
  username: string,
  password: string,
) {
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#submit-login').click();
}

test('1. inicio de sesión exitoso', async ({ page }) => {
  await openLogin(page);
  await login(page, 'practice', 'SuperSecretPassword!');

  await expect(page).toHaveURL(/\/secure$/);
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  await expect(page.locator('a[href="/logout"]')).toBeVisible();
  await page.screenshot({ path: path.join(evidenceDir, '01-login-exitoso.png'), fullPage: true });
});

test('2. usuario inválido muestra el mensaje real del sitio', async ({ page }) => {
  await openLogin(page);
  await login(page, 'wrongUser', 'SuperSecretPassword!');

  await expect(page).toHaveURL(/\/login$/);
  // La documentación de la página anuncia "Invalid username.", pero el sitio
  // realmente responde con este mensaje. La aserción conserva el hecho observado.
  await expect(page.locator('#flash')).toContainText('Your password is invalid!');
  await page.screenshot({ path: path.join(evidenceDir, '02-usuario-invalido.png'), fullPage: true });
});

test('3. contraseña inválida', async ({ page }) => {
  await openLogin(page);
  await login(page, 'practice', 'WrongPassword');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#flash')).toContainText('Your password is invalid!');
  await page.screenshot({ path: path.join(evidenceDir, '03-password-invalido.png'), fullPage: true });
});

test('4. cierre de sesión exitoso', async ({ page }) => {
  await openLogin(page);
  await login(page, 'practice', 'SuperSecretPassword!');
  await expect(page).toHaveURL(/\/secure$/);

  await page.locator('a[href="/logout"]').click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  await page.screenshot({ path: path.join(evidenceDir, '04-logout-exitoso.png'), fullPage: true });
});
