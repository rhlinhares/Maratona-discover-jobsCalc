// Como data será alterado pelo update, não pode ser constante
let data = {
  name: "Mayk",
  avatar: "https://github.com/maykbrito.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 75,
};

// Criando um objeto e habilitando para exportação
module.exports = {
  get() {
    return data;
  },
  update(newData) {
    data = newData;
  },
};