import React from "react";
import { render, screen } from "@testing-library/react";
import PropertyCard from "./PropertyCard";
import { IProperty } from "@/lib/interface";
import "@testing-library/jest-dom";

jest.mock("next/link", () => {
  const ReactReq = require("react");
  return {
    __esModule: true,
    default: ({ children, href }: any) =>
      ReactReq.createElement("a", { href }, children),
  };
});

jest.mock("@/components/ui/carousel", () => {
  const ReactReq = require("react");
  return {
    __esModule: true,
    Carousel: ({ children }: any) =>
      ReactReq.createElement("div", null, children),
    CarouselContent: ({ children }: any) =>
      ReactReq.createElement("div", null, children),
    CarouselItem: ({ children }: any) =>
      ReactReq.createElement("div", null, children),
    CarouselDots: () =>
      ReactReq.createElement("div", { "data-testid": "dots" }),
  };
});

jest.mock("@/components/ui/card", () => {
  const ReactReq = require("react");
  return {
    __esModule: true,
    Card: ({ children, ...props }: any) =>
      ReactReq.createElement("div", props, children),
  };
});
jest.mock("@/components/ui/button", () => {
  const ReactReq = require("react");
  return {
    __esModule: true,
    Button: ({ children, asChild, ...props }: any) =>
      ReactReq.createElement("button", props, children),
  };
});

describe("PropertyCard", () => {
  const mockProperty: IProperty = {
    idProperty: "1",
    name: "Casa Bonita",
    address: "Calle Falsa 123",
    codeInternal: "ABC123",
    year: 2022,
    price: 500000,
    owner: {
      idOwner: "10",
      name: "Juan Pérez",
      address: "Otra Calle 456",
      photo: "",
      birthday: "",
    },
    idOwner: "10",
    propertyImages: [
      {
        idPropertyImage: "1342413",
        idProperty: "1",
        file: "/img1.jpg",
        enabled: true,
      },
      {
        idPropertyImage: "1342411312",
        idProperty: "1",
        file: "/img2.jpg",
        enabled: false,
      },
    ],
  };

  it("muestra el nombre de la propiedad", () => {
    render(React.createElement(PropertyCard, { property: mockProperty }));
    expect(screen.getByText("Casa Bonita")).toBeInTheDocument();
  });

  it("muestra la dirección", () => {
    render(React.createElement(PropertyCard, { property: mockProperty }));
    expect(screen.getByText("Calle Falsa 123")).toBeInTheDocument();
  });

  it("muestra el precio formateado con $", () => {
    render(React.createElement(PropertyCard, { property: mockProperty }));
    expect(screen.getByText(/\$\s*500[.,]000/)).toBeInTheDocument();
  });

  it("muestra al dueño", () => {
    render(React.createElement(PropertyCard, { property: mockProperty }));
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  it("muestra 'Sin imágenes' cuando no hay imágenes habilitadas", () => {
    const propSinImgs = { ...mockProperty, propertyImages: [] };
    render(React.createElement(PropertyCard, { property: propSinImgs }));
    expect(screen.getByText("Sin imágenes")).toBeInTheDocument();
  });
});
