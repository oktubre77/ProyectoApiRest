const { Int32 } = require('mongodb');
var mongoose = require('mongoose');  
var MoviesSchema  = new mongoose.Schema({  
  ISBN: String,
  Titulo: String,
  Autor: String,
  Year: String,
  Pais: String,
  Editorial: String
});
mongoose.model('Libros', MoviesSchema);
// Exportamos como módulo
module.exports = mongoose.model('Libros');