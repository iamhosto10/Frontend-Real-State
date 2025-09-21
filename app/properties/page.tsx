"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { IOwner, IProperty, IPropertyImage } from "../../lib/interface";
import PropertyCard from "@/components/propertyCard/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  Plus,
  Filter,
  MapPin,
  DollarSign,
  Building,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PropertiesList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [filters, setFilters] = useState({
    name: "",
    address: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data, error } = useSWR(`${apiUrl}/api/properties`, fetcher);
  const { data: images } = useSWR(`${apiUrl}/api/propertyimages`, fetcher);
  const { data: owners } = useSWR(`${apiUrl}/api/owners`, fetcher);

  const [filteredProperties, setFilteredProperties] = useState<IProperty[]>([]);

  useEffect(() => {
    if (data && images && owners) {
      let filtered = data as IProperty[];

      if (filters.name) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.address) {
        filtered = filtered.filter((p) =>
          p.address.toLowerCase().includes(filters.address.toLowerCase())
        );
      }

      if (filters.minPrice) {
        filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
      }

      if (filters.maxPrice) {
        filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
      }

      const withImages = filtered.map((p) => ({
        ...p,
        propertyImages: images?.filter(
          (img: IPropertyImage) => img.idProperty === p.idProperty
        ),
      }));

      const withOwners = withImages.map((p) => ({
        ...p,
        owner: owners?.find((o: IOwner) => o.idOwner === p.idOwner),
      }));

      setFilteredProperties(withOwners);
    }
  }, [data, images, owners, filters]);

  const clearFilters = () => {
    setFilters({
      name: "",
      address: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const hasActiveFilters =
    filters.name || filters.address || filters.minPrice || filters.maxPrice;

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full inline-block">
            <Home className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-800">
            Error cargando propiedades
          </h2>
          <p className="text-red-600">Hubo un problema al cargar los datos</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full inline-block animate-pulse">
            <Home className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800">
            Cargando propiedades...
          </h2>
          <p className="text-blue-600">Por favor espera un momento</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="bg-white/80 hover:bg-white transition-colors"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Volver al Inicio
              </Button>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    Lista de Propiedades
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {data?.length || 0} propiedad
                    {data?.length !== 1 ? "es" : ""} disponible
                    {data?.length !== 1 ? "s" : ""} •{" "}
                    {filteredProperties.length} mostrada
                    {filteredProperties.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Link
                href="/properties/create"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Nueva Propiedad
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-full">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-primary">
              Filtros de Búsqueda
            </h2>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar Filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Nombre
                </label>
              </div>
              <input
                placeholder="Buscar por nombre..."
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Dirección
                </label>
              </div>
              <input
                placeholder="Buscar por dirección..."
                value={filters.address}
                onChange={(e) =>
                  setFilters({ ...filters, address: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Precio Mínimo
                </label>
              </div>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Precio Máximo
                </label>
              </div>
              <input
                type="number"
                placeholder="Sin límite"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Mostrando {filteredProperties.length} de {data?.length}{" "}
                propiedades
              </p>
            </div>
          )}
        </Card>

        {/* Empty State */}
        {data && data.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center space-y-6">
            <div className="p-6 bg-gray-100 rounded-full inline-block">
              <Home className="w-16 h-16 text-gray-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-700">
                No hay propiedades registradas
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Comienza agregando tu primera propiedad para gestionar el
                inventario inmobiliario
              </p>
            </div>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link
                href="/properties/create"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Primera Propiedad
              </Link>
            </Button>
          </div>
        ) : filteredProperties.length === 0 && hasActiveFilters ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center space-y-6">
            <div className="p-6 bg-orange-100 rounded-full inline-block">
              <Search className="w-16 h-16 text-orange-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-700">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No hay propiedades que coincidan con los filtros aplicados.
                Intenta ajustar los criterios de búsqueda.
              </p>
            </div>
            <Button onClick={clearFilters} variant="outline" size="lg">
              <X className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        ) : (
          /* Properties List */
          <div className="space-y-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.idProperty} property={property} />
            ))}
          </div>
        )}

        {/* Statistics Footer */}
        {filteredProperties.length > 0 && (
          <Card className="bg-white/60 backdrop-blur-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-primary">
                  {filteredProperties.length}
                </h4>
                <p className="text-gray-600 text-sm">
                  Propiedad{filteredProperties.length !== 1 ? "es" : ""}{" "}
                  mostrada{filteredProperties.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-primary">
                  $
                  {Math.round(
                    filteredProperties.reduce((acc, p) => acc + p.price, 0) /
                      filteredProperties.length
                  ).toLocaleString()}
                </h4>
                <p className="text-gray-600 text-sm">Precio promedio</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Building className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-primary">
                  {
                    new Set(filteredProperties.map((p) => p.owner?.idOwner))
                      .size
                  }
                </h4>
                <p className="text-gray-600 text-sm">
                  Propietario
                  {new Set(filteredProperties.map((p) => p.owner?.idOwner))
                    .size !== 1
                    ? "s"
                    : ""}{" "}
                  único
                  {new Set(filteredProperties.map((p) => p.owner?.idOwner))
                    .size !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
