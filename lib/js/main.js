const axios = require('axios');
const date = new Date();
const fs = require('fs');

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${year}/${month}/${day}`;


function getData() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('https://api.myquran.com/v1/sholat/jadwal/1624/'+currentDate);
      resolve(response.data);
    } catch (error) {
      reject(null);
    }
  });
}

function getRunningText() {
  return new Promise((resolve, reject) => {
    const myData = './public/data/runningText.json';
    const rawData = fs.readFileSync(myData);
    const jsonData = JSON.parse(rawData);
    resolve(jsonData);
  });
}

function getMediaSlide(){
  return new Promise((resolve, reject) => {
    const myData = './public/data/media.json';
    const rawData = fs.readFileSync(myData);
    const jsonData = JSON.parse(rawData);
    resolve(jsonData);
  });
}

module.exports = {
    getData,
    getRunningText,
    getMediaSlide
};