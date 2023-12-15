var database = require("../database/config");

function buscarUltimasMedidas(idEsteira, limite_linhas) {
  instrucaoSql = "";

  if (process.env.AMBIENTE_PROCESSO == "producao") {
    instrucaoSql = `select 
                        COUNT(chave),
                        momento,
                        DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico
                    from medida
                    where fk_esteira = ${idEsteira}
                    order by id desc limit ${limite_linhas}`;
  } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
    instrucaoSql = `SELECT
        SUM(CASE WHEN chave = 0 THEN 1 ELSE 0 END) AS quantidade_0,
        SUM(CASE WHEN chave = 1 THEN 1 ELSE 0 END) AS quantidade_1
    from medida
    where fk_esteira = ${idEsteira}`;
  } else {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n"
    );
    return;
  }

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idEsteira) {
  instrucaoSql = "";

  if (process.env.AMBIENTE_PROCESSO == "producao") {
    instrucaoSql = `select top 1
        chave as temperatura, 
        dht11_umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fk_esteira 
                        from medida where fk_esteira = ${idEsteira} 
                    order by id desc`;
  } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
    instrucaoSql = `select 
                    SUM(CASE WHEN chave = 0 THEN 1 ELSE 0 END) AS quantidade_0,
                    SUM(CASE WHEN chave = 1 THEN 1 ELSE 0 END) AS quantidade_1,
                        fk_esteira 
                        from medida where fk_esteira = ${idEsteira} 
                    order by id desc limit 1`;
  } else {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n"
    );
    return;
  }

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarUltimasMedidas,
  buscarMedidasEmTempoReal,
};
