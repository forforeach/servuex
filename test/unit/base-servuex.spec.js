
import { BaseServuex } from '../../src/base-servuex'
import { AlreadyInitializedError } from '../../src/errors'

import { MockServuex } from '../mocks/mock-servuex'
import { ParentServuex } from '../mocks/parent-servuex'

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
    const mockValue = 'mock mockProp1'
    const store = {
      state: { [namespace]: {} },
      commit: jest.fn(),
      registerModule: jest.fn((_namespace, s) => (schema = s)),
    }
    Object.defineProperty(store.state[namespace], 'mockProp1', { get: jest.fn(() => mockValue) })

    it('preserves non-async methods of the instance as non-async', () => {
      const childServuex = new MockServuex(namespace, store)

      const result = childServuex.mockMethod('foo', 'bar', 3)

      expect(typeof result).toBe('string')
      expect(result).toEqual(childServuex.mockMethod.name)
    })

    it('preserves async methods of the instance as async', async () => {
      const childServuex = new MockServuex(namespace, store)

      const result = childServuex.mockAsyncMethod()
      const value = await result

      expect(result).toBeInstanceOf(Promise)
      expect(value).toBe('mockAsyncMethod')
    })

    it('decorates state props', () => {
      const childServuex = new MockServuex(namespace, store)

      const descriptor = Object.getOwnPropertyDescriptor(childServuex, 'mockProp1')

      expect(typeof descriptor.get).toEqual('function')
    })

    it('gets value from appropriate state property', () => {
      const childServuex = new MockServuex(namespace, store)

      const value = childServuex.mockProp1

      expect(value).toEqual(mockValue)
    })

    it('calls to appropriate state prop on access', () => {
      const childServuex = new MockServuex(namespace, store)

      // eslint-disable-next-line no-unused-vars
      const value = childServuex.mockProp1
      const descriptor = Object.getOwnPropertyDescriptor(store.state[namespace], 'mockProp1')

      expect(descriptor.get).toHaveBeenCalled()
    })

    it('calls commit method on value set', () => {
      const childServuex = new MockServuex(namespace, store)

      const newValue = 'new value'

      childServuex.mockProp1 = newValue

      expect(store.commit).toHaveBeenCalledWith(`${namespace}/set_mockProp1`, newValue)
    })

    it('updates right property on commit', () => {
      // eslint-disable-next-line no-unused-vars
      const childServuex = new MockServuex(namespace, store)

      const newValue = 'new value'

      schema.mutations.set_mockProp2(schema.state, newValue)

      expect(schema.state.mockProp2).toBe(newValue)
    })

    it('calls commit that exists on the schema', () => {
      const childServuex = new MockServuex(namespace, store)

      const newValue = 'new value'

      childServuex.mockProp1 = newValue
      const mutationName = store.commit.mock.calls[0][0].replace(`${namespace}/`, '')

      expect(schema.mutations[mutationName]).toBeDefined()
    })

    it('throws when initialize method is called more then once per instance', () => {
      const childServuex = new MockServuex(namespace, store)

      expect(() => childServuex.initialize()).toThrow(AlreadyInitializedError)
    })

    it('decorates methods along the inheritance chain', () => {
      const parentServuex = new ParentServuex(namespace, store)

      const thisRef = parentServuex.childMethod()
      const result = parentServuex.parentMethod()

      expect(thisRef).toEqual(parentServuex)
      expect(result).toEqual(parentServuex)
    })

    it('defines all instance methods as actions', () => {
      // eslint-disable-next-line no-unused-vars
      const parentServuex = new ParentServuex(namespace, store)

      expect(Object.keys(schema.actions).length).toEqual(3)
    })

    it('defines all instance getters as getters', () => {
      // eslint-disable-next-line no-unused-vars
      const parentServuex = new ParentServuex(namespace, store)

      expect(Object.keys(schema.getters).length).toEqual(4)
    })
  })
})
