# 🏥 Podsistem za upravljanje tokom lečenja pacijenata opšte bolnice

<table style="margin: 0 auto; text-align: left;">
  <tr>
    <td style="padding-right:50px;"><strong>Autor:</strong> Jovan Petrović</td>
    <td style="text-align:right; padding-left:50px;"><strong>Mentor:</strong> prof. dr Nenad Aničić</td>
  </tr>
</table>

<br />

Podsistem za koji se projektuje baza podataka je podsistem za upravljanje tokom lečenja pacijenata opšte bolnice.

Na početku, pacijent dolazi na šalter kod medicinskog tehničara koji ga registruje u sistem. Zatim ide na pregled kod izabranog lekara opšte prakse, koji po potrebi izdaje uput za ambulantno-specijalistički pregled, gde lekar specijalista beleži nalaze i kreira izveštaj lekara specijaliste.

Ukoliko je potrebno stacionarno lečenje, izabrani lekar opšte prakse, na osnovu mišljenja lekara specijaliste, izdaje uput za stacionarno lečenje, kojim se definišu dalji koraci terapije. Tokom stacionarnog lečenja prate se sve intervencije nad pacijentom, uključujući izdavanje naloga za davanje injekcija i druge terapijske procedure.

Sve informacije u vezi lečenja beleže se u istoriji bolesti, koja predstavlja centralnu evidenciju toka lečenja pacijenta. Na kraju procesa, pacijentu se izdaje otpusna lista, koja sumira postupak lečenja i sadrži završni komentar o njegovom toku i ishodu, kao i predlog za eventualno dalje lečenje i zdravstvenu negu.

## ⚙️ Pokretanje projekta

### 1️⃣ Instalacija zavisnosti

Potrebno je imati **Docker** i **Docker Compose** programe instalirane na svom računaru. Bez ovoga, projekat se ne može pokrenuti.

Provera:

```bash
docker --version
docker compose version
```

---

### 2️⃣ Kloniranje repozitorijuma

```bash
git clone https://github.com/Petrovic8684/BP3.git
cd BP3
```

### 3️⃣ Kreiranje `.env` fajlova

Potrebno je napraviti `.env` fajl u root direktorijumu projekta.

**Primer `/.env` fajla:**

```env
ADMINER_PORT=8080
POSTGRES_PORT=5432
NODE_PORT=3000
VITE_REACT_PORT=5173
```

Zatim je potrebno napraviti `.env` fajl u /backend direktorijumu projekta.

**Primer `/backend/.env` fajla:**

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=BP3
POSTGRES_HOST=postgres

TOKEN_SECRET="tajna"
```

Na kraju je potrebno napraviti `.env` fajl u /frontend direktorijumu projekta.

**Primer `/frontend/.env` fajla:**

```env
VITE_API_URL="http://localhost:3000"
```

---

### 4️⃣ Pokretanje servisa

U root direktorijumu projekta (gde se nalazi `docker-compose.yml`) potrebno je pokrenuti:

```bash
docker compose up --build
```

Opcija `--build` je potrebna da bi Docker izgradio slike i instalirao sve zavisnosti. Ova komanda startuje sva četiri servisa: **React**, **Node**, **Postgres** i **Adminer**.

### 5️⃣ Provera

- Node aplikacija bi trebalo da bude dostupna na portu iz `/.env` (npr. `localhost:3000`).
- Adminer bi trebalo da bude dostupan na portu iz `/.env` (npr. `localhost:8080`).
- Postgres server bi trebalo da bude dostupan na portu iz `/.env` (npr. `localhost:5432`).
- React aplikacija bi trebalo da bude dostupna na portu iz `/.env` (npr. `localhost:5173`).

_Happy coding! 🚀_
