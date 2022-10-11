import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import Job from "./../models/Job.js";
import moment from "moment";

export const createJob = async (req, res) => {
  const { position, company, jobLocation } = req.body;
  if (!position || !company || !jobLocation) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  const removedJob = await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Job removed", removedJob });
};

export const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  const queryObj = {
    createdBy: req.user.userId,
  };

  if (status !== "all") {
    queryObj.status = status;
  }

  if (jobType !== "all") {
    queryObj.jobType = jobType;
  }

  if (search) {
    queryObj.position = { $regex: search, $options: "i" };
  }

  let result = Job.find(queryObj);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("position");
  }

  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObj);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ totalJobs, jobs, numOfPages });
};

export const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Please provide all values");
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id:${jobId}`);
  }

  //check permissions (whether same user is trying to access or not)
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate(jobId, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  //stats.reduce((prev,curr)=>{},initialVal);
  stats = stats.reduce((acc, curStat) => {
    const { _id: title, count } = curStat;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    declined: stats.declined || 0,
    interview: stats.interview || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
