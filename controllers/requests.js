const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const User = require('../models/user');

// create request
router.post('/users/request', function (req, res) {
    Request.create(req.body, function (error, newRequest) {
        res.redirect('/users/me');
    });
});


module.exports = router;