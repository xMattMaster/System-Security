CREATE OR REPLACE PROCEDURE COMPLETA_REGISTRAZIONE (
    IN In_Id TEXT,
    IN In_Nome TEXT,
    IN In_Cognome TEXT,
    IN In_DataNascita DATE,
    IN In_CodiceFiscale VARCHAR(16),
    IN In_Indirizzo VARCHAR(40)
)
LANGUAGE plpgsql
AS $$
DECLARE
BEGIN
    INSERT INTO clienti (id, nome, cognome, datanascita, codicefiscale, indirizzo) 
    VALUES (In_Id, In_Nome, In_Cognome, In_DataNascita, In_CodiceFiscale, In_Indirizzo);
    
    COMMIT;
END; $$;