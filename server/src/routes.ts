import express from 'express';
import PointController from './controllers/pointController';
import ItemController from './controllers/itemController';

const routes =  express.Router();
const pointController = new PointController();
const itemController = new ItemController();


routes.get('/items', itemController.index);
routes.post('/points', pointController.store);
routes.get('/points', pointController.index);
routes.get('/point/:id', pointController.show);
routes.get('kek', pointController.show);


export default routes;