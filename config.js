var _ = require('lodash');

var cfg = {}; // the cfg object which will be returned

cfg.env = process.env.NODE_ENV || 'development';

// Environment specific database configs
var dbConfigs = {
    development: {
        client: 'postgresql',
        connection: {
            host: 'localhost',
            user: 'zsafka',
            port: 5432,
            password: 'zsafka',
            database: 'zsafka',
            charset: 'utf8'
        },
        pool: { min: 0, max: 5 }
    },

    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL
    }
};

// Determine the correct database config
if (_.isUndefined(dbConfigs[cfg.env])) {
    cfg.db = dbConfigs.development;
}
else {
    cfg.db = dbConfigs[cfg.env];
}

// Module exports
module.exports = cfg;