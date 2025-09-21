"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  MapPin,
  Camera,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function CreateOwner() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    address: "",
    photo: "",
    birthday: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          photo: form.photo,
          birthday: form.birthday,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear propietario");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/owner");
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al crear el propietario");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <Button
            variant="outline"
            className="mb-6 bg-white/80 hover:bg-white transition-colors shadow-md"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Crear Nuevo Propietario
              </h1>
              <p className="text-gray-600 mt-1">
                Completa la información para registrar un nuevo propietario
              </p>
            </div>
          </div>
        </div>

        {success && (
          <Card className="bg-green-50/80 backdrop-blur-sm border-2 border-green-200 p-6">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">
                  ¡Propietario creado exitosamente!
                </h3>
                <p className="text-sm">
                  Redirigiendo al listado de propietarios...
                </p>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Error al crear propietario</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <label className="text-sm font-semibold text-gray-700">
                    Nombre Completo *
                  </label>
                </div>
                <input
                  required
                  name="name"
                  placeholder="Ingresa el nombre completo"
                  value={form.name}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-full">
                    <MapPin className="w-4 h-4 text-red-600" />
                  </div>
                  <label className="text-sm font-semibold text-gray-700">
                    Dirección *
                  </label>
                </div>
                <input
                  required
                  name="address"
                  placeholder="Ingresa la dirección completa"
                  value={form.address}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Camera className="w-4 h-4 text-purple-600" />
                  </div>
                  <label className="text-sm font-semibold text-gray-700">
                    URL de Foto *
                  </label>
                </div>
                <input
                  required
                  type="url"
                  name="photo"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={form.photo}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
                {form.photo && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                    <img
                      src={form.photo}
                      alt="Vista previa"
                      className="w-20 h-20 rounded-full object-cover shadow-md border-4 border-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <label className="text-sm font-semibold text-gray-700">
                    Fecha de Nacimiento *
                  </label>
                </div>
                <input
                  required
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={onChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="bg-blue-50/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Los campos marcados con (*) son obligatorios
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading || success}
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando Propietario...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ¡Propietario Creado!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Propietario
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                size="lg"
                className="bg-white/80 hover:bg-white transition-colors"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Consejos para crear un propietario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p>
                • <strong>Nombre:</strong> Ingresa el nombre completo del
                propietario
              </p>
              <p>
                • <strong>Dirección:</strong> Incluye ciudad, estado y código
                postal
              </p>
            </div>
            <div className="space-y-2">
              <p>
                • <strong>Foto:</strong> Usa una URL válida de imagen (JPG, PNG)
              </p>
              <p>
                • <strong>Fecha:</strong> Asegúrate de que la fecha sea correcta
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
