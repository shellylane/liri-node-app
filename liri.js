// Initialize dotenv
require("dotenv").config();
require;

//NPM Modules
const Spotify = require("node-spotify-api");
const moment = require("moment");
const request = require("request");
const fs = require("fs");

//Local Modules
const keys = require("./keys");
const spotify = new Spotify(keys.spotify);

//variables to store results
var concert;
var movie;

//Array to store user input
const nodeArgs = process.argv;

//variable to store user action requested
const action = process.argv[2];
var input = "";

//FUNCTIONS

//Function to get input data to include more than one word
var getInput = function() {
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      input = input + "+" + nodeArgs[i];
    } else {
      input += nodeArgs[i];
    }
  }
};

//Function to request Concert Info - "concert-this"
var getConcert = function() {
  request(
    "https://rest.bandsintown.com/artists/" +
      input +
      "/events?app_id=codingbootcamp",
    function(error, response, body) {
      // If the request was successful...
      if (!error && response.statusCode === 200) {
        // Then log the body from the site!
        concert = JSON.parse(body);
        console.log("Here's your concert info!");
        console.log("Name of Venue: " + concert[0].venue.name);
        console.log(
          "Location: " + concert[0].venue.city + ", " + concert[0].venue.region
        );
        console.log(
          "Date: " + moment(concert[0].venue.datetime).format("MM DD YYYY")
        );
      }
    }
  );
};

//Function to get Spotify results
var getSpotify = function() {
  spotify
    .search({ type: "track", query: input, limit: 1 })
    .then(function(song) {
      console.log("Artist: " + song.tracks.items[0].artists[0].name);
      console.log("Song Name: " + song.tracks.items[0].name);
      console.log(
        "Preview Link: " + song.tracks.items[0].external_urls.spotify
      );
      console.log("Album: " + song.tracks.items[0].album.name);
    })
    .catch(function(err) {
      console.log(err);
    });
};
//Function to get Movie Info - movie-this
var getMovie = function() {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

  // request to the queryUrl
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      movie = JSON.parse(body);
      console.log("Title: " + movie.Title);
      console.log("Year: " + movie.Year);
      console.log("Rated: " + movie.Rated);
      console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
      console.log("Country: " + movie.Country);
      console.log("Language: " + movie.Language);
      console.log("Plot: " + movie.Plot);
      console.log("Actors: " + movie.Actors);
    }
  });
};

//Function for do-what-it-says
var getRandom = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    // If no error, parsing the text in the random.txt file and assigning the text to the appropriate command
    var dataArr = data.split(",");
    randomAction = dataArr[0];
    input = dataArr[1];

    if (randomAction === "concert-this") {
      getConcert();
    } else if (randomAction === "spotify-this-song") {
      getSpotify();
    } else if (randomAction === "movie-this") {
      getMovie();
    } else {
      notRec();
    }
  });
};

//Function for uncrecognized input
var notRec = function() {
  console.log("Not sure what you are asking");
};

//MAIN PROCESSES

//if user chooses "concert-this"
if (action === "concert-this") {
  getInput();
  getConcert();
}

//if user chooses "spotify-this-song"
else if (action === "spotify-this-song") {
  if (nodeArgs.length > 3) {
    getInput();
    getSpotify();
  } else {
    var input = "The Sign Ace of Base";
    getSpotify();
  }
}

//if user chooses "movie-this"
else if (action === "movie-this") {
  if (nodeArgs.length > 3) {
    getInput();
    getMovie();
  } else {
    var input = "Mr Nobody";
    getMovie();
  }
}

//if user chooses "do-what-it-says"
else if (action === "do-what-it-says") {
  getRandom();
}

//if input not recognized
else {
  notRec();
}
