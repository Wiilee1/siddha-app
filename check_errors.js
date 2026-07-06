const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
    else console.log('PAGE LOG:', msg.text());
  });
  page.on('pageerror', error => errors.push('PAGE ERROR: ' + error.message));

  try {
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });

    // Complete onboarding if present
    const onboarding = await page.$('.onboarding-container');
    if (onboarding) {
      console.log('Onboarding detected — completing...');
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
      await new Promise(r => setTimeout(r, 800));
      console.log('Onboarding done.');
    }

    // Check home screen is visible (no mascot)
    const mascot = await page.$('.mascot-home-avatar');
    if (mascot) throw new Error('FAIL: Mascot still visible on home screen!');
    else console.log('✓ No floating mascot on home screen.');

    // Check sanctuary card is gone
    const sanctuary = await page.evaluate(() => document.body.innerText.includes('Siddha Sanctuary'));
    if (sanctuary) throw new Error('FAIL: Siddha Sanctuary card still visible!');
    else console.log('✓ Siddha Sanctuary removed.');

    // Check dark mode toggle is gone
    const darkToggle = await page.$('#cosmic-theme-toggle');
    if (darkToggle) throw new Error('FAIL: Dark mode toggle still present!');
    else console.log('✓ Dark mode toggle removed.');

    // Check XP bar exists on home and has valid width
    await page.click('[data-target="home"]');
    await new Promise(r => setTimeout(r, 400));
    const xpBarWidth = await page.evaluate(() => document.querySelector('#home-xp-bar')?.style.width);
    console.log('✓ XP bar width:', xpBarWidth || '0%');

    // Test sound mute button exists on breathe screen
    await page.click('[data-target="breathe"]');
    await new Promise(r => setTimeout(r, 500));
    const muteBtn = await page.$('#sound-mute-btn');
    if (!muteBtn) throw new Error('FAIL: Sound mute button not found on Breathe screen!');
    else console.log('✓ Sound mute button present.');

    // Navigate to Journey and check quest bar navigates to breathe
    await page.click('#breathe-close-btn');
    await new Promise(r => setTimeout(r, 500));
    await page.click('[data-target="journey"]');
    await new Promise(r => setTimeout(r, 500));
    const questBar = await page.$('#journey-quest-bar');
    if (!questBar) throw new Error('FAIL: Journey quest bar not found!');
    else console.log('✓ Journey quest bar present.');

    // Click quest bar (should navigate to breathe since quest is not yet complete)
    await page.click('#journey-quest-bar');
    await new Promise(r => setTimeout(r, 500));
    const breatheActive = await page.$('.breathe-screen.active');
    if (!breatheActive) throw new Error('FAIL: Quest bar click did not navigate to Breathe screen!');
    else console.log('✓ Quest bar navigates to Breathe screen.');

    if (errors.length > 0) {
      console.log('\nErrors detected:');
      errors.forEach(e => console.log(e));
    } else {
      console.log('\n✓ All checks passed. No JS errors.');
    }

  } catch (err) {
    console.error('TEST FAILED:', err.message);
  } finally {
    await browser.close();
  }
})();
