const SAML = require('passport-saml').SAML;
const metadata = require('passport-saml-metadata');
const SamlStrategy = require('passport-wsfed-saml2').Strategy;

module.exports = function (app, passport, config) {
  metadata.fetch(config.passport.saml.metadata)
    .then(function (reader) {
      const strategyConfig = metadata.toPassportConfig(reader);
      strategyConfig.realm = config.passport.saml.issuer,
      strategyConfig.protocol = 'samlp';

      passport.use('saml', new SamlStrategy(strategyConfig, function (profile, done) {
        profile = metadata.claimsToCamelCase(profile, reader.claimSchema);
        return done(null, profile);
      }));

      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(user, done) {
        done(null, user);
      });

      app.get('/FederationMetadata/2007-06/FederationMetadata.xml', function(req, res) {
        const saml = new SAML({
          issuer: config.passport.saml.issuer,
          callbackUrl: config.passport.saml.callbackUrl,
          logoutCallbackUrl: config.passport.saml.logoutCallbackUrl
        });
        const xml = saml.generateServiceProviderMetadata();
        res.set('Content-Type', 'application/samlmetadata+xml').send(xml);
      });
    })
    .catch((e) => {
      console.error(e);
      process.exit();
    });
};
