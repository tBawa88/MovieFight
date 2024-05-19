
const key = 'e6744c17';
let url = 'http://www.omdbapi.com/';

const container = document.querySelector('.movieContainer');


createAutoComplete({
    root: document.querySelector(".autocomplete")
});
createAutoComplete({
    root: document.querySelector(".autocomplete-two")
});
createAutoComplete({
    root: document.querySelector(".autocomplete-three")
});

//This function is executed when the movie is clicked
const onMovieSelect = async (movie) => {
    const response = await axios.get(url, {
        params: {
            apikey: key,
            i: movie.imdbID, //making the search using the imdbID on the movie object
        }
    });
    const summary = document.querySelector('#summary');
    summary.innerHTML = movieTemplate(response.data);
}

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure  class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster} />"
                </p>
            </figure>
            <div class="media-content> 
                <div class="content">
                    <h1 class="title is-4">${movieDetail.Title}</h1>
                    <p><strong>${movieDetail.Genre}</strong></p>
                    <p><small>${movieDetail.Plot}</small></p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p><strong>${movieDetail.Awards}</strong></p> 
            <p><small>Awards</small></p>
        </article>
        <article class="notification is-primary">
            <p><strong>${movieDetail.BoxOffice}</strong></p> 
            <p><small>BoxOffice</small></p>
        </article>
        <article class="notification is-primary">
            <p><strong>${movieDetail.MetaScore}</strong></p> 
            <p><small>MetaScore<small></p>
        </article>
        <article class="notification is-primary">
            <p><strong>${movieDetail.imdbRating}</strong></p> 
            <p><small>IMDB Rating</small></p>
        </article>
        <article class="notification is-primary">
            <p><strong>${movieDetail.imdbVotes}</strong></p> 
            <p><small>IMDB Votes</small></p>
        </article>
    `
}




//HTML that we wish to generate
// <div class="dropdown is-active">
// <input type="text" class="movieA"/>
// <div class="dropdown-menu">
//   <div class="dropdown-content">
//     <a href="" class="dropdown-item">Movie #1</a>
//     <a href="" class="dropdown-item">Movie #2</a>
//     <a href="" class="dropdown-item">Movie #3</a>
//     <a href="" class="dropdown-item">Movie #4</a>
//   </div>
// </div>
// </div>