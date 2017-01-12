//Trivia Game JS_NH

document.addEventListener("DOMContentLoaded", function(){
//setting up global variables
var questionCount = 0;    
var correctAnswer;
var answerChoices;
var trivData;
var intervalID;
var timer = 10;
var timerDiv = document.getElementById("timer");
var right = 0;
var wrong = 0;
var missed = 0;
var rightDiv = document.getElementById("right");
var wrongDiv = document.getElementById("wrong");
var missedDiv = document.getElementById("missed");
var startButton=document.getElementById("startButton");
var qsArray = [];



  //Get the next Question from list: each is an Object!
  function nextQuestion(){

      console.log("Next Question/object iniated for Q:" + questionCount);
      $('#main').empty(); //empty main div

      var cat= $('<div id = "category">');
    
      $('#main').append(cat);

      var q= $('<div id = "question" >');

      $('#main').append(q);

      timer = 10;

    if(questionCount > 9){ //change this to final # when done testing
      return gameScore();
    }

    //Set up Q's array
    var qsArray = trivData[questionCount].incorrect_answers;
    console.log("These are the answer options (qsArray= .incorrect_answers): " + qsArray);
    correctAnswer = trivData[questionCount].correct_answer;
    qsArray.push(trivData[questionCount].correct_answer);
    console.log("updated qsArray: " + qsArray);

    // qsArray = shuffle(qsArray);

      timerDiv.innerHTML = "Time Remainig: " + timer + " Seconds";
      $('#category').html("Category: "+ trivData[questionCount].category);
      $('#question').html(trivData[questionCount].question);
    
        //ansOptions will be passed into onclick event
      ansOptions = document.getElementsByClassName("ansOptions");


    //creating ans divs and assigning each answer to its <div>:
    for(var i = 0; i < qsArray.length; i++) {
      
      $('#main').append('<div class = ansOptions id= ans' +[i]+' >');

      document.getElementById('ans'+ i).innerHTML = qsArray[i];
    }
      
      //call fxn to check answer
      answerOnClick(ansOptions);
      //then call start fxn which starts the countdown fxn
      start();
  }
  //Checking event/answer
  function answerOnClick(answers){
    Array.prototype.forEach.call(answers, function(element){
      element.onclick = function(){
        if(element.innerHTML === correctAnswer){
          stop();
          alertMessage("Correct!");
                    timer = 10;
          questionCount++;
          right++;
        }
        else {
          stop();
          alertMessage("Nope!");
          timer = 10;
          questionCount++;
          wrong++;

        }
      }
    })
  }


  function start(){
    intervalID = setInterval(countDown, 1000);
  }

  function countDown(){
    timer--;
    timerDiv.innerHTML = "Time Remainig: " + timer + " Seconds";
    if (timer === 0){
      stop();
      alertMessage("You're out of time");
      timer = 10;
      questionCount++;
      missed++;

    }
  }

  function stop(){
    clearInterval(intervalID);
  }
  //calling Trivia queston from open trivia database.
  function callTrivia(){
    var queryUrl = `https://opentdb.com/api.php?amount=10&category=22&type=multiple`;
    $.ajax({
      url: queryUrl,
      method: 'GET'
    }).done(function(response){
      trivData = response.results;
      console.log(trivData);
      console.log(response.results[questionCount]);
      nextQuestion();
    });
  }
  //fxn to call giphy with tag related to the correct answer
  function callGiphy(search){
    search = search.replace(' ','+');
    $.ajax({
      url: 'https://api.giphy.com/v1/gifs/search?',
      data: {
       api_key: 'dc6zaTOxFJmzC',
        q: search
      }

    }).done(function(response) {
      console.log("giphy data: " +response);
      giphy = response.data[1].images.fixed_height.url;
      document.getElementById("giphy").innerHTML = "<img src=" + giphy + ">";
    });
  }



  function alertMessage(message){
    //empty main div
    $('#main').empty(); 

    var a= $('<p id = response>').text(message +" The correct answer was: " + correctAnswer);
    //adding a break to have "message" on a different line from rest of text (like instructions)
    a.html(function(i,v){ return v.replace('The','<br>The');});
        $('#main').append(a);

    var b= $('<div id = giphy >');
    $('#main').append(b);

    callGiphy(correctAnswer);
    console.log("callGiphy fxn from alertMessage fxn 1st")

    setTimeout(nextQuestion, 4000);
    console.log("nextQuestion called from alertMessage fxn 2nd");
  }

  function gameScore(){
    console.log("gameScore called (q[i] surpassed limit)")
    timer = 10;
    timerDiv.innerHTML = "Time Remainig: " + timer + " Seconds";

    // pauseButton.disabled = true;
    // resumeButton.disabled = true;
    GameOver("All done, here's how you did:");
    questionCount=0;//This causes next quesion to try and use the first question object again.
  }

  function GameOver(message){

    stop();

    $('#main').empty(); //empty main div
    //create a variable to hold the element that displays the message
    var a= $('<p id = "gameResult">').text(message);
    //append to the main div   
    $('#main').append(a);

    var corrects= $('<div id = correct >').text("Correct Answers: "+ right);
    $('#main').append(corrects);

    var wrongs= $('<div id = wrong >').text("Incorect Answers: "+ wrong);
    $('#main').append(wrongs);

    var missedQs= $('<div id = missed >').text("Unanswered: "+ missed);
    $('#main').append(missedQs);

    var b= $('<div id = giphy >');
    $('#main').append(b);

    startButton=$('<button type = button class= btn-lg id = startButton>').text("Start Over ?");
    $('#main').append(startButton);

    if (right/questionCount > 0.75){
        callGiphy("Hooray");
        console.log("callGiphy fxn called from GameOver fxn");

    }
    else {
        callGiphy("game over");
        console.log("callGiphy fxn called from GameOver fxn");      
    }

    // I feel like this is redundant since a global startButton is declared and the  
    //  onclick fxn below should recognize this button....maybe necessary because after #main div is cleared, the 
    // new startButton variable is only visible in this fxn--not so for "right", "wrong" etc  
    // is the onclick fxn the issue?--
    var startButton=document.getElementById("startButton");
    startButton.onclick = function(){
      questionCount = 0;
      right = 0;
      wrong = 0;
      missed = 0;

      callTrivia();
      startButton.disabled=false;
    }
  
// .on("click") check out w3c validator.

  }

  // ----------------Clicking Start Button will start the game-------------------------------

    //Setting up startButton var and onclick function
    // var startButton=document.getElementById("startButton");

    startButton.onclick = function(){
      questionCount = 0;
      right = 0;
      wrong = 0;
      missed = 0;

      callTrivia();
      startButton.disabled=false;
    }

});