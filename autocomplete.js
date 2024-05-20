
const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

    //injecting the html code for a dropdown into root element
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown"> 
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div> 
    `;
    //refrences to the elements that were injected into root
    const input = root.querySelector('.input');
    const dropdown = root.querySelector('.dropdown');
    const dropdownContent = root.querySelector('.results');


    const generateHtml = (items) => {
        dropdown.classList.add('is-active');
        dropdownContent.innerHTML = ""; //clearing out the previous to add new
        for (let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item); //this fn decides what goes inside an option
            option.addEventListener('click', (event) => {
                dropdown.classList.remove('is-active'); //closes the menu
                input.value = inputValue(item); //update the value of input
                //function that knows what to do on option select
                onOptionSelect(item);

            })
            dropdownContent.append(option);
        }
    }
    const onInput = async (event) => {
        let searchTerm = event.target.value;
        searchTerm = searchTerm.trimStart();
        let items;
        if (searchTerm !== "")
            items = await fetchData(searchTerm);
        if (items && items.length) {
            generateHtml(items);
        } else {
            dropdown.classList.remove('is-active');
        }
    }

    //adding a debounced eventlistener to the input
    input.addEventListener('input', debounceWrapper(onInput));

    document.addEventListener('click', event => {
        //checking if the clicked area is not inside the autocomplete component
        if (!root.contains(event.target))
            dropdown.classList.remove('is-active');

    })
}