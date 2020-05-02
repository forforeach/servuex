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
    this.decorateActions(schema.actions)
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
            schema.actions[name] = descriptor.value
          } else if (typeof descriptor.get === 'function') {
            schema.getters[name] = descriptor.value
          } else {
            schema.state[name] = descriptor.value
            schema.mutations[this.getMutationName(name)] = function mutation(state, value) {
              state[name] = value
            }
          }
        })
      proto = Object.getPrototypeOf(proto)
    }
    return schema
  }

  createStoreModule(schema) {
    this.#store.registerModule(this.namespace, schema)
  }

  decorateActions(methods) {
    Object.entries(methods).forEach(([name, value]) => {
      if (!this[name].decorated) {
        const originalMethod = value
        this[name] = async function decorator(...params) {
          return originalMethod.apply(this, params)
        }.bind(this)
        this[name].decorated = true
      }
    })
  }

  decorateState(state) {
    Object.entries(state).forEach(([name]) => {
      Object.defineProperty(this, name, {
        configurable: false,
        enumerable: true,
        get() {
          return this.#store.state[this.#_namespace][name]
        },
        set(v) {
          this.#store.commit(`${this.namespace}/${this.getMutationName(name)}`, v)
        },
      })
    })
  }
}
