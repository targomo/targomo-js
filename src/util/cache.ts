class SimpleLRUEntry<T> {
  constructor(public value: Promise<T>, public key: string, public previous: SimpleLRUEntry<T>, public next: SimpleLRUEntry<T>) {}
}

export interface Cache<T> {
  get(key: string, factory?: () => Promise<T>): Promise<T>
}

/**
 * Extremely simple LRU (to avoid includinng another library)...However when more functionality is needed then an existing library is better
 */
export class SimpleLRU<T> implements Cache<T> {
  private map: {[index: string]: SimpleLRUEntry<T>} = {}
  private size = 0
  private newest: SimpleLRUEntry<T>
  private oldest: SimpleLRUEntry<T>

  constructor(private capacity: number = 0) {
  }

  /**
   * If a value for a given key is contained in the cache then return that value
   * otherwise create/store and return a new value, by calling the given `factory` function
   *
   * @param key
   * @param factory
   */
  async get(key: string, factory?: () => Promise<T>): Promise<T> {
    const found = this.map[key]
    if (found !== undefined) {
      if (this.oldest == found && found.next) {
        this.oldest = found.next
      }

      if (found.next) {
        found.next.previous = found.previous
      }

      if (found.previous) {
        found.previous.next = found.next
      }

      found.previous = this.newest
      found.next = null
      this.newest = found

      try {
        return await found.value
      } catch (e) {
        this.map[key] = undefined
        return this.get(key, factory)
      }
    } else if (factory) {
      const promise = factory()
      const entry = this.map[key] = new SimpleLRUEntry<T>(promise, key, this.newest, null)
      const value = await promise

      if (this.newest) {
        this.newest.next = entry
      }

      this.newest = entry

      if (this.capacity) {
        if (this.size >= this.capacity) {
          const current = this.oldest

          if (current) {
            this.oldest = current.next
            delete this.map[current.key]
          }

        } else {
          this.size++
        }
      }

      if (!this.oldest) {
        this.oldest = this.newest
      }

      return value
    } else {
      return undefined
    }
  }
}


/**
 * Even simpler unlimited cache
 */
export class SimpleCache<T> implements Cache<T> {
  private map: {[index: string]: T} = {}

  async get(key: any, factory?: () => Promise<T>): Promise<T> {
    let keyString: string

    if (typeof key === 'string') {
      keyString = key
    } else {
      keyString = JSON.stringify(key)
    }

    if (this.map[keyString] != undefined) {
      return this.map[keyString]
    } else {
      const value = await factory()
      this.map[keyString] = value
      return value
    }
  }
}
