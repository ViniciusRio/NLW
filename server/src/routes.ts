import express from 'express';
import PointController from './controllers/pointController';
import ItemController from './controllers/itemController';
import multer from 'multer';
import multerCofing from './config/multer';

const routes =  express.Router();
const upload = multer(multerCofing);
const pointController = new PointController();
const itemController = new ItemController();


routes.get('/items', itemController.index);
routes.get('/points', pointController.index);
routes.get('/point/:id', pointController.show);
routes.get('kek', pointController.show);

routes.post('/points', upload.single('image'), pointController.store);

export default routes;