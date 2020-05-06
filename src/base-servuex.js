import { AlreadyInitializedError } from './errors'
import { createStoreSchemaForInstance, decorateState } from './utils'

export class BaseServuex {
  #_namespace = null

  #store = null

  #initialized = false

  constructor(namespace, store) {
    this.#_namespace = namespace
    this.#store = store
  }

  get namespace() {
    return this.#_namespace
  }

  initialize() {
    if (this.#initialized) {
      throw new AlreadyInitializedError()
    }
    const schema = this.getStoreSchema()
    this.createStoreModule(schema)
    this.decorateState(schema.state)
    this.#initialized = true
  }

  getStoreSchema() {
    return createStoreSchemaForInstance(this, BaseServuex)
  }

  createStoreModule(schema) {
    this.#store.registerModule(this.namespace, schema)
  }

  decorateState(state) {
    decorateState(state, this, this.#_namespace, this.#store)
  }
}
