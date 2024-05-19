
const key = 'e6744c17';
let url = 'http://www.omdbapi.com/';

const container = document.querySelector('.movieContainer');

const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
         <img src="${imgSrc}" />
         ${movie.Title} (${movie.Year})
         `;
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    fetchData: async (searchTerm) => {
        const response = await axios.get(url, {
            params: {
                apikey: key,
                s: searchTerm,
                page: "1"
            }
        });
        if (response.data.Error)
            return [];
        return response.data.Search;
    }

};

//config object for autocomplete component
createAutoComplete({
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'));
    },
    ...autoCompleteConfig
});
createAutoComplete({
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'));
    },
    ...autoCompleteConfig
});

// fetch movie detail when an option is selected
// also inject the html into summaryElement
const onMovieSelect = async (movie, summaryElement) => {
    const response = await axios.get(url, {
        params: {
            apikey: key,
            i: movie.imdbID,
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
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
            <p><strong>${movieDetail.imdbRating}</strong></p> 
            <p><small>IMDB Rating</small></p>
        </article>
        <article class="notification is-primary">
            <p><strong>${movieDetail.imdbVotes}</strong></p> 
            <p><small>IMDB Votes</small></p>
        </article>
    `
}
