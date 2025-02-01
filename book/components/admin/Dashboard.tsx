import { Card, CardHeader, CardBody } from "@nextui-org/react";

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Układ kart w gridzie Tailwind */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Karta nr 1 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-700">
              Ilość zamówień
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">123</p>
          </CardBody>
        </Card>

        {/* Karta nr 2 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-700">
              Ilość produktów
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">45</p>
          </CardBody>
        </Card>

        {/* Karta nr 3 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-700">
              Nowi użytkownicy
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">5</p>
          </CardBody>
        </Card>

        {/* Karta nr 4 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-700">
              Przychód (PLN)
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">1500 zł</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};


export default DashboardPage;
