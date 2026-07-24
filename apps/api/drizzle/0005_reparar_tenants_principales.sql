WITH candidatos AS (
  SELECT DISTINCT ON (t.organizacion_id)
    t.id
  FROM tenants_qlik t
  WHERE t.estado = 'activo'
    AND NOT EXISTS (
      SELECT 1
      FROM tenants_qlik principal
      WHERE principal.organizacion_id = t.organizacion_id
        AND principal.es_principal = true
    )
  ORDER BY t.organizacion_id, t.creado_en ASC, t.id ASC
)
UPDATE tenants_qlik
SET es_principal = true,
    actualizado_en = now()
WHERE id IN (SELECT id FROM candidatos);
