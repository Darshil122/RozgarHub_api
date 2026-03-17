const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    job_title: {
      type: String,
      required: true,
    },
    job_desc: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    created_By: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    number_of_persons: {
      type: String,
      required: true,
    },
    pay_per_day: {
      type: String,
      required: true,
    },
    job_closing_date: {
      type: Date,
      required: true,
    },
    worker_required_date: {
      type: Date,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;