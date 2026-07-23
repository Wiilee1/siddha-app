const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 450, height: 800 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER RUNTIME ERROR:', error.stack));

  try {
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

    // Complete onboarding if present
    const onboarding = await page.$('.onboarding-container');
    if (onboarding) {
      await page.click('.btn-next-welcome');
      await new Promise(r => setTimeout(r, 400));
      await page.type('#user-name-input', 'Test');
      await page.click('#btn-next');
      await new Promise(r => setTimeout(r, 400));
      await page.click('[data-value="beginner"]');
      await new Promise(r => setTimeout(r, 400));
      await page.click('[data-value="stress"]');
      await new Promise(r => setTimeout(r, 400));
      await page.click('[data-value="10"]');
      await page.click('#btn-next');
      await new Promise(r => setTimeout(r, 400));
      await page.click('#btn-enter-sanctuary');
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('Navigating to breathe screen...');
    await page.click('[data-target="breathe"]');
    await new Promise(r => setTimeout(r, 800));

    console.log('Checking for close button...');
    const btn = await page.$('#breathe-close-btn');
    if (!btn) {
      console.log('breathe-close-btn element NOT found in DOM!');
    } else {
      console.log('breathe-close-btn exists, checking bounding box...');
      const box = await btn.boundingBox();
      console.log('Bounding Box:', box);
    }

    console.log('Clicking close button...');
    await page.click('#breathe-close-btn');
    console.log('Click successful!');

  } catch (err) {
    console.error('Click error:', err.message);
  } finally {
    await browser.close();
  }
})();
