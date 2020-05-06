import { BaseServuex } from '../../src/base-servuex'

export class MockServuex extends BaseServuex {
  constructor(namespace, store) {
    super(namespace, store)
    this.mockProp1 = 'mockProp1'
    this.mockProp2 = 'mockProp2'
    this.initialize()
  }

  get mockGetter1() {
    return 'mockGetter1'
  }

  get mockGetter2() {
    return 'mockGetter2'
  }


  getThis() {
    return this
  }


  mockMethod(_foo, _bar, _num) {
    return 'mockMethod'
  }

  async mockAsyncMethod() {
    return 'mockAsyncMethod'
  }
}
