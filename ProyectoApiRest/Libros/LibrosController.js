var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Importamos como módulo el esquema
var Mov = require('./Libro');

// Todas las movies
router.get('/', (req, res) => {
    // Permitimos que desde todos los dominios accedan a nuestra Rest API
    res.header('Access-Control-Allow-Origin', '*');
    // Traemos todo
    Mov.find({}, (err, Libros) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los Libros"});
        res.status(200).send(Libros);
    });
});


router.get('/:ISBN', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
	Mov.findOne({ ISBN: req.params.ISBN}, (err, movie) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        if (!movie) return res.status(404).send({"error":"404"});
        res.status(200).send(movie);
    });
});

router.get('/Autor/:Autor', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
	Mov.findOne({ Autor: req.params.Autor}, (err, movie) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        if (!movie) return res.status(404).send("Autor no encontrada: " + req.params.Autor);
        res.status(200).send(movie);
    });
});

router.get('/Editorial/:Editorial', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    Mov.find({ Editorial: req.params.Editorial}, (err, movie) =>{
        if (err) return res.status(500).send("Problemas buscando");
        if (!movie) return res.status(404).send("Editorial no encontrada : " + req.params.Editorial);
        res.status(200).send(movie);
    });
});




module.exports = router;