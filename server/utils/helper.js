module.exports = {
  /**
   * Итератор для Promise
   * Итерирует n кол-во Promise, ожидает их выполнения
   * @param {any} n кол-во циклов
   * @param {function} cbPromise callback Promise
   * @returns {array} массив Promise
   */
  async timesAsync (n, cbPromise) {
    let i = 0
    const promises = []

    if (typeof n !== 'number' && !Array.isArray(n)) return

    if (typeof n === 'number') {
      while (i < n) {
        promises.push(cbPromise(i))
        i++
      }
    }

    if (Array.isArray(n)) {
      n.forEach((item, index) => {
        promises.push(cbPromise(index))
      })
    }

    try {
      await Promise.all(promises)
    } catch (err) {
      console.log('[timeAsync]', err)
    }
  }
}
