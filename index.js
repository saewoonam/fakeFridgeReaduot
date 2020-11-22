const polka = require('polka');
const fs = require('fs');

console.log("Try to start to read file");
let file_data = fs.readFileSync('./2018-08-11-20-00-00.csv', 'utf-8')
let lines = file_data.split('\n');
let no_comments = lines.filter(item => item[0]!="#")
let keys = lines[0].slice(1,).split(',').map(item=>item.trim())
let parameters = keys.map((item)=>item.replace(/ /g, '_'))

function get_all() {
    let values;
    let dict = {}
    let done = false;
    do {
        values = no_comments[0].split(',').map(item=>item.trim())
        if (keys.length == values.length) {
            keys.forEach((key, index)=> {
                dict[key] = values[index];
            });
            done = true;
        }
        no_comments.shift()
    } while (!done)
    return dict
}

let values = get_all()
console.log('values', values)
polka()
  // .use(one, two)
  .get('/', (req, res) => {
    console.log('root');
    res.end('got to root');
  })
  .get('/:inst/:parameter', (req, res) => {
    if (req.params.inst == 'fridge') {
      if (req.params.parameter == 'keys') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(keys));
      } else if (req.params.parameter == 'all') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(values));
        values = get_all();
      } else if (req.params.parameter.replace(/_/g,' ') in values) {
        res.setHeader('Content-Type', 'application/json');
        key = req.params.parameter.replace(/_/g,' ')
        res.end(JSON.stringify(values[key]));
      } else {
        res.end("could not find data to send"); // add more description
      }
    } else {
        res.end("could not find instrument"); // add more description
    }
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
