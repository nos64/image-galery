const API_KEY = '0qCl5TCnXtw3VtKF8YW6k2Rp-9f30yX8uic7VAOYkZE';
const BASE_URL = 'https://api.unsplash.com/';
const headerLogo = document.querySelector('.header__logo');
const input = document.querySelector('.header__search');
const searchBtn = document.querySelector('.header__search-btn');
const imagesList = document.querySelector('.images-list');
const headerThemeToggler = document.querySelector('.header__theme-toggler');
const errorMessage = document.querySelector('.error-message');

/**Создание элементов */
const creatElement = (item) => {
  const li = document.createElement('li');
    li.classList.add('images-item');
  const a = document.createElement('a');
    a.classList.add('images-link');
    a.href = `${item.urls.regular}`;
    a.target = "_blank";
    
  const img = document.createElement('img');
    img.classList.add('image');
    img.src = `${item.urls.regular}`;
    img.alt = `image`;
    img.title = 'Click for fullsize'

  a.append(img);
  li.append(a);
  imagesList.append(li);
}

/**Обработка запроса */
getDataImg = url => fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw `Что-то пошло не так, ошибка ${response.status}`
  })
  .catch(err => console.error(err));


/**Запрос изображений при загрузке страницы*/
const firstRender = async (data) => {
  const urlLoad = `${BASE_URL}photos?page=1&order_by=popular&per_page=30&orientation=landscape&client_id=${API_KEY}`
  return await getDataImg(urlLoad);
}

/**Первоначальный вывод популярных картинок при загрузке страницы */
const showData = async (data) => {
  data = await firstRender()
  data.map(item => {
    creatElement(item)
  })
}

/**Запрос результатов поиска изображений*/
const showSearch = async () => {
  const urlSearch = `${BASE_URL}/search/photos?page=1&query=${input.value}&per_page=30&orientation=landscape&client_id=${API_KEY}`;
  return await getDataImg(urlSearch);
}

/**Вывод результатов поиска */
const renderSearchResult = async (data) => {
  event.preventDefault();
  if (!input.value) return;
  if (input.value) {
    errorMessage.classList.remove('error-message-active');
    data = await showSearch();
    console.log('data: ', data);
    if (data.results.length) {
      imagesList.innerHTML = '';
      data.results.map(item => {
        creatElement(item);
      });
    } else {
      errorMessage.classList.add('error-message-active');
    }
  } 
}

showData()

/**Обработка нажатия Enter и кнопки Поиск */
searchBtn.addEventListener('click', renderSearchResult);
input.addEventListener('keydown', (e) => {
  if (e.keyCode == 13) renderSearchResult()
});

/**Перезагрузка страницы по клику на лого */
headerLogo.addEventListener('click', () => {
  window.location.reload()
});

/**Переключатель темы светлая/темная с сохранением в LocalStorage */
let lightMode = localStorage.getItem('lightMode');

headerThemeToggler.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  if (document.body.classList.contains('light-mode')) {
    localStorage.setItem('lightMode', 'enabled');
  } else {
    localStorage.setItem('lightMode', null)
  }
});

const getLocalStorageTheme = () => {
  if (lightMode === 'enabled') {
    document.body.classList.add('light-mode')
  }
};

window.addEventListener('load', getLocalStorageTheme);

