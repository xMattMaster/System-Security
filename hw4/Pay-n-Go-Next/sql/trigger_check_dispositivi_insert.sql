-- Trigger che verifica se i dispositivi inseriti sono associati al massimo a due veicoli
CREATE OR REPLACE FUNCTION check_dispositivi_insert_func()
RETURNS TRIGGER AS $$
DECLARE
    disp_count INT;
BEGIN
    SELECT COUNT(*) INTO disp_count 
    FROM associazioni_disp_auto 
    WHERE dispositivo = NEW.dispositivo; 
    
    -- Se ci sono già 2 (o più) associazioni, blocca l'inserimento
    IF disp_count >= 2 THEN
        RAISE EXCEPTION 'Limite massimo di veicoli (2) raggiunto per questo dispositivo';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_dispositivi_insert ON associazioni_disp_auto;
CREATE TRIGGER check_dispositivi_insert
BEFORE INSERT ON associazioni_disp_auto
FOR EACH ROW
EXECUTE FUNCTION check_dispositivi_insert_func();
