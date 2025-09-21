"use client";

import {
  IOwner,
  IProperty,
  IPropertyImage,
  IPropertyTrace,
} from "@/lib/interface";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  PlusIcon,
  Home,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Code,
  Camera,
  History,
  Edit,
  Trash2,
  Building,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Clientpage = ({ id }: { id: string }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [deletingTrace, setDeletingTrace] = useState<string | null>(null);

  const { data: property, error: errorProperty } = useSWR<IProperty>(
    id ? `${apiUrl}/api/properties/${id}` : null,
    fetcher
  );
  const { data: images } = useSWR<IPropertyImage[]>(
    id ? `${apiUrl}/api/propertyImages/by-property/${id}` : null,
    fetcher
  );
  const { data: traces } = useSWR<IPropertyTrace[]>(
    id ? `${apiUrl}/api/propertyTraces/by-property/${id}` : null,
    fetcher
  );
  const { data: owner } = useSWR<IOwner>(
    property && property.idOwner
      ? `${apiUrl}/api/owners/${property.idOwner}`
      : null,
    fetcher
  );

  const deleteImage = async (idImage: string) => {
    setDeletingImage(idImage);
    try {
      const response = await fetch(`${apiUrl}/api/propertyImages/${idImage}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error eliminando la imagen:", error);
    } finally {
      setDeletingImage(null);
    }
  };

  const deleteTrace = async (idTrace: string) => {
    setDeletingTrace(idTrace);
    try {
      const response = await fetch(`${apiUrl}/api/propertyTraces/${idTrace}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error eliminando el rastro:", error);
    } finally {
      setDeletingTrace(null);
    }
  };

  if (errorProperty)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full inline-block">
            <Home className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-800">
            Error cargando propiedad
          </h2>
          <p className="text-red-600">
            Hubo un problema al cargar los datos de la propiedad
          </p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full inline-block animate-pulse">
            <Home className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800">
            Cargando propiedad...
          </h2>
          <p className="text-blue-600">Por favor espera un momento</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <Button
          variant="outline"
          asChild
          className="bg-white/80 hover:bg-white transition-colors shadow-md"
        >
          <Link href="/properties" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Listado
          </Link>
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm border-2 shadow-xl overflow-hidden">
          <div className="relative">
            <div className="h-20"></div>

            <div className="relative px-6 md:px-8 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-full shadow-xl ring-6 ring-white flex items-center justify-center">
                    {images && images.length > 0 ? (
                      <img
                        src={images[0].file}
                        className="size-full rounded-full"
                      />
                    ) : (
                      <Building className="w-16 h-16 text-blue-600" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="text-center md:text-left space-y-2 mt-4 md:mt-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                    <Code className="w-4 h-4" />
                    <span className="font-mono">{property.codeInternal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Información de la Propiedad
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-full mt-0.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Dirección
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {property.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full mt-0.5">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Precio
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    ${property?.price?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full mt-0.5">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Año</p>
                  <p className="text-gray-700">{property.year}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-full">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Información del Propietario
              </h3>
            </div>

            {owner ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={owner.photo}
                    alt={owner.name}
                    className="w-16 h-16 rounded-full object-cover shadow-md ring-4 ring-white"
                  />
                  <div className="flex-1">
                    <Link href={`/owner/${owner.idOwner}`} className="block">
                      <h4 className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2">
                        {owner.name}
                        <ExternalLink className="w-4 h-4" />
                      </h4>
                    </Link>
                    <p className="text-gray-600">{owner.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="p-4 bg-gray-100 rounded-full inline-block">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mt-2">
                  Información del propietario no disponible
                </p>
              </div>
            )}
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-full">
              <Camera className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Galería de Imágenes
            </h2>
            <span className="ml-auto bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
              {images?.filter((img: IPropertyImage) => img.enabled).length || 0}{" "}
              imágenes
            </span>
          </div>

          {images && images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images
                .filter((img: IPropertyImage) => img.enabled)
                .map((img: IPropertyImage) => (
                  <div key={img.idPropertyImage} className="group space-y-4">
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={img.file}
                        alt={`Imagen ${img.idPropertyImage}`}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 bg-white/80 hover:bg-white"
                      >
                        <Link
                          href={{
                            pathname: "/propertyimage/update",
                            query: {
                              id: img.idPropertyImage,
                              idProperty: property.idProperty,
                              file: img.file,
                              enabled: img.enabled,
                            },
                          }}
                          className="flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteImage(img.idPropertyImage)}
                        disabled={deletingImage === img.idPropertyImage}
                        className="flex-1"
                      >
                        {deletingImage === img.idPropertyImage ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 mr-1" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}

              <Link
                href={"/propertyimage/create/" + property.idProperty}
                className="group flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/50 transition-all duration-300"
              >
                <div className="p-4 bg-gray-100 group-hover:bg-purple-100 rounded-full transition-colors duration-300">
                  <PlusIcon className="w-8 h-8" />
                </div>
                <p className="mt-2 font-medium">Añadir Imagen</p>
              </Link>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="p-6 bg-gray-100 rounded-full inline-block">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-gray-700">
                  No hay imágenes disponibles
                </h4>
                <p className="text-gray-500 max-w-md mx-auto">
                  Añade la primera imagen de esta propiedad para mostrar su
                  atractivo visual
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link
                  href={"/propertyimage/create/" + property.idProperty}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Añadir Primera Imagen
                </Link>
              </Button>
            </div>
          )}
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-full">
              <History className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Historial de Ventas
            </h2>
            <span className="ml-auto bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {traces?.length || 0} registro{traces?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {traces && traces.length > 0 ? (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                      <th className="text-left px-6 py-4 font-semibold">
                        Fecha
                      </th>
                      <th className="text-left px-6 py-4 font-semibold">
                        Nombre
                      </th>
                      <th className="text-left px-6 py-4 font-semibold">
                        Valor
                      </th>
                      <th className="text-left px-6 py-4 font-semibold">
                        Impuestos
                      </th>
                      <th className="text-center px-6 py-4 font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {traces.map((trace: IPropertyTrace, index: number) => (
                      <tr
                        key={trace.idPropertyTrace}
                        className={`${
                          index % 2 === 0 ? "bg-white/80" : "bg-gray-50/80"
                        } hover:bg-blue-50/80 transition-colors`}
                      >
                        <td className="px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {new Date(trace.dateSale).toLocaleDateString(
                              "es-ES"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-medium">
                          {trace.name}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <span className="text-green-700 font-bold">
                            ${Number(trace.value).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <span className="text-orange-700 font-medium">
                            ${Number(trace.tax).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="bg-white/80 hover:bg-white"
                            >
                              <Link
                                href={{
                                  pathname: "/propertytrace/update",
                                  query: {
                                    id: trace.idPropertyTrace,
                                    idProperty: property.idProperty,
                                    name: trace.name,
                                    dateSale: trace.dateSale,
                                    value: trace.value,
                                    tax: trace.tax,
                                  },
                                }}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Editar
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteTrace(trace.idPropertyTrace)}
                              disabled={deletingTrace === trace.idPropertyTrace}
                            >
                              {deletingTrace === trace.idPropertyTrace ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Eliminar
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <Link
                  href={"/propertytrace/create/" + property.idProperty}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Añadir Nueva Venta
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="p-6 bg-gray-100 rounded-full inline-block">
                <History className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-gray-700">
                  No hay historial de ventas
                </h4>
                <p className="text-gray-500 max-w-md mx-auto">
                  Registra la primera venta de esta propiedad para comenzar el
                  seguimiento
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Link
                  href={"/propertytrace/create/" + property.idProperty}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Registrar Primera Venta
                </Link>
              </Button>
            </div>
          )}
        </Card>

        {traces && traces.length > 0 && (
          <Card className="bg-white/60 backdrop-blur-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-primary">
                  $
                  {Math.max(
                    ...traces.map((t) => Number(t.value))
                  ).toLocaleString()}
                </h4>
                <p className="text-gray-600 text-sm">Venta más alta</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <History className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-primary">
                  {traces.length}
                </h4>
                <p className="text-gray-600 text-sm">Total de ventas</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-primary">
                  {new Date(
                    Math.max(
                      ...traces.map((t) => new Date(t.dateSale).getTime())
                    )
                  ).getFullYear()}
                </h4>
                <p className="text-gray-600 text-sm">Última venta</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clientpage;
