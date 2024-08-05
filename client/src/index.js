import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { UserDataProvider } from './contexts/UserDataProvider';
import { OnScreenProvider } from './contexts/OnScreenProvider';
import { SearchQueryProvider } from './contexts/SearchQueryProvider';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <UserDataProvider>
                <OnScreenProvider>
                    <SearchQueryProvider>
                        <Routes>
                            <Route path='/*' element={<App />} />
                        </Routes>
                    </SearchQueryProvider>
                </OnScreenProvider>
            </UserDataProvider>
        </BrowserRouter>
    </React.StrictMode>
);