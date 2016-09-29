define(['jquery',
    'underscore',
    'backbone',
    'app/views/Page',
    'app/views/Canvas',
    'app/models/President',
    'text!app/templates/build.html'],
  function ($,
            _,
            Backbone,
            Page,
            Canvas,
            President,
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
        this.counter = this.$el.find('#counter');

        this.ready();
      },

      shown: function () {
        this.canvas = new Canvas({el: "#drawingCanvas"});

        var tl = new TimelineMax();
        tl.fromTo('#drawingCanvas canvas', .5, {x: '50%'}, {x: '0%'});
        tl.fromTo('#drawingCanvas canvas', .5, {scaleY: 0.008, scaleX: 0.9}, {scaleY: 1, scaleX: 1, onComplete: function () {
          $('#drawingCanvas').addClass('draw-area--shown');
        }});
        tl.fromTo(this.questionParts[0], .4, {opacity: 0, y: 20}, {opacity: 1, y: 0});
        tl.fromTo(this.questionParts[1], .5, {opacity: 0, y: 20}, {opacity: 1, y: 0}, '-=0.2');
        tl.fromTo(this.questionParts[2], .4, {opacity: 0, y: 20}, {opacity: 1, y: 0}, '-=0.2');

        tl.fromTo('.build__button.btn--danger', .2, {opacity: 0, scale: 0.2, y: 100}, {opacity: 1, scale: 1, y: 0, ease: Elastic.easeOut.config(1, 0.4)}, '-=0.2');
        tl.fromTo('.build__button.btn--success', .2, {opacity: 0, scale: 0.2, y: 100}, {opacity: 1, scale: 1, y: 0, ease: Elastic.easeOut.config(1, 0.4)}, '-=0.1');

        tl.to(this.counter, .3, {opacity: 0.7});
      },

      loadQuestions: function () {
        $.ajax({
          type: "GET",
          url: 'app/datas/questions.json'
        }).done(questionsLoaded.bind(this));

        function questionsLoaded(questions) {
          this.questions = questions;
          this.remainingQuestions = _.clone(questions);

          this.pickCurrentQuestion(false);
        }
      },

      pickCurrentQuestion: function (shouldAnimate) {
        if (this.remainingQuestions.length < 1) return;

        this.currentQuestion = this.remainingQuestions.shift();

        this.questionBodyEl.text(this.currentQuestion.questionBody);

        if (shouldAnimate) {
          TweenMax.to(this.questionBodyEl, .3, {scale: 1, opacity: 1});
        }

        this.updateCounter();
      },

      answerButtonClicked: function (e) {
        var answerType = e.currentTarget.dataset.answer;
        var answer = this.currentQuestion[answerType + 'Answer'];

        this.selectedAnswers.push(answer);

        this.canvas.drawImage(answer.imageFileName);

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

        var president = new President({
          name: this.presidentName,
          drawingParts: this.selectedAnswers.map(function (answer) {
            return answer.imageFileName
          }),
          drawing: this.canvas.getDataURL()
        });

        president.save(null, {success: onSaveSuccess.bind(this), error: function (err) {
          console.log(err);
        }});

        function onSaveSuccess(president) {
          this.president = president;
          this.$el.find('.btn--twitter').attr("href", 'https://twitter.com/intent/tweet?text=Vote for ' + president.get('name') + ', my custom great president ! ' + window.location.href);
          this.slideDrawing();
          Backbone.history.navigate('/p/' + president.get('token'), {
            trigger: false,
            replace: true
          });
        }
      },

      slideDrawing: function () {
        var permalink = window.location.protocol + '//' + window.location.host + '/p/' + this.president.get('token');
        var permalinkEl = this.$el.find('#permalink')[0];
        permalinkEl.innerText = permalinkEl.href = permalink;

        this.$el.addClass('build--share');
        TweenMax.to('#reset', .3, {opacity: 0, onComplete: function () {
          $('#reset').remove();
        }});
        TweenMax.set('.build__end-message', {opacity: 1});
        TweenMax.to('#drawingCanvas', .35, {x: '100%', delay: .3});
      },

      onResetButtonClick: function () {
        this.selectedAnswers = [];
        this.canvas.clear();
        this.remainingQuestions = _.clone(this.questions);
        this.pickCurrentQuestion(false);
      },

      updateCounter: function () {
        this.counter.text( this.questions.length - this.remainingQuestions.length + ' / ' + this.questions.length);
      }
    });

    return BuildView;
  });
