import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Card from '../Components/Card';
import AppContext from '../context';
import { NavLink } from 'react-router-dom';
import UserButton from '../Components/UI/UserButton';

function Orders() {
  const { URL_API } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(URL_API + '/orders');
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        //setOrders(data.map(obj => obj.items).flat());
        setIsLoading(false);
      } catch (error) {
        alert('Помилка при запиті замовлень');
        console.error(error);
      }
    })();
  }, [URL_API]);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мої замовлення</h1>
        {localStorage.userName ? <UserButton name={localStorage.userName} /> : <NavLink to="/sign-in" className="button_log1">Вхід в акаунт</NavLink>}
      </div>
      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card key={isLoading ? index : item.id} loading={isLoading} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Orders;
