'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { QRCodeSVG } from "qrcode.react";
import { Star } from "lucide-react"; // Ícono de estrella para los puntos
import Swal from 'sweetalert2';

const userId = "user1";
// Datos mockeados
const userData = {
  name: "Lionel Messi",
};

export default function UserDashboard() {
  const qrUrl = `${userId}`;
  const [rewards, setRewards] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [rewardsFiltradas, setRewardsFiltradas] = useState([]);
  const [rewardSeleccionada, setRewardSeleccionada] = useState(null);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [points, setPoints] = useState(1250);
  const [redemptionHistory, setRedemptionHistory] = useState([]);

  const canjearRecompensa = async (userId, productId, valor) => {
    if (points < valor) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No tienes suficientes puntos para canjear esta recompensa.',
      });
      return;
    }
    try {
      // Generar un código aleatorio de 6 caracteres (letras y números)
      const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
      };

      const randomCode = generateRandomCode();

      const product = rewards.find((p) => p.id === productId);
      const body = {
        userId,
        productId: product.descripcion,
        businessId: `${empresaSeleccionada.nombre}`,
        points: -(product.valor),
        code: randomCode,
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
      setPoints((prevPoints) => prevPoints - valor);
      setRedemptionHistory((prevHistory) => [
        {
          id: Date.now(),
          productId: product.descripcion,
          businessId: empresaSeleccionada.nombre,
          points: -valor,
          date: new Date().toISOString(),
        },
        ...prevHistory,
      ]);
      Swal.fire(
        'Canjeado!',
        `Su ECOdigo es: ${randomCode}. Muestrelo en caja para canjear su recompensa.`,
        'success'
      );
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    // Fetch para las transacciones del usuario (redemptionHistory)
    fetch(`https://10.7.17.122:3001/transactions/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las transacciones');
        }
        return response.json();
      })
      .then(data => {
        console.log('Transacciones obtenidas:', data);
        setRedemptionHistory(data);
      })
      .catch(error => {
        console.error('Error al fetchear transacciones:', error);
      });

    // Fetch para obtener todas las recompensas
    fetch('https://10.7.17.122:3001/rewards')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las recompensas');
        }
        return response.json();
      })
      .then(data => {
        console.log('Recompensas obtenidas:', data);
        setRewards(data);
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
      });

    // Fetch para obtener los negocios
    fetch('https://10.7.17.122:3001/businesses')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los negocios');
        }
        return response.json();
      })
      .then(data => {
        console.log('Negocios obtenidos:', data);
        setEmpresas(data);
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
      });
  }, []);

  // useEffect para manejar la apertura del modal de SweetAlert
  useEffect(() => {
    if (showConfirmar && rewardSeleccionada) {
      Swal.fire({
        title: 'Confirmar Canje',
        text: `Va a canjear ${rewardSeleccionada.valor} puntos por ${rewardSeleccionada.descripcion}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Canjear',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          canjearRecompensa(userId, rewardSeleccionada.id, rewardSeleccionada.valor);
        }
        // Reseteamos el estado para evitar reabrir el modal
        setShowConfirmar(false);
      });
    }
  }, [showConfirmar, rewardSeleccionada]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col max-w-md mx-auto font-sans">
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>
          <img src="https://icongr.am/entypo/leaf.svg?size=40&color=%2325E96F" alt="Icono de hoja" />
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>ECOmmunity</h1>
        </div>
        {/* Header con nombre y puntos */}
        <Card className="mb-6 shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Hola, {userData.name}
            </CardTitle>
            <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-2 mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-semibold text-blue-600">
                {points.toLocaleString()} Puntos
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* Botón QR */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="w-full mb-6 py-6 text-lg font-medium rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
            >
              Ver Código QR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90%] rounded-2xl p-6 bg-white shadow-xl">
            <DialogTitle></DialogTitle>
            <div className="flex flex-col items-center gap-4">
              <QRCodeSVG
                value={qrUrl}
                size={220}
                level="H"
                includeMargin={true}
                className="rounded-lg border-4 border-blue-100 p-2 bg-white"
              />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800">{userData.name}</p>
                <p className="text-sm text-gray-500">Escanea para canjear</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Historial de canjes */}
        <Card className="flex-1 shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent>
            <Tabs defaultValue="history">
              <TabsList className="flex justify-center space-x-4 border-b">
                <TabsTrigger value="history" className="px-4 py-2 font-medium">
                  Historial
                </TabsTrigger>
                <TabsTrigger value="rewards" className="px-4 py-2 font-medium">
                  Recompensas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <ScrollArea className="h-[calc(100vh-380px)] pr-4">
                  {redemptionHistory.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{redemption.productId}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(redemption.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })} . {redemption.businessId}
                        </p>
                      </div>
                      <p className="text-blue-600 font-semibold text-sm">
                        {redemption.points} pts
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="rewards">
                {empresaSeleccionada ? (
                  <>
                    {/* Vista detalle de la empresa seleccionada */}
                    <div className="flex items-center py-3">
                      <button
                        onClick={() => {
                          setEmpresaSeleccionada(null);
                          setRewardsFiltradas([]);
                        }}
                        className="mr-2"
                      >
                        ←
                      </button>
                      <img
                        src={empresaSeleccionada.icono}
                        alt={empresaSeleccionada.nombre}
                        style={{
                          marginRight: "10px",
                          width: "25px",
                          height: "25px",
                          borderRadius: "50%"
                        }}
                      />
                      <p className="font-medium">{empresaSeleccionada.nombre}</p>
                    </div>

                    <ScrollArea className="h-[calc(100vh-380px)]">
                      {rewardsFiltradas.map((reward) => (
                        <div
                          onClick={() => {
                            setRewardSeleccionada(reward);
                            setShowConfirmar(true);
                          }}
                          key={reward.id}
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#E2EAF4",
                            borderRadius: "10px",
                            padding: "10px",
                            marginBottom: "10px"
                          }}
                          className="flex justify-between items-center py-3 cursor-pointer"
                        >
                          <p className="font-medium text-gray-800">{reward.descripcion}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <p className="font-medium text-gray-800">{reward.valor}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </>
                ) : (
                  // Vista de listado de empresas
                  <ScrollArea className="h-[calc(100vh-380px)]">
                    {empresas.map((empresa) => (
                      <div
                        key={empresa.id}
                        style={{ backgroundColor: "#E2EAF4", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}
                        className="flex justify-between items-center py-3 cursor-pointer"
                        onClick={() => {
                          setEmpresaSeleccionada(empresa);
                          setRewardsFiltradas(
                            rewards.filter((reward) => reward.local === empresa.nombre)
                          );
                        }}
                      >
                        <div className="flex items-center">
                          <img
                            src={empresa.icono}
                            alt={empresa.nombre}
                            style={{
                              marginRight: "10px",
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%"
                            }}
                          />
                          <p>{empresa.nombre}</p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
