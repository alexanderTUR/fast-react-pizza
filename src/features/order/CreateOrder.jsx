import { formatCurrency } from '../../utils/helpers.js';
import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { store } from '../../store.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddress, getUsername } from '../user/userSlice.js';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice.js';

import { createOrder } from '../../services/apiRestaurant.js';
import { Button } from '../../ui/Button.jsx';
import { EmptyCart } from '../cart/EmptyCart.jsx';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

export const CreateOrder = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  const isLoadingAddress = addressStatus === 'loading';

  if (!cart.length) return <EmptyCart />;

  return (
    <div className='px-4 py-6'>
      <h2 className='mb-8 text-xl font-semibold'>Ready to order? Let&apos;s go!</h2>

      <Form method='POST'>
        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>First Name</label>
          <input
            className='input grow'
            type='text'
            name='customer'
            required
            defaultValue={username}
          />
        </div>

        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>Phone number</label>
          <div className='grow'>
            <input className='input w-full' type='tel' name='phone' required />
            {formErrors?.phone && (
              <p className='mt-2 rounded-md bg-red-100 px-2 py-1 text-xs text-red-700'>
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className='relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>Address</label>
          <div className='grow'>
            <input
              className='input w-full'
              type='text'
              name='address'
              defaultValue={address}
              disabled={isLoadingAddress}
              required
            />
            {addressStatus === 'error' && (
              <p className='mt-2 rounded-md bg-red-100 px-2 py-1 text-xs text-red-700'>
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className='z-1 absolute right-2 top-2'>
              <Button
                type='small'
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className='mb-12 flex items-center gap-5'>
          <input
            type='checkbox'
            name='priority'
            id='priority'
            className='h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2'
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority' className='font-medium'>
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <input
            type='hidden'
            name='position'
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />
          <Button disabled={isSubmitting || isLoadingAddress} type='primary'>
            {isSubmitting ? 'Placing the order' : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};

  if (!isValidPhone(order.phone)) {
    errors.phone = 'Invalid phone number';
  }

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
};
