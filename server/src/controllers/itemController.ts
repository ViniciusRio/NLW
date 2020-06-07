import knex from '../database/connection';
import { Response, Request } from 'express';

class ItemController {
    async index(request: Request, response:Response) {

        const items = await knex('items').select('*');
        const serializeItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`
            };
        });
    
        response.json(serializeItems)
    }
}

export default ItemController;