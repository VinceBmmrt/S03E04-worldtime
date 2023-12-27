// Imports
const express = require('express');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localizedFormat = require('dayjs/plugin/localizedFormat');
require('dayjs/locale/fr');

const capitalCities = require('./my_modules/capitalCities');

const PORT = 3000;

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

const app = express();


// Pour créer notre route '/', on a 2 possibilités
// Option 1 : rédiger le HTML directement dans le code de la callback
// On aurait un truc comme :
//
//  app.get('/', (req, res) => {
//      let capitalsList = "<ul>";                                       // On crée le début de notre élément HTML 
//      for(capital of capitalCities) {                                  // Pour chaque capitale dans la liste des capitales
//          capitalsList += `<li>${capital.name} - ${capital.tz}</li>`;  // On créera un <li> à insérer dans notre <ul>
//      }
//      capitalsList += "</ul>";                                         // On oublie pas de fermer notre Unordered List
//      res.send(capitalsList);                                          // On envoie l'élément HTML "liste des capitales" au client
//  });
//
// Option 2 : On va enfin utiliser des fichiers HTML !!!
// On a de la chance, on a déjà un fichier tout prêt dans ./views/index.html
// Problème : comment le sélectionner avec Node.js ?
// On va utiliser __dirname ! 
// C'est une variable globale de Node, qui précise l'endroit où le fichier en cours d'exécution est situé
//
//  console.log(__dirname); // Jetez-y un oeil !
//
// On crée notre route "Page d'accueil" (la route "/" ou aussi appelée la route root => à la racine)

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get('/city/:name', (req, res) => {
    const cityName = req.params.name;
    const cityData = getCityData(capitalCities, cityName);

    const date = dayjs()
                    .tz(cityData.tz)
                    .locale('fr')
                    .format('LLLL');      // dayjs() renvoie un 'objet spécial' qui correspond à la date du jour

    const responseData = 
        `
            <h1>Ville : ${cityData.name}</h1>
            <p>Date : ${date}</p>
        `;

    res.send(responseData);

})


app.listen(PORT, () => {
    console.log(`Server is listening @ http://localhost:${PORT} ...`)
});

function getCityData(tableau, nomDeLaVilleRecherchee) {
    for (const capital of tableau) {
        if(capital.name.toLowerCase() === nomDeLaVilleRecherchee) { // "beijing" === "beijing"
            return capital;
        }
        
    }
}


