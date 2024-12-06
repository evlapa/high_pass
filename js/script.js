// Яндекс.Карты
(function connectYaMaps() {
  ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
      center: [55.770228, 37.636823],
      zoom: 13
    }, {
      searchControlProvider: 'yandex#search'
    }),

      // Создаём макет содержимого.
      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
      ),

      myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
        hintContent: 'Собственный значок метки',
        balloonContent: 'Это красивая метка'
      }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: 'svg/map-point.svg',
        iconImageSize: [12, 12],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [0, 0]
      });

    myMap.geoObjects
      .add(myPlacemark)
  });
})();

// Переменные и функции поиска
(function search() {
  const searchBtn = document.querySelector('.header__btn');
  const searchInput = document.querySelector('.header__input');
  const clearSearchBtn = document.querySelector('.header__open-close-btn');

  function clearSearch() {
    searchInput.classList.add('invisible');
    searchInput.value = '';
  }

  searchBtn.addEventListener('click', () => {
    searchInput.classList.toggle('invisible');
  });

  searchBtn.addEventListener('focusout', (event) => {
    if (event.relatedTarget !== searchInput) {
      clearSearch();
    }
  });

  searchInput.addEventListener('input', () => {
    if (!searchInput.value) {
      clearSearchBtn.style.display = 'none';
    } else {
      clearSearchBtn.style.display = 'flex';
    }
  });

  searchInput.addEventListener('focusout', (event) => {
    if (event.relatedTarget !== clearSearchBtn) {
      clearSearch();
    }

    searchInput.classList.contains('invisible') ? clearSearchBtn.style.display = 'none' : clearSearchBtn.style.display = 'flex';
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
  });

  clearSearchBtn.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
    }

    clearSearchBtn.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        event.preventDefault();
      }
    })
  });
})();

// Переменные и функции бургер-меню
(function openBurger() {
  const openBurgerBtn = document.querySelector('.header__burger-btn');
  const closeBurgerBtn = document.querySelector('.header__close-burger-btn');
  const header = document.querySelector('.header');
  const menuList = document.querySelector('.header__list');
  const menuLinks = menuList.querySelectorAll('.header__link');
  const headerPhone = document.querySelector('.header__phone');
  const logo = document.querySelector('.header__logo');
  const search = document.querySelector('.header__search');
  const blocksToOpen = [menuList, closeBurgerBtn, headerPhone];
  const blocksToHide = [logo, search, openBurgerBtn];
  const linksToCloseMenu = [...menuLinks, closeBurgerBtn, headerPhone];
  const body = document.querySelector('body');

  openBurgerBtn.addEventListener('click', () => {

    header.classList.add('header--active');
    body.classList.add('no-scroll');

    for (let block of blocksToHide) {
      block.style.display = 'none';
    }

    for (let block of blocksToOpen) {
      block.style.display = 'flex';
      block.style.opacity = 1;
    }

    for (let link of linksToCloseMenu) {

      link.addEventListener('click', () => {

        for (let block of blocksToHide) {
          block.style.display = 'flex';
        }

        for (let block of blocksToOpen) {
          block.style.opacity = 0;
          block.style.display = 'none';
        }

        header.classList.remove('header--active');
        body.classList.remove('no-scroll');
      })
    }
  })
})();

// Плавный скролл

(function scroll() {
  const menuItems = document.querySelectorAll('.header__link, .footer__logo');
  for (let item of menuItems) {
    item.addEventListener('click', scrollSmoothly);
  }

  function scrollSmoothly(event) {
    scrollPage(event);
  };

  function scrollPage(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href') === '#' ? '#hero' : event.currentTarget.getAttribute('href');
    const targetPosition = document.querySelector(targetId).offsetTop;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition - 110;
    const duration = 1000;
    let start = null;

    window.requestAnimationFrame(scroll);

    function scroll(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));

      if (progress < duration) {
        window.requestAnimationFrame(scroll);
      }
    }

    function easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }
  };
})();

// Валидация
(function validate() {
  const aboutValid = new window.JustValidate('#about__form');
  const contactsValid = new window.JustValidate('#contacts__inputs');
  const mailRules = [{
    rule: 'required',
    errorMessage: 'Введите е-мейл',
  },
  {
    rule: 'email',
    errorMessage: 'Недопустимый формат',
  }];

  aboutValid
    .addField('.about__input', mailRules);

  contactsValid
    .addField('.contacts__name', [{
      rule: 'minLength',
      value: 2,
      errorMessage: 'Имя должно содержать не менее 2 букв',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Имя должно содержать не более 30 букв',
    },
    {
      rule: 'required',
      errorMessage: 'Введите имя',
    },
    {
      rule: 'customRegexp',
      value: /[a-z, а-я]/gi,
      errorMessage: 'Недопустимые символы',
    }])
    .addField('.contacts__email', mailRules)
    .addField('.contacts__comment', [{
      validator: (value) => {
        return value !== undefined && value.toString().length > 3;
      },
      errorMessage: 'Сообщение должно содержать не менее 3 знаков',
    }])
})();

// Сокрытие темного блока с карты
(function animateAddressLayer() {
  const darkBlock = document.querySelector('.contacts__address');
  const btn = document.querySelector('.contacts__open-close-btn');
  const darkBlockStyles = getComputedStyle(darkBlock);
  const startBlockPosition = parseInt(darkBlockStyles.width);
  const padding = parseInt(darkBlockStyles["padding-right"]);

  btn.addEventListener('click', () => {
    btn.classList.toggle('contacts__address--hidden');

    if (btn.classList.contains('contacts__address--hidden')) {
      btn.setAttribute('aria-label', "Раскрыть блок с адресом");
      darkBlock.style.left = -(startBlockPosition - padding) + 'px';
    } else {
      btn.setAttribute('aria-label', "Свернуть блок с адресом");
      darkBlock.style.left = '0px';
    }
  });
})();

//Кликабельность анонсов статей
(function makeClickable() {
  const articles = document.querySelectorAll('.projects__middle-article, .projects__small-article');
  console.log(articles);

  for (let article of articles) {
    article.addEventListener('click', () => {
      alert('При необходимости тут можно доработать открытие выбранной новости в отдельном окне.')
    });
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        alert('При необходимости тут можно доработать открытие выбранной новости в отдельном окне.')
      }
    });
  }
})();