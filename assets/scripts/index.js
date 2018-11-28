'use strict'

window.onload = () => {
  const URL = 'http://ec2-18-234-187-37.compute-1.amazonaws.com:3000/daily-feedback';


  fetch(URL)
    .then(resp => resp.json())
    .then(response => {
      console.log(response);
      const parent = document.querySelector('.ul');
      const source = response.result;
      source.forEach(element => {
        let newChannel = document.createElement('li');
        parent.appendChild(newChannel);
        let newA = document.createElement('a')
        newA.setAttribute('href', `/checkouts/${element.channel}`);
        newChannel.appendChild(newA);
        console.log(newA);
        newA.innerText = element.channel;

      });
    });
}
