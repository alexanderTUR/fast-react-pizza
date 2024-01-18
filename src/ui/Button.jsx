import { Link } from 'react-router-dom';

export const Button = ({ children, disabled, to, type }) => {
  const baseStyles =
    'inline-block rounded-full bg-yellow-400  font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed text-sm';

  const styles = {
    primary: baseStyles + ' px-4 py-3 md:px-6 md:py-4',
    secondary:
      'inline-block rounded-full font-semibold uppercase tracking-wide text-stone-400 transition-colors duration-300 hover:bg-stone-300 focus:bg-stone-300 focus:outline-none focus:ring focus:ring-stone-200 focus:ring-offset-2 disabled:cursor-not-allowed border-2 border-stone-300 px-4 py-2.5 md:px-6 md:py-3.5 hover:text-stone-800 focus:text-stone-800 text-sm',
    small: baseStyles + ' py-2 md:px-5 md:py2.5 text-xs',
  };

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  return (
    <button className={styles[type]} disabled={disabled}>
      {children}
    </button>
  );
};
