# 🚀 Automated IT Offboarding Web App & Portal

Uma solução **End-to-End** desenvolvida para automatizar, padronizar e auditar o processo de desligamento de colaboradores no **Google Workspace**, integrada a um painel web interativo e a uma planilha de controle.

---

## 📌 Visão Geral

O processo manual de offboarding de TI costuma ser vulnerável a falhas humanas, demorado e difícil de rastrear. Este projeto resolve esse desafio combinando a **Admin Directory API do Google Workspace**, **Google Apps Script** e um **Web App responsivo com Tailwind CSS**.

Com apenas alguns cliques, a equipe de TI executa automaticamente tarefas críticas de revogação de acesso e retém o histórico completo em tempo real, mantendo um controle visual simples para etapas adicionais de infraestrutura manual (como o Active Directory).

---

## ✨ Funcionalidades

- **🔒 Desativação & Movimentação de UO no Workspace**: Suspende a conta do usuário imediatamente e move o cadastro para a Organizational Unit (OU) de destino (`/Desativados`).
- **👥 Gestão Automática de Grupos**: Remove o colaborador de todos os grupos de e-mail e distribuição do Workspace, preservando apenas o grupo dedicado a backup/retenção.
- **📦 Integração de Retention & Backup (Keepit)**: Insere o usuário automaticamente no grupo de retenção garantindo a integridade dos dados antes do descarte.
- **🕒 Agendamento Inteligente de Licenças**: Cria gatilhos automatizados para a remoção gradual da licença (24h após o desligamento), otimizando custos e conformidade.
- **🎛️ Painel Web Interativo (Dashboard)**:
  - Visual moderno, responsivo e com suporte a *Dark Mode*.
  - Sincronização em tempo real de duas vias com o Google Sheets.
  - Alternância rápida com um clique para status manuais (**`⏳ Pendente`** ↔ **`✅ SIM`**).

---

## 🛠️ Tecnologias Utilizadas

- **Google Apps Script (GAS)** — Motor de automação e integração de APIs.
- **Google Workspace Admin SDK (Directory API)** — Gestão de Usuários e Grupos no domínio.
- **HTML5 & Tailwind CSS** — Interface gráfica limpa, executiva e responsiva.
- **FontAwesome** — Identidade visual e ícones funcionais.
- **Google Sheets** — Banco de dados de retaguarda e audit trail.

---

## 🏗️ Estrutura da Planilha de Controle

A planilha vinculada deve manter exatamente a seguinte ordem nas colunas da **Linha 1** (Colunas A até G):

| Coluna | Nome do Cabeçalho | Descrição |
| :---: | :--- | :--- |
| **A** | `Nome` | Nome completo do colaborador desligado |
| **B** | `E-mail` | Endereço corporativo no Google Workspace |
| **C** | `Grupos Workspace` | Status da remoção dos grupos de e-mail |
| **D** | `Keepit (Backup)` | Confirmação da inclusão no grupo de retenção |
| **E** | `Suspensão UO` | Confirmação da suspensão e movimentação de pasta |
| **F** | `Desativação AD` | Controle manual de desativação no Active Directory |
| **G** | `Licença (24h)` | Status do agendamento da remoção de licença |

---

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos
* Conta com privilégios de **Super Administrador** no Google Workspace Admin Console.
* Serviço do **AdminDirectory** ativado nas Configurações Avançadas de Serviços do Apps Script.

### 2. Configuração do Código Backend (`Codigo.gs`)

Crie o arquivo `Codigo.gs` no editor de scripts vinculado à sua planilha e defina as constantes iniciais com as configurações da sua empresa.

### 3. Instruções de Implantação (Deployment)

1. No Apps Script, clique em **Implantar** > **Nova implantação**.
2. Tipo: **App da Web**.
3. **Executar como**: `EU` *(Conta de Administrador)*.
4. **Quem tem acesso**: `Qualquer pessoa na sua organização`.
