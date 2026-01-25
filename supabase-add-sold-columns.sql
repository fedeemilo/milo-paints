-- Agregar columnas para el estado de vendido
-- Ejecutar esto en el SQL Editor de Supabase

-- Agregar columna 'sold' (boolean, por defecto false)
ALTER TABLE paintings 
ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT false NOT NULL;

-- Agregar columna 'sold_at' (timestamp, nullable)
ALTER TABLE paintings 
ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE;

-- Opcional: Crear un índice para mejorar las consultas por estado vendido
CREATE INDEX IF NOT EXISTS idx_paintings_sold ON paintings(sold);

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'paintings' 
  AND column_name IN ('sold', 'sold_at');
