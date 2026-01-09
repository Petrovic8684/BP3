# 🏥 Podsistem za upravljanje tokom lečenja pacijenata opšte bolnice

<table style="margin: 0 auto; text-align: left;">
  <tr>
    <td style="padding-right:50px;"><strong>Autor:</strong> Jovan Petrović</td>
    <td style="text-align:right; padding-left:50px;"><strong>Mentor:</strong> dr Nenad Aničić</td>
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

### 3️⃣ Kreiranje `.env` fajla

Potrebno je napraviti `.env` fajl u root folderu projekta.

**Primer `.env` fajla:**

```env
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=mydatabase
DB_PORT=5432
NODE_PORT=3000
ADMINER_PORT=8080
DATABASE_URL=postgres://postgres:postgres123@postgres:5432/mydatabase
```

⚠️ **Važno:** `DATABASE_URL` mora odgovarati Postgres servisu u `docker-compose.yml` (hostname `postgres`).

---

### 4️⃣ Pokretanje servisa

U root direktorijumu projekta (gde se nalazi `docker-compose.yml`) potrebno je pokrenuti:

```bash
docker compose up --build
```

Opcija `--build` je potrebna da bi Docker izgradio Node sliku i instalirao sve zavisnosti. Ova komanda startuje sva tri servisa: **Node**, **Postgres** i **Adminer**.

### 5️⃣ Provera

- Node aplikacija bi trebalo da bude dostupna na portu iz `.env` (npr. `localhost:3000`).
- Adminer bi trebalo da bude dostupan na `localhost:8080` (ili `ADMINER_PORT` iz `.env`).
- Postgres server radi u kontejneru i može da se konektuje iz Node aplikacije preko `DATABASE_URL`.

_Happy coding! 🚀_
