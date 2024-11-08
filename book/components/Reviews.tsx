import { Card } from '@nextui-org/react';

const Reviews = () => {
  return (
    <Card className="p-4 mb-4  bg-primary-100">
      <h4 className="text-lg font-semibold mb-2">Reviews</h4>
      <div>
        {/* Sample review */}
        <div className="my-2">
          <p>"Great service!"</p>
          <p className="text-gray-500">by John Doe</p>
        </div>
        {/* Repeat for more reviews */}
      </div>
    </Card>
  );
};

export default Reviews;
