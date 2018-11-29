const app = require('./app');
const PORT = 'http://ec2-18-234-187-37.compute-1.amazonaws.com:3000';

app.listen(PORT, () => {
  console.log(`App is up and running on port ${PORT}`);
});
