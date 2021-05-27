const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };
    // Iniciar a variável de total de horas/dia EM PROGRESS
    let jobTotalHours = 0;

    // const updatedJobs = Job.get().map((job) => {
    const updatedJobs = jobs.map((job) => {
      // ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      // Incrementando a quantidade de status com base na chave status, definida na variável anterior
      statusCount[status] += 1;
      // Exemplo
      // status = done
      // statusCount[done] += 1

      jobTotalHours =
        status == "progress"
          ? (jobTotalHours += Number(job["daily-hours"]))
          : jobTotalHours;
      //   if (status=="progress"){
      //       jobTotalHours += Number(job["daily-hours"])
      //   }

      return {
        ...job,
        remaining,
        status,

        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
        // budget: JobUtils.calculateBudget(job, Profile.get()["value-hour"]),
      };
    });

    // Horas livres -> quantidade de horas que quero trabalhar/dia
    // MENOS
    // a quantidade de horas/dia de cada job EM PROGRES
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
