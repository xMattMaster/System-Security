CREATE OR REPLACE PROCEDURE CASELLO_TRAFFICATO(
    INOUT Out_somma INT DEFAULT NULL,
    INOUT Out_max_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT C.id, COUNT(*)
    INTO Out_max_id, Out_somma
    FROM tragitti T 
    JOIN caselli C ON T.casello_ingresso = C.id
    GROUP BY C.id
    ORDER BY COUNT(*) DESC
    LIMIT 1;
END; $$;