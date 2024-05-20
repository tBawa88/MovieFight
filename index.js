
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
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
    ...autoCompleteConfig
});
createAutoComplete({
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
    ...autoCompleteConfig
});


let leftMovie;
let rightMovie;

// fetch movie detail when an option is selected
// also inject the html into summaryElement
const onMovieSelect = async (movie, summaryElement, movieSide) => {
    const response = await axios.get(url, {
        params: {
            apikey: key,
            i: movie.imdbID,
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if (movieSide === 'left') leftMovie = response.data;
    if (movieSide === 'right') rightMovie = response.data;

    //check if both sides have been populated
    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftMovieStats = document.querySelectorAll('#left-summary .notification');
    const rightMovieStats = document.querySelectorAll('#right-summary .notification');

    //iterator over one of these and compare it with other
    leftMovieStats.forEach((leftStat, index) => {
        const rightStat = rightMovieStats[index]; //obtaining corresponding stat from right

        const leftValue = leftStat.dataset.value;
        const rightValue = rightStat.dataset.value;

        if (parseInt(leftValue) < parseInt(rightValue)) {
            leftStat.classList.remove('is-primary'); //remove the original class
            leftStat.classList.add('is-warning');   //add warning class
            rightStat.classList.add('is-primary')
            rightStat.classList.remove('is-warning')
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
            leftStat.classList.add('is-primary')
            leftStat.classList.remove('is-warning');
        }
    })
}

const movieTemplate = (movieDetail) => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const rating = parseFloat(movieDetail.imdbRating);
    const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    const awards = movieDetail.Awards.split(' ').reduce((acc, item) => {
        let n = parseInt(item);
        return isNaN(n) ? acc : n + acc;
    }, 0)

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
        <article data-value=${awards} class="notification is-primary">
            <p><strong>${movieDetail.Awards}</strong></p> 
            <p><small>Awards</small></p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p><strong>${movieDetail.BoxOffice}</strong></p> 
            <p><small>BoxOffice</small></p>
        </article>
        <article data-value=${rating} class="notification is-primary">
            <p><strong>${movieDetail.imdbRating}</strong></p> 
            <p><small>IMDB Rating</small></p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p><strong>${movieDetail.imdbVotes}</strong></p> 
            <p><small>IMDB Votes</small></p>
        </article>
    `
}
