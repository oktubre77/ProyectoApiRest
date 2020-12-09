var mongoose = require('mongoose');
const conexion = "mongodb+srv://oktubre77:pochoclo@cluster0.jgskm.mongodb.net/Test?retryWrites=true&w=majority"
mongoose.connect(conexion ,{useNewUrlParser: true, useUnifiedTopology: true});