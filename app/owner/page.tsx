"use client";

import { IOwner } from "@/lib/interface";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Plus, Eye, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OwnersList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const { data: owners, error } = useSWR<IOwner[]>(
    `${apiUrl}/api/Owners`,
    fetcher
  );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full inline-block">
            <Users className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-800">
            Error cargando propietarios
          </h2>
          <p className="text-red-600">Hubo un problema al cargar los datos</p>
        </div>
      </div>
    );

  if (!owners)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full inline-block animate-pulse">
            <Users className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800">
            Cargando propietarios...
          </h2>
          <p className="text-blue-600">Por favor espera un momento</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
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
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    Lista de Propietarios
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {owners?.length || 0} propietario
                    {owners?.length !== 1 ? "s" : ""} registrado
                    {owners?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 transition-colors shadow-lg"
            >
              <Link href="/owner/create" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Nuevo Propietario
              </Link>
            </Button>
          </div>
        </div>

        {owners && owners.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center space-y-6">
            <div className="p-6 bg-gray-100 rounded-full inline-block">
              <Users className="w-16 h-16 text-gray-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-700">
                No hay propietarios registrados
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Comienza agregando tu primer propietario para gestionar las
                propiedades
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Link href="/owner/create" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Primer Propietario
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {owners?.map((owner: IOwner) => (
              <Card
                key={owner.idOwner}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-2 hover:border-green-300/50 overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <img
                        src={owner.photo}
                        alt={owner.name}
                        className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white group-hover:ring-green-200 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Eye className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-primary group-hover:text-green-600 transition-colors">
                      {owner.name}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="p-1 bg-gray-100 rounded-full mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 leading-relaxed">
                          {owner.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-1 bg-gray-100 rounded-full">
                        <Calendar className="w-3 h-3 text-gray-500" />
                      </div>
                      <p className="text-gray-500">
                        {new Date(owner.birthday).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:bg-green-50 group-hover:border-green-300 transition-colors"
                    >
                      <Link
                        href={`/owner/${owner.idOwner}`}
                        className="flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {owners && owners.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mt-8">
            <div className="text-center space-y-2">
              <h4 className="text-lg font-semibold text-primary">
                Gestión de Propietarios
              </h4>
              <p className="text-gray-600">
                Total de {owners.length} propietario
                {owners.length !== 1 ? "s" : ""} en el sistema
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
