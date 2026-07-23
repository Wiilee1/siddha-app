const puppeteer = require('puppeteer');

(async () => {
    console.log('--- STARTING HOME SCREEN VERIFICATION TEST ---');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('[PAGE CONSOLE ERROR]', msg.text());
        }
    });
    page.on('pageerror', err => console.log('[PAGE UNCAUGHT ERROR]', err.message));

    // Pre-seed localStorage so user is logged in & tutorial is completed
    await page.evaluateOnNewDocument(() => {
        const initialState = {
            user: { name: 'Alex', dailyCommitment: 20, avatar: './src/assets/avatar_monk.jpg' },
            completedTutorial: true,
            xp: 0,
            level: 1,
            streak: 0,
            meditationHistory: [],
            reflectionHistory: []
        };
        localStorage.setItem('siddha_db', JSON.stringify(initialState));
    });

    try {
        console.log('Navigating to http://localhost:8000...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle0', timeout: 15000 });

        // 1. Verify Home Screen loads
        console.log('\n[TEST 1] Verifying Home Screen load...');
        await page.waitForSelector('.home-screen', { visible: true, timeout: 5000 });
        console.log('✓ PASS: Home screen (.home-screen) loaded and visible.');

        // 2. Verify Container Background Image
        console.log('\n[TEST 2] Verifying Container Background Image...');
        const bgImage = await page.evaluate(() => {
            const home = document.querySelector('.home-screen');
            if (!home) return null;
            const style = window.getComputedStyle(home);
            return {
                inline: home.style.backgroundImage,
                computed: style.backgroundImage
            };
        });

        console.log('  Inline background-image:', bgImage.inline);
        console.log('  Computed background-image:', bgImage.computed);

        const isSiddhaImage = /Siddha_(lvl\d+|nomed_\d+day|Nomed_\d+days)/i.test(bgImage.inline || bgImage.computed);
        if (!isSiddhaImage) {
            throw new Error(`FAIL: Background image does not match Siddha image pattern. Got: ${bgImage.inline || bgImage.computed}`);
        }
        console.log(`✓ PASS: Container background image verified (${bgImage.inline || bgImage.computed}).`);

        // 3. Verify Top Right Corner User Profile Picture
        console.log('\n[TEST 3] Verifying Top Right Corner Profile Picture...');
        const profileAvatar = await page.evaluate(() => {
            const btn = document.querySelector('#home-profile-btn');
            const img = document.querySelector('#home-profile-avatar-img');
            const header = document.querySelector('.home-header');
            if (!btn || !img || !header) return null;

            const btnRect = btn.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();

            return {
                btnExists: true,
                src: img.src,
                width: btnRect.width,
                height: btnRect.height,
                top: btnRect.top,
                right: btnRect.right,
                headerRight: headerRect.right,
                headerTop: headerRect.top,
                isTopRight: (headerRect.right - btnRect.right) < 40 && (btnRect.top - headerRect.top) < 30
            };
        });

        if (!profileAvatar) {
            throw new Error('FAIL: Top right profile avatar elements (#home-profile-btn or #home-profile-avatar-img) not found in DOM.');
        }

        console.log('  Profile Avatar SRC:', profileAvatar.src);
        console.log('  Profile Position (top, right relative to header):', profileAvatar.top, profileAvatar.right);

        if (!profileAvatar.src) {
            throw new Error('FAIL: Profile avatar img tag is missing src attribute.');
        }
        if (!profileAvatar.isTopRight) {
            throw new Error('FAIL: Profile avatar is not located in the top right corner of the header.');
        }
        console.log('✓ PASS: User profile picture verified in top right corner.');

        console.log('\n========================================');
        console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
        console.log('========================================');

    } catch (err) {
        console.error('\n❌ VERIFICATION TEST FAILED:', err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
