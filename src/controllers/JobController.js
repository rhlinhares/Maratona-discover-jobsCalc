const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  create(req, res) {
    return res.render("job");
  },

  // REFATORADO
  // save altera os dados do Job. Por isso, foi tirado do controller e transferido para o model

  async save(req, res) {
    //// const jobs = await Job.get()
    //// const lastId = jobs[jobs.length - 1]?.id || 0;
    // // const lastId = await Job.get()[Job.get().length - 1]?.id || 0;

    await Job.create({
      // id: lastId + 1,
      // o banco já incrementa o id
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    });

    return res.redirect("/");
  },

  async show(req, res) {
    const jobId = req.params.id;

    const jobs = await Job.get()
    const job = jobs.find((job) => Number(job.id) === Number(jobId));
    // const job = await Job.get().find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const profile = await Profile.get()
    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);
    // job.budget = JobUtils.calculateBudget(job, await Profile.get()["value-hour"]);

    return res.render("job-edit", { job });
  },

  async update(req, res) {
    
    const jobId = req.params.id;

    // const jobs = await Job.get();

    // const job = jobs.find((job) => Number(job.id) === Number(jobId));

    // if (!job) {
    //   return res.send("Job not found!");
    // }

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    // Job.update() = Job.get().map((job) => {...
    // ! não funciona
    // const newJobs = jobs.map((job) => {
    //   if (Number(job.id) === Number(jobId)) {
    //     job = updatedJob;
    //   }

    //   return job;
    // });

    await Job.update(updatedJob, jobId);

    res.redirect("/job/" + jobId);
  },

  async delete(req, res) {
    // mudada a funcionalidade, pois o próprio model deve apagar o dado
    const jobId = req.params.id;
    await Job.delete(jobId);

    return res.redirect("/");
  },
};
