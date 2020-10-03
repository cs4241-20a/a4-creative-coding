import express from 'express';

const app = express();

app.use(express.static("./public", {extensions:['html']}));

app.listen(3000);