var express = require('express');
var router = express.Router();
const sql = require('mssql');
var createError = require('http-errors');

const config = {
  user: 'fischetti.francesco',  //Vostro user name
  password: 'xxx123#', //Vostra password
  server: "213.140.22.237",  //Stringa di connessione
  database: 'fischetti.francesco', //(Nome del DB)
}

let executeQuery = function (res, query, next,page) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      sql.close();
      let resultJSON = result.recordset; //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      renderPug(res,resultJSON,page);
      
    });

  });
}

function renderPug(res,risultato,page)
{
    console.log(risultato);
    res.render(page, {units: risultato[0]});
    
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dettagli/:Unit', function(req, res, next) {
  console.log(req.params.Unit);
  let sqlQuery = ` select * from dbo.[cr-unit-attributes] where Unit = '${req.params.Unit}'`;
  executeQuery(res, sqlQuery, next,"dettagli")
});

router.get('/units', function (req, res, next) {
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery(res, sqlQuery, next,"Visual");
  
 });
module.exports = router;