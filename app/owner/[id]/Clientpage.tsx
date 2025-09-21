"use client";

import { IPropertyImage, IOwner, IProperty } from "@/lib/interface";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Home,
  Building,
} from "lucide-react";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/propertyCard/PropertyCard";
import { Card } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Clientpage = ({ id }: { id: string }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [filteredProperties, setFilteredProperties] = useState<IProperty[]>([]);

  const { data: owner, error: errorOwner } = useSWR<IOwner>(
    id ? `${apiUrl}/api/owners/${id}` : null,
    fetcher
  );
  const { data: properties } = useSWR<IProperty[]>(
    id ? `${apiUrl}/api/properties/by-owner/${id}` : null,
    fetcher
  );
  const { data: images } = useSWR<IPropertyImage[]>(
    `${apiUrl}/api/propertyimages`,
    fetcher
  );

  useEffect(() => {
    if (images && properties) {
      let filtered = properties as IProperty[];

      const withImages = filtered.map((p) => ({
        ...p,
        propertyImages: images?.filter(
          (img: IPropertyImage) => img.idProperty === p.idProperty
        ),
      }));

      const withOwners = withImages.map((p) => ({
        ...p,
        owner: owner as IOwner,
      }));

      setFilteredProperties(withOwners);
    }
  }, [images, owner, properties]);

  if (errorOwner)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full inline-block">
            <User className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-800">
            Error cargando propietario
          </h2>
          <p className="text-red-600">
            Hubo un problema al cargar los datos del propietario
          </p>
        </div>
      </div>
    );

  if (!owner)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full inline-block animate-pulse">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800">
            Cargando propietario...
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
          <Link href="/owner" className="flex items-center gap-2">
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
                  <img
                    src={owner.photo}
                    alt={owner.name}
                    className="w-32 h-32 rounded-full object-cover shadow-xl ring-6 ring-white"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="text-center md:text-left space-y-2 mt-4 md:mt-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    {owner.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                    <Building className="w-4 h-4" />
                    <span>
                      {filteredProperties.length} propiedad
                      {filteredProperties.length !== 1 ? "es" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Dirección</h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-10">
              {owner.address}
            </p>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Fecha de Nacimiento
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-10">
              {new Date(owner.birthday).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Propiedades</h2>
              <p className="text-gray-600">
                {filteredProperties.length > 0
                  ? `${filteredProperties.length} propiedad${
                      filteredProperties.length !== 1 ? "es" : ""
                    } registrada${filteredProperties.length !== 1 ? "s" : ""}`
                  : "No hay propiedades registradas"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="p-6 bg-gray-100 rounded-full inline-block">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-gray-700">
                    No hay propiedades registradas
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Este propietario aún no tiene propiedades asociadas en el
                    sistema
                  </p>
                </div>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <PropertyCard key={property.idProperty} property={property} />
              ))
            )}
          </div>
        </Card>

        {filteredProperties.length > 0 && (
          <Card className="bg-white/60 backdrop-blur-sm p-6 text-center">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-primary">
                Resumen del Propietario
              </h4>
              <p className="text-gray-600">
                {owner.name} tiene {filteredProperties.length} propiedad
                {filteredProperties.length !== 1 ? "es" : ""} registrada
                {filteredProperties.length !== 1 ? "s" : ""} en el sistema
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clientpage;
