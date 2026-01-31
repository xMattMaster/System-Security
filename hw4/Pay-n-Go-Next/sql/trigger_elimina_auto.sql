-- Trigger che elimina tutte le auto associate al cliente dalla tabella AUTOMOBILI quando viene eliminato
CREATE OR REPLACE FUNCTION elimina_auto_func()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM automobili WHERE targa = OLD.automobile;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS elimina_auto ON appartenenze_auto;
CREATE TRIGGER elimina_auto
AFTER DELETE ON appartenenze_auto
FOR EACH ROW
EXECUTE FUNCTION elimina_auto_func();
