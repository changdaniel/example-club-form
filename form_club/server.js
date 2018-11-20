const express = require('express')
const app = express()


var name = 'Test';
var willing = 0;
var age = 0;
var password = 'password';

//connection to database (which is just a file called test.db that I made beforehand with the appropriate columns)
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./test.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to test.db');
  });

let sql = `SELECT * from responses`;
 
db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

app.set('view engine', 'pug')

app.get('/',function(request, response) {
    response.render('input-form')
})

app.get('/add-responses',function(request,response) {
  
  name = request.query.name;

  if(request.query.willing == 'on'){
    willing = 1;
  }
  else{
    willing = 0;
  }
  
  age = request.query.age;

  password = request.query.password;

  db.run(`INSERT INTO responses(Name, Willing, Age, Password) VALUES(?, ?, ?, ?);`, (name), (willing), (age), (password), function(err) {
    if (err) {
      return console.log(err.message);
   }
   console.log(`A row has been inserted`);
  });

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });

  response.redirect('/display')
})

app.get('/display', function(request,response){

  response.send('Name: ' + name + ' Willingness: ' + willing + ' Age: ' + age + ' Password: ' + password);
})

app.listen(8080, function(){
    console.log('Server listening on port 8080');

})
