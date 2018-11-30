'use strict'

window.onload = () => {
  const URL = `http://localhost:3000/daily-feedback`;

  fetch(URL)
    .then(resp => resp.json())
    .then(response => {
      console.log(response);
      console.log('hello')
      response.result.forEach(element => {
        const newPage = document.implementation.createHTMLDocument(element.channel);
        console.log(newPage)
      });
      // const newpage = document.implementation.createDocument('thispage');
  });
}
