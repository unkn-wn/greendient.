# greendient.


Greendient, a way to improve sustainability of recipes by minimizing carbon footprint through the identification of viable substitutes.

The backend was created using node.js and the spoonacular API. When the user searches for a meal, the application retrieves a list of recipes for the meal. It then computes the total effective CO2 footprint for each recipe by mapping each ingredient to the most similar ingredient in a database of CO2 footprints. Finally, substitutes for each ingredient are found through a substitute database and the net increase or decrease of the CO2 footprint is calculated.
