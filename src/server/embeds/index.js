import { Router } from 'express';

const embedsRouter = Router();

embedsRouter.get('/github/:id', (req, res) => {
  res.send(`<script src="https://gist.github.com/${req.params.id}.js"></script>`);
});

export default embedsRouter;
