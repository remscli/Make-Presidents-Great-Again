define(['jquery',
    'underscore',
    'backbone',
    'app/views/Page',
    'app/collections/Questions',
    'text!app/templates/build.html'],
  function ($,
            _,
            Backbone,
            Page,
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
        this.canvas = this.$el.find("#drawingCanvas");

        this.remainingQuestions = null;
        this.selectedAnswers = [];
        this.currentQuestion = null;

        this.render();
        this.loadQuestions();
      },

      render: function () {

        this.$el.html(this.template());

        this.ready();
      },

      loadQuestions: function () {
        this.model.fetch({
          success: questionsLoaded.bind(this)
        });

        function questionsLoaded() {
          this.remainingQuestions = this.model;

          this.pickCurrentQuestion();
        }
      },

      pickCurrentQuestion: function () {
        if (this.remainingQuestions.length < 1) {
          console.log("END");
          console.log(this.selectedAnswers);
        }

        this.currentQuestion = this.remainingQuestions.shift();

        this.$el.find("#questionBody").text(this.currentQuestion.get('questionBody'));
      },

      answerButtonClicked: function (e) {
        var answerType = e.currentTarget.dataset.answer;
        var answer = this.currentQuestion.get([answerType + 'Answer']);

        this.selectedAnswers.push(answer);

        this.pickCurrentQuestion();
      }
    });

    return BuildView;
  });
