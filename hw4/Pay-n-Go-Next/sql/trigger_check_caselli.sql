-- Trigger che verifica se il casello inserito ha codice e numero unici
CREATE OR REPLACE FUNCTION check_caselli_func()
RETURNS TRIGGER AS $$
DECLARE
    found_cod INT;
BEGIN
    SELECT COUNT(*) INTO found_cod 
    FROM caselli 
    WHERE codice = NEW.codice AND numero = NEW.numero;
    
    IF found_cod > 0 THEN
        RAISE EXCEPTION 'Si è provato ad inserire un casello già esistente';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_caselli ON caselli;
CREATE TRIGGER check_caselli
BEFORE INSERT ON caselli
FOR EACH ROW
EXECUTE FUNCTION check_caselli_func();
