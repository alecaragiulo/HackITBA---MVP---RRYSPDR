'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Gift } from "lucide-react"; // Ícono para las recompensas

const products = [
  {
    id: 1,
    name: "Taza Personalizada",
    points: 10,
    description: "Taza de cerámica de 11oz",
  },
  {
    id: 2,
    name: "Bolígrafo Marrón",
    points: 20,
    description: "Bolígrafo de lujo con tinta negra",
  },
];

export default function RewardsStore() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const onRedeemPoints = async (userId, productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      const body = {
        userId,
        productId,
        businessId: 1,
        points: product.points,
      };

      const response = await fetch(`http://10.7.17.171:3001/redeem-points`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error al canjear los puntos");
      }
      alert("¡Canje exitoso! Disfruta tu recompensa.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-800 text-center flex items-center justify-center gap-2">
          <Gift className="w-6 h-6 text-indigo-600" />
          Tienda de Recompensas
        </h1>
      </header>

      {/* Lista de productos */}
      <div className="space-y-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="pt-6 pb-4 flex items-center gap-4">
              {/* Ícono circular con puntos */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                {product.points}
              </div>
              {/* Detalles */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-indigo-600 font-medium mt-1">{product.points} puntos</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => onRedeemPoints(userId, product.id)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm"
                disabled={!userId} // Deshabilitar si no hay userId
              >
                Canjear
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}