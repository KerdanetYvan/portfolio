-- Migration: activer le RLS sur portfolio.status et créer les 4 policies

-- 1. Activer le RLS
ALTER TABLE portfolio.status ENABLE ROW LEVEL SECURITY;

-- 2. Policy SELECT: public (anon + authenticated)
DROP POLICY IF EXISTS "Anyone can view status" ON portfolio.status;
CREATE POLICY "Anyone can view status" ON portfolio.status
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. Policy INSERT: admin uniquement
DROP POLICY IF EXISTS "Only admin can create status" ON portfolio.status;
CREATE POLICY "Only admin can create status" ON portfolio.status
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

-- 4. Policy UPDATE: admin uniquement
DROP POLICY IF EXISTS "Only admin can update status" ON portfolio.status;
CREATE POLICY "Only admin can update status" ON portfolio.status
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
    WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

-- 5. Policy DELETE: admin uniquement
DROP POLICY IF EXISTS "Only admin can delete status" ON portfolio.status;
CREATE POLICY "Only admin can delete status" ON portfolio.status
    FOR DELETE
    TO authenticated
    USING (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);