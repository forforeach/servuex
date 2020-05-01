export class BaseServuex {
  #_namespace = null

  constructor(namespace) {
    this.#_namespace = namespace
  }

  get namespace() {
    return this.#_namespace
  }

  initialize() {
    const methods = this.getAllMethodNames()
    this.decorateMethods(methods)
  }

  getAllMethodNames() {
    let methods = {}
    let proto = this
    while (proto && proto.constructor !== BaseServuex) {
      const descriptors = Object.getOwnPropertyDescriptors(proto)
      const currentMethods = Object.entries(descriptors)
        .filter(([name, descriptor]) => typeof descriptor.value === 'function' && name !== 'constructor')
        .reduce((acc, [name, descriptor]) => {
          acc[name] = descriptor
          return acc
        }, {})
      methods = { ...currentMethods, ...methods }
      proto = Object.getPrototypeOf(proto)
    }
    return methods
  }

  decorateMethods(methods) {
    Object.entries(methods).forEach(([name, descriptor]) => {
      if (!this[name].decorated) {
        const originalMethod = descriptor.value
        this[name] = async function decorator(...params) {
          return originalMethod.apply(this, params)
        }.bind(this)
        this[name].decorated = true
      }
    })
  }
}
