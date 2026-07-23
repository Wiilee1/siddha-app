const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 450, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));

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

    // Now on home screen
    console.log('--- Checking DOM Elements ---');
    const animContHTML = await page.evaluate(() => {
      const el = document.querySelector('#hero-anim-container');
      return el ? el.innerHTML : 'NOT FOUND';
    });
    console.log('Inner HTML of #hero-anim-container:', animContHTML);

    const level = await page.evaluate(() => {
      const stats = JSON.parse(localStorage.getItem('siddha_db') || '{}');
      return stats.level;
    });
    console.log('User Level:', level);

    // Let's trigger a level-up to level 3 and check if steam wisps appear
    console.log('--- Simulating Level 3 ---');
    await page.evaluate(() => {
      // Direct update of level to 3
      const state = JSON.parse(localStorage.getItem('siddha_db') || '{}');
      state.level = 3;
      localStorage.setItem('siddha_db', JSON.stringify(state));
      // Trigger updateData
      const activeScreen = document.querySelector('.screen.active');
      if (activeScreen && typeof activeScreen.updateData === 'function') {
        activeScreen.updateData();
      }
    });

    await new Promise(r => setTimeout(r, 500));
    const animContHTML_lvl3 = await page.evaluate(() => {
      const el = document.querySelector('#hero-anim-container');
      return el ? el.innerHTML : 'NOT FOUND';
    });
    console.log('Inner HTML of #hero-anim-container at Level 3:', animContHTML_lvl3);

    // Let's navigate to Journey and back to Home, to check if the loop breaks
    console.log('--- Navigating away and back ---');
    await page.click('[data-target="journey"]');
    await new Promise(r => setTimeout(r, 500));
    await page.click('[data-target="home"]');
    await new Promise(r => setTimeout(r, 500));

    const animContHTML_returned = await page.evaluate(() => {
      const el = document.querySelector('#hero-anim-container');
      return el ? el.innerHTML : 'NOT FOUND';
    });
    console.log('Inner HTML of #hero-anim-container after returning:', animContHTML_returned);

  } catch (err) {
    console.error('DEBUG SCRIPT ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
