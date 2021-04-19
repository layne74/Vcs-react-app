import './App.css';
import Home from './componants/Home';

function App() {
  return (
    // Main App
    <div className="App">
      {/* Heading/title */}
      <div className="heading">
        <h1>VCS Search engine</h1>
      </div>
      {/* Home componant called */}
      <Home />
      <div>
        <p className="credit-text">Created by <a href="https://github.com/layne74/" target="blank">Layne Hutchings</a></p>
      </div>
    </div>
  );
}

export default App;
