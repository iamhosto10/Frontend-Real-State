"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Home, Users, Building, Search, Plus, Eye } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Building className="w-16 h-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Bienes Raíces
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Plataforma integral para la gestión de propiedades y propietarios.
            Encuentra, administra y conecta con el mundo inmobiliario de manera
            sencilla y eficiente.
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Propiedades Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-2 hover:border-primary/30">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors duration-300">
                <Home className="w-8 h-8 text-blue-600" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-primary">Propiedades</h2>
                <p className="text-gray-600 leading-relaxed">
                  Explora nuestro catálogo completo de propiedades. Busca,
                  filtra y encuentra la propiedad perfecta con información
                  detallada, imágenes y datos de contacto.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1" size="lg">
                  <Link href="/properties" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Ver Propiedades
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1" size="lg">
                  <Link
                    href="/properties/create"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Crear Nueva
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Propietarios Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-2 hover:border-primary/30">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors duration-300">
                <Users className="w-8 h-8 text-green-600" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-primary">
                  Propietarios
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Administra la información de todos los propietarios. Mantén
                  actualizada la base de datos con datos de contacto,
                  direcciones y propiedades asociadas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1" size="lg">
                  <Link href="/owner" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Ver Propietarios
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1" size="lg">
                  <Link
                    href="/owner/create"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Crear Nuevo
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/*
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mt-16">
          <h3 className="text-2xl font-bold text-center text-primary mb-8">
            Gestión Inmobiliaria Completa
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">
                Búsqueda Avanzada
              </h4>
              <p className="text-gray-600 text-sm">
                Filtra por nombre, dirección, rango de precios y más
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">
                Galería Visual
              </h4>
              <p className="text-gray-600 text-sm">
                Imágenes de alta calidad con carrusel interactivo
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">
                Gestión Integral
              </h4>
              <p className="text-gray-600 text-sm">
                Administra propiedades y propietarios en un solo lugar
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
