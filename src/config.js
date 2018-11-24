const env = process.env.NODE_ENV || 'development';

const configuration = {
  'development': {
    'web': {
      'host': '0.0.0.0',
      'port': 8080,
    },
    'db': {
      'username': 'awesomeboggle',
      'password': 'awesomeboggle',
      'database': 'awesomeboggle',
      'host': 'localhost',
      'port': 3306
    }
  },
};

module.exports = configuration[env];