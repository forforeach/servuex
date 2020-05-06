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
    let schema = {}
    const namespace = 'some'
    const mockHelloValue = 'mock hello'
    const store = {
      state: { [namespace]: {} },
      commit: jest.fn(),
      registerModule: jest.fn((_namespace, s) => (schema = s)),
    }
    Object.defineProperty(store.state[namespace], 'hello', { get: jest.fn(() => mockHelloValue) })
    class SomeService extends BaseServuex {
      constructor() {
        super(namespace, store)
        this.hello = 'bar'
        this.prop2 = 'childProp'
        this.initialize()
      }

      getThis() {
        return this
      }

      get innerGetter() {
        return 'innerGetter'
      }

      someMethod(_foo, _bar, _num) {
        return 'someMethod'
      }

      async someAsyncMethod() {
        return 'someAsyncMethod'
      }
    }

    class SomeAnotherService extends SomeService {
      constructor() {
        super()
        this.foo = 100
        this.prop1 = 'prop1'
        this.initialize()
      }

      get fooGetter() {
        return this.foo
      }

      someAnotherMethod() {
        return this
      }
    }

    it('preserves non-async methods of the instance as non-async', () => {
      const someService = new SomeService()

      const result = someService.someMethod('foo', 'bar', 3)

      expect(typeof result).toBe('string')
      expect(result).toEqual('someMethod')
    })

    it('preserves async methods of the instance as async', async () => {
      const someService = new SomeService()

      const result = someService.someAsyncMethod()
      const value = await result

      expect(result).toBeInstanceOf(Promise)
      expect(value).toBe('someAsyncMethod')
    })

    it('decorates methods along the inheritance chain', () => {
      const someAnotherService = new SomeAnotherService()

      const someResult = someAnotherService.getThis()
      const someAnotherResult = someAnotherService.someAnotherMethod()

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

      expect(store.commit).toHaveBeenCalledWith(`${namespace}/set_hello`, newValue)
    })

    it('calls commit that exists on the schema', () => {
      const someService = new SomeService()
      const newValue = 'new value'

      someService.hello = newValue
      const mutationName = store.commit.mock.calls[0][0].replace(`${namespace}/`, '')

      expect(schema.mutations[mutationName]).toBeDefined()
    })

    it('defines all instance methods as actions', () => {
      // eslint-disable-next-line no-unused-vars
      const someAnotherService = new SomeAnotherService()

      expect(Object.keys(schema.actions).length).toEqual(4)
    })

    it('defines all instance getters as getters', () => {
      // eslint-disable-next-line no-unused-vars
      const someAnotherService = new SomeAnotherService()

      expect(Object.keys(schema.getters).length).toEqual(4)
    })
  })
})
