import { Request, Response, Router } from 'express'
import { ActorSystem } from 'tarant'

const SyncController = (system: ActorSystem, config: any): Router => {
  console.log(config.actorTypes)
  const router: Router = Router()

  router.get(`${config.paths.pull}/:id`, async (req: Request, res: Response) => {
    console.log('get', req.params.id)
    try {
      const actor = (await system.actorFor(req.params.id)) as any
      res.json(await actor.toJson())
      console.log('get result', actor)
    } catch (_) {
      console.log('get error')
      res.sendStatus(404)
    }
  })

  router.post(`${config.paths.push}/:id`, async (req: Request, res: Response) => {
    let actor: any
    try {
      actor = await system.actorFor(req.params.id)
    } catch (_) {
      actor = await system.actorOf(config.actorTypes[req.body.type], [req.params.id])
    }
    console.log('here', actor, (actor as any).updateFrom) 
    actor.updateFrom(req.body)
    console.log('here2')
    res.sendStatus(200)
  })

  return router
}

export default SyncController
