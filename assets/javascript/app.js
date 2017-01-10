var questionCount = 0;    //Nahir JS
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
var pauseButton = document.getElementById("pause");
var resumeButton = document.getElementById("resume");
var giphy;
var qsArray = [];



//Get the next Question from list: each is an Object!
function nextQuestion(){

  console.log("Next Question/object:");
    $('#main').empty(); //empty main div

    var cat= $('<div id = "category">');
  
    $('#main').append(cat);

    var q= $('<div id = "question" >');

    $('#main').append(q);

  timer = 10;

  if(questionCount > 4){ //change this to final # when done testing
    return gameScore();
  }
  //Set up Q's array
  var qsArray = trivData[questionCount].incorrect_answers;
  console.log("These are the answer options (qsArray= .incorrect_answers): " + qsArray);
  correctAnswer = trivData[questionCount].correct_answer;
  qsArray.push(trivData[questionCount].correct_answer);
  console.log("updated qsArray: " + qsArray);

  // qsArray = shuffle(qsArray);
  //ansOptions will be passed into onclick event
  ansOptions = document.getElementsByClassName("ansOptions");
  timerDiv.innerHTML = "<p>Timer: " + timer + "</p>";
  $('#category').html("Category: "+ trivData[questionCount].category);
  $('#question').html(trivData[questionCount].question);
    
    var aZero= $('<div id = ans0 class=ansOptions>');
    $('#main').append(aZero);
    var aOne= $('<div id = ans1 class=ansOptions>');
    $('#main').append(aOne);
    var aTwo= $('<div id = ans2 class=ansOptions>');
    $('#main').append(aTwo);
    var aThree= $('<div id = ans3 class=ansOptions>');
    $('#main').append(aThree);

      //ansOptions will be passed into onclick event
    ansOptions = document.getElementsByClassName("ansOptions");


//Assigning each answer to its <div>:
  for(var i = 0; i < qsArray.length; i++) {
    
    // $('#main').append('<div class = "ansOptions" id=" ans'+[i]+'" />');

    document.getElementById('ans'+ i).innerHTML = qsArray[i];
  }
  answerOnClick(ansOptions);
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
          rightDiv.innerHTML = "<p>Correct: " + right;
          // setTimeout(function(){nextQuestion();}, 5000);
        }
        else {
          stop();
          alertMessage("Wrong!");
          timer = 10;
          questionCount++;
          wrong++;
          wrongDiv.innerHTML = "<p>Wrong: " + wrong;
          // setTimeout(function(){nextQuestion();}, 5000);
        }
      }
    })
  }

  function disableAnswerOnClick(answers){
    Array.prototype.forEach.call(answers, function(element){
      element.onclick = function(){
        alertMessagePaused("Paused!");
      }
    })
  }

  function start(){
    intervalID = setInterval(countDown, 1200);
  }

  function countDown(){
    timer--;
    timerDiv.innerHTML = "<p>Timer: " + timer + "</p>";
    if (timer === 0){
      stop();
      alertMessage("You're out of time");
      timer = 10;
      questionCount++;
      missed++;
      missedDiv.innerHTML = "<p>missed: " + missed + "</p>";
    }
  }

  function stop(){
    clearInterval(intervalID);
  }

  function callTrivia(){
    $.ajax({
      url:'https://opentdb.com/api.php?amount=5',
      // method: 'GET'
      data: {
       category: 22,
        // difficulty: medium,
        type: 'multiple'
      }
    }).done(function(response){
      trivData = response.results;
      console.log(trivData);
      console.log(response.results[questionCount]);
      nextQuestion();
    });
  }

  function callGiphy(search){
    search = search.replace(' ','+');
    $.ajax({
      url: 'https://api.giphy.com/v1/gifs/search?',
      data: {
       api_key: 'dc6zaTOxFJmzC',
        q: search
      }

    }).done(function(response) {
      console.log(response);
      giphy = response.data[0].images.fixed_height.url;
      document.getElementById("giphy").innerHTML = "<img src=" + giphy + ">";
    });
  }

  function gameScore(){
    timer = 10;
    timerDiv.innerHTML = "<p>Timer: " + timer + "</p>";
    pauseButton.disabled = true;
    resumeButton.disabled = true;
    GameOver("All done, here's how you did:");

  }

  function alertMessage(message){

    $('#main').empty(); //empty main div

    var a= $('<p id = "response">').text(message + "The correct answer was: " + correctAnswer);
   
    
    $('#main').append(a);

    var b= $('<div id = giphy >');

    $('#main').append(b);


    callGiphy(correctAnswer);

    setTimeout(function(){nextQuestion();}, 4000);


  }

  function GameOver(message){

    $('#main').empty(); //empty main div

    var a= $('<p id = "gameResult">').text(message);
    // a.attr('data-name', message);
    
    $('#main').append(a);

    var corrects= $('<div id = correct >').text("Correct Answers: "+ right);

    $('#main').append(corrects);

    var wrongs= $('<div id = wrong >').text("Wrong Answers: "+ wrong);

    $('#main').append(wrongs);

    var missed= $('<div id = missed >').text("Missed Questions: "+ missed);

    $('#main').append(missed);



    // callGiphy(" ");

    setTimeout(function(){nextQuestion();}, 4000);

   

  }



  document.addEventListener("DOMContentLoaded", function(){

    var pauseButton = document.getElementById("pause");
    var resumeButton = document.getElementById("resume");

    pauseButton.disabled = true;
    resumeButton.disabled = true;
    
    startButton.onclick = function(){
      // if (document.getElementById("game-alert")){
      //   document.getElementById("game-alert").style.display = 'none';
      // }
      // stop();
      pauseButton.disabled = false;
      questionCount = 0;
      right = 0;
      wrong = 0;
      missed = 0;
      rightDiv.innerHTML = "<p>Correct: " + right;
      wrongDiv.innerHTML = "<p>Wrong: " + wrong;
      missedDiv.innerHTML = "<p>missed: " + missed + "</p>";
      // var index1 = selectBox.selectedIndex;
      // var index2 = difficultyBox.selectedIndex;
      callTrivia();
    }

    pauseButton.onclick = function(){
     disableAnswerOnClick(ansOptions);
      resumeButton.disabled = false;
      stop();
    }

    resumeButton.onclick = function(){
      answerOnClick(ansOptions);
      resumeButton.disabled = true;
      start();
    }

  });