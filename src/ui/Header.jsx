import { Link } from 'react-router-dom';
import { SearchOrder } from '../features/order/SearchOrder.jsx';

export const Header = () => {
  return (
    <header>
      <Link to='/'>Fast React Pizza</Link>
      <SearchOrder />
      <p>🍕</p>
    </header>
  );
};
