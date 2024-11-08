import { Card } from '@nextui-org/react';

const CurrentOrders = () => {
  return (
    <Card className="p-4 mb-4  bg-primary-100">
      <h4 className="text-lg font-semibold mb-2">Current Orders</h4>
      <div>
        {/* Sample current order */}
        <div className="flex justify-between my-2">
          <p>Order #5678</p>
          <p>Status: In Progress</p>
        </div>
        {/* Repeat for more current orders */}
      </div>
    </Card>
  );
};

export default CurrentOrders;
