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
    const namespace = 'some'
    const mockHelloValue = 'mock hello'
    const store = {
      state: { [namespace]: {} },
      commit: jest.fn(),
      registerModule: jest.fn(),
    }
    Object.defineProperty(store.state[namespace], 'hello', { get: jest.fn(() => mockHelloValue) })
    class SomeService extends BaseServuex {
      constructor() {
        super(namespace, store)
        this.hello = 'bar'
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

    it('decorates state props', () => {
      const someService = new SomeService()

      const descriptor = Object.getOwnPropertyDescriptor(someService, 'hello')

      expect(typeof descriptor.get).toEqual('function')
    })

    it('gets value from appropriate state property', () => {
      const someService = new SomeService()

      const mockValue = someService.hello

      expect(mockValue).toEqual(mockHelloValue)
    })

    it('calls to appropriate state prop on access', () => {
      const someService = new SomeService()

      // eslint-disable-next-line no-unused-vars
      const value = someService.hello
      const descriptor = Object.getOwnPropertyDescriptor(store.state[namespace], 'hello')

      expect(descriptor.get).toHaveBeenCalled()
    })

    it('calls commit method on value set', () => {
      const someService = new SomeService()
      const newValue = 'new value'

      someService.hello = newValue

      expect(store.commit).toHaveBeenCalledWith('set_hello', newValue)
    })
  })
})
