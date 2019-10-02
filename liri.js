// Initialize dotenv
require("dotenv").config();

//NPM packages
const axios = require("axios");
const chalk = require("chalk");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const fs = require("fs");

//Local Modules
const keys = require("./keys");
const spotify = new Spotify(keys.spotify);

//variable to store user action requested
let action = process.argv[2];
let search = process.argv.slice(3).join(" ");

//FUNCTIONS

//Function to request Concert Info - "concert-this"
var getConcert = function () {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
      search +
      "/events?app_id=codingbootcamp")
    .then(function (res, err) {
      //if error console log out the errror
      if (err) {
        return console.log("Error occurered: " + err);
      }
      let concerts = res.data;

      console.log(chalk.blue("Here's are the next 3 concerts for " + search + ":"));
      console.log(chalk.green("***********************************"));

      for (var i = 0; i < 3; i++) {
        let stateOrCountry;

        function getState() {
          let state = concerts[i].venue.region;
          let country = concerts[i].venue.country;
          if (state) {
            stateOrCountry = state;
          }
          else {
            stateOrCountry = country;
          }
        }

        getState();

        console.log("Venue: " + concerts[i].venue.name);
        console.log("City: " + concerts[i].venue.city + ", " + stateOrCountry);
        console.log("Date: " + moment(concerts[i].datetime).format("MM DD YYYY"));
        console.log(chalk.green("***********************************"));
      }
    });
}

//Function to get Spotify results
var getSpotify = function () {
  spotify
    .search({ type: "track", query: search, limit: 3 })
    .then(function (res) {
      let songs = res.tracks.items;
      console.log(chalk.blue("The top 3 results for " + search + " are:"));
      console.log(chalk.green("***********************************"));
      for (var i = 0; i < songs.length; i++) {
        console.log("Artist: " + songs[i].artists[0].name);
        console.log("Song Name: " + songs[i].name);
        console.log("Preview Link: " + songs[i].external_urls.spotify);
        console.log("Album: " + songs[i].album.name);
        console.log(chalk.green("***********************************"));
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};

//Function to get Movie Info - movie-this
var getMovie = function () {
  axios
    .get(
      "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")
    .then(function (res, err) {
      //if error console log out the errror
      if (err) {
        return console.log("Error occurered: " + err);
      }
      let movie = res.data;
      console.log(chalk.green("***********************************"));
      console.log(chalk.magenta(movie.Title));
      console.log("Year: " + movie.Year);
      console.log("Rated: " + movie.Rated);
      console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
      console.log("Country: " + movie.Country);
      console.log("Language: " + movie.Language);
      console.log("Plot: " + movie.Plot);
      console.log("Actors: " + movie.Actors);
      console.log(chalk.green("***********************************"));
    });
};


//Function for do-what-it-says
var getRandom = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }

    // If no error get values for action and search
    var dataArr = data.split(",");
    action = dataArr[0];
    search = dataArr[1];
    getSpotify();
  });
};

//Main Process
switch (action) {

  case "concert-this":
    getConcert();
    break;

  case "spotify-this-song":
    if (search) {
      getSpotify();
    } else {
      //if no search term default to "The Sign" by Ace of Base
      search = "The Sign Ace of Base";
      getSpotify();
    }
    break;

  case "movie-this":
    if (search) {
      getMovie();
    } else {
      //If no search term default to "Mr. Nobody"
      search = "Mr Nobody";
      getMovie();
    }
    break;

  case "do-what-it-says":
    getRandom();
    break;

  default:
    console.log(chalk.yellow("Liri isn't sure what you are asking"));

}

