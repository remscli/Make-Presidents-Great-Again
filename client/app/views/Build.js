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
        'click .build__button': 'answerButtonClicked'
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

        this.questionParts = this.$el.find('.question').children();
        TweenMax.set(this.questionParts, {opacity: 0});

        this.questionBodyEl = this.$el.find("#questionBody");

        this.ready();
      },

      shown: function () {
        this.canvas = new Canvas({el: "#drawingCanvas"});

        var tl = new TimelineMax();
        tl.fromTo(this.questionParts[0], .4, {opacity: 0, y: 20}, {opacity: 1, y: 0});
        tl.fromTo(this.questionParts[1], .5, {opacity: 0, y: 20}, {opacity: 1, y: 0}, '-=0.2');
        tl.fromTo(this.questionParts[2], .4, {opacity: 0, y: 20}, {opacity: 1, y: 0}, '-=0.2');

        tl.fromTo('.build__button.btn--danger', .2, {opacity: 0, scale: 0.2, y: 100}, {opacity: 1, scale: 1, y: 0, ease: Elastic.easeOut.config(1, 0.4)});
        tl.fromTo('.build__button.btn--success', .2, {opacity: 0, scale: 0.2, y: 100}, {opacity: 1, scale: 1, y: 0, ease: Elastic.easeOut.config(1, 0.4)});
      },

      loadQuestions: function () {
        this.model.fetch({
          success: questionsLoaded.bind(this)
        });

        function questionsLoaded() {
          this.remainingQuestions = this.model;

          this.pickCurrentQuestion(false);
        }
      },

      pickCurrentQuestion: function (shouldAnimate) {
        if (this.remainingQuestions.length < 1) {
          console.log("END");
          console.log(this.selectedAnswers);
        }

        this.currentQuestion = this.remainingQuestions.shift();

        if (shouldAnimate) {
          var tl = new TimelineMax();
          tl.to(this.questionBodyEl, .3, {scale: 0.8, opacity: 0, onComplete: updateText.bind(this)});
          tl.to(this.questionBodyEl, .3, {scale: 1, opacity: 1});
        } else {
          updateText.call(this);
        }

        function updateText() {
          this.questionBodyEl.text(this.currentQuestion.get('questionBody'));
        }
      },

      answerButtonClicked: function (e) {
        var answerType = e.currentTarget.dataset.answer;
        var answer = this.currentQuestion.get([answerType + 'Answer']);

        this.selectedAnswers.push(answer);

        this.pickCurrentQuestion(true);
      }
    });

    return BuildView;
  });
