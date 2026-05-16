-- Migration: activer le RLS sur portfolio.learning_items et créer les 4 policies

-- 1. Activer le RLS
ALTER TABLE portfolio.learning_items ENABLE ROW LEVEL SECURITY;

-- 2. Policy INSERT: admin uniquement
DROP POLICY IF EXISTS "Only admin can create learning items" ON portfolio.learning_items;
CREATE POLICY "Only admin can create learning items" ON portfolio.learning_items
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

-- 3. Policy SELECT: public (anon + authenticated)
DROP POLICY IF EXISTS "Anyone can view learning items" ON portfolio.learning_items;
CREATE POLICY "Anyone can view learning items" ON portfolio.learning_items
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 4. Policy UPDATE: admin uniquement
DROP POLICY IF EXISTS "Only admin can update learning items" ON portfolio.learning_items;
CREATE POLICY "Only admin can update learning items" ON portfolio.learning_items
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
    WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

-- 5. Policy DELETE: admin uniquement
DROP POLICY IF EXISTS "Only admin can delete learning items" ON portfolio.learning_items;
CREATE POLICY "Only admin can delete learning items" ON portfolio.learning_items
    FOR DELETE
    TO authenticated
    USING (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);