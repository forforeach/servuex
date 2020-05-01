import { BaseServuex } from './base-servuex'

class Foo extends BaseServuex {
  constructor() {
    super('foo')
    this.a = 'a'
    this.initialize()
  }

  method() {
    return this.a
  }
}

// eslint-disable-next-line no-unused-vars
const foo = new Foo()
