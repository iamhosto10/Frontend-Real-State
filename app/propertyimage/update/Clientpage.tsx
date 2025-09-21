"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Camera,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

const Clientpage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const idProperty = searchParams.get("idProperty");
  const file = searchParams.get("file");
  const enabled = searchParams.get("enabled") === "true";

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<string>(file || "");
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/propertyimages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPropertyImage: id,
          idProperty,
          file: image,
          enabled: isEnabled,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar la imagen");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/properties/" + idProperty);
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al actualizar la imagen");
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
            <div className="p-3 bg-purple-500/10 rounded-full">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Editar Imagen
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica la imagen existente de la galería
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
                  ¡Imagen actualizada exitosamente!
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
                <h3 className="font-semibold">Error al actualizar imagen</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Camera className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-primary">
                  URL de la Imagen
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-semibold text-gray-700">
                      URL de la imagen *
                    </label>
                  </div>
                  <input
                    required
                    type="url"
                    name="file"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full px-4 py-4 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white/80 backdrop-blur-sm text-lg"
                  />
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Ingresa una URL válida de imagen (JPG, PNG, WEBP)
                  </p>
                </div>

                {image && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Vista Previa
                    </h4>
                    <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
                      <img
                        src={image}
                        alt="Vista previa de la imagen"
                        className="w-full max-h-64 object-cover"
                        onLoad={() => {}}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Válida
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-semibold text-gray-700">
                    ¿Activar imagen en la galería?
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={loading || success || !image.trim()}
                  size="lg"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 transition-colors shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Guardando...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      ¡Imagen Actualizada!
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
              <div className="bg-purple-50/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  La imagen se añadirá automáticamente a la galería de la
                  propiedad
                </p>
              </div>
            </div>
          </form>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Consejos para añadir imágenes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p>
                • <strong>Formato:</strong> Usa formatos JPG, PNG o WEBP
              </p>
              <p>
                • <strong>Calidad:</strong> Asegúrate de que la imagen sea clara
                y nítida
              </p>
            </div>
            <div className="space-y-2">
              <p>
                • <strong>Tamaño:</strong> Las imágenes muy grandes pueden
                tardar en cargar
              </p>
              <p>
                • <strong>URL:</strong> Debe ser una dirección web válida y
                accesible
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Después de añadir la imagen, serás redirigido automáticamente a la
            página de la propiedad
          </p>
        </div>
      </div>
    </div>
  );
};

export default Clientpage;
