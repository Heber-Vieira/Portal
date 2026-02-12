-- Habilitar RLS na tabela profiles se ainda não estiver habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam seus próprios perfis
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Política para permitir que administradores vejam todos os perfis
-- Assumindo que existe uma role 'Administrador' na coluna role
CREATE POLICY "Administradores podem ver todos os perfis" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'Administrador'
  )
);

-- Política de Atualização para Administradores
-- Permite que admins atualizem qualquer perfil
CREATE POLICY "Administradores podem atualizar qualquer perfil" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'Administrador'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'Administrador'
  )
);

-- Política de Atualização para o Próprio Usuário
-- Permite que o usuário atualize apenas campos básicos do seu perfil
-- (Opcional, se desejado. Caso contrário, apenas admins editam)
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política de Exclusão para Administradores
CREATE POLICY "Administradores podem excluir perfis" 
ON profiles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'Administrador'
  )
);

-- Garantir que a coluna primary_color existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'primary_color') THEN
        ALTER TABLE profiles ADD COLUMN primary_color TEXT DEFAULT '#0f172a';
    END IF;
END $$;

-- Garantir que a coluna allowed_apps existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'allowed_apps') THEN
        ALTER TABLE profiles ADD COLUMN allowed_apps TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Garantir que a coluna role existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'Usuário';
    END IF;
END $$;

-- Política de Inserção (Geralmente via trigger no auth.users, mas se precisar inserir direto)
CREATE POLICY "Administradores podem criar perfis" 
ON profiles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'Administrador'
  )
);
