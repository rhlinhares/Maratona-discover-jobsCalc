const express = require("express");
const routes = express.Router();
// parte do express que cria as rotas

const basePath = __dirname + "/views";

// ---------------------------------------------------------------------
// REFATORAÇÃO DAS EXPRESSÕES CRIADAS ANTERIORMENTE NAS ROTAS
const Profile = {
  data: {
    name: "Raphael H. Linhares",
    avatar: "https://avatars.githubusercontent.com/u/83095962?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
  },
  controllers: {
    index(req, res) {
      return res.render("profile", { profile: Profile.data });
    },

    update (req, res) {
        // req.body para pegar os dados
        const data = req.body

        // definir quantas semanas tem num ano
        const weeksPerYear = 52

        // remover as semanas de férias do ano
        const weeksperMonth = (weeksPerYear- data["vacation-per-year"])/12

        // quantas horas por semanas estou trabalhando
        const weekTotalHours = data["hours-per-day"]*data["days-per-week"]

        // total de horas trabalhadas no mês
        const monthlyTotalHours = weeksperMonth*weekTotalHours

        // qual o valor da hora, baseado na estimativa de ganhos
        // data["value-hour"] = data["monthly-budget"]/monthlyTotalHours
        const valueHour = data["monthly-budget"]/monthlyTotalHours

        // Profile.data = data
        Profile.data = {
            ...Profile.data,
            ...req.body,
            "value-hour": valueHour
        }
        return res.redirect('/profile')
    }
  },
};

// ---------------------------------------------------------------------
// REFATORAÇÃO DAS EXPRESSÕES CRIADAS ANTERIORMENTE NAS ROTAS
const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 60,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: "One Two Project",
      "daily-hours": 3,
      "total-hours": 47,
      createdAt: Date.now(),
    },
  ],

  controllers: {
    index(req, res) {
      // criar um novo array de jobs
      const updatedJobs = Job.data.map((job) => {
        // ajustes no job
        // ? Rever forEach vs map
        const remaining = Job.services.remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";

        return {
          ...job, //espalhamento - spread
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
        };
      });
      return res.render("index", { jobs: updatedJobs });
    },
    create(req, res) {
      return res.render("job");
    },

    save(req, res) {
      // req.body -> retorna um objeto com as propriedades definidas na página
      // { name: 'teste', 'daily-hours': '4', 'total-hours': '20' }
      //   const jobId = Job.data.length + 1;
      // ! gerando erros na hora de excluir. Necessário entender porque
      const lastId = Job.data[Job.data.length -1]?.id || 0
      // ? o erro do indice continua. Quando apaga o item 1, o item 2 mantém o índice 2

      Job.data.push({
        id: lastId +1, // jobId
        name: req.body.name,
        "daily-hours": req.body["daily-hours" ],
        "total-hours": req.body["total-hours"],
        createdAt: Date.now(), // atribuindo a data do momento
      }); // acrescenta o objeto ao array jobs
      return res.redirect("/");
    },

    show (req,res) {
        // Editar o Job 
        const jobId = req.params.id
        const job = Job.data.find(job => Number(job.id) === Number(jobId))

        if (!job) {
            return res.send("Job not found!")
        }

        job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

        return res.render("job-edit", { job})
    },

    update (req,res) {
        const jobId = req.params.id
        // req.params
        const job = Job.data.find(job => Number(job.id) === Number(jobId))

        if (!job) {
            return res.send("Job not found!")
        }

        const updatedJob = {
            ... job,
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],
        }
        // ? Necessário? Já foi realizada uma procura por id antes
        Job.data = Job.data.map(job => {
            if(Number(job.id)===Number(jobId)){
                job = updatedJob
            }
            return job 
        })

        res.redirect("/job/" + jobId)

    },

    delete (req,res) {
        const jobId = req.params.id

        Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))
        // vai filtrar (manter) todos os elementos em que a expressão for  verdadeira
        // Ou seja, quando a expressão for falsa (no caso, quando o id for igual), esse elemento será excluído

        return res.redirect('/')
    }
  },

  services: {
    remainingDays(job) {
      // cálculo de tempo restante
      const jobDays = (job["total-hours"] / job["daily-hours"]).toFixed(); // toFixed transforma em String
      const createdDate = new Date(job.createdAt);
      const dueDay = createdDate.getDate() + Number(jobDays);
      const dueDateInMs = createdDate.setDate(dueDay);
      // ? Verificar documentação e exemplos dessa abordagem

      const timeDiffInMs = dueDateInMs - Date.now();
      const dayInMs = 1000 * 60 * 60 * 24;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);

      return dayDiff;
    },
    calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
  },
};
// ---------------------------------------------------------------------

// request, response

// routes.get('/', (request,response)=>{
//     return response.sendFile(__dirname + "/views/index.html")
// })

// ----------- construção inicial das rotas
// routes.get('/', (req,res)=> {return res.sendFile(basePath + "/index.html")})
// routes.get('/job', (req,res)=> {return res.sendFile(basePath + "/job.html")})
// routes.get('/job/edit', (req,res)=> {return res.sendFile(basePath + "/job-edit.html")})
// routes.get('/profile', (req,res)=> {return res.sendFile(basePath + "/profile.html")})
// trocar caminhos relativos nos arquivos .html por caminhos "absolutos:
// ./images --> /images
// ---------------------------------------------------------------------

// ----------- construção das rotas com EJS
// após a troca pelo ejs, a expressão deve mudar. o arquivo não será enviado, e sim renderizado
// o ejs lê por padrão a pasta views (não src/views), que havia sido criada antes. Assim, pode ser desconsiderado o basePath - e os arquivos não precisam de extensão
routes.get("/", Job.controllers.index);
// index deixa de receber argumento ()

routes.get("/job", Job.controllers.create);

routes.post("/job", Job.controllers.save);

routes.get("/job/:id", Job.controllers.show);

routes.post("/job/:id", Job.controllers.update);

routes.post("/job/delete/:id", Job.controllers.delete);

routes.get("/profile", Profile.controllers.index);

routes.post("/profile", Profile.controllers.update);

module.exports = routes;
