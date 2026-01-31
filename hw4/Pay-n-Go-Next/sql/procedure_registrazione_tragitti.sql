CREATE OR REPLACE PROCEDURE REGISTRAZIONE_TRAGITTI(
    In_Cod_Disp INT,
    In_Cod_Cas_E VARCHAR(20),
    In_Num_Cas_E INT,
    In_Cod_Cas_U VARCHAR(20),
    In_Num_Cas_U INT,
    In_DataOra_I TIMESTAMP,
    In_DataOra_U TIMESTAMP
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_ingresso INT;
    v_id_uscita INT;
    v_num_trag INT;
BEGIN
    SELECT id INTO v_id_ingresso FROM caselli WHERE codice = In_Cod_Cas_E AND numero = In_Num_Cas_E;
    SELECT id INTO v_id_uscita FROM caselli WHERE codice = In_Cod_Cas_U AND numero = In_Num_Cas_U;
    
    SELECT COALESCE(MAX(numtragitto), 0) INTO v_num_trag FROM tragitti WHERE dispositivo = In_Cod_Disp;
    
    INSERT INTO tragitti (numtragitto, dispositivo, casello_ingresso, casello_uscita, dataora_i, dataora_u)
    VALUES (v_num_trag + 1, In_Cod_Disp, v_id_ingresso, v_id_uscita, In_DataOra_I, In_DataOra_U);

    COMMIT;
END; $$;