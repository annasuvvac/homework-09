const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const pdf = require("html-pdf");
const questions = [
  {
    type: "input",
    message: "What's your GitHub username?",
    name: "username"
  },
  {
    type: "list",
    message: "Which color do you Perfer?",
    name: "color",
    choices: ["green", "blue", "pink","red"]
  }
]

inquirer
  .prompt(questions)
  .then(function(userInput){ //what's this function about?

  let userName = userInput.username;
  userName = userName.toLowerCase().trim();
  let userColor = userInput.color;

  let data = {
    username: userName,
    color: userColor
  }
    callAxios(data)
  });
  
function callAxios(data){
  const queryURL = `https://api.github.com/users/${data.username}`;
  axios.get(queryURL)
  .then(function(res){
    console.log(res);
    res.data.color = data.color;
    writeToHTML(res.data);  
  });
}

const generateHTML= require("./generateHTML");  

function writeToHTML(res){ 
  let htmlContent = generateHTML(res);
  writeFileAsync(`${res.name}_profile.html`, htmlContent);
  console.log("Successfully wrote to html!");
  printToPdf(htmlContent,res);
}

function printToPdf(html,res){
  let options = { format: 'Letter' };
  pdf.create(html, options).toFile(`${res.name}_profile.pdf`, function (err) {
    if (err)
      return console.log(err);
    console.log("Successfully printed to pdf!");
  });
}




