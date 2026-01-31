-- Trigger che elimina tutte le auto associate al cliente a seguito della sua eliminazione
CREATE OR REPLACE FUNCTION elimina_appartenenze_auto_func()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM appartenenze_auto WHERE cliente = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS elimina_appartenenze_auto ON clienti;
CREATE TRIGGER elimina_appartenenze_auto
AFTER DELETE ON clienti
FOR EACH ROW
EXECUTE FUNCTION elimina_appartenenze_auto_func();
