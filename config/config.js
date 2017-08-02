const os = require('os');
const fileCache = require('file-system-cache').default;

module.exports = {
  development: {
    app: {
      name: 'Passport SAML strategy example',
      port: process.env.PORT || 3000
    },
    passport: {
      strategy: 'saml',
      saml: {
        path: process.env.SAML_PATH || '/login/callback',
        issuer: process.env.SAML_ISSUER || 'passport-saml',
        metadata: {
          url: process.env.SAML_METADATA,
          timeout: 1500,
          backupStore: fileCache({ basePath: os.tmpdir() })
        }
      }
    }
  }
};
