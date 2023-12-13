const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
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
    
});

app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000.');
});