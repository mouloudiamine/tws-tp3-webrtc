const express = require('express');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const app = express();
const port = process.env.PORT || 3000;
const mockResponse = {
  foo: 'bar',
  bar: 'foo',
};
app.get('/api', (req, res) => {
  res.send(mockResponse);
});

app.get('/', (req, res) => {
  res.status(200).sendFile(HTML_FILE);
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

app.use(express.static(DIST_DIR));
