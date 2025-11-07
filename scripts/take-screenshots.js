const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  // Screenshots klasörünü oluştur
  const screenshotsDir = path.join(process.cwd(), 'ui-ux-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('🚀 Tarayıcı başlatılıyor...');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Yavaşlatılmış mod - görselleri görebilmek için
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('\n📸 Ekran görüntüleri alınıyor...\n');
  console.log('⚠️  NOT: Giriş yapmanız gerekiyor. Tarayıcı açıldığında:');
  console.log('   1. Clerk ile giriş yapın');
  console.log('   2. Ana sayfaya gidin');
  console.log('   3. Enter tuşuna basın (bu script devam edecek)\n');

  try {
    // Ana sayfaya git
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Kullanıcının giriş yapması için bekle
    console.log('⏳ Giriş yapmanız bekleniyor...');
    await page.waitForTimeout(30000); // 30 saniye bekle
    
    // Ana sayfa
    console.log('📄 Ana sayfa...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-home.png'),
      fullPage: true 
    });
    console.log('✅ Ana sayfa kaydedildi');

    // Sayfadaki tüm linkleri bul
    const currentUrl = page.url();
    
    // Server sidebar varsa
    const serverLinks = await page.$$eval('[data-server-id]', elements => 
      elements.map(el => ({
        id: el.getAttribute('data-server-id'),
        name: el.getAttribute('aria-label') || 'server'
      }))
    ).catch(() => []);

    if (serverLinks.length > 0) {
      console.log(`\n🖥️  ${serverLinks.length} server bulundu\n`);
      
      for (let i = 0; i < Math.min(serverLinks.length, 3); i++) {
        const server = serverLinks[i];
        try {
          console.log(`📄 Server: ${server.name}...`);
          await page.click(`[data-server-id="${server.id}"]`);
          await page.waitForTimeout(2000);
          
          await page.screenshot({ 
            path: path.join(screenshotsDir, `02-server-${i + 1}-${server.name.replace(/[^a-z0-9]/gi, '-')}.png`),
            fullPage: true 
          });
          console.log(`✅ Server ${i + 1} kaydedildi`);

          // Channel'ları çek
          const channels = await page.$$eval('[data-channel-id]', elements => 
            elements.slice(0, 3).map(el => ({
              id: el.getAttribute('data-channel-id'),
              name: el.textContent?.trim() || 'channel'
            }))
          ).catch(() => []);

          for (let j = 0; j < channels.length; j++) {
            const channel = channels[j];
            try {
              console.log(`  📝 Channel: ${channel.name}...`);
              await page.click(`[data-channel-id="${channel.id}"]`);
              await page.waitForTimeout(1500);
              
              await page.screenshot({ 
                path: path.join(screenshotsDir, `03-server-${i + 1}-channel-${j + 1}-${channel.name.replace(/[^a-z0-9]/gi, '-')}.png`),
                fullPage: true 
              });
              console.log(`  ✅ Channel ${j + 1} kaydedildi`);
            } catch (error) {
              console.log(`  ❌ Channel hatası: ${error.message}`);
            }
          }
        } catch (error) {
          console.log(`❌ Server hatası: ${error.message}`);
        }
      }
    }

    // Modalleri aç ve çek
    console.log('\n🎨 Modal ve component görüntüleri alınıyor...\n');
    
    // Server settings modal
    try {
      const serverDropdown = await page.$('[data-server-header]');
      if (serverDropdown) {
        await serverDropdown.click();
        await page.waitForTimeout(500);
        await page.screenshot({ 
          path: path.join(screenshotsDir, '04-server-dropdown.png'),
          fullPage: true 
        });
        console.log('✅ Server dropdown kaydedildi');
        
        // Dropdown'ı kapat
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    } catch (error) {
      console.log(`❌ Server dropdown hatası: ${error.message}`);
    }

    console.log('\n🎉 Tüm ekran görüntüleri alındı!');
    console.log(`📁 Klasör: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
  
  await browser.close();
}

takeScreenshots().catch(console.error);
