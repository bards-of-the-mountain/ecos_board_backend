const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let jugadoresConectados = [];
let contador = 0;

const pusher = new Pusher({
  appId: '2023049',
  key: 'b50eb8000bd0cb796352',
  secret: 'a7f566c31a13a674df98',
  cluster: 'eu',
  useTLS: true
});

app.post('/move', (req, res) => {
  const { index, value } = req.body;

  pusher.trigger('eco-board', 'move', {
    index,
    value
  });

  res.status(200).send('Movimiento enviado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.post('/turno', (req, res) => {
  const { nuevoTurno } = req.body;

  pusher.trigger('partida', 'cambio-turno', {
    turno: nuevoTurno
  });

  res.status(200).send({ status: 'turno actualizado' });
});


app.get('/jugador', (req, res) => {
  if (!jugadoresConectados.includes('A')) {
    jugadoresConectados.push('A');
    return res.send({ jugador: 'A' });
  } else if (!jugadoresConectados.includes('B')) {
    jugadoresConectados.push('B');
    return res.send({ jugador: 'B' });
  } else {
    return res.status(403).send({ error: 'Partida completa' });
  }
});

app.post('/salir', (req, res) => {
  const { jugador } = req.body;

  jugadoresConectados = jugadoresConectados.filter(j => j !== jugador);
  console.log(`Jugador ${jugador} ha salido de la partida`);
  res.send({ status: 'ok' });
});

app.post('/move', (req, res) => {
  console.log("hola mundo")
  console.log(req)
  const { index, jugador, carta } = req.body;

  console.log("req: ", req)
  console.log(jugador)
  console.log(carta)

  // No anidamos dos veces "carta"
  pusher.trigger('eco-board', 'move', {
    index,
    carta: {
      ...carta,
      jugador
    }
  });

  res.status(200).send('Movimiento enviado');
});