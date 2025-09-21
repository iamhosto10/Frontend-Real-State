import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IProperty } from "@/lib/interface";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Code,
  DollarSign,
  User,
  Eye,
  ExternalLink,
} from "lucide-react";

interface IPropertyCardProps {
  property: IProperty;
}

const PropertyCard = ({ property }: IPropertyCardProps) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-2 hover:border-blue-300/50 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="w-full lg:w-1/2">
          {property.propertyImages && property.propertyImages.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {property.propertyImages?.map(
                  (image, index) =>
                    image.enabled && (
                      <CarouselItem key={index}>
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={image.file}
                            alt={property.name}
                            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </CarouselItem>
                    )
                )}
              </CarouselContent>
              <CarouselDots className="mt-4" />
            </Carousel>
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="p-4 bg-gray-300 rounded-full inline-block">
                  <Eye className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-500 font-medium">Sin imágenes</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-3">
            <h2 className="font-bold text-2xl lg:text-3xl text-primary group-hover:text-blue-600 transition-colors">
              {property.name}
            </h2>

            {property.owner && (
              <Link
                href={`/owner/${property.owner?.idOwner}`}
                className="inline-block"
              >
                <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group-hover:bg-blue-50 px-3 py-1 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{property.owner?.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="p-2 bg-purple-100 rounded-full mt-0.5">
                <Code className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Código</p>
                <p className="text-gray-700 font-mono">
                  {property.codeInternal}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full mt-0.5">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Año</p>
                <p className="text-gray-700">{property.year}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full mt-0.5">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Precio</p>
                <p className="text-2xl font-bold text-green-700">
                  ${property.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button
              asChild
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors shadow-md group-hover:shadow-lg"
            >
              <Link
                href={`/properties/${property.idProperty}`}
                className="flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Detalles Completos
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
