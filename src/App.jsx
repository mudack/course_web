import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';
import Drawer from './Components/Drawer';
import Home from './Pages/Home';
import Favorites from './Pages/Favorites';
import Orders from './Pages/Orders';
import AppContext from './context';
import Register from './Pages/Register';
import Login from './Pages/Login';
//export const AppContext = React.createContext({});

const URL_API = `${window.location.protocol}//${window.location.hostname}:1721/sneakers`;

const App = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartResponse, favoritesResponse, itemsResponse,] = await Promise.all([
          axios.get(URL_API + '/cart'),
          axios.get(URL_API + '/favorites'),
          axios.get(URL_API + '/items'),
        ]);

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Помилка при запиті даних');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const onAddToCart = async obj => {
    try {
      const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`${URL_API}/cart/${findItem.id}`);
      } else {
        setCartItems(prev => [...prev, obj]);
        const { data } = await axios.post(URL_API + '/cart', obj);
        setCartItems(prev =>
          prev.map(item => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Помилка при додаванні до кошика');
      console.error(error);
    }
  };

  const onRemoveItem = id => {
    try {
      axios.delete(`${URL_API}/cart/${id}`);
      setCartItems(prev => prev.filter(item => Number(item.id) !== Number(id)));
    } catch (error) {
      alert('Помилка видалення з кошика');
      console.error(error);
    }
  };

  const onAddToFavorite = async obj => {
    try {
      const findItem = favorites.find(item => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setFavorites(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`${URL_API}/favorites/${findItem.id}`);
      } else {
        setFavorites(prev => [...prev, obj]);
        const { data } = await axios.post(URL_API + '/favorites', obj);
        setFavorites(prev =>
          prev.map(item => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Не вдалося додати до "Улюблене"');
      console.error(error);
    }
  };

  const onRemoveFavorite = id => {
    try {
      axios.delete(`${URL_API}/favorites/${id}`);
      setFavorites(prev => prev.filter(item => Number(item.id) !== Number(id)));
    } catch (error) {
      alert('Помилка при видаленні з "Улюблене"');
      console.error(error);
    }
  };

  const onChangeSearchInput = event => setSearchValue(event.target.value);

  const isItemAdded = id => cartItems.some(obj => Number(obj.parentId) === Number(id));

  const isItemFavorite = id => favorites.some(obj => Number(obj.parentId) === Number(id));

  return (
    <AppContext.Provider
      value={{
        URL_API,
        items,
        cartItems,
        favorites,
        onRemoveFavorite,
        isItemAdded,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}>
      <div className={cartOpened ? "wrapper clear app_hidden" : "wrapper clear"}>
        <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} opened={cartOpened} />
        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route path="/" element={<Home
            items={items}
            cartItems={cartItems}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            isItemFavorite={isItemFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading}
          />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/orders" element={<Orders />} />

        </Routes>

      </div>
    </AppContext.Provider>
  );
};

export default App;
