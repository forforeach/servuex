/*  eslint-disable max-classes-per-file */

class BaseServuexError extends Error {
  constructor(message) {
    super(`Servuex: ${message}`)
    const constructor = Object.getPrototypeOf(this).constructor
    this.name = constructor.name
  }
}

export class AlreadyInitializedError extends BaseServuexError {
  constructor() {
    super('servuex instance was already initialized for the current instance')
  }
}
