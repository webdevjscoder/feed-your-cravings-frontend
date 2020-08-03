const BASE_URL = 'http://localhost:3000';
const MEALS_URL = `${BASE_URL}/meals`;
const CATEGORIES_URL = `${BASE_URL}/categories`;

function fetchAllCategoriesAndMeals() {
    fetch(CATEGORIES_URL)
        .then(function(response) {
            return response.json()
        })
        .then(function(object) {
            object.data.forEach(function(category) {
                document.querySelector('.category-container').innerHTML += `
                        <div class='menu-list' data-id="${category.id}">
                            <a id='button' href='#'>${category.attributes.name}</a>
                            <div class='meal-title'>
                            </div>
                        </div>
                `
            })
            object.included.forEach(function(meal) {
                document.querySelector(`[data-id="${meal.relationships.category.data.id}"]`).querySelector('#button').addEventListener('click', function(e) {
                    e.preventDefault();
                    const mealTitle = document.querySelector(`[data-id="${meal.relationships.category.data.id}"]`).querySelector('.meal-title');
                    if (mealTitle) {
                        mealTitle.style.display = 'block'; 
                        mealTitle.innerHTML += `
                            <ul class='meal' data-meal-id="${meal.id}">
                                <li>${meal.attributes.name}</li>
                            </ul>
                        `
                    }
                    mealTitle.querySelector(`[data-meal-id="${meal.id}"]`).querySelector('li').addEventListener('click', function(e) {
                        e.preventDefault();
                        const mealContainer = document.querySelector('.meal-container')
                        mealContainer.innerHTML += `
                            <div class='meal-card'>
                                <ul>
                                    <li>${meal.attributes.name}</li>
                                    <li>${meal.attributes.description}</li>
                                    <li>${meal.attributes.price}</li>
                                </ul>
                            </div>
                        `
                    })
                })
            })
        })
        .catch(errors => alert(errors));
}

document.addEventListener("DOMContentLoaded", function (){
    fetchAllCategoriesAndMeals()
});