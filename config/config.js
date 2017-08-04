const os = require('os');
const fileCache = require('file-system-cache').default;

const hostname = process.env.HOSTNAME || os.hostname();
const port = process.env.PORT || 3000;
const host = hostname + (port != 443 ? ':' + port : '');

module.exports = {
  development: {
    app: {
      name: 'Passport SAML strategy example',
      hostname: hostname,
      host: host,
      port: port
    },
    passport: {
      strategy: 'saml',
      saml: {
        path: '/login/callback',
        callbackUrl: `https://${host}/login/callback`,
        logoutCallbackUrl: `https://${host}/logout`,
        issuer: process.env.SAML_ISSUER || 'passport-saml',
        metadata: {
          url: process.env.SAML_METADATA,
          timeout: process.env.SAML_METADATA_TIMEOUT || 1500,
          backupStore: fileCache({
            basePath: process.env.SAML_METADATA_CACHE_DIR || os.tmpdir(),
            ns: 'passport-saml-example'
          })
        }
      }
    }
  }
};
