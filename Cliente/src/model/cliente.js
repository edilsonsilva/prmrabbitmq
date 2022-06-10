const mongoose = require("mongoose");

const schema_cliente = new mongoose.Schema({
    nomecompleto: {type: String },
    apikey:{type:String},
    email: { type: String, unique:true },
    cpf:{type:String, unique:true},
    endereco:{type:String}
  }); 
  module.exports = mongoose.model("Cliente", schema_cliente);
  