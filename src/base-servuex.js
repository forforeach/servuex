export class BaseServuex {
  #_namespace = null

  #store = null

  constructor(namespace, store) {
    this.#_namespace = namespace
    this.#store = store
  }

  get namespace() {
    return this.#_namespace
  }

  initialize() {
    const schema = this.getStoreSchema()
    this.createStoreModule(schema)
    this.decorateState(schema.state)
  }

  getMutationName(name) {
    return `set_${name}`
  }

  getStoreSchema() {
    const schema = {
      namespaced: true,
      state: {},
      mutations: {},
      actions: {},
      getters: {},
    }
    let proto = this
    while (proto && proto.constructor !== BaseServuex) {
      const descriptors = Object.getOwnPropertyDescriptors(proto)
      Object.entries(descriptors)
        .filter(([name]) => name !== 'constructor')
        .forEach(([name, descriptor]) => {
          if (typeof descriptor.value === 'function' && name !== 'constructor') {
            schema.actions[name] = descriptor.value.bind(this)
          } else if (typeof descriptor.get === 'function') {
            schema.getters[name] = descriptor.get.bind(this)
          }
        })
      proto = Object.getPrototypeOf(proto)
    }
    Object.entries(this).forEach(([key, value]) => {
      schema.state[key] = value
      schema.mutations[this.getMutationName(key)] = function mutation(state, val) {
        state[key] = val
      }
    })
    return schema
  }

  createStoreModule(schema) {
    this.#store.registerModule(this.namespace, schema)
  }

  decorateState(state) {
    Object.entries(state).forEach(([name]) => {
      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        get: () => this.#store.state[this.#_namespace][name],
        set: (v) => {
          this.#store.commit(`${this.namespace}/${this.getMutationName(name)}`, v)
        },
      })
    })
  }
}
