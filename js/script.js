document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('textInput');
    const outputField = document.getElementById('outputField');
    const imageContainer = document.getElementById('imageContainer');
    const button = document.getElementById('submitButton');
    const fetchButton = document.getElementById('fetchButton');

    button.addEventListener('click', function() {
        const inputText = inputField.value;
        outputField.textContent = inputText;
    });

    fetchButton.addEventListener('click', function() {
        fetch('js/sample.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch JSON');
                }
                return response.json();
            })
            .then(data => {
                imageContainer.innerHTML = ''; // Clear previous content
                const sortedKeys = Object.keys(data).sort(); // Sort keys alphabetically

                const carGroups = {};

                // Group cars by their brand, model, and year
                sortedKeys.forEach(key => {
                    const [carBrand, carModel, carYear] = key.split('/'); // Extract brand, model, and year
                    if (!carGroups[carBrand]) {
                        carGroups[carBrand] = {};
                    }
                    if (!carGroups[carBrand][carModel]) {
                        carGroups[carBrand][carModel] = {};
                    }
                    if (!carGroups[carBrand][carModel][carYear]) {
                        carGroups[carBrand][carModel][carYear] = [];
                    }
                    carGroups[carBrand][carModel][carYear].push(data[key]);
                });

                // Create a block for each car brand
                for (const [brand, models] of Object.entries(carGroups)) {
                    const brandBlock = document.createElement('div');
                    brandBlock.classList.add('brand-block');

                    const brandTitle = document.createElement('h3');
                    brandTitle.textContent = brand;
                    brandTitle.classList.add('brand-title');
                    brandBlock.appendChild(brandTitle);

                    const modelList = document.createElement('div');
                    modelList.classList.add('model-list');
                    modelList.style.display = 'none'; // Initially hidden

                    for (const [model, years] of Object.entries(models)) {
                        const modelBlock = document.createElement('div');
                        modelBlock.classList.add('model-block');

                        const modelTitle = document.createElement('h4');
                        modelTitle.textContent = model;
                        modelTitle.classList.add('model-title');
                        modelBlock.appendChild(modelTitle);

                        const yearList = document.createElement('div');
                        yearList.classList.add('year-list');
                        yearList.style.display = 'none'; // Initially hidden

                        for (const [year, images] of Object.entries(years)) {
                            const yearBlock = document.createElement('div');
                            yearBlock.classList.add('year-block');

                            const yearTitle = document.createElement('h5');
                            yearTitle.textContent = year;
                            yearTitle.classList.add('year-title');
                            yearBlock.appendChild(yearTitle);

                            const imageList = document.createElement('div');
                            imageList.classList.add('image-list');
                            imageList.style.display = 'none'; // Initially hidden

                            images.forEach(imageUrl => {
                                const img = document.createElement('img');
                                img.src = imageUrl;
                                img.alt = `${brand} ${model} ${year}`;
                                img.style.width = '200px';
                                img.style.margin = '10px';
                                imageList.appendChild(img);
                            });

                            yearTitle.addEventListener('click', function() {
                                imageList.style.display = imageList.style.display === 'none' ? 'block' : 'none';
                            });

                            yearBlock.appendChild(imageList);
                            yearList.appendChild(yearBlock);
                        }

                        modelTitle.addEventListener('click', function() {
                            yearList.style.display = yearList.style.display === 'none' ? 'block' : 'none';
                        });

                        modelBlock.appendChild(yearList);
                        modelList.appendChild(modelBlock);
                    }

                    brandTitle.addEventListener('click', function() {
                        modelList.style.display = modelList.style.display === 'none' ? 'block' : 'none';
                    });

                    brandBlock.appendChild(modelList);
                    imageContainer.appendChild(brandBlock);
                }
            })
            .catch(error => {
                imageContainer.textContent = 'Error: ' + error.message;
            });
    });
});