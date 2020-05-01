/*  eslint-disable max-classes-per-file */
import { BaseServuex } from './base-servuex'

describe('BaseServuex: ', () => {
  describe('basic functionality', () => {
    it('defines BaseServuex class', () => {
      expect(BaseServuex).toBeDefined()
    })

    it('defines readonly namespace property', () => {
      const namespace = 'namespace'
      const service = new BaseServuex(namespace)

      expect(service.namespace).toBe(namespace)
    })
  })

  describe('core functionality', () => {
    class SomeService extends BaseServuex {
      constructor() {
        super('some')
        this.initialize()
      }

      someMethod(_foo, _bar, _num) {
        return this
      }
    }

    class SomeAnotherService extends SomeService {
      constructor() {
        super()
        this.foo = 100
        this.initialize()
      }

      get fooGetter() {
        return this.foo
      }

      someAnotherMethod() {
        return this
      }
    }

    it('decorates all methods of the instance', () => {
      const someService = new SomeService()

      someService.someMethod('foo', 'bar', 3)

      expect(someService.someMethod.name).not.toEqual('someMethod')
    })

    it('should decorate methods with async method', () => {
      const someService = new SomeService()

      const result = someService.someMethod('foo', 'bar', 3)

      expect(result).toBeInstanceOf(Promise)
    })

    it('should return value of the method after invoke', async () => {
      const someService = new SomeService()

      const result = await someService.someMethod('foo', 'bar', 3)

      expect(result).toEqual(someService)
    })

    it('decorates methods along the inheritance chain', async () => {
      const someAnotherService = new SomeAnotherService()

      const someResult = await someAnotherService.someMethod('foo', 'bar', 3)
      const someAnotherResult = await someAnotherService.someAnotherMethod()

      expect(someResult).toEqual(someAnotherService)
      expect(someAnotherResult).toEqual(someAnotherService)
    })
  })
})
