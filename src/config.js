const env = process.env.NODE_ENV || 'development';

const configuration = {
  'development': {
    'apiVersion': '1.0',
    'logging': {
      'level': 'dev'
    },
    'web': {
      'host': '0.0.0.0',
      'port': 8080,
    },
    'db': {
      'username': 'awesomeboggle',
      'password': 'awesomeboggle',
      'database': 'awesomeboggle_development',
      'host': 'localhost',
      'port': 3306
    }
  },
  'test': {
    'apiVersion': '1.0',
    'logging': {
      'level': 'dev'
    },
    'web': {
      'host': '0.0.0.0',
      'port': 8080,
    },
    'db': {
      'username': 'awesomeboggle',
      'password': 'awesomeboggle',
      'database': 'awesomeboggle_test',
      'host': 'localhost',
      'port': 3306
    }
  },
};

module.exports = configuration[env];
