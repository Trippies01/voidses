# 📦 GitHub'a Yükleme Rehberi

## 1. Git Kurulumu

Git kurulu değil. İndirmek için:

**Seçenek A: Winget ile (Önerilen)**
```cmd
winget install --id Git.Git -e --source winget
```

**Seçenek B: Manuel İndirme**
https://git-scm.com/download/win adresinden indir ve kur.

Kurulum sonrası PowerShell'i yeniden başlat.

---

## 2. Git Yapılandırması

```bash
git config --global user.name "Adın Soyadın"
git config --global user.email "email@example.com"
```

---

## 3. GitHub'a Yükleme

### Adım 1: Git Repository Başlat
```bash
git init
```

### Adım 2: Dosyaları Ekle
```bash
git add .
```

### Adım 3: İlk Commit
```bash
git commit -m "Initial commit"
```

### Adım 4: Branch Adını Değiştir
```bash
git branch -M main
```

### Adım 5: GitHub Remote Ekle
```bash
git remote add origin https://github.com/Trippies01/Trippies.git
```

### Adım 6: GitHub'a Push Et
```bash
git push -u origin main
```

**Not:** GitHub şifre istemez, Personal Access Token (PAT) ister.

---

## 4. GitHub Personal Access Token Oluşturma

1. GitHub'da: Settings > Developer settings > Personal access tokens > Tokens (classic)
2. "Generate new token (classic)" tıkla
3. Note: "Vercel Deployment"
4. Expiration: 90 days (veya istediğin)
5. Scopes: **repo** seç (tüm repo izinleri)
6. "Generate token" tıkla
7. Token'ı kopyala (bir daha göremezsin!)

Push ederken şifre yerine bu token'ı kullan.

---

## 5. Vercel'e Tekrar Deploy

GitHub'a yüklendikten sonra:

1. https://vercel.com/dashboard adresine git
2. "Add New..." > "Project"
3. GitHub repo'nu seç: **Trippies01/Trippies**
4. Framework Preset: **Next.js**
5. Environment Variables ekle (önceki gibi)
6. "Deploy" tıkla

---

## 🚀 Hızlı Komutlar (Git kurulduktan sonra)

```bash
# 1. Git başlat
git init

# 2. Tüm dosyaları ekle
git add .

# 3. Commit
git commit -m "Initial commit"

# 4. Branch
git branch -M main

# 5. Remote ekle
git remote add origin https://github.com/Trippies01/Trippies.git

# 6. Push
git push -u origin main
```

---

## 💡 Alternatif: GitHub Desktop Kullan

Git komut satırı yerine GitHub Desktop kullanabilirsin:

1. https://desktop.github.com adresinden indir
2. GitHub hesabınla giriş yap
3. "Add" > "Add Existing Repository"
4. Proje klasörünü seç
5. "Publish repository" tıkla

Çok daha kolay! 🎉

---

## ⚠️ Önemli Notlar

- `.env` dosyası GitHub'a yüklenmez (güvenlik için)
- `node_modules` klasörü yüklenmez (çok büyük)
- Vercel otomatik olarak her commit'te yeniden deploy eder
- Environment variables'ları Vercel dashboard'dan ekle
