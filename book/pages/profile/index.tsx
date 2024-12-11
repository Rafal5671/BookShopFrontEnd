import React from 'react';

const UserProfile = () => {
  const user = {
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    orders: [
      {
        id: 1,
        date: "2024-11-18",
        status: "Wysłane",
        products: [
          { id: 101, title: "Zbrodnia i kara" },
          { id: 102, title: "Mistrz i Małgorzata" },
        ],
      },
      {
        id: 2,
        date: "2024-11-15",
        status: "Dostarczone",
        products: [{ id: 103, title: "Władca Pierścieni" }],
      },
      {
        id: 3,
        date: "2024-11-20",
        status: "W trakcie realizacji",
        products: [
          { id: 104, title: "Hobbit" },
          { id: 105, title: "Silmarillion" },
        ],
      },
    ],
    reviews: [
      { id: 1, book: "Władca Pierścieni", content: "Nie mogłem się oderwać!", rating: 9 },
    ],
  };

  // Funkcja do przypisywania klasy w zależności od statusu
  const getStatusClass = (status) => {
    switch (status) {
      case "Wysłane":
        return "bg-blue-500 text-white px-3 py-1 rounded-lg";
      case "Dostarczone":
        return "bg-green-500 text-white px-3 py-1 rounded-lg";
      case "W trakcie realizacji":
        return "bg-yellow-500 text-white px-3 py-1 rounded-lg";
      default:
        return "bg-gray-500 text-white px-3 py-1 rounded-lg";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-primary-100 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Cześć Jan
        </h1>
        {/* Dane osobowe */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Dane osobowe
          </h2>
          <p className="mb-1">
            <span className="font-bold">Imię i nazwisko:</span> {user.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user.email}
          </p>
        </div>
        {/* Zamówienia */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Zamówienia
          </h2>
          <ul className="space-y-3">
            {user.orders.map((order) => (
              <li
                key={order.id}
                className="p-4 rounded-lg shadow-sm border"
              >
                <div className="mb-3">
                  <p className="font-bold">Data zamówienia: {order.date}</p>
                  <p className={`${getStatusClass(order.status)} inline-block mt-2`}>
                    {order.status}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Produkty:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {order.products.map((product) => (
                      <li key={product.id}>{product.title}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Recenzje */}
        <div>
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Recenzje
          </h2>
          <ul className="space-y-4">
            {user.reviews.map((review) => (
              <li
                key={review.id}
                className="p-4 rounded-lg shadow-sm"
              >
                <p className="font-bold">{review.book}</p>
                <p>{review.content}</p>
                <p className="text-yellow-500 font-semibold">
                  Ocena: {review.rating}/10
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
