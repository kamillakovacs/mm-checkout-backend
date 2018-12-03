'use strict'

window.onload = () => {
  const URL = 'http://mm-checkout.us-east-1.elasticbeanstalk.com/daily-feedback';

  fetch(URL)
    .then(resp => resp.json())
    .then(response => {
      console.log(response);
      const parent = document.querySelector('.daily-feedback');
      const source = response.result;
      source.forEach(element => {
        let newChannel = document.createElement('li');
        parent.appendChild(newChannel);
        let newA = document.createElement('a')
        newA.setAttribute('href', `/checkouts/${element.channel}`);
        newChannel.appendChild(newA);
        newA.innerText = element.channel;
      });
    });
}
