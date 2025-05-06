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

    fetch('js/image_sources.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch JSON');
            }
            return response.json();
        })
        .then(data => {
            const carData = {};

            // Парсинг даних у структурований формат
            for (const [key, imageUrl] of Object.entries(data)) {
                const [brand, model, year] = key.split('/');
                if (!carData[brand]) carData[brand] = {};
                if (!carData[brand][model]) carData[brand][model] = {};
                if (!carData[brand][model][year]) carData[brand][model][year] = [];
                carData[brand][model][year].push(imageUrl);
            }

            // Додавання марок у меню
            populateBrands(carData);
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
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
        modelMenu.style.left = '200px'; // Висуваємо меню моделей
        yearMenu.style.left = '-200px'; // Ховаємо меню років

        for (const model of Object.keys(models).sort()) {
            const li = document.createElement('li');
            li.textContent = model;
            li.classList.add('model-item'); // Додаємо клас для стилізації
            li.addEventListener('click', () => {
                toggleYears(models[model], brand, model);
            });
            modelList.appendChild(li);
        }
    }

    function toggleYears(years, brand, model) {
        if (yearMenu.style.left === '400px') {
            // Якщо меню років відкрите, закриваємо його
            yearMenu.style.left = '-200px';
            yearList.innerHTML = ''; // Очищення списку років
        } else {
            // Відкриваємо меню років
            showYears(years, brand, model);
        }
    }

    function showYears(years, brand, model) {
        console.log('Selected model:', model); // Відладка
        console.log('Available years:', years); // Перевірка, чи є роки
        yearList.innerHTML = ''; // Очищення списку років
        photoContainer.innerHTML = ''; // Очищення фотографій
        yearMenu.style.left = '400px'; // Висуваємо меню років

        for (const year of Object.keys(years).sort()) {
            const li = document.createElement('li');
            li.textContent = year;
            li.classList.add('year-item'); // Додаємо клас для стилізації
            li.addEventListener('click', () => {
                console.log('Year clicked:', year); // Відладка
                console.log('Images for year:', years[year]); // Перевірка зображень
                showImages(years[year], brand, model, year);
            });
            yearList.appendChild(li);
        }
    }

    function showImages(images, brand, model, year) {
        if (!photoContainer) {
            console.error('Error: photoContainer element is not found in the DOM.');
            return;
        }

        console.log('Selected year:', year); // Відладка
        console.log('Images array:', images); // Перевірка масиву зображень
        photoContainer.innerHTML = `<h2>${brand} ${model} ${year}</h2>`; // Заголовок для вибраного року

        if (images && images.length > 0) {
            images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${brand} ${model} ${year}`;
                img.style.width = '200px'; // Фіксована ширина
                img.style.height = '150px'; // Фіксована висота
                img.style.objectFit = 'cover'; // Збереження пропорцій з обрізанням
                img.style.border = '2px solid #FFC0CB'; // Світло-рожева рамка
                img.style.borderRadius = '8px'; // Закруглені краї
                img.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Тінь

                img.onerror = () => {
                    console.warn(`Image not found: ${imageUrl}`);
                    img.style.display = 'none'; // Ховаємо зображення, якщо воно не завантажується
                };

                photoContainer.appendChild(img);
            });
        } else {
            photoContainer.innerHTML += '<p>Немає доступних фотографій для цього року.</p>';
        }
    }

    function closeAllMenus() {
        modelMenu.style.left = '-200px';
        yearMenu.style.left = '-200px';
        modelList.innerHTML = ''; // Очищення списку моделей
        yearList.innerHTML = ''; // Очищення списку років
        photoContainer.innerHTML = ''; // Очищення фотографій
    }
});