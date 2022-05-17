import React from 'react';
import {Routes,Route, BrowserRouter as Router} from 'react-router-dom';
import Chat from  './components/chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
