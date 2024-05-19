const debounceWrapper = (func) => {
    let timeoutId
    return (...args) => {
        if (timeoutId)
            clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, 800);

    }
}

//we dont need to import this function since we're using this file as a script file inside the
//index.html file, so all the code written here will be added to the final webpage when it is rendered