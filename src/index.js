import app from './app';
const config = require('./config');

const server = app.listen(config.web.port, config.web.host, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server running at http://${host}:${port}`);
});
