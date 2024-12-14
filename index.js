const express = require('express')
const cors = require('cors')
const app = express()
const { BodyBuilder } = require('./src/bodybuilder/bodybuilder.entity')
app.use(cors())
const port = 3000
const { Gym } = require('./src/gym/gym.entity')
app.use(express.json())
const { Style } = require('./src/style/style.entity')

//banco de dados de clientes
var clientes = []

//banco de dados de academias
var academias = [
  {id: 0, nome: 'Academia 1', telefone: '123456789', bodyBuilder:[]},
  {id: 1, nome: 'Academia 2', telefone: '000000000', bodyBuilder:[]},
  {id: 2, nome: 'Academia 3', telefone: '987123568', bodyBuilder:[]},
]

//banco de dados de estilos
var estilos = []

app.post('/body-builder', (req, res) => {
  const data = req.body;

  const idacademia = data.idacademia;
  const gym = academias.find(academia => academia.id == idacademia);

  const idestilo = data.idestilo;
  const estilo = estilos.find(style => style.id == idestilo);

  console.log(estilo);
  let bodyBuilder = new BodyBuilder(data.nome, data.cpf, data.peso, data.altura, data.dataNascimento, data.sapato, gym, estilo);
  clientes.push(bodyBuilder);

  res.status(201).json(clientes);  
});

app.put('/body-builder/:cpf', (req, res) => {
  const data = req.body;
  let cpf = req.params.cpf;

  const idacademia = data.idacademia;
  const gym = academias.find(academia => academia.id == idacademia);

  const idestilo = data.idestilo;
  const estilo = estilos.find(style => style.id == idestilo);

  let bodyBuilder = new BodyBuilder(data.nome, data.cpf, data.peso, data.altura, data.dataNascimento, data.sapato, gym, estilo);
  
  for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].cpf == cpf) {
          clientes[i] = bodyBuilder;
          return res.status(200).json(clientes);  
      }
  }
  res.status(404).send("Body builder não encontrado");
});

app.put('/body-builder/:cpf', (req, res) => {
  const data = req.body
  let cpf = req.params.cpf

  let bodyBuilder = new BodyBuilder(data.nome, data.cpf, data.peso, data.altura, data.dataNascimento, data.sapato) 
  
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
      clientes[i] = bodyBuilder
      res.send("Atualizou")
    }
  }
  throw new Error("Body builder nao encontrado")
})

app.delete('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
      clientes.splice(i, 1)
      res.send("Deletou")
    }
  }
  throw new Error("Cliente nao encontrado")
})

app.get('/body-builder', (req, res) => {
  res.json(clientes)
})


app.get('/bodybuilder/search/:texto', (req, res) => {
  let texto = req.params.texto;

  let retorno = [];
  let clienteEncontrado = false;

  function verificarObjeto(objeto, texto) {

    for (let [chave, valor] of Object.entries(objeto)) {

      console.log(`chave: ${chave}, valor: ${valor}`);

      if (typeof valor === 'string' && valor.toLowerCase().includes(texto.toLowerCase())) {
        console.log(`Encontrado "${texto}" na chave: ${chave}, valor: ${valor}`);
        return true;
        
      } else if (typeof valor === 'object' && valor !== null) {
        
        if (verificarObjeto(valor, texto)) {
          return true;
        }
      }
    }
    return false;
  }

  clientes.forEach((element, index) => {
    if (verificarObjeto(element, texto)) {
      retorno.push(element);
      clienteEncontrado = true;
    }
  });

  if (clienteEncontrado) {
    console.log(retorno);
    res.json(retorno);
  } else {
    res.status(404).json({ mensagem: 'Nenhum cliente encontrado.' }); 
  }
});

app.post('/gym', (req, res) => {
  const data = req.body
  let gym = new Gym();
  gym.nome = data.nome
  gym.telefone = data.telefone
  academias.push(gym);
  res.send("Cadastrou")

})

app.get('/gym', (req, res) => {
  res.json(academias)
})

app.post('/style', (req, res) => {
  const data = req.body; 
  console.log(data);

  let style = new Style();
  style.id = estilos.length + 1
  style.nome = data.nome; 
  estilos.push(style);

  res.status(201).send("Cadastrado com sucesso"); 
});

app.get('/style', (req, res) => {
  res.json(estilos)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

