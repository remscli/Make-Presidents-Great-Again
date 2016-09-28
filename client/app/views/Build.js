define(['jquery',
    'underscore',
    'backbone',
    'app/views/Page',
    'app/views/Canvas',
    'app/collections/Questions',
    'text!app/templates/build.html'],
  function ($,
            _,
            Backbone,
            Page,
            Canvas,
            Questions,
            buildTemplate) {

    var BuildView = Page.extend({
      id: 'page-build',

      events: {
        'click .build__button': 'answerButtonClicked',
        'click #nameButton': 'onNameButtonClick',
        'click #reset': 'onResetButtonClick'
      },

      initialize: function (options) {
        this.template = _.template(buildTemplate);

        this.model = new Questions();

        this.remainingQuestions = null;
        this.selectedAnswers = [];
        this.currentQuestion = null;

        this.render();
        this.loadQuestions();
      },

      render: function () {

        this.$el.html(this.template());

        this.questionParts = this.$el.find('#question').children();
        TweenMax.set(this.questionParts, {opacity: 0});

        this.questionBodyEl = this.$el.find("#questionBody");

        this.nameInput = this.$el.find('#nameInput');

        this.ready();
      },

      shown: function () {
        this.canvas = new Canvas({el: "#drawingCanvas"});

        var tl = new TimelineMax();
        tl.fromTo('#drawingCanvas canvas', .5, {x: '50%'}, {x: '0%'});
        tl.fromTo('#drawingCanvas canvas', .5, {scaleY: 0.008, scaleX: 0.9}, {scaleY: 1, scaleX: 1, onComplete: function () {
          $('#drawingCanvas').addClass('transition-end');
        }});
        tl.fromTo(this.questionParts[0], .4, {opacity: 0, y: 20}, {opacity: 1, y: 0});
        tl.fromTo(this.questionParts[1], .5, {opacity: 0, y: 20}, {opacity: 1, y: 0}, '-=0.2');
        tl.fromTo(this.questionParts[2], .4, {opacity: 0, y: 20}, {opacity: 1, y: 0}, '-=0.2');

        tl.fromTo('.build__button.btn--danger', .2, {opacity: 0, scale: 0.2, y: 100}, {opacity: 1, scale: 1, y: 0, ease: Elastic.easeOut.config(1, 0.4)}, '-=0.2');
        tl.fromTo('.build__button.btn--success', .2, {opacity: 0, scale: 0.2, y: 100}, {opacity: 1, scale: 1, y: 0, ease: Elastic.easeOut.config(1, 0.4)}, '-=0.1');
      },

      loadQuestions: function () {
        this.model.fetch({
          success: questionsLoaded.bind(this)
        });

        function questionsLoaded() {
          this.remainingQuestions = this.model.clone();

          this.pickCurrentQuestion(false);
        }
      },

      pickCurrentQuestion: function (shouldAnimate) {
        if (this.remainingQuestions.length < 1) return;

        this.currentQuestion = this.remainingQuestions.shift();

        this.questionBodyEl.text(this.currentQuestion.get('questionBody'));

        if (shouldAnimate) {
          TweenMax.to(this.questionBodyEl, .3, {scale: 1, opacity: 1});
        }
      },

      answerButtonClicked: function (e) {
        var answerType = e.currentTarget.dataset.answer;
        var answer = this.currentQuestion.get([answerType + 'Answer']);

        this.selectedAnswers.push(answer);

        this.canvas.drawImage('img/' + answer.imageFileName + '.png', { x: answer.imagePosX, y: answer.imagePosY });

        TweenMax.to('#reset', 1, {opacity: 1});
        if (this.remainingQuestions.length) {
          TweenMax.to(this.questionBodyEl, .3, {scale: 0.8, opacity: 0, onComplete: this.pickCurrentQuestion.bind(this, true)});
        } else {
          this.hideQuestions();
        }
      },

      hideQuestions: function () {
        var tl = new TimelineMax({onComplete: onHideCompleted.bind(this)});

        tl.to('.build__questions', .3, {x: '-100%', opacity: 0, ease: Power3.easeInOut}, .2);
        tl.to('.build__namer', .3, {x: '0%', opacity: 1, ease: Power3.easeInOut}, .2);

        function onHideCompleted() {
          this.nameInput.focus();
          $('.build__questions').remove();
        }
      },

      onNameButtonClick: function () {
        var name = this.nameInput.val();

        if (name.length < 3) {
          this.$el.find('#errorMessage').show();
          this.nameInput.addClass('has-error');
          return;
        }

        this.presidentName = name;

        this.slideDrawing();
      },

      slideDrawing: function () {
        this.$el.addClass('build--share');
        TweenMax.set('.build__end-message', {opacity: 1});
        TweenMax.to('#drawingCanvas', .35, {x: '100%', delay: .3});
      },

      onResetButtonClick: function () {
        this.selectedAnswers = [];
        this.canvas.clear();
        this.remainingQuestions = this.model.clone();
        this.pickCurrentQuestion(false);
      }
    });

    return BuildView;
  });
