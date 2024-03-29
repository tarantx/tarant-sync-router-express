import SyncController from '../lib/index'
import { ActorSystem } from 'tarant'
import Actor from 'tarant/dist/actor-system/actor'
import * as request from 'supertest'
import * as express from 'express'
import { faker } from '@faker-js/faker'
import { json } from 'body-parser'

class FakeActor extends Actor {}
let config: any = {
  sync: {
    active: true,
    delay: 1000,
  },
  paths: {
    pull: '/pull',
    push: '/push',
  },
  actorTypes: { FakeActor },
}
describe('index exports function that returns  express router', () => {
  let supertest: any
  let app: express.Express

  beforeEach(() => {
    app = express()
    app.use(json())
    supertest = request(app)
  })

  function setupController(system: ActorSystem) {
    const controller = SyncController(system, config)
    app.use(controller)
  }

  describe('pull', () => {
    it('should pull actor data if found', async () => {
      const id = faker.datatype.uuid(),
        expectedresult = { stuff: faker.datatype.uuid() },
        ActorSystemMock: any = {
          actorFor: jest.fn(),
        }

      let system: ActorSystem = jest.fn<ActorSystem, []>(() => ActorSystemMock)()
      setupController(system)
      ActorSystemMock.actorFor.mockResolvedValue({
        toJson: () => Promise.resolve(expectedresult),
      })

      const result = await supertest.get(`${config.paths.pull}/${id}`)
      expect(result.body).toEqual(expectedresult)
      expect(result.statusCode).toEqual(200)
    })

    it('should return 404 if unable to find actor', async () => {
      const id = faker.datatype.uuid(),
        ActorSystemMock: any = {
          actorFor: jest.fn(),
        }

      let system: ActorSystem = jest.fn<ActorSystem, []>(() => ActorSystemMock)()
      setupController(system)
      ActorSystemMock.actorFor.mockRejectedValue('')

      const result = await supertest.get(`${config.paths.pull}/${id}`)

      expect(ActorSystemMock.actorFor).toHaveBeenCalledWith(id)
      expect(result.statusCode).toEqual(404)
    })
  })

  describe('push', () => {
    it('should update state of an actor', async () => {
      const id = faker.datatype.uuid(),
        body = { stuff: faker.datatype.uuid(), type: 'FakeActor' },
        ActorSystemMock: any = {
          resolveOrNew: jest.fn(),
        },
        ActorMock = {
          updateFrom: jest.fn(),
        }

      let system: ActorSystem = jest.fn<ActorSystem, []>(() => ActorSystemMock)()
      setupController(system)
      ActorSystemMock.resolveOrNew.mockResolvedValue(ActorMock)

      const result = await supertest.post(`${config.paths.push}/${id}`).send(body)

      expect(ActorSystemMock.resolveOrNew).toHaveBeenCalledWith(id, FakeActor, [id])
      expect(ActorMock.updateFrom).toHaveBeenCalledWith(body)
      expect(result.statusCode).toEqual(200)
    })
  })
})
