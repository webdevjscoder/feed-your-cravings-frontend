class CategoryAdapter {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    fetchAllCategories() {
        return fetch(this.baseUrl)
            .then(function(res) {
                return res.json()
            })
    }

    createNewCategory(configurationObject) {
        return fetch(this.baseUrl, configurationObject)
            .then(function(res) {
                return res.json();
            })
    }

    deleteCategory(categoryId) {
        return fetch(`${this.baseUrl}/${categoryId}`, {method: "DELETE"})
            .then(function(response){
                return response.json()
        })
    }
}