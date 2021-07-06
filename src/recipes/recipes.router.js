const path = require('path');
const express = require('express');
const xss = require('xss'); // for sanitisation purposes
const RecipesService = require('./recipes.service');

const recipesRouter = express.Router();
const jsonParser = express.json();

const serializeRecipe = recipe => ({
    id: recipe.id,
    name: xss(recipe.name),
})

recipesRouter
    .route('/')
    .get((req, res, next) => {
        RecipesService.getAllRecipes(req.app.get('db'))
            .then(recipes => {
                console.log(recipes)
                res.json(recipes.recipes)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const newRecipe = { name };

        for (const [key, value] of Object.entries(newRecipe))
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing 'name' in request body`}
                })
            }


        RecipesService.insertRecipe(
            req.app.get('db'),
            newRecipe
        )
            .then(recipe => {
                res .status(201)
                    .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
                    .json(serializeRecipe(recipe))
            })
            .catch(next)
    }) 
    


module.exports = recipesRouter;