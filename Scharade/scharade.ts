const categorysElement = document.getElementById("categories");
const checkboxTemplate = '<input type="checkbox" name="{category}" id="{category}" value="{category}">';
var categories: string[] = [];

async function loadJson() {
    const response = await fetch('./words.json');
    const data = await response.json();
    categories = Object.keys(data);
}

loadJson();
console.log(categories)
categories.forEach((category: string)=> {
    categorysElement!.innerHTML = checkboxTemplate.replace('{category}', category);
    console.log("foreach")
});




