-- SQL para criar dados de exemplo para o usuário caipora@kuky.cloud
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, obter o ID do usuário caipora@kuky.cloud
DO $$
DECLARE
    user_id_caipora UUID;
BEGIN
    -- Buscar o ID do usuário caipora@kuky.cloud
    SELECT id INTO user_id_caipora 
    FROM auth.users 
    WHERE email = 'caipora@kuky.cloud';
    
    -- Se não encontrar o usuário, parar a execução
    IF user_id_caipora IS NULL THEN
        RAISE EXCEPTION 'Usuário caipora@kuky.cloud não encontrado!';
    END IF;
    
    -- 2. Inserir clientes de exemplo
    INSERT INTO public.clients (name, phone, email, address) VALUES
    ('João Silva', '(11) 99999-1234', 'joao.silva@email.com', 'Rua das Flores, 123 - São Paulo/SP'),
    ('Maria Santos', '(11) 88888-5678', 'maria.santos@email.com', 'Av. Paulista, 456 - São Paulo/SP'),
    ('Pedro Oliveira', '(11) 77777-9012', 'pedro.oliveira@email.com', 'Rua Augusta, 789 - São Paulo/SP'),
    ('Ana Costa', '(21) 66666-3456', 'ana.costa@email.com', 'Copacabana, 321 - Rio de Janeiro/RJ'),
    ('Carlos Ferreira', '(11) 55555-7890', 'carlos.ferreira@email.com', 'Vila Madalena, 654 - São Paulo/SP'),
    ('Lucia Mendes', '(11) 44444-2345', 'lucia.mendes@email.com', 'Ipiranga, 987 - São Paulo/SP'),
    ('Roberto Lima', '(11) 33333-6789', 'roberto.lima@email.com', 'Mooca, 147 - São Paulo/SP'),
    ('Fernanda Alves', '(11) 22222-1234', 'fernanda.alves@email.com', 'Liberdade, 258 - São Paulo/SP');

    -- 3. Inserir orçamentos de exemplo
    INSERT INTO public.budgets (
        id, owner_id, client_name, client_phone, client_email, client_address,
        device_type, brand, model, device_password, defect_description,
        total_value, status, warranty_months, payment_condition, observations,
        created_at, updated_at
    ) VALUES
    -- Orçamento 1 - Aprovado
    (
        gen_random_uuid(), user_id_caipora, 'João Silva', '(11) 99999-1234', 'joao.silva@email.com', 'Rua das Flores, 123 - São Paulo/SP',
        'Smartphone', 'Samsung', 'Galaxy S21', '1234', 'Tela quebrada e não liga',
        350.00, 'approved', 3, 'À vista', 'Cliente aprovou o orçamento. Aguardando chegada da peça.',
        NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'
    ),
    -- Orçamento 2 - Concluído
    (
        gen_random_uuid(), user_id_caipora, 'Maria Santos', '(11) 88888-5678', 'maria.santos@email.com', 'Av. Paulista, 456 - São Paulo/SP',
        'iPhone', 'Apple', 'iPhone 12', '0000', 'Bateria viciada, descarrega rápido',
        280.00, 'completed', 6, '2x sem juros', 'Reparo concluído. Cliente satisfeito.',
        NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 days'
    ),
    -- Orçamento 3 - Enviado
    (
        gen_random_uuid(), user_id_caipora, 'Pedro Oliveira', '(11) 77777-9012', 'pedro.oliveira@email.com', 'Rua Augusta, 789 - São Paulo/SP',
        'Tablet', 'Samsung', 'Galaxy Tab A7', '', 'Touch não funciona em algumas áreas',
        180.00, 'sent', 3, 'À vista', 'Orçamento enviado via WhatsApp. Aguardando resposta.',
        NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
    ),
    -- Orçamento 4 - Rascunho
    (
        gen_random_uuid(), user_id_caipora, 'Ana Costa', '(21) 66666-3456', 'ana.costa@email.com', 'Copacabana, 321 - Rio de Janeiro/RJ',
        'Notebook', 'Dell', 'Inspiron 15', 'senha123', 'Não liga, led de energia pisca',
        450.00, 'draft', 6, '3x sem juros', 'Aguardando confirmação do diagnóstico.',
        NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
    ),
    -- Orçamento 5 - Rejeitado
    (
        gen_random_uuid(), user_id_caipora, 'Carlos Ferreira', '(11) 55555-7890', 'carlos.ferreira@email.com', 'Vila Madalena, 654 - São Paulo/SP',
        'Smartphone', 'Xiaomi', 'Redmi Note 10', '9876', 'Câmera traseira não foca',
        220.00, 'rejected', 3, 'À vista', 'Cliente achou o valor alto. Buscará outras opções.',
        NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'
    ),
    -- Orçamento 6 - Aprovado
    (
        gen_random_uuid(), user_id_caipora, 'Lucia Mendes', '(11) 44444-2345', 'lucia.mendes@email.com', 'Ipiranga, 987 - São Paulo/SP',
        'Smartwatch', 'Apple', 'Apple Watch Series 6', '', 'Tela riscada e pulseira quebrada',
        320.00, 'approved', 6, '2x sem juros', 'Aguardando peças. Previsão: 3 dias úteis.',
        NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'
    ),
    -- Orçamento 7 - Concluído
    (
        gen_random_uuid(), user_id_caipora, 'Roberto Lima', '(11) 33333-6789', 'roberto.lima@email.com', 'Mooca, 147 - São Paulo/SP',
        'Fone de Ouvido', 'Sony', 'WH-1000XM4', '', 'Lado direito não funciona',
        150.00, 'completed', 3, 'À vista', 'Reparo realizado. Fone testado e funcionando.',
        NOW() - INTERVAL '12 days', NOW() - INTERVAL '5 days'
    ),
    -- Orçamento 8 - Enviado
    (
        gen_random_uuid(), user_id_caipora, 'Fernanda Alves', '(11) 22222-1234', 'fernanda.alves@email.com', 'Liberdade, 258 - São Paulo/SP',
        'Smartphone', 'Motorola', 'Moto G9 Plus', '1122', 'Entrada do carregador com problema',
        80.00, 'sent', 3, 'À vista', 'Reparo simples. Aguardando confirmação.',
        NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
    );

    -- 4. Obter IDs dos orçamentos recém-criados para adicionar peças
    -- E criar algumas entradas na lixeira (orçamentos deletados)
    
    -- Criar um orçamento que será "deletado" (para a lixeira)
    WITH deleted_budget AS (
        INSERT INTO public.budgets (
            id, owner_id, client_name, client_phone, client_email,
            device_type, brand, model, defect_description,
            total_value, status, warranty_months, payment_condition,
            created_at, updated_at, deleted_at, deleted_by
        ) VALUES (
            gen_random_uuid(), user_id_caipora, 'Cliente Teste Deletado', '(11) 99999-0000', 'teste@deletado.com',
            'Smartphone', 'Samsung', 'Galaxy A50', 'Teste de exclusão',
            200.00, 'draft', 3, 'À vista',
            NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', 
            NOW() - INTERVAL '3 days', user_id_caipora
        ) RETURNING id, client_name, device_type, brand, model, total_value, created_at
    )
    -- Registrar na tabela de auditoria (lixeira)
    INSERT INTO public.budget_deletion_audit (
        budget_id, budget_data, parts_data, deleted_by, created_at, can_restore
    )
    SELECT 
        id,
        jsonb_build_object(
            'client_name', client_name,
            'device_type', device_type,
            'brand', brand,
            'model', model,
            'total_value', total_value,
            'created_at', created_at
        ),
        '[]'::jsonb,
        user_id_caipora,
        NOW() - INTERVAL '3 days',
        true
    FROM deleted_budget;

    -- Criar outro orçamento deletado mais antigo
    WITH deleted_budget2 AS (
        INSERT INTO public.budgets (
            id, owner_id, client_name, client_phone, client_email,
            device_type, brand, model, defect_description,
            total_value, status, warranty_months, payment_condition,
            created_at, updated_at, deleted_at, deleted_by
        ) VALUES (
            gen_random_uuid(), user_id_caipora, 'Outro Cliente Deletado', '(11) 88888-0000', 'outro@deletado.com',
            'Tablet', 'Apple', 'iPad Air', 'Segundo teste de exclusão',
            400.00, 'sent', 6, '2x sem juros',
            NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days', 
            NOW() - INTERVAL '7 days', user_id_caipora
        ) RETURNING id, client_name, device_type, brand, model, total_value, created_at
    )
    INSERT INTO public.budget_deletion_audit (
        budget_id, budget_data, parts_data, deleted_by, created_at, can_restore
    )
    SELECT 
        id,
        jsonb_build_object(
            'client_name', client_name,
            'device_type', device_type,
            'brand', brand,
            'model', model,
            'total_value', total_value,
            'created_at', created_at
        ),
        '[]'::jsonb,
        user_id_caipora,
        NOW() - INTERVAL '7 days',
        true
    FROM deleted_budget2;

    RAISE NOTICE 'Dados de exemplo criados com sucesso para o usuário caipora@kuky.cloud!';
    RAISE NOTICE 'Criados: 8 orçamentos ativos, 8 clientes e 2 itens na lixeira';

END $$;