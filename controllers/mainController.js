const express = require('express');
const axios = require('axios');
const http = require('http');


exports.mainPage = (req, res) => {
    //const message = 'hello world';
    //res.render('index', {dataToRender: message});

    let url = 'https://api.themoviedb.org/3/movie/854648?api_key=21df2c343e7dde49f574347a9b252ec3';
    axios.get(url)
    .then(response => {
       //console.log(response.data);
       let data = response.data;
      //console.log(data.title);

        let releaseDate = new Date(data.release_date).getFullYear();

        let genresToDisplay = '';
        data.genres.forEach(genre => {
            genresToDisplay = genresToDisplay + `${genre.name}, `;
        });
        let genresUpdated = genresToDisplay.slice(0, -2) + '.';

        let posterUrl = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${data.poster_path}`;


        let currentYear = new Date().getFullYear();

        res.render('index', {
            dataToRender: data,
             year: currentYear,
             releaseYear: releaseDate,
             genres: genresUpdated,
             poster: posterUrl
            });
    });
    
}

exports.getSearchPages = (req, res) => {
    res.render('search', {movieDetails:''});
}

exports.getMovieData = (req, res) => {
    let userMovieTitle = req.body.movieTitle;

    //console.log(userMovieTitle);

    let movieUrl = `https://api.themoviedb.org/3/search/movie?query=${userMovieTitle}&api_key=21df2c343e7dde49f574347a9b252ec3`;
    let genresUrl = 'https://api.themoviedb.org/3/genre/movie/list?&api_key=21df2c343e7dde49f574347a9b252ec3&language=en-US';

    let endpoints = [movieUrl, genresUrl];

    axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
    .then(axios.spread((movie, genres) => {


        const [movieRaw] = movie.data.results;

        //console.log(movie.data.results);

        let movieGenreIds = movieRaw.genre_ids;
        let movieGenres = genres.data.genres;
        //console.log(movieGenres);

        let movieGenresArray = [];

        for(let i = 0; i < movieGenreIds.length; i++){// i++ - i = i + 1
            for(let j = 0; j < movieGenres.length; j++) {
                if(movieGenreIds[i] === movieGenres[j].id){
                    movieGenresArray.push(movieGenres[j].name);
                }
            }
        }

       // console.log(movieGenresArray);

       let genresToDisplay = '';
       movieGenresArray.forEach(genre => {
        genresToDisplay = genresToDisplay + `${genre}, `;
       });

       genresToDisplay = genresToDisplay.slice(0, -2) + '.';

       //console.log(genresToDisplay);

        let movieData = {
            title: movieRaw.title,
            year: new Date(movieRaw.release_date).getFullYear(),
            genres: genresToDisplay,
            overview: movieRaw.overview,
            posterUrl: `https://image.tmdb.org/t/p/w500${movieRaw.poster_path}`
        };
    
        res.render('search', {movieDetails: movieData});
    
    }));

}

exports.getMovie = (req, res) => {
    const movieToSearch =
        req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie
             ? req.body.queryResult.parameters.movie
            : '';
   
   const reqUrl = encodeURI(
        `http://www.omdbapi.com/?t=${movieToSearch}&apikey=cc6f9d1b`
   );
   http.get(
       reqUrl,
       responseFromAPI => {
           let completeResponse = ''
           responseFromAPI.on('data', chunk => {
               completeResponse += chunk
           })
           responseFromAPI.on('end', () => {
               const movie = JSON.parse(completeResponse);
               if (!movie || !movie.Title) {
                   return res.json({
                       fulfillmentText: 'Sorry, we could not find the movie you are asking for.',
                       source: 'getmovie'
                   });
                }
   
               let dataToSend = movieToSearch;
               dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
                    movie.Director
               } and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.`;
   
               return res.json({
                   fulfillmentText: dataToSend,
                   source: 'getmovie'
               });
           })
        },
       error => {
           return res.json({
               fulfillmentText: 'Could not get results at this time',
               source: 'getmovie'
            });
        }
    )
}