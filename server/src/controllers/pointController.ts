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

            return response.json(points);
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
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
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

        const pointsItems = items.map((item_id: number) => {
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
        const trx = await knex.transaction();

        const point = await trx('points').where('id', id).first();
        const items = await trx('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('title');
        
        if (!point) {
            return response.status(400).json({ message: 'Point not found.' });
        };

        return response.json({ point, items });
    }


}

export default PointController;