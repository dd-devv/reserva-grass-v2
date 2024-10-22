
export interface caracteristicasCancha {
    techado: boolean;
    canchas_futsal: number;
    canchas_voley: number;
    garaje: boolean;
    iluminacion: boolean;
    empresa: CanchaMain;
}

export interface CanchaMain {
    _id: string,
    nombre: string;
    direccion: string;
    ubicacion: string;
    referencia: string;
    portada: any;
}
interface portada {
    imagen?: string;
    _id?: string;
}

// export const CORE: CanchaMain[] = [
//     {
//         nombre: 'Cancha de fulbito',
//         direccion: 'Av. Los Alamos 123',
//         ubicacion: 'Villa Maria del Triunfo',
//         referencia: 'Frente a la comisaria',
//         portada: 'https://www.losandes.com.ar/files/image/2020/06/01/20200601111357_5ed4b1c5b1b1e.jpeg',
//         caracteristicas: [
//             {
//                 techado: true,
//                 canchasFutsal: 2,
//                 canchasVoley: 0,
//                 garaje: true,
//                 iluminacion: true
//             }
//         ]
//     },
// ]