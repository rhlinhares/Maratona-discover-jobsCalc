const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// module.exports exporta direto um objeto entre chaves
// OPEN precisa estar dentro de uma estrutura de função do tipo (){}
module.exports = () => 
  open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
