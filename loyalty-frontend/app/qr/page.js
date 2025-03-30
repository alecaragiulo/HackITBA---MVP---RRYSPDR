'use client';

import { useSearchParams } from "next/navigation";
import { Gift } from "lucide-react"; // Ícono para las recompensas
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { QRCodeSVG } from "qrcode.react";
import { Star } from "lucide-react"; // Ícono de estrella para los puntos
import { Scanner } from '@yudiel/react-qr-scanner';

const businessId = "McDonald's";


export default function RewardsStore() {

  const [data, setData] = useState(null);
  const [productos, setProductos] = useState(null);

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const fetchProducts = async (businessId) => {
    try {
      // Hacer la petición GET al endpoint que obtiene los productos
      const response = await fetch(`https://10.7.17.122:3001/products/${businessId}`, { mode: 'cors' });
  
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('Product not found');
      }
  
      // Convertir la respuesta en JSON
      const data = await response.json();

      setProductos(data);

    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };
  
  useEffect(() => {
    fetchProducts(businessId);
  }, []);

  const onQrScan = (result) => {

    setData(result);
  };

  const onRedeemPoints = async (userId, productId) => {
    try {
      const product = productos.find((p) => p.id === productId);
      const body = {
        userId,
        productId,
        businessId,
        points: product.points,
      };

      const response = await fetch(`https://10.7.17.122:3001/redeem-points`, {
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
    setTimeout(() => {
      window.location.href = "https://10.7.17.122/qr";
    }, 2000);
  };
  

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col max-w-md mx-auto font-sans">
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>
          <img src="https://icongr.am/entypo/leaf.svg?size=40&color=%2325E96F" alt="Icono de hoja" />
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>ECOmmunity</h1>
        </div>
        {/* Header con nombre y puntos */}
        <Card className="mb-2 shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Hola
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Botón QR */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full mb-6 py-6 text-lg font-medium rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
            >
              Escanear Código QR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90%] rounded-2xl p-6 bg-white shadow-xl">
            <DialogTitle></DialogTitle>
            <div className="flex flex-col items-center gap-4">
              <Scanner onScan={onQrScan} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

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
        {productos.map((product) => (
          <Card
            key={product.id}
            className="bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="pt-6 pb-4 flex items-center gap-4">
              {/* Ícono circular con puntos */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                {product.puntos}
              </div>
              {/* Detalles */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{product.id}</h3>
                <p className="text-indigo-600 font-medium mt-1">{product.puntos} puntos</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => onRedeemPoints(data.userId, product.id)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm"
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