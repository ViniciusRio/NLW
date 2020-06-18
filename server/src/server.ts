import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';

import { errors } from 'celebrate';


const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express
    .static(path.resolve(__dirname, 'uploads', 'items')));
app.use('/uploads', express
    .static(path.resolve(__dirname, 'uploads', 'points')));
app.get('/users', (request, response) => {
    response.json({ message: 'Hello Worrld' });
});

app.use(errors());

app.listen(3333);