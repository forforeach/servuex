/*  eslint-disable max-classes-per-file */
import { BaseServuex } from '../../src/base-servuex'

class ChildServuex extends BaseServuex {
  constructor(namespace, store) {
    super(namespace, store)
    this.childProp1 = 'childProp1'
    this.childProp2 = 'childProp2'
  }

  get childGetter1() {
    return 'childGetter1'
  }

  get childGetter2() {
    return 'childGetter2'
  }

  childMethod() {
    return this
  }

  async childAsyncMethod() {
    return 'childAsyncMethod'
  }
}

export class ParentServuex extends ChildServuex {
  constructor(namespace, store) {
    super(namespace, store)
    this.parentProp1 = 'parentProp1'
    this.parentProp2 = 'parentProp2'
    this.initialize()
  }

  get parentGetter1() {
    return 'parentGetter1'
  }

  get parentGetter2() {
    return 'parentGetter2'
  }

  parentMethod() {
    return this
  }
}
