# ![logomakr_0zeodi](https://user-images.githubusercontent.com/3071208/50887134-a606fd00-13f2-11e9-8a7a-c90138074c6e.png)


[![npm](https://img.shields.io/npm/v/tarant-sync-router-express.svg)](https://www.npmjs.com/package/tarant-sync-router-express)
[![Build Status](https://travis-ci.org/tarantx/tarant-sync-router-express.svg?branch=master)](https://travis-ci.org/tarantx/tarant-sync-router-express)
[![Coverage Status](https://coveralls.io/repos/github/tarantx/tarant-sync-router-express/badge.svg?branch=master)](https://coveralls.io/github/tarantx/tarant-sync-router-express?branch=master)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![issues Welcome](https://img.shields.io/badge/issues-welcome-brightgreen.svg)
![npm](https://img.shields.io/npm/l/tarant-sync-router-express.svg)
![GitHub issues](https://img.shields.io/github/issues/tarantx/tarant-sync-router-express.svg)
![GitHub pull requests](https://img.shields.io/github/issues-pr/tarantx/tarant-sync-router-express.svg)
![Downloads](https://img.shields.io/npm/dt/tarant-sync-router-express.svg)

## Motivation

remote-sync server for bindings clients using routers or `tarant-sync-router-express`


## Installation

add it to your project using `npm install tarant-sync-router-express --save` or `yarn add tarant-sync-router-express`

## Usage

initialize your controllers/routers by calling the `SyncController` with the actor system and the wanted configuration. Adding them to your express app.

```js
import SyncController from "tarant-sync-router-express"
import { ActorSystem, ActorSystemConfigurationBuilder } from 'tarant'
import AppActor from '../AppActor'

const app: express.Application = express()
const port: number = 3002
const config : any  = {
      paths: {
          pull: "/pull", 
          push: "/push", 
      },
      actorTypes: { AppActor }
}

const system : any = ActorSystem.for(ActorSystemConfigurationBuilder.define().done())  

app.use(SyncController(system, config))

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
})
```

your actors will require to implement IUpdatable (UpdateFrom) and IExportable (toJson)

```js
import { Actor } from "tarant";
import { IUpdatable, IExportable } from "tarant-sync-router-express"

export default class AppActor extends Actor implements IUpdatable, IExportable {

  constructor(name: string) {
      super(name)
  }

  addOne() {
      this.counter++
  }

  toJson(){
        return {
            id: this.id,
            type:"AppActor",
            counter: this.counter
        }
    }

    updateFrom({ counter }: any): void {
        this.counter = counter
    }

    private counter = 1; 
}

```
## confiuration options

3. paths.pull: path to endpoint for pulling data from the backend
3. paths.push: path to endpoint for pushing data to the backend
4. ActorTypes: objects registering the type of actors that should be sync with the backend 

##### Created my free [logo](https://logomakr.com/0ZeODI) at <a href="http://logomakr.com" title="Logo Makr">LogoMakr.com</a> 
