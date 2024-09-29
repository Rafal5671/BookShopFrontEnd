// components/UserProfile.tsx
import { Card, Avatar } from '@nextui-org/react';

const UserProfile = () => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center">
        <Avatar
          size="lg"
          src="https://i.pravatar.cc/150"
          alt="User avatar"
          className="mr-4"
          disableAnimation
        />
        <div>
          <h3 className="text-lg font-semibold">User Name</h3>
          <p className="text-gray-500">user@example.com</p>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
