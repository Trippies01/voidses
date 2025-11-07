const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function saveAuthSession() {
  console.log('🚀 Tarayıcı başlatılıyor...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  console.log('📝 Adımlar:');
  console.log('1. Tarayıcıda açılan sayfada giriş yapın');
  console.log('2. Ana sayfaya (server sayfası) geldiğinizde');
  console.log('3. Bu terminale geri dönün ve ENTER tuşuna basın\n');

  try {
    await page.goto('http://localhost:3001/sign-in');
    
    // Kullanıcının giriş yapmasını bekle
    await new Promise(resolve => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('✅ Giriş yaptınız mı? (Enter tuşuna basın): ', () => {
        readline.close();
        resolve();
      });
    });

    // Session'ı kaydet
    const sessionPath = path.join(process.cwd(), 'scripts', 'auth-session.json');
    await context.storageState({ path: sessionPath });
    
    console.log('\n✅ Session kaydedildi!');
    console.log(`📁 Dosya: ${sessionPath}`);
    console.log('\n💡 Artık "npm run screenshots:full" komutuyla tüm sayfaları otomatik çekebilirsiniz.\n');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
  
  await browser.close();
}

saveAuthSession().catch(console.error);
