type Gender = 'M' | 'F';

export class Person extends Object {
    private readonly name: String;
    private readonly gender: Gender;
    private readonly birthday: Date;

    constructor(name: String, gender: Gender, birthday: Date) {
        super();
        this.name = name;
        this.gender = gender;
        this.birthday = birthday;
    }

    toString(): string {
        const birthday = `${this.birthday.getFullYear()}-${this.birthday.getMonth() + 1}-${this.birthday.getDate()}`;
        return `${this.name}, ${this.gender}, born on ${birthday}`;
    }
}


const persons: Array<Person> = [];

export function appendPerson(person: Person): void {
    persons.push(person);
}


let stopInterval: boolean = false;

export function stop() {
    stopInterval = true;
}

export function isStop() {
    return stopInterval;
}

export function hasPersonInQueue() {
    return persons.length > 0;
}

export async function main(args: Array<String> = []) {
    const interval = (args && args.length) ? parseInt(args[0] as string) : 500;

    return new Promise<void>((resolve) => {
        let timer = setInterval(() => {

            if (hasPersonInQueue()) {
                const person = persons.pop();
                console.log(`New person ${person} coming, welcome!!`);
            }

            if (stopInterval) {
                clearInterval(timer);
                timer = null;
                resolve();
            }
        }, interval);
    });
}
