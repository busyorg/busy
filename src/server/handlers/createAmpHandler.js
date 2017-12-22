import url from 'url';
import steemAPI from '../steemAPI';
import renderAmpPage from '../renderers/ampRenderer';

export default function createAmpHandler(template) {
  return function ampResponse(req, res) {
    steemAPI.sendAsync('get_content', [req.params.author, req.params.permlink]).then((result) => {
      if (result.id === 0) return res.sendStatus(404);
      const appUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
      });

      return res.send(renderAmpPage(result, appUrl, template));
    });
  };
}
