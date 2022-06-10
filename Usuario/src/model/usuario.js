const mongoose = require("mongoose");

const schema_usuario = new mongoose.Schema({
    nomeusuario: {type: String, unique: true },
    senha: { type: String },
    apikey:{type:String, unique:true},
    criado: { type: Date, default: Date.now },
  }); 
  module.exports = mongoose.model("Usuario", schema_usuario);
  