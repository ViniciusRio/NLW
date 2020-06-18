import express from 'express';
import PointController from './controllers/pointController';
import ItemController from './controllers/itemController';
import multer from 'multer';
import multerCofing from './config/multer';
import {celebrate, Joi} from 'celebrate'

const routes =  express.Router();
const upload = multer(multerCofing);
const pointController = new PointController();
const itemController = new ItemController();


routes.get('/items', itemController.index);
routes.get('/points', pointController.index);
routes.get('/point/:id', pointController.show);
routes.get('kek', pointController.show);

routes.post(
    '/points',
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }),
    pointController.store);

export default routes;