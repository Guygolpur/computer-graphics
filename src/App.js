import React from 'react';
import Draw from './Components/draw'
import './App.css';

function App() {
  return (
    <div className="App">
      <canvas></canvas>
      <script>
        let cx = document.querySelector("canvas").getContext("2d");
        cx.strokeStyle = "blue";
        cx.strokeRect(5, 5, 50, 50);
        cx.lineWidth = 5;
        cx.strokeRect(135, 5, 50, 50);
      </script>
    </div>
  );
}

export default App;
