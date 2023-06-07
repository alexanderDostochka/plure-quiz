import { renderDOM, h } from "./vdom.js";
import { words, quizGame } from "./mok.js";

class App {
  container = document.getElementById("app");
  timer = null;
  currentQuestion = 0;
  answers = [];
  slectedAnswer = {};
  logo = h("img", { src: "content/logo.svg", alt: words.logoAlt });
  logoWithLink = h("a", { class: "logo", href: "/" }, [
    this.logo,
    words.quizTitle,
  ]);

  constructor(quizGame) {
    this.quizGame = quizGame;
    this.timerCounter = quizGame.time;
    renderDOM(this.container, this.renderInitialLayout());
  }

  // Render inital layout
  renderInitialLayout = () =>
    this.mainLayout([this.renderInitialHeader(), this.renderWelcomeSection()]);

  // Main layout
  mainLayout = (children) => h("main", null, children);

  // Render header
  renderInitialHeader = () => {
    // Create navigation
    const navigation = h("nav", null, [
      h("ul", null, [
        h("li", null, [h("a", { href: "/about" }, [words.about])]),
      ]),
    ]);

    return h("header", null, [this.logoWithLink, navigation]);
  };

  // Render welcome section
  renderWelcomeSection = () => {
    const title = h("h1", null, ["Quiz Landing page"]);
    const description = h("p", null, [
      words.description.replace(":count", this.quizGame.questions.length),
    ]);

    const startButton = h(
      "button",
      { class: "default", onclick: this.handleClickPlayButton },
      [words.start]
    );

    return h("section", { class: "hero-section" }, [
      h("div", null, [this.logo, title, description, startButton]),
    ]);
  };

  // Quiz layout
  quizLayout = (timer = 0, currentAnswer = {}, currentQuestionIndex = 0) =>
    this.mainLayout([
      h("header", null, [
        this.logoWithLink,
        this.renderTimer(timer),
        h("div", null, []),
      ]),
      this.renderQuestionsWithAnswers(currentQuestionIndex, currentAnswer),
    ]);

  // End quiz
  endQuiz = () => {
    const correctQuestions = this.answers.filter(
      (answer) => answer.right
    ).length;
    alert(
      `${words.rightQuestion.replace(":right", correctQuestions)} ${
        this.quizGame.questions.length
      }`
    );

    clearInterval(this.timer);
    renderDOM(
      this.container,
      this.renderInitialLayout(),
      this.container.firstChild
    );

    this.currentQuestion = 0;
    this.answers = [];
  };

  // Render next button
  renderNextButton = (isDisabled = false) => {
    return h(
      "button",
      { class: "green", onclick: this.handleNextClick, disabled: isDisabled },
      [words.next]
    );
  };

  // Render questions with answers
  renderQuestionsWithAnswers = (index, currentAnswer) => {
    const question = this.quizGame.questions[index];

    const answers = h("div", { class: "answers" }, [
      ...question.answers.map((answer) => {
        return h(
          "button",
          {
            class: currentAnswer.id === answer.id ? "selected no-bg" : "no-bg",
            onclick: () => this.handleClickAnswer(answer),
          },
          [answer.answer]
        );
      }),
    ]);

    return h("section", { class: "questions-section" }, [
      h("div", null, [
        h("p", { class: "question" }, [question.question]),
        answers,
        h("div", null, [
          this.renderNextButton(!Object.keys(currentAnswer).length),
        ]),
      ]),
    ]);
  };

  // render timer
  renderTimer = (time) => {
    return h("div", { class: "timer" }, [this.secondsToMinutes(time)]);
  };

  // Timer
  startTimer = () => {
    this.timer = setInterval(() => {
      if (this.timerCounter <= 0) {
        this.endQuiz();
        clearInterval(this.timer);
      }

      renderDOM(
        this.container,
        this.quizLayout(
          this.timerCounter,
          this.slectedAnswer,
          this.currentQuestion
        ),
        this.quizLayout()
      );
      this.timerCounter -= 1;
    }, 1000);
  };

  // Convert seconds to MM:SS format
  secondsToMinutes = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(14, 19);
  };

  // Play click
  handleClickPlayButton = () => {
    this.startTimer();
    const quizGameLayout = this.quizLayout(this.timerCounter);
    renderDOM(this.container, quizGameLayout, this.container.firstChild);
  };

  // Next click
  handleNextClick = () => {
    if (!Object.keys(this.slectedAnswer).length)
      alert("Please select one answer");

    this.answers.push(this.slectedAnswer);

    if (this.answers.length >= this.quizGame.questions.length) {
      return this.endQuiz();
    }

    this.currentQuestion += 1;

    renderDOM(
      this.container,
      this.quizLayout(this.timerCounter, {}, this.currentQuestion),
      this.quizLayout(this.timerCounter, this.slectedAnswer)
    );

    this.slectedAnswer = {};
  };

  // Answer click
  handleClickAnswer = (answer) => {
    renderDOM(
      this.container,
      this.quizLayout(this.timerCounter, answer, this.currentQuestion),
      this.quizLayout(
        this.timerCounter,
        this.slectedAnswer,
        this.currentQuestion
      )
    );
    this.slectedAnswer = answer;
  };
}

new App(quizGame);
