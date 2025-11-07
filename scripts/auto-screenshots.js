const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  const screenshotsDir = path.join(process.cwd(), 'ui-ux-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('🚀 Tarayıcı başlatılıyor...\n');
  const browser = await chromium.launch({ 
    headless: false,
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    // Clerk auth'u bypass etmek için storage state kullanabiliriz
  });
  const page = await context.newPage();

  console.log('📸 Otomatik ekran görüntüleri alınıyor...\n');

  let counter = 1;

  // Yardımcı fonksiyon
  async function takeScreenshot(name, url = null) {
    try {
      if (url) {
        console.log(`📄 ${name} yükleniyor...`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
      }
      
      const fileName = `${String(counter).padStart(2, '0')}-${name.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}.png`;
      const screenshotPath = path.join(screenshotsDir, fileName);
      
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✅ ${fileName} kaydedildi`);
      counter++;
      return true;
    } catch (error) {
      console.log(`❌ ${name} hatası: ${error.message}`);
      return false;
    }
  }

  try {
    const baseUrl = 'http://localhost:3001';

    // 1. Auth sayfaları
    console.log('\n🔐 Auth Sayfaları\n');
    await takeScreenshot('sign-in', `${baseUrl}/sign-in`);
    await takeScreenshot('sign-up', `${baseUrl}/sign-up`);

    // 2. Ana sayfa / Setup
    console.log('\n🏠 Ana Sayfalar\n');
    await takeScreenshot('home', baseUrl);
    
    // Eğer giriş yapmışsa
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    
    if (currentUrl.includes('/servers/')) {
      console.log('\n✅ Giriş yapılmış, server sayfaları çekiliyor...\n');
      
      // Server ana sayfası
      await takeScreenshot('server-main');
      
      // Sol sidebar'daki server listesini bul
      const serverButtons = await page.$$('[data-id]').catch(() => []);
      console.log(`🖥️  ${serverButtons.length} server bulundu\n`);
      
      for (let i = 0; i < Math.min(serverButtons.length, 3); i++) {
        try {
          await serverButtons[i].click();
          await page.waitForTimeout(1500);
          await takeScreenshot(`server-${i + 1}`);
          
          // Server header dropdown
          const serverHeader = await page.$('[role="button"]').catch(() => null);
          if (serverHeader) {
            await serverHeader.click();
            await page.waitForTimeout(500);
            await takeScreenshot(`server-${i + 1}-dropdown`);
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
          }
          
          // Channel'ları bul ve tıkla
          const channels = await page.$$('[data-type="channel"]').catch(() => []);
          for (let j = 0; j < Math.min(channels.length, 3); j++) {
            try {
              await channels[j].click();
              await page.waitForTimeout(1000);
              await takeScreenshot(`server-${i + 1}-channel-${j + 1}`);
            } catch (e) {
              console.log(`  ⚠️  Channel ${j + 1} atlandı`);
            }
          }
          
          // Member sidebar
          const memberToggle = await page.$('[aria-label*="Üye"]').catch(() => null);
          if (memberToggle) {
            await memberToggle.click();
            await page.waitForTimeout(500);
            await takeScreenshot(`server-${i + 1}-members`);
          }
          
        } catch (e) {
          console.log(`⚠️  Server ${i + 1} atlandı: ${e.message}`);
        }
      }
      
      // Modalleri aç
      console.log('\n🎨 Modal Görüntüleri\n');
      
      // Server settings
      try {
        await page.click('[aria-label*="Sunucu Ayarları"]').catch(() => {});
        await page.waitForTimeout(500);
        await takeScreenshot('modal-server-settings');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      } catch (e) {}
      
      // Create channel
      try {
        await page.click('[aria-label*="Kanal Oluştur"]').catch(() => {});
        await page.waitForTimeout(500);
        await takeScreenshot('modal-create-channel');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      } catch (e) {}
      
      // Invite modal
      try {
        await page.click('[aria-label*="Davet"]').catch(() => {});
        await page.waitForTimeout(500);
        await takeScreenshot('modal-invite');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      } catch (e) {}
      
      // Members modal
      try {
        await page.click('[aria-label*="Üyeleri Yönet"]').catch(() => {});
        await page.waitForTimeout(500);
        await takeScreenshot('modal-members');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      } catch (e) {}
      
      // User profile
      console.log('\n👤 Kullanıcı Profili\n');
      try {
        const userAvatar = await page.$('[data-user-avatar]').catch(() => null);
        if (userAvatar) {
          await userAvatar.click();
          await page.waitForTimeout(500);
          await takeScreenshot('user-profile');
          await page.keyboard.press('Escape');
        }
      } catch (e) {}
      
      // Dark/Light mode
      console.log('\n🌓 Tema Değişiklikleri\n');
      try {
        const themeToggle = await page.$('[aria-label*="tema"]').catch(() => null);
        if (themeToggle) {
          await themeToggle.click();
          await page.waitForTimeout(500);
          await takeScreenshot('theme-light');
          await themeToggle.click();
          await page.waitForTimeout(500);
        }
      } catch (e) {}
      
    } else {
      console.log('\n⚠️  Giriş yapılmamış. Sadece public sayfalar çekildi.');
      console.log('💡 Daha fazla sayfa için önce giriş yapın ve scripti tekrar çalıştırın.\n');
    }

    console.log('\n🎉 Tamamlandı!');
    console.log(`📁 Toplam ${counter - 1} ekran görüntüsü alındı`);
    console.log(`📂 Klasör: ${screenshotsDir}\n`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
  
  await browser.close();
}

takeScreenshots().catch(console.error);
