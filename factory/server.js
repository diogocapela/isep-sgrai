const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const env = app.get('env');

app.use(express.static(path.join(__dirname, 'src')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.listen(port, 'localhost', () => {
  console.log(
    `The server is now running at http://localhost:${port} in ${env} mode.\nPress CTRL-C to stop.\n`
  );
});
