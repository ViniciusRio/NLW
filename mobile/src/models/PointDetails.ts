export interface PointDetails {
    point: {
        image: string,
        image_url: string,
        name: string,
        email: string,
        whatsapp: string
        city: string,
        uf: string
    };
    items: {
        title: string
    }[];
}