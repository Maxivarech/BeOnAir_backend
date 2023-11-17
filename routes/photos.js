var express = require('express');
const { serialize, parse } = require('../utils/json');
var router = express.Router();

const jsonDbPath = __dirname + '/../data/products.json';


const PHOTOS = [
  {
    id: 1,
    author: "Antoine",
    name: "Chèvre des montagnes",
    price: 185,
    serie: "Animaux",
    pathImage: "goat.jpg"
},
{
    id: 2,
    author: "Mathieu",
    name: "mon grand père dans son fauteuil",
    price: 75.89,
    serie: "Portraits",
    pathImage: "papy.jpg"
},
{
    id: 3,
    author: "Moise",
    name: "Burger fait maison",
    price: 32,
    serie: "Nourriture",
    pathImage: "burger.jpg"
},
{
    id: 4,
    author: "Antoine",
    name: "Bruxelles by night",
    price: 112,
    serie: "Ville",
    pathImage: "brussels.jpg"
},
{
    id: 5,
    author: "Jimmy",
    name: "Mars depuis mon jardin",
    price: 31.99,
    serie: "Espace",
    pathImage: "mars.jpg"
},
];

// Read all the photos
router.get('/', (req, res, next) => {
  // verifier si un paramère
  const filterSerie = 
  // Si un parametre a été donné pour le query paramètre 
  req.query.series
  // et qu'il contient serie
  console.log(filterSerie)
  // verifier si un paramère
  const orderBySerie =
  // Si un parametre a été donné pour le query paramètre 
  req?.query?.order?.includes('serie')
  // et qu'il contient serie
  ? req.query.order // on le conserve
  : undefined; // sinon

  let orderedPhotos;

  const photos = parse(jsonDbPath, PHOTOS);
  
  if(orderBySerie) 
    // shallow copy ordered by serie
    orderedPhotos = [...photos].sort((p1, p2) => p1.serie.localeCompare(p2.serie));
  if(orderBySerie === '-serie') orderedPhotos = orderedPhotos.reverse(); 
  
  let filteredBySerie ;
  if(orderedPhotos){
    filteredBySerie = orderedPhotos
  }else{
    filteredBySerie = [...photos];
  }

  if(filterSerie){
    filteredBySerie = filteredBySerie.filter(product => product.serie === filterSerie)
  }
  res.json( filteredBySerie ?? photos);
});

// Read all series 
router.get('/series', (req, res, next) => {
  // verifier si un paramère
  const photos = parse(jsonDbPath, PHOTOS);
  const setSerie = new Set(photos.map(photo => photo.serie)) 
  res.json(JSON.stringify(Array.from(setSerie)));
});

// Read one photo by ID
router.get('/:id', (req, res, next) => {
  const photos = parse(jsonDbPath, PHOTOS);

  const indexFound = photos.findIndex(p => p.id == req.params.id);

  if(indexFound < 0 ) return res.sendStatus(404)

  res.json(photos[indexFound]);
})


// Create a new photo
router.post('/', (req, res) => {
  const author = req?.body?.author?.length !== 0 ? req.body.author : 'Unknown';
  const name = req?.body?.name?.length !== 0 ? req.body.name : undefined;
  const serie = req?.body?.author?.length !== 0 ? req.body.serie : 'Unknown';
  const price = req?.body?.price != 0 ? req.body.price : undefined;

  console.log('POST /photos');

  if (!name || !price) return res.sendStatus(400); // error code '400 Bad request'

  const photos = parse(jsonDbPath, PHOTOS);
  const lastItemIndex = PHOTOS?.length !== 0 ? PHOTOS.length - 1 : undefined;
  const lastId = lastItemIndex !== undefined ? PHOTOS[lastItemIndex]?.id : 0;
  const nextId = lastId + 1;

  const newPhoto = {
    id: nextId,
    author: author,
    name: name,
    serie: serie,
    price : price
  };

  photos.push(newPhoto);

  serialize(jsonDbPath,photos);

  res.json(newPhoto);
});

router.delete('/:id', (req,res) => {

  const photos = parse(jsonDbPath, PHOTOS);

  const foundIndex = photos.findIndex(p => p.id == req.params.id)

  if (foundIndex < 0) return res.sendStatus(404);

  const itemsRemovedFromPhotos = photos.splice(foundIndex, 1);
  const itemRemoved = itemsRemovedFromPhotos[0]

  serialize(jsonDbPath, photos);

  res.json(itemRemoved);
})

router.patch('/:id', (req,res) => {

  // Si le client envoie un body vide => res.send(404)
  if(Object.keys(req?.body).length === 0) return res.sendStatus(400)
  
  const photos = parse(jsonDbPath, PHOTOS);

  const foundIndex = photos.findIndex(p => p.id == req.params.id)
  
  if (foundIndex < 0) return res.sendStatus(404);

  const updatedPhoto = {...photos[foundIndex], ...req.body};
  
  photos[foundIndex] = updatedPhoto;

  serialize(jsonDbPath,photos)
  
  res.json(updatedPhoto)
})

module.exports = router;
