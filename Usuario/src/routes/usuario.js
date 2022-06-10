const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");
const criar_token = require("../utils/criartoken");
const cfg = require("../config/cfg");
const { v4: uuidv4 } = require("uuid");
const route = express.Router();

const amqp = require("amqplib");
var channel, connection;


connect();
async function connect() {
    try {
        const amqpServer = "amqp://localhost";
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("DadosCliente");
    } catch (ex) {
        console.error(ex);
    }
    
}

const createSession = async user => {
    await channel.sendToQueue("DadosCliente", Buffer.from(JSON.stringify(user)));
    await channel.close();
    await connection.close();
};

  route.post("/login", (req, res) => {
    Usuario.findOne({ nomeusuario: req.body.nomeusuario }, (erro, result) => {
      if (erro)
        return res
          .status(500)
          .send({ output: `Erro ao tentar localizar -> ${erro}` });
      if (!result)
        return res.status(400).send({ output: `Usuário não localizado` });
      bcrypt.compare(req.body.senha, result.senha, (erro, same) => {
        if (erro)
          return res
            .status(500)
            .send({ output: `Erro ao validar a senha ->${erro}` });
        if (!same) return res.status(400).send({ output: `Senha inválida` });
        console.log(result.apikey);
        
          const gerar_token = criar_token(
            result._id,
            result.usuario,
            result.email
          );
        
            
            createSession({
              output: "Autenticado",
              token: gerar_token,
              apikey: result.apikey});
              res.send({
                output: "Autenticado",
                token: gerar_token,
                apikey: result.apikey})
        });
    });
  });
  

route.get("/", (req, res) => {
  Usuario.find((erro, dados) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Erro ao processar dados -> ${erro}` });
    res.status(200).send({ output: "ok", payload: dados });
  });
});

route.post("/cadastro", (req, res) => {
  bcrypt.hash(req.body.senha, cfg.salt, (erro, result) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Erra ao tentar gerar a senha -> ${erro}` });
    req.body.senha = result;
    req.body.apikey = uuidv4();

    const dados = new Usuario(req.body);
    dados
      .save()
      .then((result) => {
        res.status(201).send({ output: "Cadastro realizado", payload: result });
      })
      .catch((erro) =>
        res.status(500).send({ output: `Erro ao cadastrar -> ${erro}` })
      );
  });
})
module.exports = route;
