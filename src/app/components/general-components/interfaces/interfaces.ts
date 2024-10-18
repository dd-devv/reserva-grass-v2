export interface Region {
  id: string;
  name: string;
}

export interface Provincia {
  id: string;
  name: string;
  department_id: string;
}

export interface Distrito {
  id: string;
  name: string;
  province_id: string;
}

export interface Empresa {
  _id: string;
  region: string;
  provincia: string;
  distrito: string;
}

export interface Caracteristica {
  empresa: {
    _id: string;
  };
}