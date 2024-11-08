import { NextPage } from 'next';
import UserProfile from '@/components/UserProfile';
import OrderHistory from '@/components/OrderHistory';
import Reviews from '@/components/Reviews';
import CurrentOrders from '@/components/CurrentOrders';

const Profile: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <UserProfile />
      <OrderHistory />
      <Reviews />
      <CurrentOrders />
    </div>
  );
};

export default Profile;
