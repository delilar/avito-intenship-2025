import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import ItemForm from './components/ItemForm/ItemForm';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/form" element={<ItemForm />} />
          <Route path="/form/:id" element={<ItemForm />} />
          <Route path="/list" element={<ItemList />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/" element={<ItemList />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;