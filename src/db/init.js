const Database = require("./config");

// Necessário mandar o JavaScript esperar <await>, pois o banco de dados funciona à parte do resto do código e por padrão o JavaScript não espera
// É necessário atribuir a uma variável, que vai guardar a informação que o recurso Database foi aberto
// <await> só funciona atrelado a uma estrutura de função <async>
const initDb = {
  async init() {

    const db = await Database();

    // criação de um banco de dados segue a lógica de declaração:
    // CREATE TABLE <nome da tabela> (
    //    <campo 1> <TIPO DE DADO>,
    //    <campo 2> <TIPO DE DADO> )
    // Deve ser escrito em LETRAS MAIÚSCULAS entre ``

    await db.exec(`CREATE TABLE profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, 
    avatar TEXT, 
    monthly_budget INT, 
    days_per_week INT, 
    hours_per_day INT,
    vacation_per_year INT,
    value_hour INT
)`);
    // SQL não aceita "-" em nome de campos. Deve ser substituído por "_"

    await db.exec(`CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, 
    daily_hours INT, 
    total_hours INT,
    created_at DATETIME
)`);

    await db.run(`INSERT INTO profile (
    name, 
    avatar, 
    monthly_budget, 
    days_per_week, 
    hours_per_day, 
    vacation_per_year,
    value_hour
    ) VALUES (
        "Raphael Hubener Linhares",
        "https://github.com/rhlinhares.png",
        3000,
        5,
        5,
        4,
        60
    )`);

    await db.run(`INSERT INTO jobs (
        name, 
        daily_hours, 
        total_hours,
        created_at
    ) VALUES (
    "Pizzaria Guloso",
    2,
    1,
    1621990869064
    )`);

    await db.run(`INSERT INTO jobs (
        name, 
        daily_hours, 
        total_hours,
        created_at
    ) VALUES (
    "One Two Projects",
    3,
    47,
    1621990869064
    )`);

    await db.close()
  }
}

initDb.init()
// INT = INTEGER
