# Memirros Noivas - Sistema de Locação de Vestidos

## 📋 Sobre o Projeto

MVP completo de um sistema de loja de vestidos de casamento e eventos, desenvolvido em React + Vite + TypeScript. O sistema possui duas interfaces principais: Cliente e Admin, todas funcionando com dados mockados (sem backend real).

## 🚀 Funcionalidades

### Interface do Cliente
- **Catálogo de Vestidos**
  - Listagem com paginação automática
  - Filtros por categoria (Noiva, Madrinha, Formatura, Debutante)
  - Busca por nome/descrição
  - Modal com detalhes completos do vestido
  - Galeria de imagens
  - Botão para agendar prova

- **Agendamento de Provas**
  - Formulário completo com validações
  - Seleção de data e horário
  - Confirmação com toast
  - Salvamento no mock da API

- **Minhas Provas**
  - Lista de agendamentos do cliente
  - Visualização de status (pendente, confirmado, cancelado, concluído)
  - Opção de cancelar provas

### Interface Admin
- **Dashboard**
  - Cards com KPIs (total de vestidos, disponíveis, próximas provas)
  - Lista de próximos agendamentos
  - Visão geral do sistema

- **Gestão de Vestidos**
  - CRUD completo (criar, editar, excluir)
  - Listagem em tabela
  - Formulário com validações
  - Upload simulado de imagens (via URLs)
  - Controle de disponibilidade

- **Gestão de Agendamentos**
  - Lista completa com filtros
  - Filtro por status e data
  - Alterar status (pendente → confirmado → concluído)
  - Cancelar agendamentos
  - Modal com detalhes completos

- **Gestão de Clientes**
  - Listagem de todos os clientes
  - Visualização de histórico de aluguéis e provas
  - Edição de informações básicas
  - Estatísticas por cliente

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── admin/              # Componentes do admin
│   │   ├── DressForm.tsx
│   │   └── StatsCard.tsx
│   ├── client/             # Componentes do cliente
│   │   ├── AppointmentForm.tsx
│   │   ├── DressCard.tsx
│   │   └── DressModal.tsx
│   ├── layouts/            # Layouts e proteção de rotas
│   │   ├── AdminLayout.tsx
│   │   ├── ClientLayout.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/                 # Componentes shadcn/ui
├── contexts/
│   └── AuthContext.tsx     # Contexto de autenticação
├── hooks/
│   └── use-toast.ts        # Hook de notificações
├── pages/
│   ├── admin/              # Páginas do admin
│   │   ├── AppointmentsManagement.tsx
│   │   ├── ClientsManagement.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DressesManagement.tsx
│   │   └── Login.tsx
│   ├── client/             # Páginas do cliente
│   │   ├── Catalog.tsx
│   │   └── MyAppointments.tsx
│   ├── Login.tsx           # Login do cliente
│   └── NotFound.tsx        # Página 404
├── services/
│   └── apiMock.ts          # API Mock com dados simulados
├── types/
│   └── index.ts            # Tipos TypeScript
├── App.tsx                 # Configuração de rotas
└── main.tsx               # Entry point
```

## 🔐 Autenticação

Sistema de autenticação mock com dois tipos de usuários:

**Cliente:**
- Email: `cliente@memirros.com`
- Senha: `123456`

**Admin:**
- Email: `admin@memirros.com`
- Senha: `123456`

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado assíncrono
- **date-fns** - Manipulação de datas
- **Sonner** - Notificações toast
- **Lucide React** - Ícones

## 🚦 Como Executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em desenvolvimento:**
```bash
npm run dev
```

3. **Acessar a aplicação:**
- Cliente: http://localhost:8080/
- Admin: http://localhost:8080/admin

## 📊 Dados Mock

Todos os dados são simulados e armazenados em memória durante a execução. O arquivo `src/services/apiMock.ts` contém:

- **6 vestidos** pré-cadastrados de diferentes categorias
- **3 agendamentos** de exemplo
- **3 clientes** com históricos
- **Delay artificial** de 400-600ms nas requisições para simular rede

### API Mock Disponível

```typescript
// Autenticação
authAPI.login(email, password)

// Vestidos
dressesAPI.getAll(filters?)
dressesAPI.getById(id)
dressesAPI.create(dress)
dressesAPI.update(id, dress)
dressesAPI.delete(id)

// Agendamentos
appointmentsAPI.getAll(filters?)
appointmentsAPI.getByClientId(clientId)
appointmentsAPI.create(appointment)
appointmentsAPI.updateStatus(id, status)
appointmentsAPI.cancel(id)

// Clientes
clientsAPI.getAll()
clientsAPI.getById(id)
clientsAPI.update(id, client)
```

## 🔒 Proteção de Rotas

O sistema utiliza o componente `ProtectedRoute` para garantir que:
- Usuários não autenticados sejam redirecionados para login
- Clientes só acessem rotas de cliente
- Admins só acessem rotas de admin

## 🎯 Próximos Passos (Sugestões)

1. **Integração com Backend Real**
   - Conectar com API REST
   - Implementar upload real de imagens
   - Persistência de dados

2. **Funcionalidades Adicionais**
   - Sistema de pagamento
   - Calendário visual para agendamentos
   - Notificações por email/SMS
   - Relatórios e analytics
   - Sistema de avaliações

3. **Melhorias UX/UI**
   - Dark mode
  - Animações e transições
   - PWA (Progressive Web App)
   - Responsividade mobile aprimorada

## 📝 Notas Importantes

- ⚠️ **Dados em Memória**: Todos os dados são resetados ao recarregar a página
- 🔄 **Sem Persistência**: Não há banco de dados real
- 🎭 **Simulação Completa**: Toda a API é mockada localmente
- 🚀 **Production Ready**: Interface pronta para conectar com backend real

## 👥 Créditos

Desenvolvido como MVP para o sistema Memirros Noivas - Loja de vestidos de casamento e eventos.
