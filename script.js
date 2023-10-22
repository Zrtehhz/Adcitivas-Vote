const udp = require('dgram');

const config = {
    token: 'EGPEDXUXDSYY', // Token fourni par Top-Serveurs
    port: 8192 // Port d'écoute UDP
}

// Création du serveur UDP
var server = udp.createSocket('udp4');

// Retourner un message en cas d'erreur à la création du serveur
server.on('error', function (error) {
    console.log('VOTE Error : ' + error);
    server.close();
});

// Quand un message est reçu sur le socket
server.on('message', function (msg, info) {
    console.log('vote request');
    var res = msg.toString().split(',');

    var request = {
        token: res[0],
        nickname: res[1],
        ip: res[2],
        date: res[3],
        version: res[4]
    };

    if (request.token == config.token) {
        emit('onPlayerVote', request.nickname, request.ip, request.date, request.version);
        console.log('vote ' + request.nickname + ' ' + request.ip + ' ' + request.date + ' ' + request.version);
    }
});

// Quand le socket est en écoute (au démarrage)
server.on('listening', function () {
    var address = server.address();

    var port = address.port;
    // var family = address.family;
    // var ipaddr = address.address;

    console.log('Plugin de vote actif sur le port ' + port + ' !');
});

// On lance et on ouvre le socket
server.bind(config.port);





window.addEventListener('DOMContentLoaded', (event) => {
    // Récupération de l'adresse IP de l'utilisateur
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        const ipAddress = data.ip;
        document.getElementById("ip-address").innerText = ipAddress;
      })
      .catch(error => {
        console.log('Erreur lors de la récupération de l\'adresse IP :', error);
      });
  
    // Envoi de la requête de vote
    document.getElementById("vote-button").addEventListener("click", function() {
      const ip = document.getElementById("ip-address").innerText;
      const serverToken = ":EGPEDXUXDSYY"; // Remplacer par le token fourni par Top-Serveurs
      const voteUrl = `https://api.top-serveurs.net/v1/votes/check-ip?server_token=${serverToken}&ip=${ip}`;
  
      // Envoi de la requête de vote
      fetch(voteUrl)
        .then(response => response.json())
        .then(data => {
          const voteStatus = data.status;
          document.getElementById("vote-status").innerText = "Statut du vote : " + voteStatus;
        })
        .catch(error => {
          console.log('Erreur lors de la requête de vote :', error);
        });
    });
  });