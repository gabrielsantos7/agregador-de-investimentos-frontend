# Agregador de Investimentos - Frontend

Aplicação web para gerenciamento e acompanhamento de investimentos.

## 🚀 Instalação e configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm

### Instalação

1. Clone o repositório.

2. Instale as dependências:

    ```bash
    pnpm i
    ```

3. Configure as variáveis de ambiente:

    Crie um arquivo `.env` na raiz do projeto com a seguinte variável. Substitua o valor pela URL da API do backend:

    ```plaintext
    VITE_API_URL=http://localhost:8080
    ```

4. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

### Scripts disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Gera o build de produção
- `pnpm format` - Formata o código
- `pnpm lint` - Executa o linter
- `pnpm preview` - Visualiza o build de produção

## 🛠️ Tecnologias utilizadas

### Core

- **React** - Biblioteca para construção de interfaces de usuário
- **TypeScript** - Adiciona tipagem estática ao JavaScript
- **Vite** - Ferramenta de build e servidor de desenvolvimento

### Roteamento e estado

- **TanStack Router** - Gerenciamento de rotas da aplicação
- **TanStack Query** - Gerenciamento de estado assíncrono e cache de dados
- **TanStack Store** - Gerenciamento de estado global

### UI e estilização

- **Tailwind CSS** - Framework de CSS utilitário
- **Shadcn/UI** - Componentes de UI funcionais e estilizados
- **Lucide React** - Biblioteca de ícones
- **Sonner** - Notificações toast

### Requisições HTTP

- **Axios** - Fazer requisições HTTP para a API

### Utilitários

- **clsx** - Utilitário para construção de classes CSS condicionais
- **tailwind-merge** - Mesclar classes do Tailwind CSS
- **class-variance-authority** - Criar variantes de componentes

### Ferramentas de desenvolvimento

- **Biome** - Formatter e linter para JavaScript/TypeScript
- **TanStack Devtools** - Ferramentas de desenvolvimento para debug
