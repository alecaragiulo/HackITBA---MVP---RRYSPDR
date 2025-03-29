import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QRCodeSVG } from "qrcode.react";
import { Star } from "lucide-react"; // Ícono de estrella para los puntos

// Datos mockeados
const userData = {
  name: "Juan Pérez",
  points: 1250,
  redemptionHistory: [
    { id: 1, item: "Café Gratis", points: 100, date: "2025-03-28" },
    { id: 2, item: "Descuento 20%", points: 200, date: "2025-03-25" },
    { id: 3, item: "Combo Lunch", points: 500, date: "2025-03-20" },
    { id: 4, item: "Bebida Grande", points: 150, date: "2025-03-15" },
  ],
};

export default function UserDashboard() {
  const qrUrl = "http://10.7.17.171:3000/qr?userId=1";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col max-w-md mx-auto font-sans">
      {/* Header con nombre y puntos */}
      <Card className="mb-6 shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Hola, {userData.name}
          </CardTitle>
          <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-2 mt-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-semibold text-blue-600">
              {userData.points.toLocaleString()} Puntos
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
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Historial de Canjes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-380px)] pr-4">
            {userData.redemptionHistory.map((redemption) => (
              <div
                key={redemption.id}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{redemption.item}</p>
                  <p className="text-xs text-gray-500">{new Date(redemption.date).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}</p>
                </div>
                <p className="text-blue-600 font-semibold text-sm">
                  -{redemption.points} pts
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}