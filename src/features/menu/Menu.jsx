import { useLoaderData } from 'react-router-dom';
import { getMenu } from '../../services/apiRestaurant.js';

import { MenuItem } from './MenuItem.jsx';

export const Menu = () => {
  const menu = useLoaderData();
  return (
    <ul className='divide-y divide-stone-200 px-2'>
      {menu.map((pizza) => {
        return <MenuItem key={pizza.id} pizza={pizza} />;
      })}
    </ul>
  );
};

export const loader = async () => {
  const menu = await getMenu();
  return menu;
};
