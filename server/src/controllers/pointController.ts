import knex from '../database/connection';
import { Response, Request } from 'express';

class PointController {

    async index (request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',').map(item => Number(item.trim()));


        const points = await knex('points')
            .join('points_items', 'points_items.point_id', '=', 'points.id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializePointsImage = points.map(point => { 
            return {
                ...points,
                image_url: `http://192.168.100.8:3333/uploads/${point.image}`

            }
        });

            return response.json(serializePointsImage);
    }
    async store (request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
        // evita que consultas que dependem executem caso uma falhe
        const trx = await knex.transaction();


        const point = { 
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
         };
        // retorna o id do item criado
        const insertedPointsId = await trx('points').insert(point);

        const point_id = insertedPointsId[0];


        const pointsItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    point_id,
                    item_id
                };
            });
    
        await trx('points_items').insert(pointsItems);

        await trx.commit();

    return response.json({ 
            id: point_id,
            ...point
     });

    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();
        if (!point) {
            return response.status(400).json({ message: 'Point not found.' });
        };
        
        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title');

            const serializePoint = {
                ...point,
                image_url: `http://192.168.100.8:3333/uploads/${point.image}`
            };
        

        return response.json({ point: serializePoint, items });
    }


}

export default PointController;