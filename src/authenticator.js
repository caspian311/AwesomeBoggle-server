const passport = require('passport');
const User = require('./models/user');

const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;

async function authenticate(apiKey, done) {
  try {
    let user = await User.findByApiKey(apiKey);
    done(null, user);
  } catch (err) {
    done(err);
  }
}

function initialize() {
  passport.use(new HeaderAPIKeyStrategy({ header: 'Authorization', prefix: 'Api-Key '}, false, authenticate));
}

module.exports = {
  initialize,
  auth: passport.authenticate('headerapikey', { session: false, failureRedirect: '' })
};
