"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IOwner,
  IProperty,
  IPropertyImage,
  IPropertyTrace,
} from "@/lib/interface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  Code,
  Calendar,
  User,
  Camera,
  History,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ITrace {
  dateSale: string;
  name: string;
  value: string;
  tax: string;
}

export default function CreateProperty() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [owners, setOwners] = useState<IOwner[]>([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    price: "",
    codeInternal: "",
    year: "",
    idOwner: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [items, setItems] = useState([""]);
  const [traces, setTraces] = useState<ITrace[]>([
    { dateSale: "", name: "", value: "", tax: "" },
  ]);

  const handleChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const addInput = () => {
    setItems([...items, ""]);
  };

  const deleteInput = (index: number) => {
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
    }
  };

  const handleChangeTraces = (
    index: number,
    field: keyof ITrace,
    value: string
  ) => {
    const updated = [...traces];
    updated[index][field] = value;
    setTraces(updated);
  };

  const addTrace = () => {
    setTraces([...traces, { dateSale: "", name: "", value: "", tax: "" }]);
  };

  const deleteTrace = (index: number) => {
    const updated = traces.filter((_, i) => i !== index);
    setTraces(
      updated.length
        ? updated
        : [{ dateSale: "", name: "", value: "", tax: "" }]
    );
  };

  useEffect(() => {
    async function fetchOwners() {
      try {
        const res = await fetch(`${apiUrl}/api/owners`);
        const data = await res.json();
        setOwners(data);
      } catch (err) {
        console.error("Error fetching owners:", err);
      }
    }
    fetchOwners();
  }, [apiUrl]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const createProperty = async (
    property: Omit<IProperty, "idProperty" | "owner" | "propertyImages">
  ): Promise<Pick<IProperty, "idProperty">> => {
    const res = await fetch(`${apiUrl}/api/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al crear la propiedad");
    }

    return res.json();
  };

  const uploadImages = async (
    idProperty: string,
    items: string[]
  ): Promise<IPropertyImage[]> => {
    const validItems = items.filter((item) => item.trim() !== "");
    if (validItems.length === 0) return [];

    const requests = validItems.map((file) =>
      fetch(`${apiUrl}/api/propertyimages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProperty,
          file,
          enabled: true,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error("Error al subir imagen");
        return res.json() as Promise<IPropertyImage>;
      })
    );

    return Promise.all(requests);
  };

  const uploadTraces = async (
    idProperty: string,
    traces: Array<Omit<IPropertyTrace, "idPropertyTrace" | "idProperty">>
  ): Promise<IPropertyTrace[]> => {
    const validTraces = traces.filter(
      (t) => t.dateSale && t.name && t.value && t.tax
    );

    if (validTraces.length === 0) return [];

    const requests = validTraces.map((trace) =>
      fetch(`${apiUrl}/api/propertytraces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...trace,
          idProperty,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error("Error al subir trazabilidad");
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
      const propertyToCreate: Omit<
        IProperty,
        "idProperty" | "owner" | "propertyImages"
      > = {
        name: form.name,
        address: form.address,
        price: Number(form.price),
        codeInternal: form.codeInternal,
        year: Number(form.year),
        idOwner: form.idOwner,
      };

      const { idProperty } = await createProperty(propertyToCreate);

      await Promise.all([
        uploadImages(idProperty, items),
        uploadTraces(idProperty, traces),
      ]);

      setSuccess(true);
      setTimeout(() => {
        router.push("/properties");
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al crear la propiedad");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
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
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Crear Nueva Propiedad
              </h1>
              <p className="text-gray-600 mt-1">
                Completa la información para registrar una nueva propiedad
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
                  ¡Propiedad creada exitosamente!
                </h3>
                <p className="text-sm">
                  Redirigiendo al listado de propiedades...
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
                <h3 className="font-semibold">Error al crear propiedad</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Datos Generales
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Nombre *
                  </label>
                </div>
                <input
                  required
                  name="name"
                  placeholder="Nombre de la propiedad"
                  value={form.name}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Dirección *
                  </label>
                </div>
                <input
                  required
                  name="address"
                  placeholder="Dirección completa"
                  value={form.address}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Precio *
                  </label>
                </div>
                <input
                  required
                  type="number"
                  name="price"
                  placeholder="0"
                  value={form.price}
                  onChange={onChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Código Interno *
                  </label>
                </div>
                <input
                  required
                  name="codeInternal"
                  placeholder="Código único"
                  value={form.codeInternal}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Año *
                  </label>
                </div>
                <input
                  required
                  type="number"
                  name="year"
                  placeholder="Año de construcción"
                  value={form.year}
                  onChange={onChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    Propietario *
                  </label>
                </div>
                <select
                  required
                  name="idOwner"
                  value={form.idOwner}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
                >
                  <option value="">Selecciona un propietario</option>
                  {owners.map((owner) => (
                    <option key={owner.idOwner} value={owner.idOwner}>
                      {owner.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Camera className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Imágenes</h2>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                  {items.filter((item) => item.trim() !== "").length} imagen
                  {items.filter((item) => item.trim() !== "").length !== 1
                    ? "es"
                    : ""}
                </span>
              </div>
              <Button
                type="button"
                onClick={addInput}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((value, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      URL de la imagen {index + 1}
                    </label>
                    <input
                      type="url"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      placeholder={`https://ejemplo.com/imagen${index + 1}.jpg`}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  {value && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={value}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {items.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => deleteInput(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <History className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary">
                  Historial de Ventas
                </h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {
                    traces.filter(
                      (t) => t.dateSale && t.name && t.value && t.tax
                    ).length
                  }{" "}
                  venta
                  {traces.filter(
                    (t) => t.dateSale && t.name && t.value && t.tax
                  ).length !== 1
                    ? "s"
                    : ""}
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
                        Fecha
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
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={sale.name}
                        onChange={(e) =>
                          handleChangeTraces(index, "name", e.target.value)
                        }
                        placeholder="Nombre del comprador"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white/80"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Valor
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
                        Impuesto
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
          </Card>

          <div className="bg-blue-50/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Los campos marcados con (*) son obligatorios. Las imágenes y el
              historial de ventas son opcionales.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading || success}
              size="lg"
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando Propiedad...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ¡Propiedad Creada!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Crear Propiedad
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

        <Card className="bg-white/60 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Consejos para crear una propiedad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p>
                • <strong>Código interno:</strong> Debe ser único para cada
                propiedad
              </p>
              <p>
                • <strong>Imágenes:</strong> Usa URLs válidas de imágenes (JPG,
                PNG)
              </p>
            </div>
            <div className="space-y-2">
              <p>
                • <strong>Propietario:</strong> Debe estar registrado
                previamente
              </p>
              <p>
                • <strong>Historial:</strong> Solo se guardarán ventas con todos
                los campos completos
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
