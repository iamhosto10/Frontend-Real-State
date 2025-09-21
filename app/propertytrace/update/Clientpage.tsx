"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  History,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ITraceForm {
  dateSale: string;
  name: string;
  value: string;
  tax: string;
}

interface IClientpageProps {
  id: string;
  idProperty: string | null;
  name: string | null;
  dateSale: string | null;
  value: string | null;
  tax: string | null;
}

const Clientpage = ({
  id,
  dateSale,
  idProperty,
  name,
  tax,
  value,
}: IClientpageProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<ITraceForm>({
    dateSale: dateSale ? new Date(dateSale).toISOString().split("T")[0] : "",
    name: name || "",
    value: value || "",
    tax: tax || "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/propertytraces/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPropertyTrace: id,
          idProperty: idProperty,
          dateSale: form.dateSale,
          name: form.name,
          value: Number(form.value),
          tax: Number(form.tax),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar la venta");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/properties/" + idProperty);
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al actualizar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <Button
            variant="outline"
            className="mb-6 bg-white/80 hover:bg-white transition-colors shadow-md"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Propiedad
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <History className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Editar Venta
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica los detalles del registro de venta.
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
                  ¡Venta actualizada exitosamente!
                </h3>
                <p className="text-sm">Redirigiendo a la propiedad...</p>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Error al actualizar</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-full">
                <History className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Detalles de la Venta
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Venta *
                </label>
                <input
                  required
                  type="date"
                  name="dateSale"
                  value={form.dateSale}
                  onChange={onChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre del Comprador *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valor *
                </label>
                <input
                  required
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={onChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Impuesto *
                </label>
                <input
                  required
                  type="number"
                  name="tax"
                  value={form.tax}
                  onChange={onChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={loading || success}
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Guardando Cambios...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      ¡Actualizado!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
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
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Clientpage;
