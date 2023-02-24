import { Routes, Route } from 'react-router-dom';
import Books from './components/Books';
import BookDetails from './components/BookDetails';

function App() {
  return (
    <div>
      <header className='App-header'>
        <Routes>
          <Route
            path='/'
            element={<Books />}
          />
          <Route
            path='/:id'
            element={<BookDetails />}
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
