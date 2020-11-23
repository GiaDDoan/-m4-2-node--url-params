"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const { top50 } = require('./data/top50');

//Array of Artists without duplicates
const artists = top50.map((song) => song.artist);
let list = new Set(artists);
const listArray = [...list];

//FONCTIONS
const handleSong = (req, res) => {
  const rankNum = req.params.rank;
  const song = top50.filter((song) => song.rank == rankNum);//Can't use '===' because both the numbers type(?) aren't the same?
  res.status(200).json({ status: 200, data: song });
};
const handleArtistName = (req, res) => {
  const name = req.params.artistName;
  console.log(name.toLowerCase().split('-').join(' '));
  const artist = top50.filter((song) => song.artist.toLowerCase() === name.toLowerCase().split('-').join(' '));
  res.status(200).json({ status: 200, data: artist});
};
const handlePopularArtist = (req, res) => {
//Calculating how many duplicates
const result = {};

for (let i = 0; i < top50.length; i++) {
  result[top50[i].artist] = (result[top50[i].artist] || 0) + 1 // Need explanation
}
Object.keys(result).map(key => ({ [key]: result[key] }))
// console.log(result);

//Comparing values to get the highest
let arr = Object.values(result);
let max = Math.max(...arr);
let mostPopularArtist = Object.entries(result).find(([key, value]) => (value === max));
console.log(mostPopularArtist);
// console.log(result);

//Sending the data
const name = mostPopularArtist[0].toLowerCase(); // Is there a better way to get the name?
console.log(name);
const artist = top50.filter((song) => song.artist.toLowerCase() === name);
  res.status(200).json({ status: 200, data: artist});
};
const handleArtist = (req, res) => {
  // const artists = top50.map((song) => song.artist);
  // let list = new Set(artists);
  // const listArray = [...list];
  res.status(200).json({ status:200, data: listArray});
};

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  // .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  .get('/top50', (req, res) => {
    res.status(200).json({ status: 200, data: [...top50] });
  })
  .get('/top50/song/:rank', handleSong)
  .get('/top50/artist/:artistName', handleArtistName)
  .get('/top50/popular-artist', handlePopularArtist)
  .get('/top50/artist', handleArtist)
  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
