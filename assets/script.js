let navBar = document.querySelector('nav');
let highscoresLink = document.getElementById('highscores-link');
let container = document.getElementById('container');
let timerDisplay = document.getElementById('timer');
let startButton = document.getElementById('start-button');
let title = document.getElementById('title');
let text = document.getElementById('text');
let quizAnswers = document.getElementById('quiz-answers');
let answerButtons = document.getElementsByClassName('answer-button');
let answerMessage = document.getElementById('answer-message');
let inputField = document.getElementById('input-field');
let initials = document.getElementById('last-name');
let submitButton = document.getElementById('submit-button');


let timerSecs = 0;
let currentQuestion = 0
let score = 0;
let scoreArray = [];
let timerInterval = false;

function startQuiz() {
   
    timerSecs = 60;
    timerDisplay.textContent = timerSecs;

    countdown();

  
    nextQuestion();

    startButton.style.display = 'none';
}

function nextQuestion() {

    container.className = 'results-page mt-5'
    title.textContent = 'Question ' + (currentQuestion + 1);
    title.setAttribute('class', 'h2')
    text.textContent = questions[currentQuestion].title;
    text.className = 'h4';
    text.setAttribute('style', 'border-top: 1px double #ba251a; padding-top: 20px;')

    
    quizAnswers.style.display = 'block';

    answerButtons[0].textContent = questions[currentQuestion].choices[0];
    answerButtons[1].textContent = questions[currentQuestion].choices[1];
    answerButtons[2].textContent = questions[currentQuestion].choices[2];
    answerButtons[3].textContent = questions[currentQuestion].choices[3];

    
    for (i = 0; i < answerButtons.length; i++) {
        answerButtons[i].addEventListener('click', checkAnswer);
    }
}

function checkAnswer(event) {
    
    console.log('User chose: ' + event.target.textContent);
    console.log('Correct answer: ' + questions[currentQuestion].answer);

    
    if (event.target.textContent === questions[currentQuestion].answer) {
        answerMessage.style.display = 'block';
        answerMessage.textContent = 'Correct!';
        answerMessage.className = 'answer-message';
        currentQuestion ++;
        score ++;

        
        setTimeout(function() {
            answerMessage.style.display = 'none';
        }, 800);

       
        if (currentQuestion === questions.length) {
            endGame();

      
        } else {
            nextQuestion();
        };

    
    } else {
        currentQuestion ++;
        answerMessage.style.display = 'block';
        answerMessage.textContent = 'Incorrect!';
        answerMessage.className = 'answer-message';

        
        setTimeout(function() {
            answerMessage.style.display = 'none';
        }, 800);

        
        if (timerSecs < 10) {
            timerSecs -= 10;
            endGame();

        
        } else if (currentQuestion === 5) {
            endGame();

       
        } else {
            timerSecs -= 10;
            nextQuestion();
        };
    }
};

function endGame() {
    
    quizAnswers.style.display = 'none';
    container.className = 'quiz-page mt-5'
    title.setAttribute('class', 'h2');
    text.setAttribute('style', 'border-top: 0');
    text.removeAttribute('class');
    text.textContent = 'Your final score is ' + score + '. Enter your last name to see the high scores!';
    inputField.style.display = 'block';

    
    if (timerSecs <= 0) {
        title.textContent = 'You ran out of time!';
    } else {
        title.textContent = 'All done!';
    }


    submitButton.addEventListener('click', storeHighScore);
}

function storeHighScore(event) {
    event.preventDefault();

    if (initials.value.length === 0) {
        return
    
    } else {
        newScore = {
            userName: last-name.value.trim(),
            userScore: score
        };
        scoreArray.push(newScore);

        scoreArray.sort((a, b) => b.userScore - a.userScore);
        
        localStorage.setItem('score', JSON.stringify(scoreArray));
    
        seeHighScores();
    }
}


function loadHighScore() {
    
    storedScores = JSON.parse(localStorage.getItem('score'));

    
    if (storedScores !== null) {
        scoreArray = storedScores;

        
        return scoreArray;
    }
}

function seeHighScores() {
    
    if (timerInterval) {
        clearInterval(timerInterval);
    };

    container.className = 'score-page mt-5 card bg-light p-4';
    let ul = document.createElement('ul');
    let returnButton = document.createElement('button');
    let clearButton = document.createElement('button');
    returnButton.textContent = 'Go Back';
    clearButton.textContent = 'Clear High Scores';
    container.appendChild(ul);
    container.appendChild(returnButton);
    container.appendChild(clearButton);

    
    startButton.style.display = 'none';
    navBar.style.visibility = 'hidden';
    title.textContent = 'High Scores';
    text.textContent = '';
    text.setAttribute('style', 'border-top: 0');
    quizAnswers.style.display = 'none';
    inputField.style.display = 'none';

    
    for (i = 0; i < scoreArray.length; i++) {
        let score = scoreArray[i].userName + ' : ' + scoreArray[i].userScore;

        li = document.createElement('li');
        li.textContent = score;
        ul.appendChild(li);
    }

    
    returnButton.addEventListener('click', function() {
        location.href = 'index.html'
    });

    
    clearButton.addEventListener('click', function() {
        localStorage.clear();
        ul.innerHTML = '';
    });
};


function countdown() {
   
    timerInterval = setInterval(function() {
        timerSecs --;
        timerDisplay.textContent = timerSecs;

        
        if (timerSecs < 1) {
            timerDisplay.textContent = 0;
            endGame();
            clearInterval(timerInterval);
        };

        
        if (currentQuestion === 5) {
            timerDisplay.textContent = timerSecs;
            clearInterval(timerInterval);
        }
    }, 1000)
}

function handleFirstTab(e) {
    if (e.keyCode === 9) { 
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
    }
}

window.addEventListener('keydown', handleFirstTab);

loadHighScore();

startButton.addEventListener('click', startQuiz);
highscoresLink.addEventListener('click', seeHighScores);

