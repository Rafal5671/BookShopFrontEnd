import { Card } from '@nextui-org/react';

const OrderHistory = () => {
  return (
    <Card className="p-4 mb-4 bg-primary-100">
      <h4 className="text-lg font-semibold mb-2">Order History</h4>
      <div>
        {/* Sample order */}
        <div className="flex justify-between my-2">
          <p>Order #1234</p>
          <p>12/08/2023</p>
        </div>
        {/* Repeat for more orders */}
      </div>
    </Card>
  );
};

export default OrderHistory;
