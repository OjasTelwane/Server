const express = require('express');
const api = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route  GET api/revDB/me
// @desc   Get current users review data
// @access Private
api.route('/task')
    .get(auth.verifyUser, async (req, res, next) => {
      Task.find({"assignedToId": req.user.empId}).sort({"startDate": -1})
			.then(
				(tasks) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(tasks);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
    })
    .post(auth.verifyUser, async (req, res, next) => {
        Task.create({
          title: req.body.title,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          assignedToId: +req.body.assignedToId,
          description: req.body.description,
          assignedFromId: +req.user.empId
        })
				.then(
					(task) => {
						console.log('Task created ', task);
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(task);
					},
					(err) => next(err)
				)
				.catch((err) => next(err));
      })
      .put(auth.verifyUser, (req, res, next) => {
          res.statusCode = 403;
          res.end('PUT operation not supported on /tasks');
        }
      )
      .delete(auth.verifyUser,(req, res, next) => {
        Task.remove({})
            .then(
              (resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      );

api.route('/task/:taskId')
    .get(auth.verifyUser,(req, res, next) => {
      Task.findById(req.params.taskId)
        .then(
          (task) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(task);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
    .post(auth.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /tasks/' + req.params.taskId);
      }
    )
    .put(auth.verifyUser,(req, res, next) => {
      Task.findByIdAndUpdate(
          req.params.taskId,
          { $set: {
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            assignedToId: +req.body.assignedToId,
            assignedFromId: +req.user.empId
          } },
          { new: true }
        )
          .then(
            (task) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(task);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    )
    .delete(auth.verifyUser,(req, res, next) => {
      Task.findByIdAndRemove(req.params.taskId)
          .then(
            (resp) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(resp);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    );

api.route('/taskByDate')
    .get(auth.verifyUser, async (req, res, next) => {
      const dateValue = new Date(req.query.selectedDate);
      Task.find({
        assignedToId: req.user.empId,
        $and: [
          {startDate: {$lte: new Date(new Date(dateValue).setHours(23,59,59))}},
        {endDate: {$gte: new Date(new Date(dateValue).setHours(00,00,00))}}
        ]
      })
        .then(
				(tasks) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(tasks);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
    })

module.exports = api;
