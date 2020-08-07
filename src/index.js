const BASE_URL = 'http://localhost:3000';
const MEALS_URL = `${BASE_URL}/meals`;
const CATEGORIES_URL = `${BASE_URL}/categories`;
const categoriesContainer = document.querySelector('#category-container');
const categoryForm = document.querySelector('#category-form');
const addMealBtn = document.querySelector('#add-new-meal');
const mealContainer = document.querySelector('#meal-container');
let addMeal = false;

addMealBtn.addEventListener("click", () => {
    addMeal = !addMeal;
    if (addMeal) {
        categoriesContainer.style.display = "block";
        submitNewMeal();
    } else {
        categoriesContainer.style.display = "none";
    }
});

function fetchAllCategories() {
    fetch(CATEGORIES_URL)
        .then(function(res) {
            return res.json()
        })
        .then(function(categoryObj) {
            // console.log(categoryObj)
            createMenu(categoryObj)
        })
        .catch(errors => alert(errors))
}

function createMenu(categoryObj) {
    // console.log(categoryObj)
    categoryObj.data.forEach(function(category) {
        // console.log(categoryObj)
        // console.log(category)
        mealContainer.innerHTML += `
            <div class="category" data-category-id="category-${category.id}">
                <a href="#">${category.attributes.name}</a>
                <ul class="meals">
                </ul>
            </div>
        `
    })
    categoryObj.included.forEach(function(meal)  {
        const mealLink = document.querySelector(`[data-category-id="category-${meal.relationships.category.data.id}"]`).querySelector('a')
        // console.log(mealLink)
        mealLink.addEventListener('click', (e) => {
            e.preventDefault();
            const ul = document.querySelector(`[data-category-id="category-${meal.relationships.category.data.id}"]`).querySelector('.meals')
            addMeal = !addMeal;
            if (addMeal) {
              ul.style.display = "block";
              ul.innerHTML += `
                <li>${meal.attributes.name}</li>
                <li>${meal.attributes.description}</li>
                <li>$${meal.attributes.price}</li>
            `
            } else {
              ul.style.display = "none";
            }
        })
    })
    
}

function postCategory(data) {
    configurationObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(CATEGORIES_URL, configurationObject)
        .then(function(res) {
            return res.json();
        })
        .then(function(obj) {
            // console.log(obj)
            if (!!obj.data) {
                debugger;
                mealContainer.innerHTML += `
                    <div class="category" data-category-id="category-${obj.data.id}">
                        <a href="#">${obj.data.attributes.name}</a>
                        <ul class="meals">
                        </ul>
                    </div>
                `
            } else {
                alert(obj.message)
            }
        })
        .catch(errors => alert(errors))
}

function formData() {
    return {
        name: categoryForm.name.value
    };
};

function submitNewMeal() {
    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // console.log(e.target)
        postCategory(formData());
    })
}

// function createMenu(categoriesObj) {
//     // console.log(categoriesObj.included)
//     categoriesObj.data.forEach(function(category) {
//         // console.log(category)
//         categoriesContainer.innerHTML += `
//             <div class='menu-list' data-id="category-${category.id}">
//                 <p>${category.attributes.name}</p>
//                 <ul id="category-${category.id}-meals">
//                 </ul>
//             </div>
//         `
//     })
//     categoriesObj.included.forEach(function(meal) {
//         // console.log(meal)
//         document.querySelector(`[data-id="category-${meal.relationships.category.data.id}"]`).querySelector('p')
//             let mealList = document.querySelector(`[data-id="category-${meal.relationships.category.data.id}"]`).querySelector(`[id="category-${meal.relationships.category.data.id}-meals"]`)
//             // console.log(mealList)
//                 mealList.innerHTML += `
//                     <li><p>${meal.attributes.name}</p></li>
//                 `
//         })
// }

fetchAllCategories();