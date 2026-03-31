-- ContAI - Script de Configuração do Banco de Dados
-- Execute este script no Editor SQL do Supabase

-- 1. Habilitar RLS na tabela lancamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- 2. Criar política para usuários verem apenas seus próprios registros
CREATE POLICY "Users can view own lancamentos"
ON public.lancamentos
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Criar política para usuários inserirem apenas seus próprios registros
CREATE POLICY "Users can insert own lancamentos"
ON public.lancamentos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Criar política para usuários atualizarem apenas seus próprios registros
CREATE POLICY "Users can update own lancamentos"
ON public.lancamentos
FOR UPDATE
USING (auth.uid() = user_id);

-- 5. Criar política para usuários excluírem apenas seus próprios registros
CREATE POLICY "Users can delete own lancamentos"
ON public.lancamentos
FOR DELETE
USING (auth.uid() = user_id);

-- 6. (Opcional) Permitir visualização compartilhada por "zap" para modo familiar
-- Descomente se quiser permitir que usuários vejam registros compartilhados
-- CREATE POLICY "Users can view shared lancamentos by zap"
-- ON public.lancamentos
-- FOR SELECT
-- USING (
--   auth.uid() = user_id OR 
--   EXISTS (SELECT 1 FROM public.lancamentos l2 WHERE l2.zap = lancamentos.zap AND l2.user_id = auth.uid())
-- );

-- 7. Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_created_at ON public.lancamentos(created_at);
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria ON public.lancamentos(categoria);
CREATE INDEX IF NOT EXISTS idx_lancamentos_zap ON public.lancamentos(zap);

-- 8. (Opcional) Trigger para deletar registros quando usuário for deletado
-- CREATE OR REPLACE FUNCTION delete_user_lancamentos()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   DELETE FROM public.lancamentos WHERE user_id = OLD.id;
--   RETURN OLD;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_user_delete
-- AFTER DELETE ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION delete_user_lancamentos();
