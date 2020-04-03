import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <button onClick={fetchTestData}>
        Fetch Test Data
      </button>
    </div>
  );
}

const fetchTestData = function () {
  fetch('/api/v1/tests')
    .then(res => res.json())
    .then((response) => { console.log("Test datas response", response); })
    .catch((error) => { console.log("Error while fetching test datas", error); })
}

export default App;
