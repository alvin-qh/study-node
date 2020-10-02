function add(a, b) {
    return a + b;
}

class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    
    toString() {
        return `name: ${this.name}, age: ${this.age}, gender: ${this.gender}`;
    }
}

module.exports.add = add;
module.exports.Person = Person;
