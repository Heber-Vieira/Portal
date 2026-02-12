-- DESSATIVAR RLS TEMPORARIAMENTE PARA EVITAR BLOQUEIOS DURANTE A MANUTENÇÃO
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- REMOVER TODAS AS POLÍTICAS EXISTENTES PARA EVITAR CONFLITOS
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Administradores podem ver todos os perfis" ON profiles;
DROP POLICY IF EXISTS "Administradores podem atualizar qualquer perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Administradores podem excluir perfis" ON profiles;
DROP POLICY IF EXISTS "Administradores podem criar perfis" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- GARANTIR COLUNAS NECESSÁRIAS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'Usuário';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
        ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'allowed_apps') THEN
        ALTER TABLE profiles ADD COLUMN allowed_apps TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'primary_color') THEN
        ALTER TABLE profiles ADD COLUMN primary_color TEXT DEFAULT '#0f172a';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE profiles ADD COLUMN name TEXT;
    END IF;
END $$;

-- POLÍTICAS DE LEITURA (SELECT)
CREATE POLICY "Leitura: Usuários veem o próprio perfil" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Leitura: Administradores veem todos os perfis" 
ON profiles FOR SELECT 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'Administrador'
);

-- POLÍTICAS DE ATUALIZAÇÃO (UPDATE)
CREATE POLICY "Atualização: Administradores editam qualquer perfil" 
ON profiles FOR UPDATE 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'Administrador'
);

CREATE POLICY "Atualização: Usuários editam o próprio perfil" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- POLÍTICAS DE EXCLUSÃO (DELETE)
CREATE POLICY "Exclusão: Apenas Administradores" 
ON profiles FOR DELETE 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'Administrador'
);

-- POLÍTICAS DE INSERÇÃO (INSERT)
CREATE POLICY "Inserção: Administradores ou Trigger de Auth" 
ON profiles FOR INSERT 
WITH CHECK (true); -- Geralmente controlado por triggers do supabase, mas permissivo aqui para evitar erros de criação manual se necessário, controlando na aplicação

-- REATIVAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- CORREÇÃO DE EMERGÊNCIA: GARANTIR QUE O USUÁRIO ATUAL SEJA ADMINISTRADOR
-- Substitua SEU_EMAIL_AQUI pelo seu e-mail de login se necessário rodar manualmente
-- UPDATE profiles SET role = 'Administrador' WHERE email = 'SEU_EMAIL_AQUI';
