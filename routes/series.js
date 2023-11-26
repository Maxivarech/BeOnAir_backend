var express = require('express');
const { serialize, parse } = require('../utils/json');
var router = express.Router();

const jsonDbPath = __dirname + '/../data/series.json';

const SERIES = [
    {
        id: 1,
        name: "Animaux",
    },{
        id: 2,
        name: "Portraits",
    },{
        id: 3,
        name: "Nature",
    },{
        id: 4,
        name: "Nourriture",
    },{
        id: 5,
        name: "Ville",
    },{
        id: 6,
        name: "Espace",
    },
]

// Read all series
router.get('/', (req, res, next) => {
   const serie = parse(jsonDbPath, SERIES);
   res.json(serie);
 });

 // Read one serie by ID
router.get('/:name', (req, res, next) => {
    const serie = parse(jsonDbPath, SERIES);
  
    const indexFound = serie.findIndex(x => x.name == req.params.name);
  
    if(indexFound < 0 ) return res.sendStatus(404)
  
    res.json(SERIES[indexFound]);
  })


module.exports = router;