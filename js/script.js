document.addEventListener('DOMContentLoaded', function () {
    const brandMenu = document.getElementById('brandMenu');
    const modelMenu = document.getElementById('modelMenu');
    const yearMenu = document.getElementById('yearMenu');
    const brandList = document.getElementById('brandList');
    const modelList = document.getElementById('modelList');
    const yearList = document.getElementById('yearList');
    const photoContainer = document.getElementById('photoContainer');
    const catalogButton = document.getElementById('catalogButton');
    const headerContainer = document.getElementById('headerContainer');
    const headerTitle = document.getElementById('headerTitle');

    catalogButton.addEventListener('click', () => {
        // Додаємо клас для зменшення контейнера
        headerContainer.classList.add('minimized');
        // Ховаємо кнопку
        catalogButton.style.display = 'none';
        // Показуємо текст
        headerTitle.style.display = 'block';
    });

    fetch('js/sample.json')
  .then(response => response.json())
  .then(data => {
    // Перетворюємо плоский JSON у вкладену структуру
    const carData = {};
    for (const [key, url] of Object.entries(data)) {
      const [brand, model, year] = key.split('/');
      if (!carData[brand]) carData[brand] = {};
      if (!carData[brand][model]) carData[brand][model] = {};
      if (!carData[brand][model][year]) carData[brand][model][year] = [];
      carData[brand][model][year].push(url);
    }
    // Далі використовуйте carData для побудови меню
    populateBrands(carData);
  });

    function populateBrands(carData) {
        brandList.innerHTML = ''; // Очищення списку

        for (const brand of Object.keys(carData).sort()) {
            const li = document.createElement('li');
            li.textContent = brand;
            li.classList.add('brand-item'); // Додаємо клас для стилізації
            li.addEventListener('click', () => {
                toggleModels(carData[brand], brand);
            });
            brandList.appendChild(li);
        }
    }

    function toggleModels(models, brand) {
        if (modelMenu.style.left === '200px') {
            // Якщо меню моделей відкрите, закриваємо його
            closeAllMenus();
        } else {
            // Закриваємо всі вкладки перед відкриттям нової
            closeAllMenus();
            showModels(models, brand);
        }
    }

    function showModels(models, brand) {
        console.log('Selected brand:', brand); // Відладка
        modelList.innerHTML = ''; // Очищення списку моделей
        yearList.innerHTML = ''; // Очищення списку років
        photoContainer.innerHTML = ''; // Очищення фотографій
        modelMenu.style.left = '200px'; // Відкриваємо меню моделей праворуч від марок
        yearMenu.style.left = '-200px'; // Ховаємо меню років

        for (const model of Object.keys(models).sort()) {
            const li = document.createElement('li');
            li.textContent = model;
            li.classList.add('model-item'); // Додаємо клас для стилізації
            li.addEventListener('click', () => {
                yearList.innerHTML = ''; // Очищення списку років при виборі моделі
                toggleYears(models[model], brand, model);
            });
            modelList.appendChild(li);
        }
    }

    function toggleYears(years, brand, model) {
        // Просто показуємо роки для вибраної моделі
        showYears(years, brand, model);
    }

    function showYears(years, brand, model) {
        console.log('Selected model:', model); // Відладка
        console.log('Available years:', years); // Перевірка, чи є роки
        yearList.innerHTML = ''; // Очищення списку років
        photoContainer.innerHTML = ''; // Очищення фотографій
        yearMenu.style.left = '400px'; // Відкриваємо меню років праворуч від моделей

        // Гарантуємо, що years — це об'єкт
        if (typeof years !== 'object' || years === null) {
            yearList.innerHTML = '<li style="color:red;">No years found</li>';
            return;
        }

        // Отримуємо всі ключі (роки) навіть якщо масив фото порожній
        const yearKeys = Object.keys(years);
        if (yearKeys.length === 0) {
            yearList.innerHTML = '<li style="color:red;">No years found</li>';
            return;
        }

        for (const year of yearKeys.sort()) {
            const li = document.createElement('li');
            li.textContent = year;
            li.classList.add('year-item');
            li.addEventListener('click', () => {
                // Якщо є масив фото — показуємо, якщо ні — повідомлення
                if (Array.isArray(years[year]) && years[year].length > 0) {
                    showImages(years[year], brand, model, year);
                } else {
                    photoContainer.innerHTML = `<h2>${brand} ${model} ${year}</h2><p>Немає доступних фотографій для цього року.</p>`;
                }
            });
            yearList.appendChild(li);
        }
    }

    function showImages(images, brand, model, year) {
        photoContainer.classList.remove('closed'); // Показуємо фото

        photoContainer.innerHTML = `<h2>${brand} ${model} ${year}</h2>`;

        if (Array.isArray(images) && images.length > 0) {
            images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${brand} ${model} ${year}`;
                img.style.width = '200px';
                img.style.height = '150px';
                img.style.objectFit = 'cover';
                img.style.border = '2px solid #FFC0CB';
                img.style.borderRadius = '10px';
                img.style.boxShadow = '0 4px 12px rgba(106, 13, 173, 0.13)';
                img.style.margin = '12px 16px 12px 0';
                img.style.background = '#fff';

                img.onload = () => {
                    photoContainer.appendChild(img); // Додаємо тільки якщо завантажилось
                };
                img.onerror = () => {
                    // Не додаємо нічого, просто ігноруємо
                    console.warn(`Image not found: ${imageUrl}`);
                };
            });
        } else {
            photoContainer.innerHTML += '<p>Немає доступних фотографій для цього року.</p>';
        }
    }

    function closeAllMenus() {
        modelMenu.style.left = '-200px';
        yearMenu.style.left = '-200px';
        modelList.innerHTML = '';
        yearList.innerHTML = '';
        photoContainer.innerHTML = '';
        photoContainer.classList.add('closed'); // Ховаємо фото
    }
});