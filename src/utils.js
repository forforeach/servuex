const getMutationName = (name) => `set_${name}`

export const createStoreSchemaForInstance = (instance, lastInstanceType = Object) => {
  const schema = {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {},
    getters: {},
  }
  let proto = instance
  while (proto && proto.constructor !== lastInstanceType) {
    const descriptors = Object.getOwnPropertyDescriptors(proto)
    Object.entries(descriptors)
      .filter(([name]) => name !== 'constructor')
      .forEach(([name, descriptor]) => {
        if (typeof descriptor.value === 'function' && name !== 'constructor') {
          schema.actions[name] = descriptor.value.bind(instance)
        } else if (typeof descriptor.get === 'function') {
          schema.getters[name] = descriptor.get.bind(instance)
        }
      })
    proto = Object.getPrototypeOf(proto)
  }
  Object.entries(instance).forEach(([key, value]) => {
    schema.state[key] = value
    schema.mutations[getMutationName(key)] = function mutation(state, val) {
      state[key] = val
    }
  })
  return schema
}

export const decorateState = (state, instance, namespace, store) => {
  Object.entries(state).forEach(([name]) => {
    Object.defineProperty(instance, name, {
      configurable: true,
      enumerable: true,
      get: () => store.state[namespace][name],
      set: (v) => {
        store.commit(`${namespace}/${getMutationName(name)}`, v)
      },
    })
  })
}
