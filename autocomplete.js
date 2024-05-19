
//function that accepts a config object and renders out movie section
const createAutoComplete = ({ root }) => {

    //all these classes are bulma classes for a dropdown menu
    root.innerHTML = `
        <label><b>Search for a movie </b></label>
        <input class="input" />
        <div class="dropdown"> 
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div> 
    `;
    const inputA = root.querySelector('.input');
    const dropdown = root.querySelector('.dropdown');
    const dropdownContent = root.querySelector('.results');

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
        //means if the clicked area is not inside the root
        if (!root.contains(event.target))
            dropdown.classList.remove('is-active');
        // if (root.contains(event.target))
        //     if (inputA.value !== "")
        //         dropdown.classList.add('is-active');

    })

}