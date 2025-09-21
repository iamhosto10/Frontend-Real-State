"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  History,
  Plus,
  Trash2,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ITrace {
  dateSale: string;
  name: string;
  value: string;
  tax: string;
}

interface IPropertyTrace {
  idPropertyTrace: string;
  idProperty: string;
  dateSale: Date;
  name: string;
  value: number;
  tax: number;
}

const Clientpage = ({ id }: { id: string }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [traces, setTraces] = useState<ITrace[]>([
    { dateSale: "", name: "", value: "", tax: "" },
  ]);

  const handleChangeTraces = (
    index: number,
    field: keyof ITrace,
    value: string
  ) => {
    const updated = [...traces];
    updated[index][field] = value;
    setTraces(updated);
    if (error) setError(null);
  };

  const addTrace = () => {
    setTraces([...traces, { dateSale: "", name: "", value: "", tax: "" }]);
  };

  const deleteTrace = (index: number) => {
    const updated = traces.filter((_, i) => i !== index);

    setTraces(
      updated.length > 0
        ? updated
        : [{ dateSale: "", name: "", value: "", tax: "" }]
    );
  };

  const uploadTraces = async (
    idProperty: string,
    tracesData: ITrace[]
  ): Promise<IPropertyTrace[]> => {
    const validTraces = tracesData.filter(
      (t) => t.dateSale && t.name && t.value && t.tax
    );

    if (validTraces.length === 0) {
      return [];
    }

    const requests = validTraces.map((trace) =>
      fetch(`${apiUrl}/api/propertytraces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...trace,
          idProperty,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `Error al guardar la venta "${trace.name}"`
          );
        }
        return res.json() as Promise<IPropertyTrace>;
      })
    );

    return Promise.all(requests);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadTraces(id, traces);

      setSuccess(true);
      setTimeout(() => {
        router.push("/properties/" + id);
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al guardar las ventas");
      }
    } finally {
      setLoading(false);
    }
  };

  const validTracesCount = traces.filter(
    (t) => t.dateSale && t.name && t.value && t.tax
  ).length;

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
                Añadir Historial de Ventas
              </h1>
              <p className="text-gray-600 mt-1">
                Registra nuevas ventas asociadas a esta propiedad.
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
                  ¡Historial actualizado exitosamente!
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
                <h3 className="font-semibold">Error al guardar</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <History className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary">
                  Historial de Ventas
                </h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {validTracesCount} venta{validTracesCount !== 1 ? "s" : ""}
                </span>
              </div>
              <Button
                type="button"
                onClick={addTrace}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Venta
              </Button>
            </div>

            <div className="space-y-6">
              {traces.map((sale, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-700">
                      Venta #{index + 1}
                    </h4>
                    <Button
                      type="button"
                      onClick={() => deleteTrace(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha *
                      </label>
                      <input
                        type="date"
                        value={sale.dateSale}
                        onChange={(e) =>
                          handleChangeTraces(index, "dateSale", e.target.value)
                        }
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nombre Comprador *
                      </label>
                      <input
                        type="text"
                        value={sale.name}
                        onChange={(e) =>
                          handleChangeTraces(index, "name", e.target.value)
                        }
                        placeholder="Nombre completo"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Valor *
                      </label>
                      <input
                        type="number"
                        value={sale.value}
                        onChange={(e) =>
                          handleChangeTraces(index, "value", e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Impuesto *
                      </label>
                      <input
                        type="number"
                        value={sale.tax}
                        onChange={(e) =>
                          handleChangeTraces(index, "tax", e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Solo se guardarán las ventas que tengan todos los campos
              completos.
            </p>

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
                      Guardando...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      ¡Guardado!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Historial
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
