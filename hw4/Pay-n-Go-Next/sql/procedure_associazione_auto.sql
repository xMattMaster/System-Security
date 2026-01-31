CREATE OR REPLACE PROCEDURE ASSOCIAZIONE_AUTO(
    In_user_id TEXT,
    In_targa VARCHAR(7),
    In_modello VARCHAR(20),
    In_device VARCHAR(11),
    In_option INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_id INT;
BEGIN
    IF In_option = 0 THEN
        SELECT D.Codice INTO v_new_id 
        FROM dispositivi D 
        WHERE D.Codice NOT IN (SELECT dispositivo FROM associazioni_disp_auto) 
        ORDER BY D.Codice ASC
        LIMIT 1;
        
        INSERT INTO automobili (targa, modello) VALUES (In_targa, In_modello);
        INSERT INTO appartenenze_auto (automobile, cliente) VALUES (In_targa, In_user_id);
        INSERT INTO associazioni_disp_auto (Dispositivo, Automobile) VALUES (v_new_id, In_targa);
    ELSE
        INSERT INTO automobili (targa, modello) VALUES (In_targa, In_modello);
        INSERT INTO appartenenze_auto (automobile, cliente) VALUES (In_targa, In_user_id);
        INSERT INTO associazioni_disp_auto (dispositivo, automobile) VALUES (In_device::INT, In_targa);
    END IF;

    COMMIT;
END; $$;