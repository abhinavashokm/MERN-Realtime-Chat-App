import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserContextProvider } from './Store/UserContext';
import { CurrentChatContextProvider } from './Store/CurrentChat';
import { UnreadMessageContextProvider } from './Store/UnreadMessages';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserContextProvider>
        <UnreadMessageContextProvider>
            <CurrentChatContextProvider>
                <App />
            </CurrentChatContextProvider>
        </UnreadMessageContextProvider>
    </UserContextProvider>
);

