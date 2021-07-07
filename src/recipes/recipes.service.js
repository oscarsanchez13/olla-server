const db = require("../../db")

const RecipesService = {
    async getAllRecipes(knex) {
        // return db()
        return knex.select('*').from('recipes')
    },
    getById(knex, id) {
        return knex 
            .from('recipes')
            .select('*')
            .where({ id })
            .first()
    },
    insertRecipe(knex, newRecipe) {
        return knex
            .insert(newRecipe)
            .into('recipes')
            .returning('*')
            .then(rows => rows[0])
    },
    deleteRecipe(knex, id) {
        return knex
            .from('recipes')
            .where({ id })
            .delete()
    },
    updateRecipe(knex, id, newRecipeFields) {
        return knex
            .from('recipes')
            .where({ id })
            .update(newRecipeFields)
    },
}

module.exports = RecipesService;