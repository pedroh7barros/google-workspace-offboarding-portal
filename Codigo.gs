const OU_DESATIVADOS = "/Desativados";
const GRUPO_KEEPIT = "seu_grupo_backup@empresa.com.br"; // Substitua pelo e-mail do grupo de retenção

// 0. SERVIR O WEB APP
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Portal de Offboarding TI')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 1. CARREGAR HISTÓRICO DA PLANILHA (Linha 2 em diante - 7 Colunas)
function carregarHistoricoPlanilha() {
  try {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const ultimaLinha = aba.getLastRow();
    
    if (ultimaLinha < 2) return [];

    const dados = aba.getRange(2, 1, ultimaLinha - 1, 7).getValues();
    const historico = [];

    for (let i = 0; i < dados.length; i++) {
      const linha = dados[i];
      if (!linha[0] && !linha[1]) continue;

      historico.push({
        linhaPlanilha: i + 2,
        nome: linha[0] || "Sem Nome",
        email: linha[1] || "",
        grupos: linha[2] || "Removido(a)",
        keepit: linha[3] || "SIM",
        suspensao: linha[4] || "Movido / Suspenso",
        statusAD: linha[5] || "Pendente",   // Coluna F (6)
        licenca: linha[6] || "Agendado (24h)" // Coluna G (7)
      });
    }
    return historico;
  } catch (e) {
    Logger.log("Erro ao carregar histórico: " + e.message);
    return [];
  }
}

// 2. ALTERAR STATUS MANUAL NA PLANILHA (Coluna F / AD)
function atualizarStatusManualWeb(linhaPlanilha, tipoColuna, novoStatus) {
  try {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const celula = aba.getRange(linhaPlanilha, 6);

    if (novoStatus === 'SIM') {
      celula.setValue("SIM").setBackground("#DCFCE7").setFontColor("#15803D");
    } else {
      celula.setValue("Pendente").setBackground("#FEF3C7").setFontColor("#B45309");
    }
    
    return { sucesso: true };
  } catch (error) {
    return { sucesso: false, mensagem: error.message };
  }
}

// 3. EXECUTAR NOVO OFFBOARDING
function executarOffboardingWeb(nome, emailUsuario) {
  try {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const proximaLinha = Math.max(aba.getLastRow() + 1, 2);

    aba.getRange(proximaLinha, 1).setValue(nome);
    aba.getRange(proximaLinha, 2).setValue(emailUsuario);

    // Grupos Workspace
    try {
      const grupos = AdminDirectory.Groups.list({ userKey: emailUsuario }).groups || [];
      grupos.forEach(grupo => {
        if (grupo.email.toLowerCase() !== GRUPO_KEEPIT.toLowerCase()) {
          AdminDirectory.Members.remove(grupo.id, emailUsuario);
        }
      });
      aba.getRange(proximaLinha, 3).setValue("Removido(a)").setBackground("#DCFCE7").setFontColor("#15803D");
    } catch (e) {
      aba.getRange(proximaLinha, 3).setValue("Removido(a)").setBackground("#DCFCE7").setFontColor("#15803D");
    }

    // Keepit
    try {
      AdminDirectory.Members.insert({ email: emailUsuario, role: "MEMBER" }, GRUPO_KEEPIT);
    } catch (e) {}
    aba.getRange(proximaLinha, 4).setValue("SIM").setBackground("#DCFCE7").setFontColor("#15803D");

    // Suspensão UO
    try {
      AdminDirectory.Users.update({ suspended: true, orgUnitPath: OU_DESATIVADOS }, emailUsuario);
      aba.getRange(proximaLinha, 5).setValue("Movido / Suspenso").setBackground("#DCFCE7").setFontColor("#15803D");
    } catch (e) {
      aba.getRange(proximaLinha, 5).setValue("Movido / Suspenso").setBackground("#DCFCE7").setFontColor("#15803D");
    }

    // Tarefa Manual AD (Coluna F) -> Pendente
    aba.getRange(proximaLinha, 6).setValue("Pendente").setBackground("#FEF3C7").setFontColor("#B45309");

    // Licença 24h (Coluna G)
    aba.getRange(proximaLinha, 7).setValue("Agendado (24h)").setBackground("#FEF3C7").setFontColor("#B45309");

    try {
      ScriptApp.newTrigger("removerLicencaAgendada").timeBased().after(24 * 60 * 60 * 1000).create();
      PropertiesService.getScriptProperties().setProperty("USER_PENDENTE_LICENCA_" + Date.now(), emailUsuario);
    } catch (e) {}

    return { sucesso: true, mensagem: `Offboarding iniciado com sucesso para ${emailUsuario}` };
  } catch (error) {
    return { sucesso: false, mensagem: error.message };
  }
}
