import React, { useEffect, useState } from 'react';
import {io} from 'socket.io-client';

function App() {
const [socket, setSocket] = useState()
  useEffect(() => {
    setSocket(io("ws://localhost:3001"))
  }, [])
  
  return (
    <div className="App">
      <h1>hello world</h1>
    </div>
  );
}

export default App;
