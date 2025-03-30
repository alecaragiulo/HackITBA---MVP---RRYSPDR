"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, Trash2, QrCode } from "lucide-react";
// Importa el componente Scanner o déjalo para integrarlo más adelante
// import { Scanner } from '@yudiel/react-qr-scanner';

export default function CompanyDashboard() {
  // Lista inicial de productos (puedes cargarla desde una API)
  const [products, setProducts] = useState([
    { id: 1, name: "Café Gratis", value: 100 },
    { id: 2, name: "Descuento 20%", value: 200 },
    { id: 3, name: "Combo Lunch", value: 500 },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  // Funciones CRUD
  const addProduct = () => {
    setEditProduct({ id: null, name: "", value: "" });
    setIsEditing(true);
  };

  const editProductFunc = (product) => {
    setEditProduct(product);
    setIsEditing(true);
  };

  const deleteProduct = (id) => {
    // Podrías agregar una confirmación antes de eliminar
    setProducts(products.filter((p) => p.id !== id));
  };

  const saveProduct = () => {
    if (editProduct.id) {
      // Actualizamos el producto existente
      setProducts(products.map((p) => (p.id === editProduct.id ? editProduct : p)));
    } else {
      // Creamos un nuevo producto (usamos Date.now() como id)
      const newProduct = { ...editProduct, id: Date.now() };
      setProducts([...products, newProduct]);
    }
    setIsEditing(false);
    setEditProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-blue-100 p-6 flex flex-col max-w-4xl mx-auto font-sans">
      {/* Header / Navbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src="https://icongr.am/entypo/leaf.svg?size=40&color=%2325E96F"
            alt="Icono de hoja"
            className="mr-3"
          />
          <h1 className="text-3xl font-bold text-gray-800">Panel de Productos</h1>
        </div>
      </div>

      {/* Tarjeta con listado de productos */}
      <Card className="mb-6 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Mis Productos</CardTitle>
          <Button
            onClick={addProduct}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl shadow-md"
          >
            <Plus className="w-5 h-5" /> Agregar Producto
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-gray-100 rounded-xl p-4 mb-4 shadow-sm"
              >
                <div>
                  <p className="text-xl font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">Valor: {product.value} pts</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => editProductFunc(product)}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </Button>
                  <Button
                    onClick={() => deleteProduct(product.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modal para agregar/editar producto */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editProduct.id ? "Editar Producto" : "Agregar Producto"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Valor (pts)</label>
              <input
                type="number"
                value={editProduct.value}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    value: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditProduct(null);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para escanear código QR */}
      {qrDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Escanear Código QR</h2>
              <button
                onClick={() => setQrDialogOpen(false)}
                className="text-gray-600 hover:text-gray-800 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            {/* Aquí podrías integrar el componente <Scanner /> */}
            <div className="flex justify-center items-center">
              <p className="text-gray-500">[Componente Scanner aquí]</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
