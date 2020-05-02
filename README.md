# Servuex

_The more intuitive way to work with Vuex stores_

_____

[![Build Status](https://api.travis-ci.org/forforeach/servuex.svg?branch=master)](https://travis-ci.org/forforeach/servuex)
[![Coverage Status](https://coveralls.io/repos/github/forforeach/servuex/badge.svg?branch=master)](https://coveralls.io/github/forforeach/servuex?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Introduction

>[Vuex](https://vuex.vuejs.org/) is a state management pattern + library for [Vue.js](https://vuejs.org) applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion.

While the pattern is straight-forward, the API of the library is cumbersome. It requires learning a lot of concepts and understanding ways of interactions between them. It also forces you to work with lots of strings, which are hard to manage, and most probably, IntelliSense won't be supported.

The idea behind this library is to create an abstraction layer on top of a Vuex store with almost no new concepts. It aims to provide a simple way of working with the shared data, yet preserves the reactivity, time-travel debugging, modularization, and the rest of the great concepts of the store. 

This library doesn't try to replace a store but rather to sit on top of it and provide a better way of interacting with it.

## Instalation

`npm install --save servuex`

## Usage

First thing first we create a usual Vuex store instance:

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({ ... })
```

Then we can create our first Servuex. It should extend the BaseServuex, provide the namespace and the store to the parent constructor, and call the parent method `initialize`

```javascript
import { BaseServuex } from 'servuex'
import { store } from './path/to/store'

class UserService extends BaseServuex {
  constructor() {
    super('user', store)
    this.firstName = null
    this.lastName = null
    this.initialize()
  }
}
```

If we want to combine first and last names into a full name, we can do it by using regular getter function

```javascript
class UserService extends BaseServuex {
  
  // ...

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
```

Currently we don't have user data to work with. To get it we fetch the data from a service. We can do it using a regular method.

```javascript
class UserService extends BaseServuex {
  
  // ...

  async getUserData() {
    const { firstName, lastName} = await fetch('path/to/user/api')
    this.firstName = firstName
    this.lastName = lastName
  }
}
```
Behind the scenes every assignment to an instance property is committed to a store by auto-generated mutation, instance getters become store getters, and properties become store state. Each Servuex subclass creates a new module in a store, thus the namespace should be unique.

Check the example project [**here**](https://github.com/forforeach/servuex-example)


