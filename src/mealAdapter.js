class MealAdapter {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    createNewMeal(objectData) {
        return fetch(this.baseUrl, objectData)
            .then(function(res) {
                return res.json();
            })
    }
}