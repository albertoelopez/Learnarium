import { test, expect } from '@playwright/test';

test.describe('Memory Palace Flow', () => {
  test('complete user journey from description to 3D visualization', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Vizloci/i })
    ).toBeVisible();

    await expect(page.getByText(/Step 1: Describe Your Space/i)).toBeVisible();

    const descriptionInput = page.getByTestId('palace-description-input');
    await expect(descriptionInput).toBeVisible();

    await descriptionInput.fill(
      'My studio apartment: living room with red couch and wooden coffee table, kitchen with stainless steel fridge'
    );

    const generateButton = page.getByTestId('generate-palace-button');
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    await expect(generateButton).toHaveText(/Generating.../);

    await expect(page.getByText(/Step 2: Review Your Palace/i)).toBeVisible({
      timeout: 60000,
    });

    await expect(page.getByTestId(/room-/).first()).toBeVisible();
    await expect(page.getByTestId(/object-/).first()).toBeVisible();

    await page.screenshot({ path: 'e2e-screenshots/step2-palace-editor.png' });

    const saveButton = page.getByTestId('save-palace-button');
    await saveButton.click();

    await expect(
      page.getByText(/Step 3: Map Your Learning Content/i)
    ).toBeVisible();

    const learningTextInput = page.getByTestId('learning-text-input');
    await learningTextInput.fill(
      'Python is a high-level programming language. Variables store data. Functions encapsulate reusable code.'
    );

    const mapButton = page.getByTestId('map-concepts-button');
    await mapButton.click();

    await expect(mapButton).toHaveText(/Mapping Concepts.../);

    await expect(page.getByText(/Step 4: Your Memory Palace/i)).toBeVisible({
      timeout: 60000,
    });

    await expect(page.getByTestId('palace-viewer-3d')).toBeVisible();

    await expect(page.getByTestId(/mapping-/).first()).toBeVisible();

    await page.screenshot({ path: 'e2e-screenshots/step4-3d-view.png' });

    const mappingElements = await page.getByTestId(/mapping-/).all();
    expect(mappingElements.length).toBeGreaterThan(0);
  });

  test('shows error when description is empty', async ({ page }) => {
    await page.goto('/');

    const generateButton = page.getByTestId('generate-palace-button');
    await generateButton.click();

    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText(
      /Please enter a description/i
    );
  });

  test('shows error when learning text is empty', async ({ page }) => {
    await page.goto('/');

    const descriptionInput = page.getByTestId('palace-description-input');
    await descriptionInput.fill('Simple room with a chair');

    const generateButton = page.getByTestId('generate-palace-button');
    await generateButton.click();

    await expect(page.getByText(/Step 2: Review Your Palace/i)).toBeVisible({
      timeout: 60000,
    });

    const saveButton = page.getByTestId('save-palace-button');
    await saveButton.click();

    await expect(
      page.getByText(/Step 3: Map Your Learning Content/i)
    ).toBeVisible();

    const mapButton = page.getByTestId('map-concepts-button');
    await mapButton.click();

    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText(
      /Please enter the content/i
    );
  });

  test('navigation buttons work correctly', async ({ page }) => {
    await page.goto('/');

    const step1Button = page.getByRole('button', { name: /1\. Create Palace/i });
    const step2Button = page.getByRole('button', { name: /2\. Edit Palace/i });
    const step3Button = page.getByRole('button', { name: /3\. Map Concepts/i });
    const step4Button = page.getByRole('button', { name: /4\. View in 3D/i });

    expect(await step1Button.isDisabled()).toBe(true);
    expect(await step2Button.isDisabled()).toBe(true);
    expect(await step3Button.isDisabled()).toBe(true);
    expect(await step4Button.isDisabled()).toBe(true);
  });
});
