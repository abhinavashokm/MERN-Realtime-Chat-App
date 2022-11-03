import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './Auth/AuthContext';
import { CurrentChatContextProvider } from './Store/CurrentChat';
import { UnreadMessageContextProvider } from './Store/UnreadMessages';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <UnreadMessageContextProvider>
            <CurrentChatContextProvider>
                <App />
            </CurrentChatContextProvider>
        </UnreadMessageContextProvider>
    </AuthContextProvider>
);

