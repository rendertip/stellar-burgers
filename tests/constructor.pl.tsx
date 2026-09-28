import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });
  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user',
    update: false,
  });
  await page.routeFromHAR('tests/hars/order.har', {
    url: '**/api/orders',
    update: false,
  });
});

test.describe('Конструктор бургера', () => {
  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    await expect(page.getByText('Краторная булка N-200i', { exact: false })).toHaveCount(
      3
    );
    await expect(
      page.getByText('Биокотлета из марсианской Магнолии', { exact: false })
    ).toHaveCount(2);
  });

  test('открывает модальное окно ингредиента и закрывает его крестиком', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    await page.getByText('Краторная булка N-200i').click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeHidden();
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    await page.getByText('Краторная булка N-200i').click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeHidden();
  });

  test('создаёт заказ, очищает конструктор и закрывает окно заказа', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('order-number')).toHaveText('123456');
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByTestId('order-number')).toBeHidden();
  });
});
