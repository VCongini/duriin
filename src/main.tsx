import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.scss';

const basename = import.meta.env.BASE_URL || '/';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter basename={basename}>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
