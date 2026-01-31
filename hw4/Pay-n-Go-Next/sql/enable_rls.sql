-- Enable Row Level Security on additional tables

-- AUTOMOBILI: Users can only see their own vehicles
ALTER TABLE automobili ENABLE ROW LEVEL SECURITY;

CREATE POLICY automobili_rls_policy ON automobili FOR ALL
USING (
    targa IN (
        SELECT automobile 
        FROM appartenenze_auto 
        WHERE cliente = current_setting('app.user_id')::text
    )
);

-- APPARTENENZE_AUTO: Users can only see their own vehicle associations
ALTER TABLE appartenenze_auto ENABLE ROW LEVEL SECURITY;

CREATE POLICY appartenenze_auto_rls_policy ON appartenenze_auto FOR ALL
USING (cliente = current_setting('app.user_id')::text);

-- TRAGITTI: Users can only see trips from their own devices
ALTER TABLE tragitti ENABLE ROW LEVEL SECURITY;

CREATE POLICY tragitti_rls_policy ON tragitti FOR ALL
USING (
    dispositivo IN (
        SELECT ada.dispositivo
        FROM appartenenze_auto aa
        JOIN associazioni_disp_auto ada ON aa.automobile = ada.automobile
        WHERE aa.cliente = current_setting('app.user_id')::text
    )
);

-- ASSOCIAZIONI_DISP_AUTO: Users can only see device associations for their vehicles
ALTER TABLE associazioni_disp_auto ENABLE ROW LEVEL SECURITY;

CREATE POLICY associazioni_disp_auto_rls_policy ON associazioni_disp_auto FOR ALL
USING (
    automobile IN (
        SELECT automobile 
        FROM appartenenze_auto 
        WHERE cliente = current_setting('app.user_id')::text
    )
);
