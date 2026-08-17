const express = require('express');
const auth = require('./auth');
const db = require('./db');
const apigate = require('./apigate');

const router = express.Router();

const secret = process.env.JWT_SECRET_KEY;

const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: secret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('bearer')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

function requireUser(req, res, next) {
  if (req.user) {
    return next();
  }
  return passport.authenticate('jwt', { session: false })(req, res, next);
}

router.use('/auth', auth);
router.use('/db', passport.authenticate('jwt', { session: false }), db);
router.use('/apigate', requireUser, apigate);

module.exports = router;
