const express = require('express');
const apigate = require('../apigate');

const router = express.Router();

router.get('/status', function (req, res, next) {
  apigate.status()
    .then(function (payload) {
      res.json(payload);
    })
    .catch(next);
});

router.get('/health', function (req, res, next) {
  apigate.health()
    .then(function (payload) {
      res.status(payload.ok ? 200 : 502).json(payload);
    })
    .catch(next);
});

router.get('/plans', function (req, res, next) {
  apigate.getPlans()
    .then(function (payload) {
      res.status(payload.ok ? 200 : 502).json(payload);
    })
    .catch(next);
});

module.exports = router;
