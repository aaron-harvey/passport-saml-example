const loadMetadata = require('passport-saml-metadata');
const SamlStrategy = require('passport-saml-restify').Strategy;

module.exports = function (passport, config) {
  loadMetadata(config.passport.saml.metadata)
    .then(function (strategyConfig) {
      console.log('Using SAML configuration', strategyConfig);

      passport.use(new SamlStrategy(
        Object.assign(strategyConfig, {
          path: config.passport.saml.path,
          issuer: config.passport.saml.issuer
        }),
        function (profile, done) {
          return done(null, profile);
        }
      ));
    })
    .catch((err) => console.error.bind(console));
};
