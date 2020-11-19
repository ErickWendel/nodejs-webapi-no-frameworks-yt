class Hero {
    constructor({ name, age, power }) {
        this.id = Math.floor(Math.random() * 100) + Date.now()
        this.name = name
        this.age = age
        this.power = power
    }

    isValid() {
        const propertyNames = Object.getOwnPropertyNames(this)
        const amountInvalid = propertyNames
            .map(property => (!!this[property]) ? null : `${property} is missing`)
            .filter(item => !!item)

        return {
            valid: amountInvalid.length === 0,
            error: amountInvalid
        }
    }
}

// const h1 = new Hero({ id: 1, name: 'Erick', age: 2, power: 'ae' })
// const h2 = new Hero({ id: 1, age: 2, power: 'ae' })

// console.log('h1 valid', h1.isValid())
// console.log('h2 valid', h2.isValid())

module.exports = Hero