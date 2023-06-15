const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const Movement = require('../models/movement');

let exercisesArray = [];

// index
router.get('/workouts', function (req, res) {
    Workout.find({createdBy: req.session.userId})
    .populate('exercise.movement')
    .exec(function (error, allWorkouts) {
        res.render('workout/index.ejs', {
            workouts: allWorkouts
        });
    });
});

// new
router.get('/workouts/new', function (req, res) {
    Movement.find({
        createdBy: {
            $in: [req.session.userId, null]
        }
    }, function (error, allMovements) {
        res.render('workout/new.ejs', {
            movements: allMovements
        });
    });
});

// delete
router.delete('/workouts/:id', function (req, res) {
    Workout.findOneAndDelete({
        createdBy: req.session.userId,
        _id: req.params.id
    }, function (error, deletedWorkout) {
        res.redirect('/workouts');
    });
});

// update
router.put('/workouts/:id', function (req, res) {
    if (!Array.isArray(req.body.exercise.movement)) {
        for (const [key, value] of Object.entries(req.body.exercise)) {
            req.body.exercise[key] = [value];
        }
    }
    exercisesArray = [];
    for (i = 0; i < req.body.exercise.movement.length; i++) {
        let exercise = {
            movement: req.body.exercise.movement[i],
            weight: req.body.exercise.weight[i],
            sets: req.body.exercise.sets[i],
            reps: req.body.exercise.reps[i],
            minutes: req.body.exercise.minutes[i],
            caloriesBurned: req.body.exercise.caloriesBurned[i],
        };
        exercisesArray.push(exercise);
    }
    req.body.exercise = exercisesArray;
    Workout.findOneAndUpdate({
        createdBy: req.session.userId,
        _id: req.params.id
    }, req.body, function (error, updatedWorkout) {
        res.redirect('/workouts');
    });
});

// create
router.post('/workouts', function (req, res) {
    if (!Array.isArray(req.body.exercise.movement)) {
        for (const [key, value] of Object.entries(req.body.exercise)) {
            req.body.exercise[key] = [value];
        }
    }
    exercisesArray = [];
    for (i = 0; i < req.body.exercise.movement.length; i++) {
        let exercise = {
            movement: req.body.exercise.movement[i],
            weight: req.body.exercise.weight[i],
            sets: req.body.exercise.sets[i],
            reps: req.body.exercise.reps[i],
            minutes: req.body.exercise.minutes[i],
            caloriesBurned: req.body.exercise.caloriesBurned[i],
        };
        exercisesArray.push(exercise);
    }
    req.body.exercise = exercisesArray;
    req.body.createdBy = req.session.userId;
    Workout.create(req.body, function (error, createdWorkout) {
        res.redirect('/workouts');
    });
});

// edit
router.get('/workouts/:id/edit', function (req, res) {
    Workout.findById({
        createdBy: req.session.userId,
        _id: req.params.id
    })
    .populate('exercise.movement')
    .exec(function (error, foundWorkout) {
        Movement.find({
            createdBy: {
                $in: [req.session.userId, null]
            }
        }, function (error, allMovements) {
            res.render('workout/edit.ejs', {
                workout: foundWorkout,
                movements: allMovements
            });
        });
    });
});

// toggle complete and favorite
router.put('/workouts/:id/toggle', function (req, res) {
    if (req.body.change === 'isComplete') {
        Workout.findById({
            createdBy: req.session.userId,
            _id: req.body.id
        }, function (error, workout) {
            workout.isComplete = !workout.isComplete;
            workout.save();
        });
    }
    if (req.body.change === 'isFavorite') {
        Workout.findById({
            createdBy: req.session.userId,
            _id: req.body.id
        }, function (error, workout) {
            workout.isFavorite = !workout.isFavorite;
            workout.save(function () {
                res.redirect(`/workouts/${req.body.id}`);
            });
        });
    }
})

// show
router.get('/workouts/:id', function (req, res) {
    Workout.findById(req.params.id)
    .populate('exercise.movement')
    .exec(function (error, foundWorkout) {
        res.render('workout/show.ejs', {
            workout: foundWorkout
        });
    });
});

module.exports = router;