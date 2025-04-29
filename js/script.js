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
                const carGroups = {};

                // Group cars by their brand, model, and year
                for (const [key, value] of Object.entries(data)) {
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
                    carGroups[carBrand][carModel][carYear].push(value);
                }

                // Create a block for each car brand
                for (const [brand, models] of Object.entries(carGroups)) {
                    const brandBlock = document.createElement('div');
                    brandBlock.classList.add('brand-block');

                    const brandTitle = document.createElement('h3');
                    brandTitle.textContent = brand;
                    brandTitle.style.cursor = 'pointer';
                    brandBlock.appendChild(brandTitle);

                    const modelList = document.createElement('ul');
                    modelList.classList.add('model-list');
                    modelList.style.display = 'none'; // Initially hidden

                    for (const [model, years] of Object.entries(models)) {
                        const modelItem = document.createElement('li');
                        modelItem.textContent = model;
                        modelItem.classList.add('model-item');
                        modelItem.style.cursor = 'pointer';

                        const yearList = document.createElement('ul');
                        yearList.classList.add('year-list');
                        yearList.style.display = 'none'; // Initially hidden

                        for (const [year, images] of Object.entries(years)) {
                            const yearItem = document.createElement('li');
                            yearItem.textContent = year;
                            yearItem.classList.add('year-item');
                            yearItem.style.cursor = 'pointer';

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

                            yearItem.addEventListener('click', function() {
                                imageList.style.display = imageList.style.display === 'none' ? 'block' : 'none';
                            });

                            yearItem.appendChild(imageList);
                            yearList.appendChild(yearItem);
                        }

                        modelItem.addEventListener('click', function() {
                            yearList.style.display = yearList.style.display === 'none' ? 'block' : 'none';
                        });

                        modelItem.appendChild(yearList);
                        modelList.appendChild(modelItem);
                    }

                    brandTitle.addEventListener('click', function() {
                        modelList.style.display = modelList.style.display === 'none' ? 'block' : 'none';
                    });

                    brandBlock.appendChild(modelList);
                    imageContainer.appendChild(brandBlock);
                }
            })
            .catch(error => {
                outputField.textContent = 'Error: ' + error.message;
            });
    });
});