DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT c.relname AS partition_name
        FROM pg_inherits
        JOIN pg_class c ON c.oid = inhrelid
        JOIN pg_class p ON p.oid = inhparent
        WHERE p.relname = 'otpusnalista'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.partition_name) || ' CASCADE';
    END LOOP;
END $$;

DROP VIEW IF EXISTS vw_registrovanipacijent_full;
DROP TABLE IF EXISTS registrovanipacijent_details;
DROP VIEW IF EXISTS vw_lek_json;
DROP TABLE IF EXISTS stavkaistorije;
DROP TABLE IF EXISTS procedurazaistorija;
DROP TABLE IF EXISTS dijagnozapratecaistorija;
DROP TABLE IF EXISTS otpusnalista;
DROP TABLE IF EXISTS stavkanalogazadavanjeinjekcija;
DROP TABLE IF EXISTS nalogzadavanjeinjekcija;
DROP TABLE IF EXISTS leci;
DROP TABLE IF EXISTS leksadrziaktivnasupstanca;
DROP TABLE IF EXISTS lek;
DROP TABLE IF EXISTS aktivnasupstanca;
DROP TABLE IF EXISTS proizvodjac;
DROP TABLE IF EXISTS formaleka;
DROP TABLE IF EXISTS tipsupstance;
DROP TABLE IF EXISTS istorijabolesti;
DROP TABLE IF EXISTS procedura;
DROP TABLE IF EXISTS vrstaotpusta;
DROP TABLE IF EXISTS uputzastacionarnolecenje;
DROP TABLE IF EXISTS izvestajlekaraspecijaliste;
DROP TABLE IF EXISTS dijagnoza;
DROP TABLE IF EXISTS uputzaambulantnospecijalistickipregled;
DROP TABLE IF EXISTS clanporodice;
DROP TABLE IF EXISTS osiguranje;
DROP TABLE IF EXISTS registrovanipacijent;
DROP TABLE IF EXISTS mesto;
DROP TABLE IF EXISTS nosliacosiguranja;
DROP TABLE IF EXISTS primalacusluge;
DROP TABLE IF EXISTS specijalista;
DROP TABLE IF EXISTS odeljenje;
DROP TABLE IF EXISTS doktormedicine;
DROP TABLE IF EXISTS lekar;
DROP TABLE IF EXISTS medicinskitehnicar;
DROP TABLE IF EXISTS pruzalacusluge;
DROP TABLE IF EXISTS oblastspecijalizacije;
DROP TABLE IF EXISTS osnovosiguranja;
DROP TABLE IF EXISTS uzrokpovrede;

