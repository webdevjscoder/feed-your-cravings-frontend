const BASE_URL = 'http://localhost:3000';
const MEALS_URL = `${BASE_URL}/meals`;
const CATEGORIES_URL = `${BASE_URL}/categories`;

function fetchAllCateories() {
    fetch(CATEGORIES_URL)
        .then(function(response) {
            return response.json()
        })
        .then(function(object) {
            // create div for catergory objects
            object.data.forEach(function(category) {
                // category.id -- retrieves the id for a category
                // category.attributes.name -- this selects the category names but only in singles not in array
                document.querySelector('main').innerHTML += `
                    <div class='meal-card' data-id="${category.id}">
                        <p>${category.attributes.name}</p>
                        <ul class='meal-list'>
                        </ul>
                    </div>
                `
            })
            object.included.forEach(function(meal) {
                let category = document.querySelector(`[data-id="${meal.relationships.category.data.id}"]`).querySelector('ul');
                category.innerHTML += `
                    <li>${meal.attributes.name}</li>
                    <li>${meal.attributes.price}</li>
                `
                // meal.id -- this retrieves the id for each meal
                // meal.attributes.name -- this grabs all the name for the meals but not in array
                // meal.attributes.price -- this grabs all the prices for meals but not in array
            })
        })
}

fetchAllCateories()