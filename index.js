const polka = require('polka');

function one(req, res, next) {
  req.hello = 'world';
  next();
}

function two(req, res, next) {
  req.foo = '...needs better demo 😔';
  next();
}

polka()
  // .use(one, two)
  .get('/', (req, res) => {
    console.log('root');
    res.end('got to root');
  })
  .get('/:inst/:command', (req, res) => {
    res.end('Hello');
    console.log(req.params);
  })
  .get('/users/:id', (req, res) => {
    console.log(`~> Hello, ${req.hello}`);
    res.end(`User: ${req.params.id}`);
  })
  .listen(5000, err => {
    if (err) throw err;
    console.log(`> Running on localhost:5000`);
  });
