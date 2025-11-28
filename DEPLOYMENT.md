# Namecheap cPanel Avaldamise Juhend

## Sammud Rakenduse Avaldamiseks

### 1. Projekti Ehitamine

Projekt on juba ehitatud ja `dist` kaustas on kõik vajalikud failid valmis:
- ✅ index.html
- ✅ assets/ kaust (CSS, JS failid)
- ✅ styles/ kaust
- ✅ valge logo.svg
- ✅ .htaccess fail (React routing)

### 2. cPanel Sisselogimine

1. Mine aadressile: `https://cpanel.namecheap.com`
2. Logi sisse oma kasutajanime ja parooliga
3. Või logi sisse otse Namecheap konto kaudu ja vali "cPanel Login"

### 3. File Manager Avamine

1. cPanelis leia sektsioonis "FILES" tööriist nimega **"File Manager"**
2. Kliki sellele, et avada failihaldur
3. Vasakul poolel näed kaustade struktuuri

### 4. Õigesse Kausta Liikumine

**Variant A - Põhidomeen:**
- Liigu kausta `public_html`
- See on sinu põhidomeeni juurkaust

**Variant B - Alamdomeen:**
- Kui kasutad alamdomeeni (nt `app.sinu-domeen.ee`)
- Liigu vastavasse alamdomeeni kausta (nt `public_html/app`)

### 5. Vanade Failide Kustutamine (kui vajalik)

1. Vali kõik olemasolevad failid kaustas
2. Kliki "Delete" või parem klikk → "Delete"
3. Kinnita kustutamine

**TÄHELEPANU:** Ära kustuta `.htaccess` faili, kui see juba sisaldab olulisi seadeid (nt SSL redirect). Sellisel juhul lisa uued read olemasoleva sisu lõppu.

### 6. Failide Üleslaadimine

**Meetod 1 - ZIP Fail (Soovitatav):**

1. Oma arvutis:
   - Vali kõik failid `dist` kaustast (mitte kausta ennast!)
   - Paki need ZIP failiks (nt `build.zip`)

2. cPanelis:
   - Kliki "Upload" nuppu File Manageris
   - Vali `build.zip` fail
   - Oota, kuni üleslaadimine on lõpetatud
   - Mine tagasi File Managerisse
   - Parem klikk ZIP failil → "Extract"
   - Kustuta ZIP fail pärast ekstraktimist

**Meetod 2 - FTP (Kiire suurte failide puhul):**

1. cPanelis leia "FTP Accounts"
2. Loo uus FTP konto või kasuta olemasolevat
3. Lae alla FTP klient (nt FileZilla): https://filezilla-project.org/
4. Ühenda FTP kliendiga:
   - Host: ftp.sinu-domeen.ee
   - Username: FTP kasutajanimi
   - Password: FTP parool
   - Port: 21
5. Liigu paremale poolele (server) `public_html` kausta
6. Vasakul pool (lokaalne) ava `dist` kaust
7. Vali kõik failid dist kaustast ja lohista need paremale

### 7. .htaccess Faili Kontrollimine

1. Veendu, et `.htaccess` fail on `public_html` kaustas
2. Fail peaks sisaldama:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**Kui sul on juba .htaccess fail (SSL redirect vms):**
- Ava fail redigeerimiseks (parem klikk → "Edit")
- Lisa ülaltoodud kood faili lõppu
- Salvesta

### 8. Failiõiguste Kontrollimine

1. Vali kõik failid
2. Parem klikk → "Change Permissions"
3. Failide õigused: `644` (rw-r--r--)
4. Kaustade õigused: `755` (rwxr-xr-x)

### 9. Keskkonna Muutujate Kontrollimine

Kuna kasutad Supabase'i ja EmailJS'i, veendu, et `.env` failis on õiged väärtused:

- `VITE_SUPABASE_URL` - Sinu Supabase projekti URL
- `VITE_SUPABASE_ANON_KEY` - Supabase avalik võti
- `VITE_EMAILJS_SERVICE_ID` - EmailJS teenuse ID
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS malli ID
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS avalik võti

**NB!** Need väärtused on juba builditud JavaScript failidesse, seega ei pea neid serveris eraldi seadistama.

### 10. Testimine

1. Külasta oma domeeni: `https://sinu-domeen.ee`
2. Testi kõiki funktsioone:
   - ✅ Navigeerimine (Avaleht, Teenused, Meist, Kontakt, Agenda)
   - ✅ Keelevahetus (EST/ENG)
   - ✅ Agenda looja
   - ✅ Mallide valimine
   - ✅ PDF eksport
   - ✅ Kontaktivorm
   - ✅ Taimer funktsionaalsus

3. Testi brauseris:
   - Chrome
   - Firefox
   - Safari
   - Mobile (telefonis)

### 11. SSL-i Seadistamine (kui pole veel tehtud)

1. cPanelis leia "SSL/TLS Status"
2. Vali oma domeen
3. Kliki "Run AutoSSL"
4. Oota, kuni sertifikaat on installitud (tavaliselt 5-10 minutit)

### 12. HTTPS Redirect (soovitatav)

Lisa `.htaccess` faili algusesse (enne React routingu koodi):

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Probleemide Lahendamine

### Probleem: Leht ei lae või näitab 404 viga

**Lahendus:**
- Kontrolli, et kõik failid on `public_html` kaustas (mitte `public_html/dist`)
- Kontrolli `.htaccess` faili olemasolu ja sisu
- Kontrolli, et `index.html` on juurkaustas

### Probleem: CSS/JS failid ei lae

**Lahendus:**
- Kontrolli, et `assets` kaust on õigesti üles laetud
- Kontrolli failiõigusi (644 failidele, 755 kaustadele)
- Kontrolli brauseri konsooli võimalike vigade kohta (F12 → Console)

### Probleem: Navigeerimine ei tööta (404 refresh'il)

**Lahendus:**
- Kontrolli `.htaccess` faili olemasolu
- Veendu, et Apache mod_rewrite on lubatud (tavaliselt on vaikimisi)
- Kontrolli, et `.htaccess` fail ei sisalda vigu

### Probleem: Kontaktivorm ei tööta

**Lahendus:**
- Kontrolli EmailJS seadeid brauseri konsoolis (F12 → Console)
- Veendu, et EmailJS API võtmed on õiged
- Testi EmailJS'i staatust: https://dashboard.emailjs.com/

### Probleem: PDF eksport ei tööta

**Lahendus:**
- Kontrolli brauseri konsooli võimalike vigade kohta
- Testi erinevates brauserites
- Veendu, et JavaScript failid laadisid õigesti

## Kasulikud cPanel Tööriistad

- **File Manager** - Failide haldamine
- **FTP Accounts** - FTP kontode loomine
- **SSL/TLS Status** - SSL sertifikaatide haldamine
- **Error Log** - Serveri vigade vaatamine
- **Metrics** - Külastatavuse statistika

## Kontakt ja Abi

Kui tekivad probleemid:
1. Kontrolli Namecheap'i tuge: https://www.namecheap.com/support/
2. Vaata cPanel'i dokumentatsiooni: https://docs.cpanel.net/
3. Kontrolli serveri error logisid cPanelis

## Kokkuvõte

✅ Build tehtud
✅ .htaccess fail loodud
✅ Failid valmis üleslaadimiseks
✅ Juhend kirjutatud

**Järgmised sammud:**
1. Logi sisse cPaneli
2. Ava File Manager
3. Lae üles `dist` kausta sisu
4. Testi rakendust

Edu avaldamisega! 🚀