CREATE TABLE oblastspecijalizacije (
    sifraoblasti VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE pruzalacusluge (
    brlicence VARCHAR(20) PRIMARY KEY,
    prezimeime VARCHAR(100) NOT NULL,
    datumobnovelicence DATE NOT NULL
);

CREATE TABLE medicinskitehnicar (
    brlicence VARCHAR(20) PRIMARY KEY,
    FOREIGN KEY (brlicence) REFERENCES pruzalacusluge (brlicence)
);

CREATE TABLE lekar (
    brlicence VARCHAR(20) PRIMARY KEY,
    FOREIGN KEY (brlicence) REFERENCES pruzalacusluge (brlicence)
);

CREATE TABLE doktormedicine (
    brlicence VARCHAR(20) PRIMARY KEY,
    FOREIGN KEY (brlicence) REFERENCES lekar (brlicence)
);

CREATE TABLE odeljenje (
    sifraodeljenja VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE specijalista (
    brlicence VARCHAR(20) PRIMARY KEY,
    sifraoblasti VARCHAR(10) NOT NULL,
    sifraodeljenja VARCHAR(10) NOT NULL,
    FOREIGN KEY (brlicence) REFERENCES lekar (brlicence),
    FOREIGN KEY (sifraoblasti) REFERENCES oblastspecijalizacije (sifraoblasti),
    FOREIGN KEY (sifraodeljenja) REFERENCES odeljenje (sifraodeljenja)
);

CREATE TABLE osnovosiguranja (
    sifraosnova VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE primalacusluge (
    jmbg CHAR(13) PRIMARY KEY,
    prezimeime VARCHAR(100) NOT NULL
);

CREATE TABLE nosliacosiguranja (
    jmbg CHAR(13) PRIMARY KEY,
    FOREIGN KEY (jmbg) REFERENCES primalacusluge (jmbg)
);

CREATE TABLE mesto (
    ppt VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE registrovanipacijent (
    jmbg CHAR(13) PRIMARY KEY,
    pol CHAR(1) NOT NULL,
    imeroditelja VARCHAR(50),
    datumrodjenja DATE NOT NULL,
    posao VARCHAR(100),
    lbo VARCHAR(20) NOT NULL,
    brknjizice VARCHAR(20) NOT NULL,
    adresa VARCHAR(200),
    ppt VARCHAR(10) NOT NULL,
    brlicencetehnicardodao VARCHAR(20) NOT NULL,
    brlicenceizbranidoktor VARCHAR(20) NOT NULL,
    FOREIGN KEY (jmbg) REFERENCES primalacusluge (jmbg),
    FOREIGN KEY (ppt) REFERENCES mesto (ppt),
    FOREIGN KEY (brlicencetehnicardodao) REFERENCES medicinskitehnicar (brlicence),
    FOREIGN KEY (brlicenceizbranidoktor) REFERENCES doktormedicine (brlicence)
);

CREATE TABLE osiguranje (
    sifraos VARCHAR(20) PRIMARY KEY,
    regbr VARCHAR(20) NOT NULL,
    datumod DATE NOT NULL,
    datumdo DATE NOT NULL,
    jmbgpacijent CHAR(13) NOT NULL,
    sifraosnova VARCHAR(10) NOT NULL,
    FOREIGN KEY (jmbgpacijent) REFERENCES registrovanipacijent (jmbg),
    FOREIGN KEY (sifraosnova) REFERENCES osnovosiguranja (sifraosnova)
);

CREATE TABLE clanporodice (
    sifraos VARCHAR(20) PRIMARY KEY,
    jmbgnosilac CHAR(13) NOT NULL,
    srodstvo VARCHAR(50) NOT NULL,
    FOREIGN KEY (sifraos) REFERENCES osiguranje (sifraos),
    FOREIGN KEY (jmbgnosilac) REFERENCES nosliacosiguranja (jmbg)
);

CREATE TABLE uputzaambulantnospecijalistickipregled (
    sifrauputaas VARCHAR(20) PRIMARY KEY,
    razlog VARCHAR(200) NOT NULL,
    datum DATE NOT NULL,
    brprotokola VARCHAR(20) NOT NULL,
    jmbg CHAR(13) NOT NULL,
    brlicenceza VARCHAR(20) NOT NULL,
    FOREIGN KEY (jmbg) REFERENCES registrovanipacijent (jmbg),
    FOREIGN KEY (brlicenceza) REFERENCES specijalista (brlicence)
);

CREATE TABLE dijagnoza (
    sifradijagnoze VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(200) NOT NULL,
    opis TEXT
);

CREATE TABLE izvestajlekaraspecijaliste (
    sifraizvestaja VARCHAR(20) PRIMARY KEY,
    datumvreme TIMESTAMP NOT NULL,
    brprotokola VARCHAR(20) NOT NULL,
    nalazmisljenje TEXT NOT NULL,
    sifrauputaas VARCHAR(20) NOT NULL,
    sifradijagnoze VARCHAR(10) NOT NULL,
    FOREIGN KEY (sifrauputaas) REFERENCES uputzaambulantnospecijalistickipregled (sifrauputaas),
    FOREIGN KEY (sifradijagnoze) REFERENCES dijagnoza (sifradijagnoze)
);

CREATE TABLE uputzastacionarnolecenje (
    sifrauputasl VARCHAR(20) PRIMARY KEY,
    datum DATE NOT NULL,
    brprotokola VARCHAR(20) NOT NULL,
    jmbg CHAR(13) NOT NULL,
    sifradijagnoze VARCHAR(10) NOT NULL,
    FOREIGN KEY (jmbg) REFERENCES registrovanipacijent (jmbg),
    FOREIGN KEY (sifradijagnoze) REFERENCES dijagnoza (sifradijagnoze)
);

CREATE TABLE tipsupstance (
    sifratipasup VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE formaleka (
    sifraformeleka VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE proizvodjac (
    sifraproizvodjaca VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE aktivnasupstanca (
    atc VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL,
    sifratipasup VARCHAR(10) NOT NULL,
    FOREIGN KEY (sifratipasup) REFERENCES tipsupstance (sifratipasup)
);

CREATE TABLE lek (
    jkl VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL,
    jacina NUMERIC(7, 2) NOT NULL,
    jedinica VARCHAR(20) NOT NULL,
    sifraformeleka VARCHAR(10) NOT NULL,
    sifraproizvodjaca VARCHAR(10) NOT NULL,
    FOREIGN KEY (sifraformeleka) REFERENCES formaleka (sifraformeleka),
    FOREIGN KEY (sifraproizvodjaca) REFERENCES proizvodjac (sifraproizvodjaca)
);

CREATE TABLE leksadrziaktivnasupstanca (
    atc VARCHAR(10),
    jkl VARCHAR(10),
    PRIMARY KEY (atc, jkl),
    FOREIGN KEY (atc) REFERENCES aktivnasupstanca (atc),
    FOREIGN KEY (jkl) REFERENCES lek (jkl)
);

CREATE TABLE leci (
    atc VARCHAR(10),
    sifradijagnoze VARCHAR(10),
    PRIMARY KEY (atc, sifradijagnoze),
    FOREIGN KEY (atc) REFERENCES aktivnasupstanca (atc),
    FOREIGN KEY (sifradijagnoze) REFERENCES dijagnoza (sifradijagnoze)
);

CREATE TABLE nalogzadavanjeinjekcija (
    sifranalogainj VARCHAR(20) PRIMARY KEY,
    brprotokola VARCHAR(20) NOT NULL,
    sifrauputasl VARCHAR(20) NOT NULL,
    brlicenceizvrsio VARCHAR(20),
    FOREIGN KEY (sifrauputasl) REFERENCES uputzastacionarnolecenje (sifrauputasl),
    FOREIGN KEY (brlicenceizvrsio) REFERENCES medicinskitehnicar (brlicence)
);

CREATE TABLE stavkanalogazadavanjeinjekcija (
    brstavke INT,
    sifranalogainj VARCHAR(20),
    jkl VARCHAR(10) NOT NULL,
    datumvreme TIMESTAMP,
    propisanoampula INT NOT NULL,
    datoampula INT,
    PRIMARY KEY (brstavke, sifranalogainj),
    FOREIGN KEY (sifranalogainj) REFERENCES nalogzadavanjeinjekcija (sifranalogainj),
    FOREIGN KEY (jkl) REFERENCES lek (jkl)
);

CREATE TABLE uzrokpovrede (
    sifrapovrede VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE procedura (
    sifraprocedure VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE vrstaotpusta (
    sifravrsteot VARCHAR(10) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

CREATE TABLE istorijabolesti (
    brojistorije VARCHAR(20) PRIMARY KEY,
    tezinanovorodjence NUMERIC(7, 2),
    datumprijema DATE NOT NULL,
    datumotpusta DATE,
    sifrauputasl VARCHAR(20) NOT NULL,
    sifravrsteot VARCHAR(10),
    sifrapovrede VARCHAR(10),
    sifradijagnozeuzrokhosp VARCHAR(10) NOT NULL,
    sifradijagnozeuzroksmrti VARCHAR(10),
    brlicencezatvorio VARCHAR(20),
    sifraodeljenjaprijemno VARCHAR(10) NOT NULL,
    FOREIGN KEY (sifrauputasl) REFERENCES uputzastacionarnolecenje (sifrauputasl),
    FOREIGN KEY (sifravrsteot) REFERENCES vrstaotpusta (sifravrsteot),
    FOREIGN KEY (sifrapovrede) REFERENCES uzrokpovrede (sifrapovrede),
    FOREIGN KEY (sifradijagnozeuzrokhosp) REFERENCES dijagnoza (sifradijagnoze),
    FOREIGN KEY (sifradijagnozeuzroksmrti) REFERENCES dijagnoza (sifradijagnoze),
    FOREIGN KEY (brlicencezatvorio) REFERENCES specijalista (brlicence),
    FOREIGN KEY (sifraodeljenjaprijemno) REFERENCES odeljenje (sifraodeljenja)
);

CREATE TABLE stavkaistorije (
    brstavkeistorije INT,
    brojistorije VARCHAR(20),
    jkl VARCHAR(10) NOT NULL,
    datumvreme TIMESTAMP NOT NULL,
    toknalazi TEXT NOT NULL,
    doza NUMERIC(7, 2) NOT NULL,
    PRIMARY KEY (brstavkeistorije, brojistorije),
    FOREIGN KEY (brojistorije) REFERENCES istorijabolesti (brojistorije),
    FOREIGN KEY (jkl) REFERENCES lek (jkl)
);

CREATE TABLE procedurazaistorija (
    brojistorije VARCHAR(20),
    sifraprocedure VARCHAR(10),
    PRIMARY KEY (brojistorije, sifraprocedure),
    FOREIGN KEY (brojistorije) REFERENCES istorijabolesti (brojistorije),
    FOREIGN KEY (sifraprocedure) REFERENCES procedura (sifraprocedure)
);

CREATE TABLE dijagnozapratecaistorija (
    brojistorije VARCHAR(20),
    sifradijagnoze VARCHAR(10),
    PRIMARY KEY (brojistorije, sifradijagnoze),
    FOREIGN KEY (brojistorije) REFERENCES istorijabolesti (brojistorije),
    FOREIGN KEY (sifradijagnoze) REFERENCES dijagnoza (sifradijagnoze)
);

CREATE TABLE otpusnalista (
    sifraotpustneliste VARCHAR(20) PRIMARY KEY,
    predlog TEXT NOT NULL,
    epikriza TEXT NOT NULL,
    datumvreme TIMESTAMP NOT NULL,
    lecenod DATE NOT NULL,
    lecendo DATE NOT NULL,
    brojistorije VARCHAR(20) NOT NULL,
    sifradijagnozekonacna VARCHAR(10) NOT NULL,
    FOREIGN KEY (brojistorije) REFERENCES istorijabolesti (brojistorije),
    FOREIGN KEY (sifradijagnozekonacna) REFERENCES dijagnoza (sifradijagnoze)
);

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE dijagnoza
ADD COLUMN embedding vector(384);

CREATE OR REPLACE FUNCTION notify_new_dijagnoza() RETURNS trigger AS $$
DECLARE
    payload TEXT;
BEGIN
    payload := NEW.sifradijagnoze;
    PERFORM pg_notify('new_dijagnoza', payload);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_new_dijagnoza
AFTER INSERT OR UPDATE ON dijagnoza
FOR EACH ROW
EXECUTE FUNCTION notify_new_dijagnoza();

CREATE INDEX idx_dijagnoza_embedding_ivfflat
ON dijagnoza
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

ALTER TABLE stavkanalogazadavanjeinjekcija
ADD COLUMN IF NOT EXISTS naziv VARCHAR(100);

CREATE OR REPLACE FUNCTION func_populate_naziv_stavka()
RETURNS TRIGGER AS $$
BEGIN
    SELECT l.naziv INTO NEW.naziv
    FROM lek l
    WHERE l.jkl = NEW.jkl;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_insert_stavka
BEFORE INSERT ON stavkanalogazadavanjeinjekcija
FOR EACH ROW
EXECUTE FUNCTION func_populate_naziv_stavka();

CREATE OR REPLACE TRIGGER trg_update_jkl_stavka
BEFORE UPDATE OF jkl ON stavkanalogazadavanjeinjekcija
FOR EACH ROW
EXECUTE FUNCTION func_populate_naziv_stavka();

CREATE OR REPLACE FUNCTION func_deny_update_naziv_stavka()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.naziv IS DISTINCT FROM OLD.naziv THEN
        IF current_setting('my.updating_naziv', true) IS NULL THEN
            RAISE EXCEPTION 'Ne možete direktno menjati kolonu naziv u stavkanalogazadavanjeinjekcija';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_naziv_stavka
BEFORE UPDATE OF naziv ON stavkanalogazadavanjeinjekcija
FOR EACH ROW
EXECUTE FUNCTION func_deny_update_naziv_stavka();

CREATE OR REPLACE FUNCTION func_update_naziv_lek()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM set_config('my.updating_naziv', '1', true);

    UPDATE stavkanalogazadavanjeinjekcija
    SET naziv = NEW.naziv
    WHERE jkl = NEW.jkl
      AND (naziv IS DISTINCT FROM NEW.naziv);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_naziv_lek
AFTER UPDATE OF naziv ON lek
FOR EACH ROW
EXECUTE FUNCTION func_update_naziv_lek();

ALTER TABLE uputzastacionarnolecenje
ADD COLUMN IF NOT EXISTS naziv VARCHAR(200);

CREATE OR REPLACE FUNCTION func_populate_naziv_uput()
RETURNS TRIGGER AS $$
BEGIN
    SELECT d.naziv INTO NEW.naziv
    FROM dijagnoza d
    WHERE d.sifradijagnoze = NEW.sifradijagnoze;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_insert_uput
BEFORE INSERT ON uputzastacionarnolecenje
FOR EACH ROW
EXECUTE FUNCTION func_populate_naziv_uput();

CREATE OR REPLACE TRIGGER trg_update_sifradijagnoze_uput
BEFORE UPDATE OF sifradijagnoze ON uputzastacionarnolecenje
FOR EACH ROW
EXECUTE FUNCTION func_populate_naziv_uput();

CREATE OR REPLACE FUNCTION func_deny_update_naziv_uput()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.naziv IS DISTINCT FROM OLD.naziv THEN
        IF current_setting('my.updating_uput_naziv', true) IS NULL THEN
            RAISE EXCEPTION 'Ne možete direktno menjati kolonu naziv u uputzastacionarnolecenje';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_deny_update_naziv_uput
BEFORE UPDATE OF naziv ON uputzastacionarnolecenje
FOR EACH ROW
EXECUTE FUNCTION func_deny_update_naziv_uput();

CREATE OR REPLACE FUNCTION func_update_naziv_dijagnoza()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM set_config('my.updating_uput_naziv', '1', true);

    UPDATE uputzastacionarnolecenje
    SET naziv = NEW.naziv
    WHERE sifradijagnoze = NEW.sifradijagnoze
      AND (naziv IS DISTINCT FROM NEW.naziv);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_naziv_dijagnoza
AFTER UPDATE OF naziv ON dijagnoza
FOR EACH ROW
EXECUTE FUNCTION func_update_naziv_dijagnoza();

ALTER TABLE otpusnalista
ADD COLUMN IF NOT EXISTS jmbg CHAR(13);

CREATE OR REPLACE FUNCTION func_populate_jmbg_otpusna()
RETURNS TRIGGER AS $$
DECLARE
    v_jmbg CHAR(13);
BEGIN
    SELECT u.jmbg INTO v_jmbg
    FROM istorijabolesti ib
    JOIN uputzastacionarnolecenje u ON ib.sifrauputasl = u.sifrauputasl
    WHERE ib.brojistorije = NEW.brojistorije;

    NEW.jmbg := v_jmbg;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_insert_otpusna
BEFORE INSERT ON otpusnalista
FOR EACH ROW
EXECUTE FUNCTION func_populate_jmbg_otpusna();

CREATE OR REPLACE TRIGGER trg_update_brojistorije_otpusna
BEFORE UPDATE OF brojistorije ON otpusnalista
FOR EACH ROW
EXECUTE FUNCTION func_populate_jmbg_otpusna();

CREATE OR REPLACE FUNCTION func_deny_update_jmbg_otpusna()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.jmbg IS DISTINCT FROM OLD.jmbg THEN
        IF current_setting('my.updating_jmbg_otpusna', true) IS NULL THEN
            RAISE EXCEPTION 'Ne možete direktno menjati kolonu jmbg u otpusnalista';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_deny_update_jmbg_otpusna
BEFORE UPDATE OF jmbg ON otpusnalista
FOR EACH ROW
EXECUTE FUNCTION func_deny_update_jmbg_otpusna();

CREATE OR REPLACE FUNCTION func_update_jmbg_istorija()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM set_config('my.updating_jmbg_otpusna', '1', true);

    UPDATE otpusnalista ol
    SET jmbg = u.jmbg
    FROM uputzastacionarnolecenje u
    WHERE ol.brojistorije = NEW.brojistorije
      AND ol.jmbg IS DISTINCT FROM u.jmbg
      AND u.sifrauputasl = NEW.sifrauputasl;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_jmbg_istorija
AFTER UPDATE OF sifrauputasl ON istorijabolesti
FOR EACH ROW
EXECUTE FUNCTION func_update_jmbg_istorija();

CREATE OR REPLACE FUNCTION func_update_jmbg_uput()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM set_config('my.updating_jmbg_otpusna', '1', true);

    UPDATE otpusnalista ol
    SET jmbg = NEW.jmbg
    FROM istorijabolesti ib
    WHERE ib.brojistorije = ol.brojistorije
      AND ib.sifrauputasl = NEW.sifrauputasl
      AND ol.jmbg IS DISTINCT FROM NEW.jmbg;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_jmbg_uput
AFTER UPDATE OF jmbg ON uputzastacionarnolecenje
FOR EACH ROW
EXECUTE FUNCTION func_update_jmbg_uput();

CREATE OR REPLACE VIEW vw_lek_json AS
SELECT
jsonb_build_object(
  'lek', jsonb_build_object(
    'jkl', l.jkl,
    'naziv', l.naziv,
    'jacina', l.jacina,
    'jedinica', l.jedinica,

    'formaleka', jsonb_build_object(
      'sifraformeleka', fl.sifraformeleka,
      'naziv', fl.naziv
    ),

    'proizvodjac', jsonb_build_object(
      'sifraproizvodjaca', p.sifraproizvodjaca,
      'naziv', p.naziv
    ),

    'aktivnesupstance', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'atc', a.atc,
          'naziv', a.naziv,

          'tipsupstance', jsonb_build_object(
            'sifratipasup', ts.sifratipasup,
            'naziv', ts.naziv
          ),

          'leci', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'sifradijagnoze', d.sifradijagnoze,
                'naziv', d.naziv,
                'opis', d.opis
              )
            )
            FROM leci lc
            JOIN dijagnoza d 
                 ON d.sifradijagnoze = lc.sifradijagnoze
            WHERE lc.atc = a.atc
          )
        )
      )
      FROM leksadrziaktivnasupstanca lsa
      JOIN aktivnasupstanca a 
           ON a.atc = lsa.atc
      JOIN tipsupstance ts 
           ON ts.sifratipasup = a.sifratipasup
      WHERE lsa.jkl = l.jkl
    )

  )
) AS data
FROM lek l
JOIN formaleka fl 
     ON fl.sifraformeleka = l.sifraformeleka
JOIN proizvodjac p 
     ON p.sifraproizvodjaca = l.sifraproizvodjaca;

CREATE OR REPLACE FUNCTION trg_insert_lek_json()
RETURNS TRIGGER AS $$
DECLARE
    lek_json jsonb;
    forma_json jsonb;
    prov_json jsonb;
    supstanca jsonb;
    leci jsonb;
BEGIN
    lek_json := NEW.data->'lek';
    forma_json := lek_json->'formaleka';
    prov_json := lek_json->'proizvodjac';

    INSERT INTO formaleka(sifraformeleka, naziv)
    VALUES (forma_json->>'sifraformeleka', forma_json->>'naziv')
    ON CONFLICT (sifraformeleka) DO NOTHING;

    INSERT INTO proizvodjac(sifraproizvodjaca, naziv)
    VALUES (prov_json->>'sifraproizvodjaca', prov_json->>'naziv')
    ON CONFLICT (sifraproizvodjaca) DO NOTHING;

    INSERT INTO lek(jkl, naziv, sifraformeleka, sifraproizvodjaca, jacina, jedinica)
    VALUES (
        lek_json->>'jkl',
        lek_json->>'naziv',
        forma_json->>'sifraformeleka',
        prov_json->>'sifraproizvodjaca',
        (lek_json->>'jacina')::NUMERIC,
        lek_json->>'jedinica'
    )
    ON CONFLICT (jkl) DO NOTHING;

    FOR supstanca IN SELECT * FROM jsonb_array_elements(lek_json->'aktivnesupstance')
    LOOP
        INSERT INTO tipsupstance(sifratipasup, naziv)
        VALUES (
            (supstanca->'tipsupstance')->>'sifratipasup',
            (supstanca->'tipsupstance')->>'naziv'
        )
        ON CONFLICT (sifratipasup) DO NOTHING;
        
        INSERT INTO aktivnasupstanca(atc, naziv, sifratipasup)
        VALUES (
            supstanca->>'atc',
            supstanca->>'naziv',
            (supstanca->'tipsupstance')->>'sifratipasup'
        )
        ON CONFLICT (atc) DO NOTHING;

        INSERT INTO leksadrziaktivnasupstanca(jkl, atc)
        VALUES (
            lek_json->>'jkl',
            supstanca->>'atc'
        )
        ON CONFLICT (jkl, atc) DO NOTHING;

        FOR leci IN SELECT * FROM jsonb_array_elements(supstanca->'leci')
        LOOP
            INSERT INTO dijagnoza(sifradijagnoze, naziv, opis)
            VALUES (
                leci->>'sifradijagnoze',
                leci->>'naziv',
                leci->>'opis'
            )
            ON CONFLICT (sifradijagnoze) DO NOTHING;

            INSERT INTO leci(atc, sifradijagnoze)
            VALUES (
                supstanca->>'atc',
                leci->>'sifradijagnoze'
            )
            ON CONFLICT (atc, sifradijagnoze) DO NOTHING;
        END LOOP;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_insert_lek_json
INSTEAD OF INSERT ON vw_lek_json
FOR EACH ROW
EXECUTE FUNCTION trg_insert_lek_json();

CREATE OR REPLACE FUNCTION trg_update_lek_json()
RETURNS TRIGGER AS $$
DECLARE
    lek_json jsonb;
    old_lek_json jsonb;
    forma_json jsonb;
    prov_json jsonb;
    supstanca jsonb;
    leci jsonb;
BEGIN
    lek_json := NEW.data->'lek';
    old_lek_json := OLD.data->'lek';
    forma_json := lek_json->'formaleka';
    prov_json := lek_json->'proizvodjac';

    UPDATE formaleka
    SET naziv = forma_json->>'naziv'
    WHERE sifraformeleka = forma_json->>'sifraformeleka'
      AND naziv IS DISTINCT FROM forma_json->>'naziv';

    UPDATE proizvodjac
    SET naziv = prov_json->>'naziv'
    WHERE sifraproizvodjaca = prov_json->>'sifraproizvodjaca'
      AND naziv IS DISTINCT FROM prov_json->>'naziv';

    UPDATE lek
    SET naziv = lek_json->>'naziv',
        jacina = (lek_json->>'jacina')::NUMERIC,
        jedinica = lek_json->>'jedinica',
        sifraformeleka = forma_json->>'sifraformeleka',
        sifraproizvodjaca = prov_json->>'sifraproizvodjaca'
    WHERE jkl = lek_json->>'jkl';

    FOR supstanca IN SELECT * FROM jsonb_array_elements(lek_json->'aktivnesupstance')
    LOOP
        INSERT INTO tipsupstance(sifratipasup, naziv)
        VALUES (
            (supstanca->'tipsupstance')->>'sifratipasup',
            (supstanca->'tipsupstance')->>'naziv'
        )
        ON CONFLICT (sifratipasup) DO UPDATE
          SET naziv = EXCLUDED.naziv;

        INSERT INTO aktivnasupstanca(atc, naziv, sifratipasup)
        VALUES (
            supstanca->>'atc',
            supstanca->>'naziv',
            (supstanca->'tipsupstance')->>'sifratipasup'
        )
        ON CONFLICT (atc) DO UPDATE
          SET naziv = EXCLUDED.naziv,
              sifratipasup = EXCLUDED.sifratipasup;

        INSERT INTO leksadrziaktivnasupstanca(jkl, atc)
        VALUES (
            lek_json->>'jkl',
            supstanca->>'atc'
        )
        ON CONFLICT (jkl, atc) DO NOTHING;

        FOR leci IN SELECT * FROM jsonb_array_elements(supstanca->'leci')
        LOOP
            INSERT INTO dijagnoza(sifradijagnoze, naziv, opis)
            VALUES (
                leci->>'sifradijagnoze',
                leci->>'naziv',
                leci->>'opis'
            )
            ON CONFLICT (sifradijagnoze) DO UPDATE
              SET naziv = EXCLUDED.naziv, opis = EXCLUDED.opis;

            INSERT INTO leci(atc, sifradijagnoze)
            VALUES (
                supstanca->>'atc',
                leci->>'sifradijagnoze'
            )
            ON CONFLICT (atc, sifradijagnoze) DO NOTHING;
        END LOOP;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_lek_json
INSTEAD OF UPDATE ON vw_lek_json
FOR EACH ROW
EXECUTE FUNCTION trg_update_lek_json();

CREATE OR REPLACE FUNCTION trg_delete_lek_json()
RETURNS TRIGGER AS $$
DECLARE
    lek_json jsonb;
    jkl_val text;
    atc_list text[];
BEGIN
    lek_json := OLD.data->'lek';
    jkl_val := lek_json->>'jkl';

    SELECT array_agg(atc) INTO atc_list
    FROM leksadrziaktivnasupstanca
    WHERE jkl = jkl_val;

    DELETE FROM leksadrziaktivnasupstanca WHERE jkl = jkl_val;
    DELETE FROM leci WHERE atc = ANY(atc_list);

    DELETE FROM lek WHERE jkl = jkl_val;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_delete_lek_json
INSTEAD OF DELETE ON vw_lek_json
FOR EACH ROW
EXECUTE FUNCTION trg_delete_lek_json();

INSERT INTO dijagnoza (sifradijagnoze, naziv, opis) VALUES
('I10','Esencijalna hipertenzija','Hronično povišen krvni pritisak bez poznatog uzroka.'),
('I21','Akutni infarkt miokarda','Nekroza srčanog mišića usled prekida dotoka krvi.'),
('I50','Srčana insuficijencija','Nemogućnost srca da obezbedi adekvatan protok krvi.'),
('I48','Atrijalna fibrilacija','Poremećaj srčanog ritma sa nepravilnim otkucajima.'),
('I25','Hronična ishemijska bolest srca','Dugotrajno smanjeno snabdevanje srca krvlju.'),
('I63','Cerebralni infarkt','Moždani udar izazvan prekidom protoka krvi.'),
('I71','Aneurizma aorte','Proširenje zida aorte sa rizikom od rupture.'),
('J45','Astma','Hronično zapaljenje disajnih puteva sa bronhospazmom.'),
('J44','HOBP','Hronična opstruktivna bolest pluća.'),
('J18','Pneumonija','Infekcija plućnog parenhima.'),
('J06','Akutna infekcija GDR','Virusna infekcija gornjih disajnih puteva.'),
('J03','Akutni tonzilitis','Zapaljenje krajnika.'),
('J30','Alergijski rinitis','Alergijska reakcija sluznice nosa.'),
('G40','Epilepsija','Hronični poremećaj sa ponavljanim napadima.'),
('G43','Migrena','Neurološka glavobolja sa pratećim simptomima.'),
('G35','Multipla skleroza','Autoimuna demijelinizaciona bolest CNS-a.'),
('G20','Parkinsonova bolest','Neurodegenerativni poremećaj pokreta.'),
('G50','Trigeminalna neuralgija','Jak bol u području lica.'),
('G45','TIA','Prolazni ishemijski napad.'),
('F32','Depresivna epizoda','Poremećaj raspoloženja sa osećajem tuge.'),
('F33','Rekurentna depresija','Ponavljane depresivne epizode.'),
('F41.1','Generalizovani anksiozni poremećaj','Hronična anksioznost.'),
('F20','Šizofrenija','Teški psihotični poremećaj.'),
('F10.2','Zavisnost od alkohola','Hronična zloupotreba alkohola.'),
('F43.1','PTSP','Psihički poremećaj posle traume.'),
('K21','GERB','Vraćanje želudačne kiseline u jednjak.'),
('K29','Gastritis','Upala sluznice želuca.'),
('K35','Akutni apendicitis','Upala slepog creva.'),
('K80','Holelitijaza','Kamenje u žučnoj kesi.'),
('K52','Neinfektivni gastroenteritis','Upala digestivnog trakta.'),
('K74','Ciroza jetre','Hronično oštećenje jetre.'),
('E11','Dijabetes tip 2','Poremećaj metabolizma glukoze.'),
('E10','Dijabetes tip 1','Autoimuni dijabetes.'),
('E03','Hipotireoza','Smanjena funkcija štitaste žlezde.'),
('E05','Hipertireoza','Povećana funkcija štitaste žlezde.'),
('E66','Gojaznost','Prekomerna telesna masa.'),
('E78','Dislipidemija','Poremećaj masnoća u krvi.'),
('M54','Dorzalgija','Bol u leđima.'),
('M17','Gonartroza','Degeneracija kolena.'),
('M05','Reumatoidni artritis','Autoimuna bolest zglobova.'),
('M81','Osteoporoza','Smanjena gustina kostiju.'),
('M75','Smrznuto rame','Ograničena pokretljivost ramena.'),
('L20','Atopijski dermatitis','Hronična upala kože.'),
('L40','Psorijaza','Autoimuna bolest kože.'),
('L30','Kontaktni dermatitis','Upala kože zbog iritansa.'),
('N39.0','Infekcija urinarnog trakta','Bakterijska infekcija mokraćnih puteva.'),
('N20','Nefrolitijaza','Kamen u bubregu.'),
('N18','Hronična bubrežna bolest','Postepeni gubitak funkcije bubrega.'),
('A15','Tuberkuloza pluća','Hronična bakterijska infekcija pluća.'),
('B20','HIV bolest','Infekcija virusom humane imunodeficijencije');

INSERT INTO proizvodjac (sifraProizvodjaca, naziv) VALUES
('PL001', 'Hemofarm'),
('PL002', 'Galena'), 
('PL003', 'Galenika'),
('PL004', 'Bayer'),  
('PL005', 'Pfizer'),
('PL006', 'Novartis'),  
('PL007', 'Roche'),    
('PL008', 'Sanofi'),  
('PL009', 'GlaxoSmithKline'), 
('PL010', 'Teva');           

INSERT INTO formaleka (sifraformeleka, naziv) VALUES
('FL001','Tableta'),
('FL002','Kapsula'),
('FL003','Prašak'),
('FL004','Granule'),
('FL005','Suspenzija'),
('FL006','Sirup'),
('FL007','Rastvor'),
('FL008','Injekcija'),
('FL009','Infuzija'),
('FL010','Krema'),
('FL011','Gel'),
('FL012','Mast'),
('FL013','Losion'),
('FL014','Flaster'),
('FL015','Aerosol'),
('FL016','Sprej'),
('FL017','Supozitorija'),
('FL018','Lozenga'),
('FL019','Transdermalni gel'),
('FL020','Oralna suspenzija');

INSERT INTO tipsupstance (sifratipasup, naziv) VALUES
('TS001','Analgetik'),
('TS002','Antibiotik'),
('TS003','Antivirus'),
('TS004','Antifungik'),
('TS005','Antiparazitik'),
('TS006','Antihipertenziv'),
('TS007','Beta-blokator'),
('TS008','Diuretik'),
('TS009','Hipolipidemik'),
('TS010','Antidiabetik'),
('TS011','Insulin'),
('TS012','Antikoagulans'),
('TS013','Kortikosteroid'),
('TS014','Antipsihotik'),
('TS015','Antidepresiv'),
('TS016','Antiepileptik'),
('TS017','Bronhodilatator'),
('TS018','Antihistaminik'),
('TS019','Proton-pump inhibitor'),
('TS020','Hormonska terapija'),
('TS021','Vitamin/Minerał'),
('TS022','Anestetik'),
('TS023','Antineoplastični agens'),
('TS024','Imunosupresiv');

INSERT INTO aktivnasupstanca (atc, naziv, sifratipasup) VALUES
('A10BA02','Metformin','TS010'),        
('A02BC01','Omeprazole','TS019'),      
('J01CA04','Amoxicillin','TS002'),    
('N02BE01','Paracetamol','TS001'),   
('C07AB07','Bisoprolol','TS007'),   
('C09AA04','Enalapril','TS006'),   
('C03CA01','Furosemide','TS008'),       
('C10AA05','Atorvastatin','TS009'),    
('J05AB01','Aciclovir','TS003'),      
('J01MA02','Ciprofloxacin','TS002'), 
('A02BX02','Sucralfate','TS019'),   
('R03AC02','Salbutamol','TS017'),  
('A07AA11','Rifaximin','TS002'),  
('M01AE01','Ibuprofen','TS001'), 
('G03CA03','Ethinylestradiol','TS020'), 
('B01AC06','Acetylsalicylic acid','TS001'), 
('A06AD11','Macrogol','TS019'),          
('H02AB04','Methylprednisolone','TS013'),
('N03AX09','Lamotrigine','TS016'),      
('N06AB04','Fluoxetine','TS015'),      
('L04AA13','Leflunomide','TS024'),    
('A16AX07','Calcium, element','TS021'),
('B01AB01','Heparin','TS012'),        
('L01BA01','Methotrexate','TS023'),  
('A10BB12','Glimepiride','TS010'),  
('C08CA01','Amlodipine','TS006'),  
('A02BC02','Pantoprazole','TS019'),     
('J01EE01','Moxifloxacin','TS002'),    
('R03AK06','Ipratropium','TS017'),    
('N02AX02','Tramadol','TS001'),      
('A03FA01','Metoclopramide','TS019'),   
('H03AA01','Levothyroxine','TS020'),   
('S01BA01','Dexamethasone','TS013'),  
('A10BX04','Exenatide','TS010'),     
('N05AB04','Diazepam','TS014'),     
('C01DA02','Digoxin','TS006'),     
('B01AC30','Aspirin with dipyridamole','TS012'), 
('R01AX05','Xylometazoline','TS018'),    
('C09CA03','Losartan','TS006'),         
('G04BE09','Tamsulosin','TS006'),      
('V03AB01','Protamine','TS012'),      
('M05BA07','Alendronic acid','TS009'),   
('R05CA02','Dextromethorphan','TS001'), 
('A11AA01','Thiamine','TS021'),        
('N07AB02','Methadone','TS001'),      
('D01AC02','Itraconazole','TS004'),  
('J05AX01','Oseltamivir','TS003'),  
('P01AB01','Chloroquine','TS005'); 

INSERT INTO leci (atc, sifradijagnoze) VALUES
('N02BE01','M54'),
('N02BE01','M17'),
('N02BE01','M75'),
('N02AX02','M54'),
('N02AX02','M17'),
('N02AX02','M75'),
('B01AC06','I21'),
('B01AC06','I25'),
('B01AC06','I63'),
('R05CA02','J06'),
('N07AB02','J06'),
('J01CA04','J18'),
('J01CA04','J03'),
('J01CA04','J06'),
('J01MA02','J18'),
('J01MA02','N39.0'),
('J01EE01','J18'),
('A07AA11','K52'),
('J05AB01','J06'),
('J05AX01','J06'),
('D01AC02','L40'),
('P01AB01','A15'),
('C09AA04','I10'),
('C08CA01','I10'),
('C01DA02','I50'),
('C09CA03','I10'),
('G04BE09','I10'),
('C07AB07','I10'),
('C07AB07','I21'),
('C07AB07','I50'),
('C03CA01','I50'),
('C10AA05','E78'),
('M05BA07','E78'),
('A10BA02','E11'),
('A10BB12','E11'),
('A10BX04','E11'),
('H02AB04','L20'),
('S01BA01','L20'),
('N03AX09','G40'),
('N06AB04','F32'),
('N06AB04','F33'),
('N05AB04','F20'),
('R03AC02','J45'),
('R03AK06','J45'),
('R01AX05','J30'),
('A02BC01','K21'),
('A02BX02','K21'),
('A02BC02','K21'),
('A03FA01','K21'),
('G03CA03','E03'),
('H03AA01','E03'),
('A16AX07','E66'),
('A11AA01','E66'),
('B01AB01','I21'),
('B01AB01','I63'),
('B01AC30','I21'),
('V03AB01','I21');

INSERT INTO lek (jkl, naziv, jacina, jedinica, sifraformeleka, sifraproizvodjaca) VALUES
('1103702','PRILAZID','2.50','mg','FL001','PL003'),
('1103704','PRILAZID','5.00','mg','FL001','PL003'),
('1103810','MONOPRIL','10.00','mg','FL001','PL003'),
('1103811','MONOPRIL','20.00','mg','FL001','PL003'),
('1401140','ENAP‑H','10.00','mg','FL001','PL005'),
('1401175','ENAP‑HL','10.00','mg','FL001','PL005'),
('1401141','ENAP‑H','5.00','mg','FL001','PL005'),
('1401176','ENAP‑HL','5.00','mg','FL001','PL005'),
('1502234','ATORVASTATIN EG','20.00','mg','FL001','PL010'),
('1502235','ATORVASTATIN EG','40.00','mg','FL001','PL010'),
('1502240','SIMVASTATIN','20.00','mg','FL001','PL010'),
('1502241','SIMVASTATIN','40.00','mg','FL001','PL010'),
('1803310','OMEPRAZOLIN','20.00','mg','FL001','PL006'),
('1803311','OMEPRAZOLIN','40.00','mg','FL001','PL006'),
('1803312','PANTOPRAZOLIN','20.00','mg','FL001','PL007'),
('1803313','PANTOPRAZOLIN','40.00','mg','FL001','PL007'),
('2004120','METOPROLOL','50.00','mg','FL001','PL001'),
('2004121','METOPROLOL','100.00','mg','FL001','PL001'),
('2004122','METOPROLOL','200.00','mg','FL001','PL001'),
('2102035','CILAZAPRIL','10.00','mg','FL001','PL003'),
('2102036','CILAZAPRIL','20.00','mg','FL001','PL003'),
('2208110','FOSINOPRIL','10.00','mg','FL001','PL003'),
('2208111','FOSINOPRIL','20.00','mg','FL001','PL003'),
('2301740','PERINDOPRIL','4.00','mg','FL001','PL008'),
('2301741','PERINDOPRIL','8.00','mg','FL001','PL008'),
('2405001','LISINOPRIL','10.00','mg','FL001','PL009'),
('2405002','LISINOPRIL','20.00','mg','FL001','PL009'),
('2503102','DABIGATRAN','110.00','mg','FL001','PL006'),
('2503103','DABIGATRAN','150.00','mg','FL001','PL006'),
('2602210','WARFARIN','5.00','mg','FL001','PL002'),
('2602211','WARFARIN','2.50','mg','FL001','PL002'),
('2701000','METFORMIN XR','500.00','mg','FL001','PL010'),
('2701001','METFORMIN XR','1000.00','mg','FL001','PL010'),
('2805001','SITAGLIPTIN','100.00','mg','FL001','PL005'),
('2805002','SITAGLIPTIN','50.00','mg','FL001','PL005'),
('2904001','GLIMEPIRIDE XR','4.00','mg','FL001','PL010'),
('2904002','GLIMEPIRIDE XR','2.00','mg','FL001','PL010'),
('3001210','LEVODOPA/CR','100.00','mg','FL001','PL008'),
('3001211','LEVODOPA/CR','200.00','mg','FL001','PL008'),
('3105010','SALMETEROL/FLUTICASONE','50.00','mcg','FL015','PL009'),
('3105011','SALMETEROL/FLUTICASONE','125.00','mcg','FL015','PL009'),
('3204100','IPRATROPIUM/BROMIDE','20.00','mcg','FL015','PL007'),
('3204101','IPRATROPIUM/BROMIDE','40.00','mcg','FL015','PL007'),
('3306050','INSULIN GLARGINE','100.00','IU','FL008','PL006'),
('3306051','INSULIN ASPART','100.00','IU','FL008','PL006'),
('3407701','SALBUTAMOL SPRAY','100.00','mcg','FL016','PL010'),
('3407702','SALBUTAMOL SPRAY','200.00','mcg','FL016','PL010'),
('3508901','IBUPROFEN SUSPENSION','100.00','mg','FL006','PL001'),
('3508902','PARACETAMOL SUSPENSION','120.00','mg','FL006','PL001'),
('3609200','LOPERAMIDE CAP','2.00','mg','FL002','PL009'),
('3609201','LOPERAMIDE CAP','4.00','mg','FL002','PL009'),
('3704020','ACICLOVIR CREAM','5.00','%','FL010','PL005'),
('3704021','CLONAZEPAM','0.50','mg','FL001','PL003'),
('3704022','CLONAZEPAM','1.00','mg','FL001','PL003'),
('3801150','CEFTRIAXONE','1.00','g','FL008','PL010'),
('3801160','CEFTRIAXONE','2.00','g','FL008','PL010'),
('3902200','DICLOFENAC','50.00','mg','FL001','PL001'),
('3902201','DICLOFENAC','75.00','mg','FL001','PL001'),
('4003300','ACETYLSALICYLIC ACID EC','81.00','mg','FL001','PL001'),
('4003301','ACETYLSALICYLIC ACID EC','160.00','mg','FL001','PL001'),
('4104500','OMEPRAZOL CAPS','20.00','mg','FL002','PL006'),
('4104501','OMEPRAZOL CAPS','40.00','mg','FL002','PL006'),
('4205500','NAPROXEN','250.00','mg','FL001','PL008'),
('4205501','NAPROXEN','500.00','mg','FL001','PL008'),
('4306600','HYDROCHLOROTHIAZIDE','25.00','mg','FL001','PL002'),
('4306601','HYDROCHLOROTHIAZIDE','50.00','mg','FL001','PL002'),
('4407700','CETIRIZINE','10.00','mg','FL001','PL009'),
('4407701','CETIRIZINE','20.00','mg','FL001','PL009'),
('4508800','VITAMIN D3','1000.00','IU','FL001','PL003'),
('3801170','CEFOTAXIME','1.00','g','FL008','PL010');

INSERT INTO leksadrziaktivnasupstanca (atc, jkl) VALUES
('C09AA04','1103702'),
('C08CA01','1103702'),
('C09AA04','1103704'),
('C08CA01','1103704'),
('C09AA04','1103810'),
('C03CA01','1103810'),
('C09AA04','1103811'),
('C03CA01','1103811'),
('C09AA04','1401140'),
('C03CA01','1401140'),
('C09AA04','1401141'),
('C03CA01','1401141'),
('C09AA04','1401175'),
('C03CA01','1401175'),
('C09AA04','1401176'),
('C03CA01','1401176'),
('C10AA05','1502234'),
('C10AA05','1502235'),
('C10AA05','1502240'),
('C10AA05','1502241'),
('A02BC01','1803310'),
('A02BX02','1803310'),
('A02BC01','1803311'),
('A02BX02','1803311'),
('A02BC02','1803312'),
('A02BX02','1803312'),
('A02BC02','1803313'),
('A02BX02','1803313'),
('C07AB07','2004120'),
('C08CA01','2004120'),
('C07AB07','2004121'),
('C08CA01','2004121'),
('C07AB07','2004122'),
('C08CA01','2004122'),
('C09AA04','2102035'),
('C03CA01','2102035'),
('C09AA04','2102036'),
('C03CA01','2102036'),
('C09AA04','2208110'),
('C03CA01','2208110'),
('C09AA04','2208111'),
('C03CA01','2208111'),
('C09AA04','2301740'),
('C03CA01','2301740'),
('C09AA04','2301741'),
('C03CA01','2301741'),
('C09AA04','2405001'),
('C03CA01','2405001'),
('C09AA04','2405002'),
('C03CA01','2405002'),
('B01AB01','2503102'),
('B01AC06','2503102'),
('B01AB01','2503103'),
('B01AC06','2503103'),
('B01AB01','2602210'),
('B01AC06','2602210'),
('B01AB01','2602211'),
('B01AC06','2602211'),
('A10BA02','2701000'),
('A10BB12','2701000'),
('A10BA02','2701001'),
('A10BB12','2701001'),
('A10BA02','2805001'),
('A10BB12','2805001'),
('A10BX04','2805001'),
('A10BA02','2805002'),
('A10BB12','2805002'),
('A10BX04','2805002'),
('A10BB12','2904001'),
('A10BA02','2904001'),
('A10BB12','2904002'),
('A10BA02','2904002'),
('N03AX09','3001210'),
('N05AB04','3001210'),
('N03AX09','3001211'),
('N05AB04','3001211'),
('R03AC02','3105010'),
('R03AK06','3105010'),
('S01BA01','3105010'),
('R03AC02','3105011'),
('R03AK06','3105011'),
('S01BA01','3105011'),
('R03AK06','3204100'),
('R03AC02','3204100'),
('R03AK06','3204101'),
('R03AC02','3204101'),
('A10BX04','3306050'),
('A10BA02','3306050'),
('A10BX04','3306051'),
('A10BA02','3306051'),
('R03AC02','3407701'),
('R03AK06','3407701'),
('R03AC02','3407702'),
('R03AK06','3407702'),
('M01AE01','3508901'),
('N02BE01','3508901'),
('N02BE01','3508902'),
('R05CA02','3508902'),
('A07AA11','3609200'),
('A03FA01','3609200'),
('A07AA11','3609201'),
('A03FA01','3609201'),
('J05AB01','3704020'),
('N05AB04','3704021'),
('N03AX09','3704021'),
('N05AB04','3704022'),
('N03AX09','3704022'),
('J01CA04','3801150'),
('J01MA02','3801150'),
('J01EE01','3801150'),
('J01CA04','3801160'),
('J01MA02','3801160'),
('J01EE01','3801160'),
('M01AE01','3902200'),
('N02AX02','3902200'),
('M01AE01','3902201'),
('N02AX02','3902201'),
('B01AC06','4003300'),
('B01AC30','4003300'),
('B01AC06','4003301'),
('B01AC30','4003301'),
('A02BC01','4104500'),
('A02BX02','4104500'),
('A02BC01','4104501'),
('A02BX02','4104501'),
('M01AE01','4205500'),
('B01AC06','4205500'),
('M01AE01','4205501'),
('B01AC06','4205501'),
('C03CA01','4306600'),
('C09AA04','4306600'),
('C03CA01','4306601'),
('C09AA04','4306601'),
('R01AX05','4407700'),
('R05CA02','4407700'),
('R01AX05','4407701'),
('R05CA02','4407701'),
('A16AX07','4508800'),
('A11AA01','4508800');

INSERT INTO mesto (ppt, naziv) VALUES
('11000','Beograd'),
('21000','Novi Sad'),
('18000','Niš'),
('24000','Subotica'),
('34000','Kragujevac'),
('14000','Valjevo'),
('15300','Loznica'),
('25000','Sombor'),
('35000','Jagodina'),
('36000','Kruševac'),
('31000','Užice'),
('19000','Zaječar'),
('12000','Požarevac'),
('26000','Pančevo'),
('22000','Sremska Mitrovica'),
('23000','Pirot'),
('29000','Kraljevo'),
('37010','Vranje'),
('33000','Bor'),
('15000','Šabac'),
('26300','Vršac'),
('35230','Ćuprija'),
('11220','Borča'),
('11500','Obrenovac'),
('11090','Rakovica'),
('11080','Zemun'),
('11070','Novi Beograd'),
('11060','Palilula'),
('32000','Čačak'),
('35100','Paraćin'),
('37020','Leskovac'),
('24400','Ada'),
('24210','Bajmok'),
('25210','Odžaci'),
('36210','Ljubovija'),
('21400','Bačka Palanka'),
('25260','Apatin'),
('22300','Stara Pazova'),
('26310','Alibunar'),
('24300','Bačka Topola'),
('18300','Babušnica'),
('26320','Banatsko Novo Selo'),
('24415','Bački Vinogradi'),
('21470','Bački Petrovac'),
('35260','Despotovac'),
('26210','Kovačica');

INSERT INTO uzrokpovrede (sifrapovrede, naziv) VALUES
('V01','Pešak povređen u sudaru sa vozilom'),
('V02','Biciklista povređen u saobraćajnoj nesreći'),
('V03','Putnik u automobilu povređen u saobraćajnoj nesreći'),
('V04','Vozač motocikla povređen u sudaru'),
('V09','Drugi navedeni saobraćajni udes'),
('V10','Putnik u vozu povređen u nesreći'),
('V19','Drugi biciklista povređen u saobraćajnoj nesreći'),
('V20','Vozač motocikla povređen u saobraćajnoj nesreći'),
('V30','Putnik u trotočkašu'),
('V40','Putnik u automobilu povređen u saobraćajnoj nesreći'),
('V50','Putnik u kombiju ili pick-up vozilu'),
('V60','Putnik u teškom transportnom vozilu'),
('V70','Putnik u autobusu povređen u nesreći'),
('V80','Drugi udesi na kopnenim vozilima'),
('V90','Udesi na vodenim vozilima'),
('V95','Udesi u vazduhoplovstvu i svemiru'),
('W00','Pad na ravnoj površini zbog klizanja'),
('W01','Pad na ravnoj površini zbog klizanja ili spoticanja'),
('W10','Pad sa ili na stepenice i stepeništa'),
('W11','Pad sa ili sa ljestvi'),
('W15','Pad sa litice'),
('W16','Pad sa zgrade'),
('W17','Hodanje u rupu ili pad u rupu'),
('W18','Drugi navedeni padovi'),
('W19','Nepreciziran pad'),
('W20','Udaren od bačenog, projektilnog ili padajućeg objekta'),
('W21','Udaren bačenim objektom'),
('W22','Udario ili sudario se sa drugom osobom'),
('W25','Ugrizen ili udaren od životinje'),
('W32','Slučajno ispaljen vatreni oružje'),
('W36','Slučajna eksplozija'),
('W40','Slučajno oslobađanje drugih gasova i para'),
('W44','Kontakt sa drugim i nepreciziranim oštrim predmetom'),
('W45','Slučajno pogođen padajućim predmetom'),
('W50','Izloženost mehaničkim silama'),
('W65','Utapanje u kadi'),
('W67','Utapanje u bazenu'),
('W74','Neprecizirano utapanje'),
('X00','Izloženost nekontrolisanom požaru u zgradi'),
('X01','Izloženost kontrolisanom požaru u zgradi'),
('X10','Kontakt sa vrućim napicima ili hranom'),
('X15','Kontakt sa toplotom i vrućim objektima'),
('X20','Kontakt sa otrovnim životinjama'),
('X30','Izloženost prekomernoj prirodnoj toploti'),
('X40','Slučajno trovanje analgeticima koji nisu opioidi'),
('X41','Slučajno trovanje antiepileptičkim i sedativima'),
('X43','Slučajno trovanje drugim lekovima'),
('X44','Slučajno trovanje nepreciziranim lekovima'),
('X50','Preopterećenje i naporne pokrete'),
('X58','Slučajno izlaganje drugim faktorima'),
('Y10','Trovanje neodređenog uzroka'),
('Y20','Utapanje neodređenog uzroka'),
('Y30','Pad neodređenog uzroka'),
('Y35','Pravna intervencija sa vatrenim oružjem'),
('Y40','Neželjeni efekti pravilno primenjenog leka'),
('Y60','Medicinski incidenti i nesreće'),
('Y85','Posledice saobraćajne nesreće'),
('Y89','Posledice drugih spoljašnjih uzroka');

INSERT INTO vrstaotpusta (sifravrsteot, naziv) VALUES
('VO001','Otpust kući'),
('VO002','Otpust/premeštaj u drugu zdravstvenu ustanovu za kratkotrajnu hospitalizaciju'),
('VO003','Otpust/premeštaj u drugu zdravstvenu ustanovu'),
('VO004','Statistički otpust'),
('VO005','Otpušten na sopstveni zahtev'),
('VO006','Umro');

INSERT INTO procedura (sifraprocedure, naziv) VALUES
('0FB03ZX','Ekscizija jetre, perkutani pristup, dijagnostička'),
('0DQ10ZZ','Reparacija jednjaka, otvoreni pristup'),
('0DTJ4ZZ','Apendektomija, laparoskopski pristup'),
('0FT40ZZ','Hirurška kolecistektomija, otvoreni pristup'),
('0FB90ZZ','Ekscizija zajedničkog žučnog kanala'),
('0DB60ZZ','Ekscizija želuca, otvoreni pristup'),
('0FT44ZZ','Hepatektomija, laparoskopski pristup'),
('0HB63ZX','Reparacija kože lica, otvoreni pristup'),
('0Y6N0Z0','Biopsija limfnog čvora, perkutani pristup'),
('0TP00ZZ','Fiksacija prijeloma tibije, otvoreni pristup'),
('0THR0ZZ','Totalna zamena kuka, otvoreni pristup'),
('0SR90JZ','Artroskopska sinovektomija kolena'),
('0U5B7ZZ','Rekonekcija urinarnog trakta, otvoreni pristup'),
('0WJG0ZZ','Repozicija frakture radiusa'),
('0WQF0ZZ','Interna fiksacija frakture humerusa'),
('0W4M0Z0','Transfuzija krvi'),
('3E0335Z','Injekcija antibiotika u mišić'),
('3E0435Z','Injekcija antihistaminika, intravenski'),
('3E0535Z','Injekcija analgetika, intravenski'),
('4A023N6','Monitoring srčane funkcije'),
('4A1234Z','Praćenje pulsa i krvnog pritiska'),
('5A1221Z','Koronarni bajpas, bez uređaja'),
('5A15223','Ventilacija pluća'),
('5A1935Z','Hemodijaliza'),
('5A1D70Z','Mehanička pomoć srcu'),
('3E0436Z','Infuzija tečnosti, intravenski'),
('0Y6M0Z0','Biopsija bubrega, perkutani'),
('B2100ZZ','RTG snimanje grudnog koša'),
('B220ZZZ','U/S abdomena'),
('B330ZZ0','CT skeniranje glave'),
('B410ZZ0','MRI skeniranje kičme'),
('C130YZZ','Scintigrafija srca'),
('C400ZZZ','PET skeniranje tijela'),
('D0800ZZ','Zračenje tumora mozga'),
('D1014ZZ','Radioterapija karcinoma dojke'),
('F0100ZZ','Fizioterapija - osnovna rehabilitacija'),
('F0200ZZ','Fizikalna terapija – napredna'),
('GZB0ZZZ','Psihijatrijsko savetovanje'),
('HZC0ZZZ','Detoksikacija od supstanci'),
('0JH60MZ','Inspekcija abdomena, otvoreni pristup'),
('0JD60ZZ','Endoskopska inspekcija gastrointestinalnog trakta'),
('0JD08ZZ','Endoskopska biopsija sluzokože'),
('0RB00ZZ','Hirurška manipulacija šake'),
('0LPCXZZ','Occlusion of right fallopian tube'),
('0U5B8ZZ','Inspekcija mokraćnog sistema'),
('3E0D3CZ','Primena antikoagulanta'),
('3E043BZ','Infuzija kortikosteroida'),
('8E0W0CZ','Akupunktura – opšti pristup'),
('0Y6J0Z0','Biopsija jetre, perkutani biopsijski pristup');

INSERT INTO oblastspecijalizacije (sifraoblasti, naziv) VALUES
('SP001','Interna medicina'),
('SP002','Kardiologija'),
('SP003','Dermatovenerologija'),
('SP004','Ginekologija i akušerstvo'),
('SP005','Pedijatrija'),
('SP006','Neurologija'),
('SP007','Psihijatrija'),
('SP008','Infektivne bolesti'),
('SP009','Endokrinologija i dijabetologija'),
('SP010','Gastroenterologija'),
('SP011','Hematologija'),
('SP012','Nefrologija'),
('SP013','Pulmologija'),
('SP014','Reumatologija'),
('SP015','Onkologija'),
('SP016','Neurohirurgija'),
('SP017','Opšta hirurgija'),
('SP018','Ortopedska hirurgija'),
('SP019','Plastična i rekonstruktivna hirurgija'),
('SP020','Anesteziologija, reanimacija i intenzivna medicina'),
('SP021','Otorinolaringologija'),
('SP022','Oftalmologija'),
('SP023','Urologija'),
('SP024','Epidemiologija'),
('SP025','Medicina rada'),
('SP026','Socijalna medicina'),
('SP027','Sudska medicina'),
('SP028','Fizikalna medicina i rehabilitacija'),
('SP029','Higijena sa medicinskom ekologijom'),
('SP030','Klinička farmakologija'),
('SP031','Medicinska mikrobiologija'),
('SP032','Patološka anatomija'),
('SP033','Radiologija'),
('SP034','Radioterapija'),
('SP035','Nuklearna medicina'),
('SP036','Transfuziologija'),
('SP037','Balneoklimatologija'),
('SP038','Sportska medicina'),
('SP039','Gerijatrija'),
('SP040','Pedijatrijska neurologija'),
('SP041','Dečja i adolescentna psihijatrija'),
('SP042','Infektologija sa epidemiologijom'),
('SP043','Klinička imunologija i alergologija'),
('SP044','Maksilofacijalna hirurgija'),
('SP045','Abdominalna hirurgija'),
('SP046','Vaskularna hirurgija'),
('SP047','Kardiohirurgija'),
('SP048','Palijativna medicina'),
('SP049','Medicinska statistika i informatika');

INSERT INTO odeljenje (sifraodeljenja, naziv) VALUES
('OD001','Interna medicina'),
('OD002','Kardiologija'),
('OD003','Gastroenterologija'),
('OD004','Hematologija'),
('OD005','Endokrinologija'),
('OD006','Pedijatrija'),
('OD007','Neurologija'),
('OD008','Psihijatrija'),
('OD009','Hirurgija'),
('OD010','Ortopedija'),
('OD011','Plastična i rekonstruktivna hirurgija'),
('OD012','Otorinolaringologija'),
('OD013','Oftalmologija'),
('OD014','Urologija'),
('OD015','Anesteziologija i intenzivna nega'),
('OD016','Onkologija'),
('OD017','Radiologija'),
('OD018','Fizikalna medicina i rehabilitacija'),
('OD019','Infektivna medicina'),
('OD020','Transfuziologija'),
('OD021','Palijativna nega'),
('OD022','Neurohirurgija'),
('OD023','Ginekologija');

INSERT INTO osnovosiguranja (sifraosnova, naziv) VALUES
('OS001','Zaposleno lice'),
('OS002','Samostalni delatnik'),
('OS003','Poljoprivrednik'),
('OS004','Penzioner'),
('OS005','Nezaposleno lice sa naknadom'),
('OS006','Nezaposleno lice bez naknade'),
('OS007','Dete'),
('OS008','Trudnica ili majka'),
('OS009','Socijalno ugroženo lice'),
('OS010','Student ili učenick'),
('OS011','Lice pod ugovorom na određeno vreme'),
('OS012','Lice pod honorarnim ugovorom');

INSERT INTO pruzalacusluge (brlicence, prezimeime, datumobnovelicence) VALUES
('LIC_T001','Petrović Marko','2025-06-15'),
('LIC_T002','Janković Ana','2024-11-02'),
('LIC_T003','Nikolić Milica','2026-01-10'),
('LIC_T004','Stojanović Ivana','2025-09-27'),
('LIC_T005','Marinković Luka','2024-12-20'),
('LIC_T006','Kovačević Jelena','2025-03-05'),
('LIC_T007','Đorđević Stefan','2025-08-14'),
('LIC_T008','Popović Marija','2024-10-30'),
('LIC_T009','Rakić Bojan','2025-05-22'),
('LIC_T010','Savić Katarina','2026-02-01'),
('LIC_D001','Vučić Nikola','2025-04-01'),
('LIC_D002','Milošević Tamara','2024-09-15'),
('LIC_D003','Lukić Dragan','2025-12-05'),
('LIC_D004','Anić Ivana','2026-03-12'),
('LIC_D005','Tadić Marko','2025-07-30'),
('LIC_D006','Stefanović Marina','2024-11-18'),
('LIC_D007','Zorić Aleksandar','2025-02-28'),
('LIC_D008','Milutinović Sonja','2025-10-09'),
('LIC_D009','Bogdanović Petar','2026-01-01'),
('LIC_D010','Knežević Nina','2025-06-03'),
('LIC_S001','Jovanović Dragan','2026-04-15'),
('LIC_S002','Pavlović Marija','2025-08-02'),
('LIC_S003','Matić Ana','2024-12-12'),
('LIC_S004','Ilijević Petar','2025-05-05'),
('LIC_S005','Radovanović Jelena','2025-03-21'),
('LIC_S006','Veljković Milan','2025-11-11'),
('LIC_S007','Živković Katarina','2026-02-17'),
('LIC_S008','Simović Luka','2024-10-07'),
('LIC_S009','Vasiljević Milena','2025-09-30'),
('LIC_S010','Stanković Igor','2025-01-19'),
('LIC_S011','Ćirić Marina','2026-06-06'),
('LIC_S012','Knežević Bojan','2024-11-25'),
('LIC_S013','Perić Danijela','2025-07-13'),
('LIC_S014','Obradović Marko','2025-02-02'),
('LIC_S015','Gajić Tijana','2026-03-03'),
('LIC_S016','Bukvić Nenad','2025-10-28'),
('LIC_S017','Milanović Sandra','2024-09-09'),
('LIC_S018','Stevanović Darko','2025-12-20'),
('LIC_S019','Kostić Marina','2026-05-05'),
('LIC_S020','Radojević Nikola','2025-04-18'),
('LIC_S021','Đukić Ivana','2024-12-30'),
('LIC_S022','Babić Predrag','2025-06-25'),
('LIC_S023','Jelić Anđela','2025-08-19'),
('LIC_S024','Popadić Goran','2025-01-07'),
('LIC_S025','Simić Aleksandra','2026-02-28'),
('LIC_S026','Vuković Zoran','2025-09-11'),
('LIC_S027','Šarić Jelena','2024-10-18'),
('LIC_S028','Mandić Filip','2025-11-02'),
('LIC_S029','Ostojić Maja','2025-03-30'),
('LIC_S030','Pantić Saša','2026-01-20');

INSERT INTO medicinskitehnicar (brlicence) VALUES
('LIC_T001'),('LIC_T002'),('LIC_T003'),('LIC_T004'),('LIC_T005'),
('LIC_T006'),('LIC_T007'),('LIC_T008'),('LIC_T009'),('LIC_T010');

INSERT INTO lekar (brlicence) VALUES
('LIC_D001'),('LIC_D002'),('LIC_D003'),('LIC_D004'),('LIC_D005'),
('LIC_D006'),('LIC_D007'),('LIC_D008'),('LIC_D009'),('LIC_D010'),
('LIC_S001'),('LIC_S002'),('LIC_S003'),('LIC_S004'),('LIC_S005'),
('LIC_S006'),('LIC_S007'),('LIC_S008'),('LIC_S009'),('LIC_S010'),
('LIC_S011'),('LIC_S012'),('LIC_S013'),('LIC_S014'),('LIC_S015'),
('LIC_S016'),('LIC_S017'),('LIC_S018'),('LIC_S019'),('LIC_S020'),
('LIC_S021'),('LIC_S022'),('LIC_S023'),('LIC_S024'),('LIC_S025'),
('LIC_S026'),('LIC_S027'),('LIC_S028'),('LIC_S029'),('LIC_S030');

INSERT INTO doktormedicine (brlicence) VALUES
('LIC_D001'),('LIC_D002'),('LIC_D003'),('LIC_D004'),('LIC_D005'),
('LIC_D006'),('LIC_D007'),('LIC_D008'),('LIC_D009'),('LIC_D010');

INSERT INTO specijalista (brlicence, sifraoblasti, sifraodeljenja) VALUES
('LIC_S001','SP002','OD002'),
('LIC_S002','SP013','OD001'),
('LIC_S003','SP003','OD001'),
('LIC_S004','SP004','OD023'),
('LIC_S005','SP005','OD006'),
('LIC_S006','SP006','OD007'),
('LIC_S007','SP007','OD008'),
('LIC_S008','SP008','OD019'),
('LIC_S009','SP009','OD005'),
('LIC_S010','SP010','OD003'),
('LIC_S011','SP011','OD004'),
('LIC_S012','SP012','OD001'),
('LIC_S013','SP014','OD001'),
('LIC_S014','SP015','OD016'),
('LIC_S015','SP016','OD022'),
('LIC_S016','SP017','OD009'),
('LIC_S017','SP018','OD010'),
('LIC_S018','SP019','OD011'),
('LIC_S019','SP020','OD015'),
('LIC_S020','SP021','OD012'),
('LIC_S021','SP022','OD013'),
('LIC_S022','SP023','OD014'),
('LIC_S023','SP024','OD019'),
('LIC_S024','SP028','OD018'),
('LIC_S025','SP033','OD017'),
('LIC_S026','SP036','OD020'),
('LIC_S027','SP038','OD001'),
('LIC_S028','SP039','OD001'),
('LIC_S029','SP043','OD001'),
('LIC_S030','SP047','OD002');

-- Dummy podaci, ovo će se kasnije dodavati iz aplikacije, sada samo za prikaz rada triggera

INSERT INTO primalacusluge (jmbg, prezimeime) VALUES
('0101993712345', 'Jović Marko'),
('1506995823456', 'Marić Ana');

INSERT INTO registrovanipacijent (
    jmbg, pol, imeroditelja, datumrodjenja, posao, lbo, brknjizice, adresa, ppt, brlicencetehnicardodao, brlicenceizbranidoktor
) VALUES
('0101993712345', 'M', 'Petar', '1993-01-01', 'Programer', 'LBO12345', 'BK12345', 'Beogradska 1', '11000', 'LIC_T001', 'LIC_D001'),
('1506995823456', 'F', 'Ivan', '1998-06-15', 'Nastavnik', 'LBO54321', 'BK54321', 'Novosadska 10', '21000', 'LIC_T002', 'LIC_D002');

INSERT INTO osiguranje (sifraos, regbr, datumod, datumdo, jmbgpacijent, sifraosnova) VALUES
('OSIG001', 'RB2025001', '2025-01-01', '2026-01-01', '0101993712345', 'OS001'),
('OSIG002', 'RB2026002', '2026-01-01', '2027-01-01', '1506995823456', 'OS002');

INSERT INTO uputzaambulantnospecijalistickipregled (sifrauputaas, razlog, datum, brprotokola, jmbg, brlicenceza) VALUES
('UPA001', 'Sumnja na akutni infarkt miokarda (bol u grudima, povišeni troponini)', '2026-01-05', 'BP-A-001', '0101993712345', 'LIC_S001'),
('UPA002', 'Trajan kašalj, temperatura, sumnja na pneumoniju', '2026-02-09', 'BP-A-002', '1506995823456', 'LIC_S008');

INSERT INTO izvestajlekaraspecijaliste (sifraizvestaja, datumvreme, brprotokola, nalazmisljenje, sifrauputaas, sifradijagnoze) VALUES
('IZV001', '2026-01-05 10:30:00', 'BP-A-001', 'EKG i troponini ukazuju na akutni infarkt miokarda; preporučena hitna hospitalizacija i dalja terapija.', 'UPA001', 'I21'),
('IZV002', '2026-02-09 11:15:00', 'BP-A-002', 'Klinika i radiološki nalaz ukazuju na akutnu pneumoniju; preporučena hospitalizacija i IV antibiotik.', 'UPA002', 'J18');

INSERT INTO uputzastacionarnolecenje (sifrauputasl, datum, brprotokola, jmbg, sifradijagnoze) VALUES
('UPL001', '2026-01-05', 'BP-L-001', '0101993712345', 'I21'),
('UPL002', '2026-02-10', 'BP-L-002', '1506995823456', 'J18');

INSERT INTO istorijabolesti (brojistorije, tezinanovorodjence, datumprijema, datumotpusta, sifrauputasl, sifravrsteot, sifrapovrede, sifradijagnozeuzrokhosp, sifradijagnozeuzroksmrti, brlicencezatvorio, sifraodeljenjaprijemno) VALUES
('HIS0001', NULL, '2026-01-05', '2026-01-12', 'UPL001', 'VO001', NULL, 'I21', NULL, 'LIC_S001', 'OD002'),
('HIS0002', NULL, '2026-02-10', '2026-02-15', 'UPL002', 'VO001', NULL, 'J18', NULL, 'LIC_S008', 'OD019');

INSERT INTO procedurazaistorija (brojistorije, sifraprocedure) VALUES
('HIS0001', '4A023N6'),
('HIS0002', 'B2100ZZ');

INSERT INTO dijagnozapratecaistorija (brojistorije, sifradijagnoze) VALUES
('HIS0001', 'I50'),
('HIS0002', 'J44');

INSERT INTO stavkaistorije (brstavkeistorije, brojistorije, jkl, datumvreme, toknalazi, doza) VALUES
(1, 'HIS0001', '4003300', '2026-01-05 12:00:00', 'Stabilan bolesnik; bol u grudima smanjen nakon terapije.', 160.00),
(1, 'HIS0002', '3801170', '2026-02-10 14:00:00', 'Primljena IV terapija; temperatura počela da opada.', 1.00);

INSERT INTO otpusnalista (sifraotpustneliste, predlog, epikriza, datumvreme, lecenod, lecendo, brojistorije, sifradijagnozekonacna) VALUES
('OTP0001', 'Kontrola kod kardiologa za 1 sedmicu; nastaviti antiagregacionu terapiju i statin; prilagoditi fizičku aktivnost.', 'Pacijent hospitalizovan zbog akutnog infarkta miokarda (I21). Izvedena terapija, stabilan pri otpustu.', '2026-01-12 10:00:00', '2026-01-05', '2026-01-12', 'HIS0001', 'I21'),
('OTP0002', 'Nastaviti oralnu terapiju po potrebi; kontrola kod infektologa za 7 dana.', 'Pacijent primljen zbog akutne pneumonije (J18). Stacionarna IV terapija, kliničko poboljšanje pri otpustu.', '2026-02-15 10:00:00', '2026-02-10', '2026-02-15', 'HIS0002', 'J18');

INSERT INTO nalogzadavanjeinjekcija (sifranalogainj, brprotokola, sifrauputasl, brlicenceizvrsio) VALUES
('NAJ001', 'BP-L-001', 'UPL001', 'LIC_T001'),
('NAJ002', 'BP-L-002', 'UPL002', 'LIC_T002');

INSERT INTO stavkanalogazadavanjeinjekcija (brstavke, sifranalogainj, jkl, datumvreme, propisanoampula, datoampula) VALUES
(1, 'NAJ001', '3801150', '2026-01-06 08:00:00', 1, 1),
(1, 'NAJ002', '3801170', '2026-02-11 08:00:00', 1, 1),
(2, 'NAJ002', '3801170', '2026-02-12 08:00:00', 1, 1);

ALTER TABLE stavkanalogazadavanjeinjekcija
ADD COLUMN IF NOT EXISTS doza NUMERIC(7,2);

UPDATE stavkanalogazadavanjeinjekcija s
SET doza = s.datoampula * l.jacina
FROM lek l
WHERE s.jkl = l.jkl
  AND (s.doza IS NULL OR s.doza <> s.datoampula * l.jacina);

CREATE OR REPLACE FUNCTION func_calculate_doza_stavkanalogainj()
RETURNS TRIGGER AS
$$
DECLARE
    v_jacina NUMERIC(7,2);
BEGIN
    SELECT jacina
    INTO v_jacina
    FROM lek
    WHERE jkl = NEW.jkl;

    IF v_jacina IS NULL THEN
        RAISE EXCEPTION 'Ne postoji lek sa JKL = %', NEW.jkl;
    END IF;

    NEW.doza := NEW.datoampula * v_jacina;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_calculate_doza_stavkanalogainj
BEFORE INSERT OR UPDATE OF datoampula, jkl
ON stavkanalogazadavanjeinjekcija
FOR EACH ROW
EXECUTE FUNCTION func_calculate_doza_stavkanalogainj();

CREATE OR REPLACE FUNCTION func_calculate_doza_after_update_jacina_in_lek()
RETURNS TRIGGER AS
$$
BEGIN
    UPDATE stavkanalogazadavanjeinjekcija
    SET doza = datoampula * NEW.jacina
    WHERE jkl = NEW.jkl
      AND doza IS DISTINCT FROM (datoampula * NEW.jacina);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_calculate_doza_after_update_jacina_in_lek
AFTER UPDATE OF jacina
ON lek
FOR EACH ROW
EXECUTE FUNCTION func_calculate_doza_after_update_jacina_in_lek();

ALTER TABLE istorijabolesti
ADD COLUMN IF NOT EXISTS vrstaotpusta VARCHAR(100);

UPDATE istorijabolesti i
SET vrstaotpusta = v.naziv
FROM vrstaotpusta v
WHERE i.sifravrsteot = v.sifravrsteot;

ALTER TABLE istorijabolesti
DROP COLUMN IF EXISTS sifravrsteot;

DROP TABLE IF EXISTS vrstaotpusta;

ALTER TABLE istorijabolesti
DROP CONSTRAINT IF EXISTS chk_istorija_vrstaot_allowed;

ALTER TABLE istorijabolesti
ADD CONSTRAINT chk_istorija_vrstaot_allowed CHECK (vrstaotpusta IN (
 'Otpust kući','Otpust/premeštaj u drugu zdravstvenu ustanovu za kratkotrajnu hospitalizaciju','Otpust/premeštaj u drugu zdravstvenu ustanovu','Statistički otpust','	Otpušten na sopstveni zahtev','Umro'
));

CREATE OR REPLACE PROCEDURE proc_update_allowed_vrsteot(new_values text[])
LANGUAGE plpgsql
AS
$$
DECLARE
  v_violators text[];
  in_list text;
  sql text;
BEGIN
  IF array_length(new_values,1) IS NULL THEN
    RAISE EXCEPTION 'Niz sa novim vrednostima ne sme biti prazan';
  END IF;

  SELECT array_agg(DISTINCT vrstaotpusta) INTO v_violators
  FROM istorijabolesti
  WHERE vrstaotpusta IS NOT NULL
    AND NOT (vrstaotpusta = ANY (new_values));

  IF v_violators IS NOT NULL THEN
    RAISE EXCEPTION 'Ne mogu postaviti novo ograničenje: postojeće vrednosti nisu u novom nizu vrednosti: %', v_violators;
  END IF;

  in_list := array_to_string(ARRAY(SELECT quote_literal(trim(v)) FROM unnest(new_values) v), ',');
  sql := format('ALTER TABLE istorijabolesti DROP CONSTRAINT IF EXISTS chk_istorija_vrstaot_allowed; ALTER TABLE istorijabolesti ADD CONSTRAINT chk_istorija_vrstaot_allowed CHECK (vrstaotpusta IN (%s))', in_list);
  EXECUTE sql;
END;
$$;

-- SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conname = 'chk_istorija_vrstaot_allowed';

CREATE TABLE IF NOT EXISTS registrovanipacijent_details (
    jmbg CHAR(13) PRIMARY KEY,
    posao VARCHAR(100),
    adresa VARCHAR(200),
    imeroditelja VARCHAR(50),
    datumrodjenja DATE NOT NULL,
    brlicencetehnicardodao VARCHAR(20) NOT NULL,
    FOREIGN KEY (jmbg) REFERENCES registrovanipacijent (jmbg) ON DELETE CASCADE,
    FOREIGN KEY (brlicencetehnicardodao) REFERENCES medicinskitehnicar (brlicence)
);

INSERT INTO registrovanipacijent_details (jmbg, posao, adresa, imeroditelja, datumrodjenja, brlicencetehnicardodao)
SELECT jmbg, posao, adresa, imeroditelja, datumrodjenja, brlicencetehnicardodao
FROM registrovanipacijent
WHERE (posao IS NOT NULL OR adresa IS NOT NULL OR imeroditelja IS NOT NULL OR datumrodjenja IS NOT NULL OR brlicencetehnicardodao IS NOT NULL)
ON CONFLICT (jmbg) DO NOTHING;

ALTER TABLE registrovanipacijent
    DROP COLUMN IF EXISTS posao,
    DROP COLUMN IF EXISTS adresa,
    DROP COLUMN IF EXISTS imeroditelja,
    DROP COLUMN IF EXISTS datumrodjenja,
    DROP COLUMN IF EXISTS brlicencetehnicardodao;

CREATE OR REPLACE VIEW vw_registrovanipacijent_full AS
SELECT r.jmbg, r.pol, d.imeroditelja, d.datumrodjenja, d.posao, r.lbo, r.brknjizice, d.adresa, r.ppt, d.brlicencetehnicardodao, r.brlicenceizbranidoktor
FROM registrovanipacijent r
LEFT JOIN registrovanipacijent_details d ON r.jmbg = d.jmbg;

REVOKE INSERT, UPDATE, DELETE ON registrovanipacijent FROM PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON registrovanipacijent_details FROM PUBLIC;

CREATE OR REPLACE FUNCTION func_vw_registrovanipacijent_full_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO registrovanipacijent (jmbg, pol, lbo, brknjizice, ppt, brlicenceizbranidoktor)
    VALUES (NEW.jmbg, NEW.pol, NEW.lbo, NEW.brknjizice, NEW.ppt, NEW.brlicenceizbranidoktor);

    INSERT INTO registrovanipacijent_details (jmbg, posao, adresa, imeroditelja, datumrodjenja, brlicencetehnicardodao)
    VALUES (NEW.jmbg, NEW.posao, NEW.adresa, NEW.imeroditelja, NEW.datumrodjenja, NEW.brlicencetehnicardodao)
    ON CONFLICT (jmbg) DO UPDATE
      SET posao = EXCLUDED.posao,
          adresa = EXCLUDED.adresa,
          imeroditelja = EXCLUDED.imeroditelja,
	  datumrodjenja = EXCLUDED.datumrodjenja,
          brlicencetehnicardodao = EXCLUDED.brlicencetehnicardodao;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vw_registrovanipacijent_full_insert
INSTEAD OF INSERT ON vw_registrovanipacijent_full
FOR EACH ROW EXECUTE FUNCTION func_vw_registrovanipacijent_full_insert();

CREATE OR REPLACE FUNCTION func_vw_registrovanipacijent_full_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE registrovanipacijent
    SET pol = NEW.pol,
        lbo = NEW.lbo,
        brknjizice = NEW.brknjizice,
        ppt = NEW.ppt,
        brlicenceizbranidoktor = NEW.brlicenceizbranidoktor
    WHERE jmbg = NEW.jmbg;

    INSERT INTO registrovanipacijent_details (jmbg, posao, adresa, imeroditelja, datumrodjenja, brlicencetehnicardodao)
    VALUES (NEW.jmbg, NEW.posao, NEW.adresa, NEW.imeroditelja, NEW.datumrodjenja, NEW.brlicencetehnicardodao)
    ON CONFLICT (jmbg) DO UPDATE
      SET posao = EXCLUDED.posao,
          adresa = EXCLUDED.adresa,
          imeroditelja = EXCLUDED.imeroditelja,
	  datumrodjenja = EXCLUDED.datumrodjenja,
          brlicencetehnicardodao = EXCLUDED.brlicencetehnicardodao;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vw_registrovanipacijent_full_update
INSTEAD OF UPDATE ON vw_registrovanipacijent_full
FOR EACH ROW EXECUTE FUNCTION func_vw_registrovanipacijent_full_update();

CREATE OR REPLACE FUNCTION func_vw_registrovanipacijent_full_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM registrovanipacijent_details WHERE jmbg = OLD.jmbg;
    DELETE FROM registrovanipacijent WHERE jmbg = OLD.jmbg;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vw_registrovanipacijent_full_delete
INSTEAD OF DELETE ON vw_registrovanipacijent_full
FOR EACH ROW EXECUTE FUNCTION func_vw_registrovanipacijent_full_delete();

ALTER TABLE otpusnalista RENAME TO otpusnalista_old;

CREATE TABLE otpusnalista (
    sifraotpustneliste VARCHAR(20) NOT NULL,
    predlog TEXT NOT NULL,
    epikriza TEXT NOT NULL,
    datumvreme TIMESTAMP NOT NULL,
    lecenod DATE NOT NULL,
    lecendo DATE NOT NULL,
    brojistorije VARCHAR(20) NOT NULL,
    sifradijagnozekonacna VARCHAR(10) NOT NULL,
    jmbg CHAR(13),
    PRIMARY KEY (datumvreme, sifraotpustneliste),
    FOREIGN KEY (brojistorije) REFERENCES istorijabolesti (brojistorije),
    FOREIGN KEY (sifradijagnozekonacna) REFERENCES dijagnoza (sifradijagnoze)
)
PARTITION BY RANGE (datumvreme);

DO $$
DECLARE
    godina int;
    min_god int := 2020;
    max_god int;
    sql text;
BEGIN
    max_god := EXTRACT(YEAR FROM current_date)::int;

    FOR godina IN min_god..max_god LOOP
        sql := format('
            CREATE TABLE IF NOT EXISTS otpusnalista_%s PARTITION OF otpusnalista
            FOR VALUES FROM (%L) TO (%L);',
            godina,
            make_date(godina, 1, 1),
            make_date(godina + 1, 1, 1)
        );
        EXECUTE sql;
    END LOOP;
END$$;

INSERT INTO otpusnalista
SELECT *
FROM otpusnalista_old;

DROP TABLE IF EXISTS otpusnalista_old;

CREATE OR REPLACE TRIGGER trg_insert_otpusna
BEFORE INSERT ON otpusnalista
FOR EACH ROW
EXECUTE FUNCTION func_populate_jmbg_otpusna();

CREATE OR REPLACE TRIGGER trg_update_brojistorije_otpusna
BEFORE UPDATE OF brojistorije ON otpusnalista
FOR EACH ROW
EXECUTE FUNCTION func_populate_jmbg_otpusna();

CREATE OR REPLACE TRIGGER trg_deny_update_jmbg_otpusna
BEFORE UPDATE OF jmbg ON otpusnalista
FOR EACH ROW
EXECUTE FUNCTION func_deny_update_jmbg_otpusna();

CREATE OR REPLACE PROCEDURE proc_create_otpusna_partition_for_current_year()
LANGUAGE plpgsql
AS $$
DECLARE
    y int := EXTRACT(YEAR FROM current_date)::int;
    part_name text := format('otpusnalista_%s', y);
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE c.relname = part_name
          AND n.nspname = current_schema()
    ) THEN
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I
             FOR VALUES FROM (TIMESTAMP %L) TO (TIMESTAMP %L);',
            part_name,
            'otpusnalista',
            make_date(y,1,1)::text,
            make_date(y+1,1,1)::text
        );
        RAISE NOTICE 'Particija za % kreirana', y;
    ELSE
        RAISE NOTICE 'Particija za % već postoji', y;
    END IF;
END;
$$;