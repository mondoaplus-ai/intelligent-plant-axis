Diagnóstico encontrado

- A tela Comercial > Clientes ainda está usando o store local `useCustomerStore` com dados em memória/localStorage.
- O modal de Pedidos já consulta a tabela real de clientes no banco.
- No banco, a tabela de clientes está vazia neste momento. Por isso o pedido mostra “Nenhum cliente cadastrado”, mesmo que a tela de clientes mostre clientes locais/mockados.
- O campo de cliente em Pedido é um `Select` comum, não um campo pesquisável; por isso não permite digitar para buscar o nome.

Plano de correção sem contorno

1. Migrar o módulo de Clientes para o banco
   - Criar hook de clientes com React Query para listar, criar, editar, excluir e alterar status usando a tabela real de clientes.
   - Mapear corretamente os campos da tela para o banco: nome, código, CPF/CNPJ, contato, endereço principal, status, categoria, prazo de pagamento, limite de crédito e observações.
   - Manter compatibilidade com os componentes atuais da tela de clientes.

2. Atualizar Comercial > Clientes
   - Trocar `useCustomerStore` pelo novo hook conectado ao banco.
   - Ao criar/editar/excluir cliente, salvar no banco de verdade.
   - Após salvar cliente, invalidar/refazer também a query usada pelo modal de pedidos (`customers-list`), para o pedido enxergar imediatamente o cliente recém-cadastrado.

3. Corrigir o seletor de cliente no Pedido
   - Substituir o `Select` simples por um campo pesquisável com digitação.
   - Ao abrir o pedido, refazer a busca de clientes atualizada no banco.
   - Ao digitar, filtrar clientes por nome, documento ou código.
   - Ao selecionar cliente, preencher automaticamente CPF/CNPJ e endereço de entrega.
   - Exibir mensagens reais: carregando, erro ao carregar, nenhum cliente no banco.

4. Preservar segurança e integridade
   - Não usar dados mockados/localStorage como fonte do pedido.
   - Não buscar cliente por chave administrativa.
   - Usar as permissões existentes do usuário autenticado.
   - Se necessário, ajustar apenas políticas/permissões da tabela de clientes, sem abrir dados publicamente.

5. Validação
   - Confirmar que a tabela de clientes passa a receber novos cadastros.
   - Criar um cliente em Comercial > Clientes.
   - Abrir Novo Pedido.
   - Digitar parte do nome do cliente e selecionar.
   - Confirmar que documento e endereço são preenchidos e que o pedido pode ser salvo com o cliente correto.