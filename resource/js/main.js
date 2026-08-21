$(function () {
  initAos();
  initSubjectsTabs();
  initSurveyCounter();
  initVideoPlayer();
  initFloatingNav();
});

function initAos() {
  AOS.init();
}

function initSubjectsTabs() {
  var tabList = $('.subjects__tabs');
  var panel = $('#subjects-panel');
  if (tabList.length === 0 || panel.length === 0 || typeof Swiper === 'undefined') return;

  var tabs = tabList.find('[role="tab"]');
  var tabCount = tabs.length;

  function setActiveTab(index, moveFocus) {
    var activeTab = tabs.eq(index);
    if (activeTab.length === 0) return;

    tabs.each(function (i) {
      var isSelected = (i === index);
      $(this).attr('aria-selected', isSelected);
      $(this).attr('tabindex', isSelected ? '0' : '-1');
    });

    panel.attr('aria-labelledby', activeTab.attr('id'));

    var activeSubject = activeTab.data('subject');
    $('.subjects__panel-quote[data-subject-panel]').each(function () {
      this.hidden = ($(this).data('subjectPanel') !== activeSubject);
    });

    if (moveFocus) activeTab.trigger('focus');
  }

  var swiper = new Swiper(panel[0], {
    loop: true,
    speed: 450,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    on: {
      slideChange: function (activeSwiper) {
        setActiveTab(activeSwiper.realIndex, false);
      }
    }
  });

  tabs.on('click', function () {
    var index = tabs.index(this);
    swiper.slideToLoop(index);
    swiper.autoplay.start();
  });

  tabs.on('keydown', function (e) {
    var currentIndex = tabs.index(this);
    var nextIndex = currentIndex;

    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabCount;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabCount) % tabCount;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabCount - 1;
    else return;

    e.preventDefault();
    swiper.slideToLoop(nextIndex);
    setActiveTab(nextIndex, true);
    swiper.autoplay.start();
  });

  tabList.on('mouseenter', function () { swiper.autoplay.stop(); });
  tabList.on('mouseleave', function () { swiper.autoplay.start(); });

  var startIndex = Math.floor(Math.random() * tabCount);
  swiper.slideToLoop(startIndex, 0);
  setActiveTab(swiper.realIndex, false);
}

function initSurveyCounter() {
  var textarea = $('#survey-note');
  var counter = $('#survey-note-count');
  if (textarea.length === 0 || counter.length === 0) return;

  var maxLength = Number(textarea.attr('maxlength')) || 0;

  function updateCounter() {
    var currentLength = textarea.val().length;
    counter.text(currentLength.toLocaleString('ko-KR') + '/' + maxLength.toLocaleString('ko-KR'));
  }

  textarea.on('input', updateCounter);
  updateCounter();
}

function initVideoPlayer() {
  var thumb = $('#videoThumb');
  var video = $('#introVideo');
  var playButton = $('#playBtn');
  if (thumb.length === 0 || video.length === 0 || playButton.length === 0) return;

  playButton.on('click', function () {
    video[0].play();
  });
  video.on('play', function () {
    thumb.addClass('is-playing');
  });
  video.on('pause ended', function () {
    thumb.removeClass('is-playing');
  });
}

function initFloatingNav() {
  var navLinks = $('.floating-nav__link[href^="#"]');
  if (navLinks.length === 0) return;

  function updateActiveLink() {
    var scrollPosition = $(window).scrollTop() + window.innerHeight / 3;
    var activeLink = navLinks.eq(0);
    var activeTop = -Infinity;

    navLinks.each(function () {
      var target = $($(this).attr('href'));
      if (target.length === 0) return;
      var targetTop = target.offset().top;
      if (targetTop <= scrollPosition && targetTop > activeTop) {
        activeTop = targetTop;
        activeLink = $(this);
      }
    });

    navLinks.removeClass('floating-nav__link--active');
    activeLink.addClass('floating-nav__link--active');
  }

  $(window).on('scroll', updateActiveLink);
  updateActiveLink();
}
