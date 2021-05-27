const Database = require("../db/config");

// Criando um objeto e habilitando para exportação
module.exports = {
  // Função virou assync. Sempre que for chamada, deve ser utilizado await
  async get() {
    const db = await Database();

    const data = await db.get(`SELECT * FROM profile`);
    // comandos SQL - SELECT <campo> FROM <tabela>
    // '*' é um coringa

    await db.close();

    // * NORMALIZAÇÃO
    // Banco de dados não aceita variáveis com "-"
    return {
      name: data.name,
      avatar: data.avatar,
      "monthly-budget": data.monthly_budget,
      "days-per-week": data.days_per_week,
      "hours-per-day": data.hours_per_day,
      "vacation-per-year": data.vacation_per_year,
      "value-hour": data.value_hour,
    };
  },

  async update(newData) {
    const db = await Database();
    // campos texto em SQL devem estar entre aspas

    db.run(`UPDATE profile SET
    name =  "${newData.name}", 
    avatar = "${newData.avatar}",
    monthly_budget = ${newData["monthly-budget"]},
    days_per_week = ${newData["days-per-week"]},
    hours_per_day = ${newData["hours-per-day"]},
    vacation_per_year = ${newData["vacation-per-year"]},
    value_hour = ${newData["value-hour"]}
    `);

    await db.close();
  },
};
