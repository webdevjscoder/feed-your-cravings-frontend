const BASE_URL = 'http://localhost:3000';
const MEALS_URL = `${BASE_URL}/meals`;
const CATEGORIES_URL = `${BASE_URL}/categories`;
const categoriesContainer = document.querySelector('#category-container');
const categoryForm = document.querySelector('#category-form');
const addMealBtn = document.querySelector('#add-new-meal');
const mealContainer = document.querySelector('#meal-container');
let addMeal = false;
const categoryAdapter = new CategoryAdapter(`${BASE_URL}/categories`)

addMealBtn.addEventListener("click", () => {
    addMeal = !addMeal;
    if (addMeal) {
        categoriesContainer.style.display = "block";
        submitNewMeal();
    } else {
        categoriesContainer.style.display = "none";
    }
});

categoryAdapter.fetchAllCategories()
    .then(function(categoryObj) {
        // console.log(categoryObj)
        createMenu(categoryObj)
    })
    .catch(errors => alert(errors))

function createMenu(categoryObj) {
    // console.log(categoryObj)
    categoryObj.data.forEach(function(category) {
        // console.log(categoryObj)
        // console.log(category)
        mealContainer.innerHTML += `
            <div class="category" data-category-id="category-${category.id}">
                <a class='category-link' href="#">${category.attributes.name}</a>
                <button class='delete-category-btn' data-category-delete-id='${category.id}'>x</button>
                <ul class="meals">
                </ul>
            </div>
        `
    })
    const nodeListOfCategoryDivs = document.querySelectorAll('.category')
    nodeListOfCategoryDivs.forEach(function(div) {
        let divButton = div.querySelector('.delete-category-btn')
        divButton.addEventListener('click', function(e) {
            let categoryId = e.target.dataset.categoryDeleteId;
            categoryAdapter.deleteCategory(categoryId)
                .then(function(categoryInfo){
                    // console.log(categoryInfo.data.id)
                    document.querySelector(`[data-category-id="category-${categoryInfo.data.id}"]`).remove();
                    alert(`${categoryInfo.data.attributes.name} category has been deleted`);
                })
                .catch(errors => alert(errors));
        })
    })
    categoryObj.included.forEach(function(meal)  {
        const mealLink = document.querySelector(`[data-category-id="category-${meal.relationships.category.data.id}"]`).querySelector('a')
        // console.log(mealLink)
        const ul = document.querySelector(`[data-category-id="category-${meal.relationships.category.data.id}"]`).querySelector('.meals')
        ul.innerHTML += `
            <li class='meal-title'>${meal.attributes.name}</li>
            <li><em>Description:</em> ${meal.attributes.description}</li>
            <li><em>Price:</em> $${meal.attributes.price}</li>
        `
        mealLink.addEventListener('click', (e) => {
            e.preventDefault();
            addMeal = !addMeal;
            if (addMeal) {
                ul.style.display = "block";
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
    categoryAdapter.createNewCategory(configurationObject)
        .then(function(obj) {
            // console.log(obj)
            if (!!obj.data) {
                mealContainer.innerHTML += `
                    <div class="category" data-category-id="category-${obj.data.id}">
                        <a class='category-link' href="#">${obj.data.attributes.name}</a>
                        <button class='delete-category-btn' data-category-delete-id='${obj.data.id}'>X</button>
                        <ul class="meals">
                        </ul>
                    </div>
                `
                alert(`${obj.data.attributes.name} category has been created`);
                categoryForm.reset();
                categoriesContainer.style.display = 'none';
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
 