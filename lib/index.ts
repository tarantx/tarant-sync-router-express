import { Request, Response, Router } from 'express'
import { ActorSystem } from 'tarant'

const SyncController = (system: ActorSystem, config: any): Router => {
  const router: Router = Router()

  router.get(`${config.paths.pull}/:id`, async (req: Request, res: Response) => {
    try {
      const actor = (await system.actorFor(req.params.id)) as any
      res.json(await actor.toJson())
    } catch (_) {
      res.sendStatus(404)
    }
  })

  router.post(`${config.paths.push}/:id`, async (req: Request, res: Response) => {
    try {
      const actor: any = await system.resolveOrNew(req.params.id, config.actorTypes[req.body.type], [req.params.id])
      actor.updateFrom(req.body)
      res.sendStatus(200)
    } catch (error) {
      res.send(500)
    }
  })

  return router
}

export default SyncController
