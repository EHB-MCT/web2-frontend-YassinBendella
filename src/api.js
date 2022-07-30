import axios from "axios";

const baseUrl = 'https://api.thedogapi.com/v1'

async function getBreeds(){
    const breeds = await axios.get(`${baseUrl}/breeds`, {
        headers: {
            'x-api-key': '12f0f4b9-66c7-4802-b2a0-8cf9f5a13bc5' 
        }
    });
    return breeds.data;
}

async function getCategories(){
    const breeds = await getBreeds();
    let categories = [];
    for (let breed of breeds){
        if (breed.temperament){
            categories = categories.concat(breed.temperament.split(', '));
        }
    }
    categories = categories.filter((e,index) => categories.indexOf(e) == index);
    return categories.map(e => e.trim());
}

async function getMatchingBreeds(options){
    const breeds = await getBreeds();
    const dogOptions = {
        size: sizes[options.size],
        characteristics: options.characteristics
    }
    return filterBreeds(breeds,dogOptions);
}

function filterBreeds(breeds, options){
    const result = []
    for (let breed of breeds){
        if (filterFunction(breed,options)){
            result.push(breed);
        }
    }
    return result;
}

function parseHeight(height){
    let heights = height.split(" - ")
    if (heights.length == 2){
        return {min: parseInt(heights[0]), max: parseInt(heights[1]) }
    }
    else{
        return {min: parseInt(heights[0]), max: parseInt(heights[0])}
    }
}

function filterFunction(breed,options){
    let dogHeight = parseHeight(breed.height.metric)
    if (dogHeight.min < options.size.min || dogHeight.max > options.size.max) return false
    if (breed.temperament == undefined) return false
    let characteristics = breed.temperament.split(",")
    let intersection = options.characteristics.filter(p => characteristics.includes(p))
    if (intersection.length == 0) return false
    breed.sortIndex = intersection.length
    return true
}

const sizes = {
    'small': {min: 0, max:40},
    'medium': {min: 40, max:70},
    'large': {min: 70, max:Infinity}
};

export {
    getCategories,
    getMatchingBreeds
}