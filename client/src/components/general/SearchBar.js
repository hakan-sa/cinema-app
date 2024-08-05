import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InputGroup, FormControl } from 'react-bootstrap';

import { useSearchQuery } from '../../contexts/SearchQueryProvider';

export default function SearchBar() {

    const { query, setQuery } = useSearchQuery();

    const navigate = useNavigate();

    const searchInputHandler = (event) => {
        event.preventDefault();
        setQuery(event.target.value);
    };

    const searchHandler = (event) => {
        event.preventDefault();
        const querySlug = query.toLowerCase().replace(/ /g, '-');
        navigate('/search/' + querySlug);
    };

    return (
        <form className="d-flex position-absolute is-fixed" style={{ left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }} onSubmit={searchHandler}>
            <InputGroup>
                <FormControl
                    style={{ width: '25vw' }}
                    placeholder="Search Movies"
                    aria-label="Search"
                    value={query}
                    onChange={searchInputHandler}
                />
                <InputGroup.Text onClick={searchHandler} style={{ cursor: 'pointer' }}>
                    <i className="material-icons">search</i>
                </InputGroup.Text>
            </InputGroup>
        </form>
    );
}