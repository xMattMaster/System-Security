CREATE OR REPLACE FUNCTION check_appartenenze_func()
RETURNS TRIGGER AS $$
DECLARE
    v_codice VARCHAR(30);
    v_tipo_pagamento VARCHAR(5);
BEGIN
    SELECT codicepagamento, tipopagamento 
    INTO v_codice, v_tipo_pagamento
    FROM clienti
    WHERE id = NEW.cliente;

    IF v_codice IS NULL OR v_tipo_pagamento IS NULL THEN
        RAISE EXCEPTION 'Il metodo di pagamento è NULL, non è possibile registrare il veicolo';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_appartenenze ON appartenenze_auto;
CREATE TRIGGER check_appartenenze
BEFORE INSERT ON appartenenze_auto
FOR EACH ROW
EXECUTE FUNCTION check_appartenenze_func();
