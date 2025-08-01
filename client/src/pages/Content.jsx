import React from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import Homepage from '@/components/Homepage/Homepage';
import UserDashboard from '@/components/UserDashboard/UserDashboard';

const Content = () => {
  const { isConnected } = useAppKitAccount();

  return (
    <div>
      {isConnected ? <UserDashboard /> : <Homepage />}
    </div>
  );
};

export default Content;