let express = require('express');
let app = express();

let bodyParser = require('body-parser');


let users = require('./users');
let games = require('./games');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/users', users);
app.use('/games', games);

let server = app.listen(8080, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`Server running at http://${host}:${port}`);
});
