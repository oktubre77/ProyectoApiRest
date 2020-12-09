var express = require('express');
const nunjucks = require('nunjucks');
var bodyParser = require('body-parser')
// Incorporamos dotenv para que tome las variables de entorno en nuestro proyecto local
require('dotenv').config()

var	app = express();
const admin = process.env.admin_user;
const adminPass = process.env.admin_pass;
const MONGO_URL = process.env.url;

session = require('express-session');
app.use(session({
    secret: 'elSecreto',
    name: 'sessionId',
    proxy: true,
    resave: true,
    saveUninitialized: true ,
    cookie: { maxAge: 24 * 60 * 60 * 1000  }  
  }));  

  const path = require('path');
  app.use('/public', express.static(path.join(__dirname + '/public')));
  
  nunjucks.configure(path.join(__dirname + '/views/'), {
    autoescape: false,
    express: app
  });
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  
  const MongoClient = require('mongodb').MongoClient;

 //******************APIREST******************************** */ 

 // El archivo que tiene todo el armado de la Rest API
var LibrosController = require('./Libros/LibrosController');
// La Rest API queda en /api/
app.use('/api', LibrosController);

var port = "8181";

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});


//******************Login*************** */
  var auth = function(req, res, next) {
    if (req.session.login)
      return next();
    else
    return res.status(401).send("No has sido autorizado, amigo. O tu sesion expiró.");
  };
   
  //Index
  app.get("/", (req, res) => {
      res.sendFile(__dirname + "/views/login.html");
  });
  
  
  // Login endpoint
  app.all('/login', function (req, res) {
    if (!req.body.user || !req.body.pass) {
      res.send('No se ha podido hacer el login');    
    } else {
  
      MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
          const dbo = db.db("Test");  
          dbo.collection("usuarios").findOne({$and:[{"user":req.body.user},{"pass":req.body.pass}]},function(err, data) {             
              //console.log(data); 
              if(data){
                  req.session.login = true;  
                  req.session.nombre = data.nombre;               
                  res.status(200).send("<h1>Login con exito!</h1><a href='/home'>Ir al contenido</a>");  
              }
              else{
                res.status(401).send("No has sido autorizado, amigo.");
              } 
            })
          });
        }
      });
  
   
  // Logout endpoint
  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("Sesión cerrada!");
  });
   
  // Get content endpoint
  app.get('/content', auth, function (req, res) {

     res.send(req.session.nombre  + " puedes ver esto solo si estás con la sesion iniciada.");
  });
  
//******************Login*************** */

  // Le asignamos a MONGO_URL la url que está en las variales de entorno en el .env

app.get('/home', (req, res)=>{	
    
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
  const dbo = db.db("Test");  
  dbo.collection("Libros").find({}).toArray(function(err, data) {	      
      res.render('index.html',{data:data});
	});
});	
});
// Mostramos el formulario
app.get('/alta', (req, res)=> {
  res.sendFile(__dirname + '/views/alta.html')
})
 // Recibimos la información del formulario
app.post('/alta', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
  const dbo = db.db("Test")
  // key de la base datos : req.body.name_campo_formulario
 
  dbo.collection("Libros").insertOne(
      {
          ISBN: parseInt(Math.floor(Date.now() / 1000)),
          Titulo: req.body.Titulo,
          Autor: req.body.Autor,
          Year: req.body.Year,
          Pais: req.body.Pais,
          Editorial : req.body.Editorial

      },
      function (err, res) {
          if (err) {
          db.close();
          return console.log(err);
          }
          db.close()
      })
      res.send('<p>Libro agregado exitosamente</p><p><a href="/agregar">Agregas más</a></p><p><a href="/">Regresar a Inicio</a></p>')
  })
}) 

app.get('/buscador', (req, res)=>{	  
  //Obtenemos el valor del término de búsqueda
  var termino = req.query.busqueda;  
  // Creamos la expresión regular para poder verificar que contenga el término el nombre en la base de datos. La i significa no sensible a may/min
  var expresiontermino = new RegExp(termino,"i");
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
  const dbo = db.db("Test");    
  dbo.collection("Libros").find({"Titulo":{$regex: expresiontermino }}).toArray(function(err, data) {	      
      res.render('buscador.html',{termino:termino,data:data});
	});
});	
});	

app.listen(8080);