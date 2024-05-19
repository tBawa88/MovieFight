
const key = 'e6744c17';
let url = 'http://www.omdbapi.com/';

const container = document.querySelector('.movieContainer');
const autoWidget = document.querySelector('.autocomplete');

//all these classes are bulma classes for a dropdown menu
autoWidget.innerHTML = `
<label><b>Search for a movie </b></label>
<input class="input" />
<div class="dropdown"> 
<div class="dropdown-menu">
<div class="dropdown-content results">
</div>
</div>
</div> 
`;
const inputA = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.results');

const fetchSearchData = async (searchTerm) => {
    const response = await axios.get(url, {
        params: {
            apikey: key,
            s: searchTerm,
            page: "1"
        }
    });
    // console.log(response);
    if (response.data.Error)
        return []; //return empty array
    return response.data.Search;
};


const generateHtml = (movies) => {
    dropdown.classList.add('is-active');
    dropdownContent.innerHTML = ""; //clearing out the previous stuff when making a new search
    for (let movie of movies) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        const option = document.createElement('a');
        //creating an anchor tag and adding inner html to it, also applying a bulma class to it 
        option.classList.add('dropdown-item');
        option.innerHTML = `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
        `;
        option.addEventListener('click', (event) => {
            dropdown.classList.remove('is-active'); //close the menu
            inputA.value = movie.Title; //update the value of input
            //this movie.title value will be binded to every option created thanks to closures feature

            //call the function that will render the movie data
            onMovieSelect(movie);

        })
        dropdownContent.append(option);
    }

}
const onInput = async (event) => {
    let searchTerm = event.target.value;
    searchTerm = searchTerm.trimStart();
    let movies;
    if (searchTerm !== "")
        movies = await fetchSearchData(searchTerm);
    if (movies && movies.length) {
        generateHtml(movies);
    } else {
        dropdown.classList.remove('is-active');
        // when there is no value inside the input or we get an empty response from the api
    }
}



//debounce function moved to utils.js
inputA.addEventListener('input', debounceWrapper(onInput));


document.addEventListener('click', event => {
    //means if the clicked area is not inside the autowidget
    if (!autoWidget.contains(event.target))
        dropdown.classList.remove('is-active');
    // if (autoWidget.contains(event.target))
    //     if (inputA.value !== "")
    //         dropdown.classList.add('is-active');

})

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