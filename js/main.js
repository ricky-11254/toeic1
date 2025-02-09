document.addEventListener("DOMContentLoaded", (event) => {
/*  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    var x = document.getElementById("container");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    });

  document.querySelectorAll(".nav-link").forEach((link) =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    })
  );




  /** Smooth Scrolling
  $(document).on("click", 'a[href^="#"]', function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top,
      },
      500
    );
  });
**/
  (function () {

    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $("#quiz"); //Quiz div object
    var defaultQuestionContent;
    defaultQuestionContent = $("#content").text();


  //this may be deleted...it has to do with muting page bc of clicking next so the audio from prev question doesnt keep playing//

    // Mute a singular HTML5 element
    // function muteMe(elem) {
    //     elem.muted = true;
    //     elem.pause();
    // }
    //
    // // Try to mute all video and audio elements on the page
    // function mutePage() {
    //     document.querySelectorAll("video, audio").forEach((elem) => muteMe(elem));
    // }



  //this may be deleted...it has to do with muting page//



    // Display initial question
    displayNext();

    // Click handler for the 'next' button
    $("#next").on("click", function (e) {
      e.preventDefault();


      // Suspend click listener during fade animation
      if (quiz.is(":animated")) {
        return false;
      }
      choose();

      // If no user selection, progress stopped and pop-up alert
      if (isNaN(selections[questionCounter])) {
        swal("Please make a selection.", "Choose the best answer.", "warning");
      } else {
        questionCounter++;
        displayNext();
      }console.log('the score is: ', getScore())
    });

    // Click handler for the 'prev' button
    $("#prev").on("click", function (e) {
      e.preventDefault();
      // mutePage();

      if (quiz.is(":animated")) {
        return false;
      }
      choose();
      questionCounter--;
      displayNext();
    });

    // Click handler for the 'Start Over' button
    $("#start").on("click", function (e) {
      e.preventDefault();

      if (quiz.is(":animated")) {
        return false;
      }
      questionCounter = 0;
      selections = [];
      displayNext();
      $("#start").hide();
    });

    // Animates buttons on hover
    $(".button").on("mouseenter", function () {
      $(this).addClass("active");
    });
    $(".button").on("mouseleave", function () {
      $(this).removeClass("active");
    });

    // Creates and returns the div that contains the questions and
    // the answer selections
    function createQuestionElement(index) {
      //emailCapture();
      var qElement = $("<div>", {
        id: "question",
      });

      var header = $("<h2>Question " + (index + 1) + ":</h2>");
      qElement.append(header);

      var textProblem = $("<p>").append(questions[index].textProblem);
      qElement.append(textProblem);

      var question = $("<p>").append(questions[index].question);
      qElement.append(question);

      var radioButtons = createRadios(index);
      qElement.append(radioButtons);

      return qElement;
    }

    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
      var radioList = $("<ul>");
      var item;
      var input = "";
      for (var i = 0; i < questions[index].choices.length; i++) {
        item = $("<li>");
        input = '<input type="radio" id="choice' + i + '" name="answer" value=' + i + ' />';
        input += '<label for="choice' + i + '">' + questions[index].choices[i] + '</label>'; 
        input += questions[index].choices[i];
        input += "</label>";
        item.append(input);
        radiolist.append(item);
      }
      return radiolist;
    }

    // reads the user selection and pushes the value to an array
    function choose() {
      selections[questioncounter] = +$('input[name="answer"]:checked').val();
    }

    // displays next requested element
    function displaynext() {
      quiz.fadeout(function () {
        $("#question").remove();

        if (questioncounter < questions.length) {
          var question = questions[questioncounter];

          // show 'image' defined in question object

          if (typeof question.image !== "undefined") {
            $("#image img").attr("src", "https://ricky-11254.github.io/toeic1/" + question.image);
            $("#image").show();
          } else {
            $("#image").hide();
          }

          if (typeof question.audio !== "undefined") {
            $("#audio").show();
            $("#audio audio").attr("src", "https://ricky-11254.github.io/toeic1/audio/" + question.audio);

            // $("#audio audio")[0].play();
          } else {
            $("#audio").hide();
            $("#audio audio").stop();
          }

         
          // show 'content' defined in question object
          console.log(typeof question.content, defaultquestioncontent);
          if (typeof question.content === "undefined") {
            $("#content").text(defaultquestioncontent);
          } else {
            $("#content").text(question.content);
          }

          // show 'qtype' defined in question object
          console.log(typeof question.qtype, defaultquestioncontent);
          if (typeof question.qtype === "undefined") {
            $("#qtype").text(defaultquestioncontent);
          } else {
            $("#qtype").text(question.qtype);
          }

          var nextquestion = createquestionelement(questioncounter);
          quiz.append(nextquestion).fadein();
          if (!isnan(selections[questioncounter])) {
            $("input[value=" + selections[questioncounter] + "]").prop(
              "checked",
              true
            );
          }

          // controls display of 'prev' button
          if (questioncounter === 1) {
            $("#prev").show();
          } else if (questioncounter === 0) {
            $("#prev").hide();
            $("#next").show();
          }
        } else {
          var scoreelem = displayscore();
          quiz.append(scoreelem).fadein();
          $("#next").hide();
          $("#prev").hide();
          $("#start").show();
        }
      });
    }

  function getscore() {

    var numcorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctanswer) {
        numcorrect++;
      }
    }
    return numcorrect;
  }

    // computes score and returns a paragraph element to be displayed
    function displayscore() {
        // move results generation inside this function
        function generateresultspage() {
            // calculate score
            const score = getscore();
            const totalquestions = questions.length;

            // start building html content
            let html = `
                <!doctype html>
                <html>
                <head>
                    <title>quiz results</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
                    <style>
                        body { 
                            font-family: arial, sans-serif; 
                            max-width: 800px; 
                            margin: 0 auto; 
                            padding: 20px; 
                        }
                        .question { 
                            margin-bottom: 30px; 
                            border: 1px solid #ddd; 
                            padding: 15px; 
                            border-radius: 5px; 
                        }
                        .choice {
                            padding: 10px;
                            margin: 5px 0;
                            border-radius: 5px;
                        }
                        .correct {
                            background-color: #d4edda;
                            border: 2px solid #28a745;
                        }
                        .incorrect {
                            background-color: #f8d7da;
                            border: 2px solid #dc3545;
                        }
                        .explanation {
                            background-color: #f8f9fa;
                            border: 1px solid #e2e6ea;
                            padding: 10px;
                            margin-top: 10px;
                        }
                        .score {
                            text-align: center;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .question-image {
                            max-width: 100%;
                            height: auto;
                            display: block;
                            margin: 10px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="score">
                        you scored ${score} out of ${totalquestions}
                    </div>
            `;

            // generate results for each question
            questions.foreach((question, index) => {
                const useranswer = selections[index];
                const iscorrect = useranswer === question.correctanswer;

                // start question div
                html += `
                    <div class="question">
                        <h3>question ${index + 1}: ${question.qtype || 'question'}</h3>
                        <p>${question.question}</p>
                `;

                // add image if exists
                if (question.image) {
                    html += `<img src="https://ricky-11254.github.io/toeic1/${question.image}" alt="question image" class="question-image">`;
                }

                // add audio if exists
                if (question.audio) {
                    html += `
                        <audio controls>
                            <source src="https://ricky-11254.github.io/toeic1/audio/${question.audio}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    `;
                }

                // Generate choices
                html += `<div class="choices">`;
                question.choices.forEach((choice, choiceIndex) => {
                    let choiceClass = '';
                    if (choiceIndex === question.correctAnswer) {
                        choiceClass = 'correct'; // Always highlight correct answer in green
                    }
                    if (choiceIndex === userAnswer) {
                        choiceClass += isCorrect ? ' correct' : ' incorrect';
                    }

                    html += `
                        <div class="choice ${choiceClass}">
                            ${choice}
                        </div>
                    `;
                });
                html += `</div>`;

                // Add explanation if the answer was incorrect
                if (!isCorrect && question.explanation) {
                    html += `
                        <div class="explanation">
                            <strong>Explanation:</strong> ${question.explanation}
                        </div>
                    `;
                }

                html += `</div>`; // Close question div
            });

            // Close HTML
            html += `
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="downloadResults()" class="download-btn">Download Results</button>
                </div>
               </body>
                </html>
                <script>
                    function downloadResults() {
                        // Remove the download button temporarily
                        const btn = document.querySelector('.download-btn');
                        btn.style.display = 'none';
                        
                        // PDF options
                        const opt = {
                            margin: 1,
                            filename: 'quiz-results.pdf',
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2, useCORS: true },
                            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                        };

                        // Generate PDF from the body content
                        html2pdf().set(opt).from(document.body).save().then(function() {
                            // Show the button again after PDF is generated
                            btn.style.display = 'block';
                        });
                    }
                </script>

                <style>
                    .question {
                        page-break-inside: avoid;
                    }
                </style>
            `;

            // Open results in a new window
            const resultsWindow = window.open('', '_blank');
            resultsWindow.document.write(html);
            resultsWindow.document.close();
        }

         // Call results generation
         generateResultsPage();
      
         // Create and return score element
         const scoreElem = $("<p>", { id: "question" });
         scoreElem.append(
             "You got " +
             getScore() +
             " questions out of " +
             questions.length +
             " right."
         );
         return scoreElem;
      }
      /*
      window.onload = function () {
        emailCapture();
      };

      // Email capture
      function emailCapture() {
        const qy = questionCounter + 1;
        const capt = document.getElementById("capt");

        if (qy % 5 === 0) {
          capt.style.display = "block";
        } else {
          capt.style.display = "none";
        }
      }
        */
  })();
});
