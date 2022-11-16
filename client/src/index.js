import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './Auth/AuthContext';
import { AuthHelpersProvider } from './Auth/AuthHelpers';
import { CurrentChatContextProvider } from './Store/CurrentChat';
import { UnreadMessageContextProvider } from './Store/UnreadMessages';
import { ContactListContextProvider } from './Store/ContactList';
import { ChatHelperProvider } from './Helpers/ChatHelper';
import { ChatsContextProvider } from './Store/ChatsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <ContactListContextProvider>
            <ChatsContextProvider>
                <UnreadMessageContextProvider>
                    <CurrentChatContextProvider>
                        <AuthHelpersProvider>
                            <ChatHelperProvider>
                                <App />
                            </ChatHelperProvider>
                        </AuthHelpersProvider>
                    </CurrentChatContextProvider>
                </UnreadMessageContextProvider>
            </ChatsContextProvider>
        </ContactListContextProvider>
    </AuthContextProvider>
);

