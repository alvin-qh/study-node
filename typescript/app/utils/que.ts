type Gender = "M" | "F";

export class Person {
  private readonly name: string;
  private readonly gender: Gender;
  private readonly birthday: Date;

  constructor(name: string, gender: Gender, birthday: Date) {
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

export async function run(args: Array<string> = []) {
  const interval = (args?.length) ? parseInt(args[0]) : 500;

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
