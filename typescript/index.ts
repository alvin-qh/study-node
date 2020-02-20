import {appendPerson, main, Person, stop} from "./app";

main(['500'])
    .then(() => console.log('Process exit'));


const timer = setInterval(() => {
    const a = new Person('Alvin', 'F', new Date('1981-3-17'));
    appendPerson(a);
}, 1000);


const stdin = process.stdin;
stdin.on('readable', () => {
    stop();
    clearInterval(timer);
});
