const { math } = require('@alvin/lib');
const show = require('@alvin/output');

let result = math.add(10, 20);
show(`* add result is ${result}`);

result = math.sub(10, 20);
show(`* sub result is ${result}`);
