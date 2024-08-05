import React, { createContext, useState, useContext } from 'react';

const SearchQueryContext = createContext();

export const useSearchQuery = () => useContext(SearchQueryContext);

export const SearchQueryProvider = ({ children }) => {
    const [query, setQuery] = useState('');

    return (
        <SearchQueryContext.Provider value={{ query, setQuery }}>
            {children}
        </SearchQueryContext.Provider>
    );
};