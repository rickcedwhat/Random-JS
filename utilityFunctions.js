function hyphenToCamel(str) {
    return str.replace(/-([a-z])/g, (match) => match[1].toUpperCase());
}

function isEmpty(item) {
    return item === null || item === undefined;
}

function elementAssembler({
    attributes,
    parent,
    className,
    elementType = "div",
    innerHTML,
    data,
    style,
}){
    const newElement = document.createElement(elementType);
    if (!isEmpty(className)) {
        newElement.className = className;
    }
    if (attributes) {
        Object.keys(attributes).forEach((key) => {
            newElement.setAttribute(key,attributes[key]);
        });
    }
    if (!isEmpty(innerHTML)) {
        newElement.innerHTML = innerHTML;
    }
    if (data) {
        Object.keys(data).forEach((key) => {
            newElement.dataset[key] = data[key];
        });
    }
    if (parent) {
        parent.append(newElement);
    }
    if (style) {
        for (const [key, value] of Object.entries(style)) {
            newElement.style[key] = value;
        }
    }
    return newElement;
};

function isInsideElement(parent, child){
    let node = child;
    while (node) {
        if (node === parent) {
            return true;
        }

        // Traverse up to the parent
        node = node.parentNode;
    }

    // Go up until the root but couldn't find the `parent`
    return false;
};

function addCustomToggle(element,options){
    // get className from options or default to "show"
    const className = options?.className || "show";
    const toggleElement = options?.toggleElement || element;
    const weakToggle = options?.weakToggle ;
    
    // function to handle clicks outside of element
    const handleClick = (e) => {
        if(!isInsideElement(element,e.target)){
            toggleElement.customToggle();
        }
    };

    // add click event to element, add class and attach handleClick event
    element.addEventListener('click',(e) => {
        console.log({element,className,toggleElement,weakToggle})
        e.stopPropagation();
        if(weakToggle){
            toggleElement.classList.toggle(className);
        }else{
            toggleElement.classList.add(className);
            document.addEventListener('click',handleClick);
        }
    });

    // custom toggle method to remove class and remove handleClick event
    toggleElement.customToggle = function(){
        if(weakToggle){
            toggleElement.classList.toggle(className);
        }else{
            toggleElement.classList.remove(className);
            document.removeEventListener('click',handleClick);
        }
    }
}

function createRandomID(){
    let randomID="";
    for(i=0;i<16;i++){
        randomID+=Math.floor(Math.random()*9);
    }
    return randomID;
}

function getRandomElement(optionsArray){
    const length=optionsArray.length;
    const index=Math.floor(Math.random()*length);
    return optionsArray[index];
}

const privateData = new WeakMap();

const customObjectsCache = new WeakMap();


  