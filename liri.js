require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
// var spotify = new Spotify(keys.spotify);
var searchType = process.argv[2];
var serach = process.argv[3];

switch (searchType) {
    case "spotify-this-song":
        spotifySearch();
        break;

    case "movie-this":
        movieSearch();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
    case "concert-this":
        concertSearch();
        break;

};

function spotifySearch(track) {
    var track = process.argv[3];
    if (!track) track = "The Sign Ace of Base";

    var spotify = new Spotify({
        id: "99d510b232784e86818f92b2750b8aaf",
        secret: "291825ef6fce4ff29b40f287ad693e48"
    });
    spotify.search({
            type: 'track',
            query: track
        },
        function(err, data) {

            if (err) {
                return console.log("Error message: " + err);
            }
            var results = `
                Artist - ${data.tracks.items[0].artists[0].name}
                Song - ${data.tracks.items[0].name}
                Preview Link - ${data.tracks.items[0].external_urls.spotify}
                Album - ${data.tracks.items[0].album.name}
                `;
            console.log(results);
            fs.appendFile('log.txt', results, function(err) {
                if (err) throw err;
                console.log("Saved to the log");
            });
        });


};

function movieSearch() {
    var input = process.argv[3].split(" ").join('+');
    if (input === null) {
        input = "Mr. Nobody";
    }
    var parameter = input;
    axios.get(`http://omdbapi.com/?t=${parameter}&r=json&apikey=trilogy`)
        .then(function(response) {
            let results = `
            Title - ${response.data.Title}
            Year - ${response.data.Year}
            IMDB Rating ${response.data.Ratings[0].Value}
            Rotten Tomatoes Rating - ${response.data.Ratings[1].Value}
            Country - ${response.data.Country}
            Language - ${response.data.Language}
            Plot - ${response.data.Plot}
            Actors - ${response.data.Actors}`;
            console.log(results);
            fs.appendFile("log.txt", results, function(err) {
                if (err) throw err;
                console.log("Saved to the log");
            });
        }).catch(function(error) {
            console.log(error);
        });
}

function concertSearch() {
    var input = process.argv[3].split(" ").join('+');
    var parameter = input;
    axios.get(`https://rest.bandsintown.com/artists/${parameter}/events?app_id=codingbootcamp`)
        .then(function(response) {
            let results = `
            Venue Name - ${response.data[0].venue.name}
            Venue Location - ${response.data[0].venue.city + ", " + response.data[0].venue.country}
            Date of the Event - ${response.data[0].datetime}
            `;
            console.log(results);
            fs.appendFile("log.txt", results, function(err) {
                if (err) throw err;
                console.log("Saved to the log");
            });
        }).catch(function(error) {
            console.log(error);
        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            console.log("Error Message: " + error);
        } else {
            var doWhatItSays = data.split(",");
            if (doWhatItSays[0] === "spotify-this-song") {
                input = doWhatItSays[1];
                parameter = input;
                console.log("The song search is: " + parameter);
                spotifySearch(parameter);
                log(parameter);
            }
        }
    })
}

function log(logResults) {
	fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
			throw error;
	    }
    });
}
