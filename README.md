# SeniorEase Mobile 📱👴👵

Um aplicativo de anotações, lembretes e gestão de tarefas desenhado com foco absoluto na **acessibilidade** e facilidade de uso para o público sénior. O SeniorEase permite que os utilizadores organizem a sua rotina sem barreiras tecnológicas, oferecendo suporte nativo para comandos de voz, leitura de ecrã e interface adaptativa.

---

## ✨ O Que Foi Feito (Principais Funcionalidades)

O projeto foi construído para resolver problemas reais de usabilidade, entregando as seguintes funcionalidades:

- **Cadernos Personalizáveis:** Organização por cadernos com títulos, descrições e ícones (emojis).
- **Blocos Dinâmicos (Rich Content):**
  - 📝 **Textos:** Anotações simples.
  - ✅ **Tarefas:** Checklists interativas.
  - ⏰ **Lembretes:** Integração com notificações locais para avisos de horários.
  - 📹 **Reuniões:** Acesso rápido a links externos (Zoom, Meet, etc.).
- **Acessibilidade em Primeiro Lugar:**
  - 🎙️ **Ditação por Voz:** Conversão de fala em texto em tempo real (`@react-native-voice/voice`).
  - 🔊 **Leitura em Voz Alta (TTS):** Síntese de voz nativa para ler os conteúdos do ecrã.
  - ⚙️ **Painel de Acessibilidade:** Ajuste dinâmico do tamanho da fonte, espaçamento e alto contraste.
- **Reforço Positivo:** Sistema de elogios dinâmicos ao concluir tarefas ou criar cadernos, gerando uma experiência acolhedora.
- **Armazenamento Offline:** Dados persistidos localmente e de forma segura utilizando o `AsyncStorage`.

---

## 🛠️ Tecnologias e Arquitetura

O projeto foi desenvolvido sob os princípios da **Clean Architecture** (Arquitetura Limpa), garantindo um código altamente testável, escalável e de fácil manutenção.

- **Framework:** React Native com Expo
- **Linguagem:** TypeScript (Strict Mode)
- **Armazenamento:** `@react-native-async-storage/async-storage`
- **Testes:** Jest + React Native Testing Library
- **CI/CD:** GitHub Actions + Expo Application Services (EAS)

### Estrutura de Pastas (Clean Architecture)

- `/domain`: Entidades core (Notebook, ContentBlock) e contratos de Repositórios.
- `/application`: Casos de Uso (Use Cases) isolados (ex: `AddBlockUseCase`, `UpdateNotebookUseCase`).
- `/infrastructure`: Implementação de repositórios (`AsyncStorage`) e serviços externos (Notificações, TTS).
- `/presentation`: Componentes UI, Hooks e Stores (React Context API).

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

Certifique-se de que tem o [Node.js](https://nodejs.org/) (versão 20+) instalado e uma conta no [Expo](https://expo.dev/).

Recomenda-se ter a CLI do EAS instalada:

```bash
npm install -g eas-cli
```

### Passos para Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seniorease-mobile.git
cd seniorease-mobile
```

2. Instale as dependências:

```bash
npm install
```

> **Nota:** O script `postinstall` executará automaticamente o `patch-package` para corrigir dependências nativas legadas, como o `react-native-voice`.

3. Inicie o servidor de desenvolvimento do Expo:

```bash
npx expo start
```

Pressione **a** para abrir no emulador Android, **i** para o simulador iOS, ou leia o QR Code com a app Expo Go no seu telemóvel físico.

---

## 🧪 Testes Unitários

A aplicação possui uma ampla cobertura de testes, validando Casos de Uso, Serviços, Contextos Globais e a interface do utilizador.

Para executar a suite de testes:

```bash
npm run test
```

Para limpar a cache do Jest (em caso de problemas com mocks):

```bash
npx jest --clearCache
```

---

## ⚙️ CI/CD (Integração e Entrega Contínuas)

O projeto conta com pipelines automatizados configurados no GitHub Actions para garantir a qualidade do código e a entrega contínua do executável via Expo EAS.

### 1. CI - Qualidade e Testes (`.github/workflows/ci.yml`)

Disparado automaticamente a cada `push` ou `pull_request` na branch `main`.

- **Validação de Tipagem:** Executa `npx tsc --noEmit` para garantir a integridade do TypeScript.
- **Testes Unitários:** Roda a suite do Jest para evitar regressões na lógica de negócio e na UI.

### 2. CD - Build e Deploy (`.github/workflows/cd.yml`)

Responsável por gerar o pacote instalável (APK/AAB para Android) na nuvem da Expo.

#### Como é disparado:

- Automaticamente ao criar uma Tag de versão no repositório (ex: `git tag v1.0.0` e `git push origin v1.0.0`).
- Manualmente através da aba **Actions** no GitHub (opção `workflow_dispatch`).

O fluxo aplica automaticamente o `patch-package` antes de empacotar o código nativo, garantindo a compatibilidade de bibliotecas de voz com o Gradle mais recente.

### Configuração Necessária para o CD

Para que o GitHub Actions consiga comunicar com o EAS, o repositório possui uma variável de ambiente (Secret) configurada:

- `EXPO_TOKEN`: Token de autenticação gerado na plataforma Expo.

---

