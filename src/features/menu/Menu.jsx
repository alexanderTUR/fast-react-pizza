import { getMenu } from '../../services/apiRestaurant.js';
import { useLoaderData } from 'react-router-dom';
import { MenuItem } from './MenuItem.jsx';

export const Menu = () => {
  const menu = useLoaderData();
  return (
    <ul>
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
