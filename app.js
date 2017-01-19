var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static('public'));

var data = fs.readFileSync('data.json', 'utf8');
data = JSON.parse(data);

var exphbs = require('express-handlebars')

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  partialsDir: 'views/partials/',
  extname: '.hbs'
}))
app.set('view engine', 'hbs')




app.get('/', function(req,res){
  data.champions = data.champions.map(function(champ){
     // var name = champ.name;
      /*debugger
      switch(name){
        case 'LeBlanc': name = 'Leblanc'; break;
        case 'Cho\'Gath': name = 'Chogath'; break;
      }*/

      //champ.imgsrc = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'+name.replace(' ', '')+'.png'
      champ.imgsrc = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'+champ.key + '.png'
     return champ;
  })

  res.render("grid", {
    champions: data.champions
  });
  // res.file("data.json");
});

app.get('/api/all', function(req,res){
  res.json(data);
})

// ### 1.1: Which champion has the best range?
// > Hint: Try ton find in the given dataset (data.json) the information you
// need, and then try to get the champion with the longest range. If many
//  results matches, return them all.
app.get('/api/champion/best-range', function (req, res) {
  var bestRange = -Infinity;
  var bestChampions = [];
  data.champions.forEach(function (current_champion) {
    if (current_champion.stats.attackrange > bestRange) {
     bestRange = current_champion.stats.attackrange;
     bestChampions = [];
    }
    if (current_champion.stats.attackrange >= bestRange) {
      bestChampions.push(current_champion);
    }
  });
  res.json(bestChampions);
});

// ## 1.2: Which champion *is the* weakest champion in term of armory at level 18?
// > Hint: Try ton find in the given dataset (data.json) the informations you need
//  and then try to get the champion with the lowest armor. At level one, a champion
// have `armor` Armor, and the gain `armorperlevel` at each level. If many results matches, return them all.
app.get('/api/champion/weakest-armory-at-level-18', function (req, res) {
  var weakestArmor = Infinity;
  // var wekeastArmor = data.champions[0].stats.armor + data.champions[0].stats.armorperlevel * 17
  var weakestChampions = [];
  data.champions.forEach(function (current_champion) {
    var currentArmory = current_champion.stats.armor + current_champion.stats.armorperlevel * 17;
    if (currentArmory < weakestArmor) {
     weakestRange = currentArmory;
     weakestChampions = [];
    }
    if (currentArmory >= weakestRange) {
      weakestChampions.push(current_champion);
    }
  });
  res.json(weakestChampions);
});

// ### 1.3: What is the Match id of the last time Rengar was played?
// > Hint: Try ton find in the given dataset (data.json) the informations you need.
// You will probably have to join the champions and the matches data. If many results matches, return them all.
app.get('/api/champion/last-rengar', function (req, res) {
  var champ = data.champions.filter(function (current_champ) {
    return current_champ.name === "Rengar"
  })[0];
  // Select the matches where this champion played
  var latestMatch = data.matches.filter(function (c) {
    return c.champion === champ.id;
  }).sort(function (a, b) {
    // Sort the matches by the timestamp, the first element being the latest match
    return a.timestamp > b.timestamp ? -1 : 1;
  })[0];
  res.send(latestMatch.matchId.toString());
});

// ### 1.4: What is, in all the given matches, the most played champion?
// > Hint: Try ton find in the given dataset (data.json) the informations you need.
// You will probably have to join the champions and the matches data. If many results matches, return them all.
app.get('/api/champion/most-played-champion', function (req, res) {
  var championIds = {}
  data.matches.forEach(c => championIds[c.champion] = (championIds[c.champion] + 1) || 1)
  var maxId = 0;
  var bestChampions = []
  Object.keys(championIds).forEach(cId => {
    if (championIds[cId] > maxId) {
       maxId = championIds[cId];
       bestChampions = [];
    }
    if (championIds[cId] >= maxId) {
       bestChampions.push(+cId);
    }
  })
  bestChampions = bestChampions.map(cId => {
    return data.champions.filter(champ => champ.id === cId)[0];
  });
// numberOfTimes = championIds[champId]
  res.json(bestChampions);
});



app.listen(2020)
