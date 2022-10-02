API_KEY="15340e5b23d1467bb03bc7343910e99f"
function makeRequest (method, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }
  
var kaggleset = {"apples":0.43,
    "bananas": 0.86,
    "barley": 1.18,
    "beef": 85.58,
    "blackberries": 1.53,
    "berries": 1.53,
    "grapes": 1.53,
    "brassicas": 0.51,
    "sugar": 3.2,
    "cassava": 1.32,
    "cheese": 23.88,
    "citrus Fruit": 0.39,
    "coffee": 28.53,
    "chocolate": 46.65,
    "carob": 9.3,
    "eggs": 4.67,
    "fish": 13.63,
    "groundnuts": 3.23,
    "lamb": 39.72,
    "goat": 39.72,
    "maize": 1.7,
    "milk": 3.15,
    "nuts": 0.43,
    "oatmeal": 2.48,
    "onions": 0.5,
    "leeks": 0.5,
    "fruit": 1.05,
    "legumes": 1.79,
    "vegetables": 0.53,
    "peas": 0.98,
    "pork": 12.31,
    "potatoes": 0.46,
    "poultry": 9.87,
    "prawns": 26.87,
    "rice": 4.45,
    "root Vegetables": 0.43,
    "soy milk": 0.98,
    "tofu": 3.16,
    "tomatoes": 2.09,
    "wheat": 1.57,
    "rye": 1.57,
    "wine": 1.79,
    "water": 0
}
    function classify(ingredientnames) {
        
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    resolve(xhr.response);      
                  } else {
                      console.error(xhr.statusText);
                    }
                }
            };
            var input = []
            for (var name of ingredientnames)
                input.push({ "title": name, "upc": "", "plu_code": "" })
            xhr.open("POST", `https://api.spoonacular.com/food/products/classifyBatch?apiKey=${API_KEY}`, false);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(input));

        });
    }
    var conversions = { "gram": 0.001,
                    "grams": 0.001,
                    "g": 0.001,
                    "oz": [0.0283495],
                    "ml": [0.001],
                    "cup": [0.24],
                    "serving": [0.24],
                    "cups": [0.24],
                    "servings": [0.24],
                    "can": [0.48],
                    "tbsp": [0.015],
                    "tbsps": [0.015],
                    "tsp": [0.005],
                    "tsps": [0.005],
                    "cloves": [0.015],
                    "clove": [0.015],
                    "pinches": [0.005],
                    "pinch": [0.005],
                    "": [0]
}
    /*function CO2(valuekg,ingredientname) { //returns in kg	
        
        return ;
    }*/
    
    //make sure these substitutes appear the kaggleset
    var substitutes = { "beef": ["legumes", "tofu"],
                    "chocolate": ["carob"],
                    "cheese": ["cashew", "sweet potato"],
                    "lamb": ["pork", "legumes"],
                    "goat": ["pork", "legumes"],
                    "coffee": ["water", "carob"],
                    "prawns": ["mushrooms", "tofu", "potatoes"],
                    "fish": ["tofu", "tempeh"],
                    "pork": ["tofu", "legumes"],
                    "poultry": ["tofu", "legumes"]
    }
    
    function kaggle(name) {
        console.log(name.toLowerCase());
        console.log(kaggleset.hasOwnProperty(name.toLowerCase()));
        if (kaggleset.hasOwnProperty(name.toLowerCase()))
            return kaggleset[name.toLowerCase()]
        else
            return 0
    }
    function comp(a, b) {
        return a[0] - b[0];
    }

    function query_callback() {
        return this.response;
    }
    function query(recipename){
        console.log("hi");
        const xhr = new XMLHttpRequest();
        makeRequest("GET", `https://api.spoonacular.com/recipes/complexSearch?query=${recipename}&apiKey=${API_KEY}`).then(function (response) {
            var recipes = JSON.parse(response);
            console.log(recipes);
            var recipedata = []
            console.log(recipes.results);
            for (var recipe of recipes.results){
                recipeinfo(recipe).then(function (response) {
                    recipedata.push(response);
                    console.log(recipedata);
                    // window.location.href = `/recipes.html?meal=${recipename}&result=${recipedata}`;   
                });
                break;
            }
            recipedata.sort(comp)
            console.log(recipedata);  
        })

        //recipedata stores array of carbon, recipe, substitutions; where substitutions[ingred][sub] = change in CO2 by replacing ingred with sub
    }
    

    function recipeinfo(recipe){   
        console.log(recipe); 
        var id = recipe['id']
        var title = recipe['title']
        var image = recipe['image']

        // var ingredientnames = [];
        // for (var ingredient of ingredients)
        //     ingredientnames.push(ingredient['name'])
        // var classifiednames = classify(ingredientnames)
        return new Promise(function(resolve, reject) {
            resolve(makeRequest("GET", `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${API_KEY}`).then(function (response) {
            ingredients = JSON.parse(response).ingredients;
            console.log(ingredients);
            var ingredientnames = [];
            for (var ingredient of ingredients)
                ingredientnames.push(ingredient['name'])   
            return [response, classify(ingredientnames)];
            
            }).then(function (response) {
                var carbon = 0;
                var dataset = [] // "name", CO2eq
                var substitutions = {};
                ingredients = JSON.parse(response[0]).ingredients;
                var ingredientnames = [];
                for (var ingredient of ingredients)
                    ingredientnames.push(ingredient['name'])
                for (var i = 0; i < ingredients.length; i++) {
                    //var ingredientname = classify(ingredient['name']);	
                    var ingredient = ingredients[i]
          
                    
                    var ingredientname = ingredient['name']
                    
                    if (!ingredientname in kaggleset){
                        for (var breadcrumb in response[1][i]["breadcrumbs"]){
                            if (breadcrumb in kaggleset){
                                ingredientname = breadcrumb;
                                break;
                            }
                        }
                    }
          
          
                    //const req = new XMLHttpRequest();
                    var value = ingredient["amount"]["metric"]["value"];
                    var unit = ingredient["amount"]["metric"]["unit"];
                    if (unit == "")
                        unit == "cup";
                    var valuekg
                    console.log(value);
                    //req.open("GET", `https://api.spoonacular.com/recipes/convert?ingredientName=${ingredient["name"]}&sourceAmount=${value}&sourceUnit=${unit}&targetUnit=grams&apiKey=92b54ee6a39e4d6d973a2af30bd87b27`, false);
                    if (value * conversions[unit] == "NaN") {
                        valuekg = 0
                    } else {
                        valuekg = value * conversions[unit];
                    }
                    
                    // console.log(valuekg);
                    dataset[ingredientname] = valuekg * kaggle(ingredientname)
                    // console.log(valuekg);
                    console.log(dataset[ingredientname]);
                    carbon += dataset[ingredientname]
                    
                    if (substitutes.hasOwnProperty(ingredientname)) {
                        substitutions[ingredientname] = {}
                        for (var sub in substitutes[ingredientname]) {
                            substitutions[ingredientname][sub] = valuekg * (kaggle("sub") - kaggle("ingredientname"))
                        }
                    }
                    }
                    return {carbon: carbon, recipe: recipe, ingredients: ingredients, substitutions: substitutions}
            }));
        });
    }
query("lasagna")