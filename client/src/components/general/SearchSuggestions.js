import React, { useContext, useEffect } from 'react';

import { SearchQueryContext } from '../../App';

export default function SearchSuggestions() {

    const { query } = useContext(SearchQueryContext);

    const updateSuggestionsHandler = (event) => {
        event.preventDefault();
    }

    useEffect(() => {
        updateSuggestionsHandler();
    }, [query]);

    return (
        {/* Some kind of movie card dropdown that lists
            say the top 5 results based off what the current
            user query is */}
    );
}