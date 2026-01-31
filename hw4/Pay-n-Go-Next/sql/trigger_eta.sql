-- Trigger che verifica se l'utente è maggiorenne
CREATE OR REPLACE FUNCTION verifica_eta_func()
RETURNS TRIGGER AS $$
BEGIN
    IF EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.datanascita)) < 18 THEN
        RAISE EXCEPTION 'Devi essere maggiorenne per poterti registrare';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS verifica_eta ON clienti;
CREATE TRIGGER verifica_eta
BEFORE INSERT ON clienti
FOR EACH ROW
EXECUTE FUNCTION verifica_eta_func();

DROP TRIGGER IF EXISTS verifica_eta_update ON clienti;
CREATE TRIGGER verifica_eta_update
BEFORE UPDATE ON clienti
FOR EACH ROW
EXECUTE FUNCTION verifica_eta_func();
