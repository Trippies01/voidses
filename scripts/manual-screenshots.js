const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

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
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('📸 Manuel Ekran Görüntüsü Modu\n');
  console.log('Nasıl Kullanılır:');
  console.log('1. Tarayıcıda istediğin sayfaya git');
  console.log('2. Terminale dön ve dosya adı gir');
  console.log('3. Enter\'a bas - ekran görüntüsü alınacak');
  console.log('4. Bitirmek için "q" yaz\n');

  try {
    await page.goto('http://localhost:3001');
    
    let counter = 1;
    while (true) {
      const fileName = await askQuestion(`\n📷 Ekran görüntüsü adı (veya 'q' çık): `);
      
      if (fileName.toLowerCase() === 'q' || fileName.toLowerCase() === 'quit') {
        break;
      }
      
      if (!fileName.trim()) {
        console.log('❌ Lütfen bir dosya adı gir!');
        continue;
      }
      
      const sanitizedName = fileName.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
      const screenshotPath = path.join(
        screenshotsDir, 
        `${String(counter).padStart(2, '0')}-${sanitizedName}.png`
      );
      
      console.log('⏳ Ekran görüntüsü alınıyor...');
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✅ Kaydedildi: ${path.basename(screenshotPath)}`);
      counter++;
    }

    console.log('\n🎉 Tamamlandı!');
    console.log(`📁 Toplam ${counter - 1} ekran görüntüsü alındı`);
    console.log(`📂 Klasör: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
  
  rl.close();
  await browser.close();
}

takeScreenshots().catch(console.error);
