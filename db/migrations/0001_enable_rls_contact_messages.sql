-- Migration: activer le RLS sur portfolio.contact_messages et créer les 4 policies

-- 1. Activer le RLS
ALTER TABLE portfolio.contact_messages ENABLE ROW LEVEL SECURITY;

-- 2. Policy SELECT: admin uniquement
DROP POLICY IF EXISTS "Only admin can view contact messages" ON portfolio.contact_messages;
CREATE POLICY "Only admin can view contact messages" ON portfolio.contact_messages
    FOR SELECT
    TO authenticated
    USING (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

-- 3. Policy INSERT: public (anon + authenticated)
DROP POLICY IF EXISTS "Anyone can create contact messages" ON portfolio.contact_messages;
CREATE POLICY "Anyone can create contact messages" ON portfolio.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 4. Policy UPDATE: admin uniquement
DROP POLICY IF EXISTS "Only admin can update contact messages" ON portfolio.contact_messages;
CREATE POLICY "Only admin can update contact messages" ON portfolio.contact_messages
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
    WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

-- 5. Policy DELETE: admin uniquement
DROP POLICY IF EXISTS "Only admin can delete contact messages" ON portfolio.contact_messages;
CREATE POLICY "Only admin can delete contact messages" ON portfolio.contact_messages
    FOR DELETE
    TO authenticated
    USING (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);