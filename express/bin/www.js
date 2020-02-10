const express = require('express');
const config = require('../src/conf/conf');

const app = express();

config(app);

