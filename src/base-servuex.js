export class BaseServuex {

  #_namespace = null

  constructor(namespace) {
    this.#_namespace = namespace; 
  }

  get namespace() {
    return this.#_namespace
  }

  initialize() {
    const methodNames = this.getAllMethodNames()
    this.decorateMethods(methodNames)
  }

  getAllMethodNames() {
    let methodNames = new Set()
    let proto = this
    while (proto && proto.constructor !== BaseServuex) {
      const currentMethodNames = Object.getOwnPropertyNames(proto).filter(
        (property) =>
          typeof proto[property] === "function" && property !== "constructor"
      )
      methodNames = new Set([...methodNames, ...currentMethodNames])
      proto = Object.getPrototypeOf(proto)
    }
    return methodNames
  }

  decorateMethods(methodNames) {
    for (const methodName of methodNames) {
      if (!this[methodName].decorated) {
        const originalMethod = this[methodName]
        this[methodName] = async function decorator(...params) {
          return originalMethod.apply(this, params)
        }.bind(this)
        this[methodName].decorated = true
      }
    }
  }
}
