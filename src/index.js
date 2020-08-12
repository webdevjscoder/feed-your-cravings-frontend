document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000';
    // const MEALS_URL = `${BASE_URL}/meals`;
    // const CATEGORIES_URL = `${BASE_URL}/categories`;
    const categoriesContainer = document.querySelector('#category-container');
    const categoryForm = document.querySelector('#category-form');
    const addMealBtn = document.querySelector('#add-new-meal');
    const mealContainer = document.querySelector('#meal-container');
    let addMeal = false;
    const categoryAdapter = new CategoryAdapter(`${BASE_URL}/categories`)
    const mealAdapter = new MealAdapter(`${BASE_URL}/meals`);

    addMealBtn.addEventListener("click", () => {
        addMeal = !addMeal;
        if (addMeal) {
            categoriesContainer.style.display = "block";
            submitNewCategory();
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
                    <button class='add-meal' data-category-meal-id='${category.id}'>Add Meal</button>
                    <ul class="meals">
                    </ul>
                </div>
            `
        })
        // const nodeListOfCategoryDivs = document.querySelectorAll('.category')
        // nodeListOfCategoryDivs.forEach(function(div) {
            // mealContainer.addEventListener('click', (e) => {
            //         // console.log(e.target.dataset)
            //         // THIS DELETES CATEGORY
            //         if (e.target.className === "delete-category-btn") {
            //             let categoryId = e.target.dataset.categoryDeleteId;
            //             categoryAdapter.deleteCategory(categoryId)
            //                 .then(function(categoryInfo){
            //                     // console.log(categoryInfo.data.id)
            //                     document.querySelector(`[data-category-id="category-${categoryInfo.data.id}"]`).remove();
            //                     alert(`${categoryInfo.data.attributes.name} category has been deleted`);
            //                 })
            //         } else if (e.target.className === "add-meal") {
            //             const div = document.querySelector(`[data-category-id="category-${e.target.dataset.categoryMealId}"]`);
            //             const mealUl = div.querySelector('.meals');
            //             const divId = e.target.dataset.categoryMealId;
            //             div.innerHTML += renderMealForm();
            //             const mealForm = div.querySelector('#meal-form');
            //             submitNewMeal(mealForm, divId, mealUl, div);
                    
            //         }
            //     })
        // })
            categoryObj.included.forEach(function(meal)  {
                // const mealLink = document.querySelector(`[data-category-id="category-${meal.relationships.category.data.id}"]`).querySelector('a')
                // console.log(mealLink)
                const ul = document.querySelector(`[data-category-id="category-${meal.relationships.category.data.id}"]`).querySelector('.meals')
                ul.innerHTML += `
                    <li class='meal-title'>${meal.attributes.name}</li>
                    <li><em>Description:</em> ${meal.attributes.description}</li>
                    <li><em>Price:</em> $${meal.attributes.price}</li>
                    <li><button class='delete-meal' data-delete-meal-id='${meal.id}'>Delete Meal</button></li>
                `
                // mealLink.addEventListener('click', (e) => {
                //     e.preventDefault();
                //     addMeal = !addMeal;
                //     if (addMeal) {
                //         ul.style.display = "block";
                //     } else {
                //         ul.style.display = "none";
                //     }
                // })
            })
        }

        mealContainer.addEventListener('click', function(e) {
            e.preventDefault();
            addMeal = !addMeal;
            if (e.target.className === 'category-link') {
                let mealUl = document.querySelector(`[data-category-id="${e.target.parentElement.dataset.categoryId}"]`).querySelector('.meals')
                if (addMeal) {
                    mealUl.style.display = 'block';
                } else {
                    mealUl.style.display = 'none';
                }
            } else if (e.target.className === 'delete-category-btn') {
                let categoryId = e.target.dataset.categoryDeleteId;
                categoryAdapter.deleteCategory(categoryId)
                    .then(function(categoryInfo){
                    // console.log(categoryInfo.data.id)
                        document.querySelector(`[data-category-id="category-${categoryInfo.data.id}"]`).remove();
                        alert(`${categoryInfo.data.attributes.name} category has been deleted`);
                    })
            } else if (e.target.className === 'add-meal') {
                // console.log(e.target.dataset.categoryMealId)
                let parentDiv = e.target.parentElement;
                parentDiv.innerHTML += renderMealForm();
            } else if (e.target.type === 'submit') {
                let parentDivId = e.target.parentNode.parentNode.dataset.categoryId.split('-')[1];
                let mealUl = e.target.parentNode.parentNode.querySelector('.meals');
                let mealForm = e.target.parentElement;
                // console.log(mealForm, parentDivId)
                postMeal(mealForm, mealUl, mealFormData(mealForm, parentDivId))
            }
        })

    function postCategory(data) {
        let configurationObject = {
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
                            <button class='delete-category-btn' data-category-delete-id='${obj.data.id}'>x</button>
                            <button class='add-meal' data-category-meal-id='${obj.data.id}'>Add Meal</button>
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

    function submitNewCategory() {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // console.log(e.target)
            postCategory(formData());
        })
    }

    function renderMealForm() {
        return `
            <form id='meal-form'>
                <h3>Add Meal:</h3>
                <label>Name:</label>
                <input type='text' name='name' value='' placeholder="Cheeseburger, Steak, etc...">
                <label>Description:</label>
                <input type='text' name='description' value='' placeholder='Well Cook, lettuce, tomato, onion...'>
                <label>Price: $</label>
                <input type='number' name='price' value='' placeholder='14.95'>
                <input type='submit' name='submit' value='Submit'>
            </form>
        `
    }

    // function submitNewMeal(mealForm, divId, mealUl) {
    //     // console.log(mealForm)
    //     mealForm.addEventListener('submit', (e) => {
    //         // console.log(e.target)
    //         e.preventDefault();
    //         // postMeal(mealForm, mealUl, mealFormData(mealForm, divId))
    //     })
    // }

    function mealFormData(mealForm, divId) {
        return {
            name: mealForm.name.value,
            description: mealForm.description.value,
            price: Number(mealForm.price.value).toFixed(2),
            categoryId: divId
        }
    }

    function postMeal(mealForm, mealUl, data) {
        // console.log(mealForm)
        let objectData = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
            },
            body: JSON.stringify(data)
        };
        mealAdapter.createNewMeal(objectData)
            .then(function(json) {
                // console.log(json.included[0].id)
                if (!!json.data) {
                    mealUl.innerHTML += `
                        <li class='meal-title'>${json.data.attributes.name}</li>
                        <li><em>Description:</em> ${json.data.attributes.description}</li>
                        <li><em>Price:</em> $${json.data.attributes.price}</li>
                        <li><button class='delete-meal' data-delete-meal-id='${json.data.id}'>Delete Meal</button></li>
                    `
                    alert(`${json.data.attributes.name} was created successfully!`);
                    mealForm.reset();
                    mealForm.style.display = 'none';
                    console.log(mealUl)
                    mealUl.style.display = 'block';
                } else {
                    alert(json.message);
                }
            })
    }
})