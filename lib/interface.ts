export interface IProperty {
  idProperty: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  propertyImages?: IPropertyImage[];
  owner: IOwner;
  idOwner: string;
}

export interface IPropertyImage {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
}

export interface IPropertyTrace {
  idPropertyTrace: string;
  idProperty: string;
  dateSale: string;
  name: string;
  value: number | string;
  tax: number | string;
}

export interface IOwner {
  idOwner: string;
  name: string;
  address: string;
  photo: string;
  birthday: string;
}
