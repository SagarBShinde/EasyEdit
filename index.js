console.log ("From the from Renderer -2");

const newFieldBtn = document.getElementById('CreateBtn');

newFieldBtn.addEventListener('click', function(event){
  console.log('Inside listner')
  let yamlData = readYaml();
  let mainDiv = document.createElement("div");
  mainDiv.setAttribute("id", "main-container");
  document.body.appendChild(mainDiv);
  document.getElementById("main-container").appendChild(createObjNode(yamlData));
  // document.body.appendChild(createObjNode(yamlData));
  // let node = document.getElementById('header')  
})


function createObjNode(jsonObj){
  if (jsonObj === null)
  return;
  let objList = createList();
  for (var i in jsonObj) {
    console.log("value of i is:" + i);
    console.log("value of obj[i] is:" + jsonObj[i]);
    let listDiv = createListItem(i,jsonObj[i]);
      objList.appendChild(listDiv);
      if (jsonObj[i] !== null && typeof(jsonObj[i])=="object" ){
        let list = createObjNode(jsonObj[i]);  
        listDiv.appendChild(list);  
      }
    }
  return objList;
}

function createList() {
  let list = document.createElement("ul");
  list.setAttribute("class", "yamlList");
  return list;

}

function createListItem(yamlKey, yamlVal){
  let listItem = document.createElement('li')
  let listDiv = document.createElement("div");
  listDiv.setAttribute("id", yamlKey+'_div');
  listDiv.setAttribute("class", 'listDiv');
  listDiv.appendChild(createKeyItem(yamlKey));
  listDiv.appendChild(createSeparatorItem());
  if (typeof(yamlVal)!== "object") {
    listDiv.appendChild(createValueItem(yamlVal));
  }
 listItem.appendChild(listDiv)
  return listItem;
}

function createKeyItem(yamlKey){
  let keyNode = document.createElement('input');
  keyNode.setAttribute("id", yamlKey);
  keyNode.setAttribute("class", "keyInput");
  keyNode.setAttribute("value", yamlKey);
  return keyNode;

}

function createSeparatorItem(){
  let separatorNode = document.createElement("span");
  separatorNode.setAttribute("class", "separator")
  separatorNode.textContent = ":";
  return separatorNode;
}

function createValueItem(yamlval){
  let valNode = document.createElement('input');
  valNode.setAttribute("id", yamlval)
  valNode.setAttribute("class", "valInput")
  valNode.setAttribute("value", yamlval);
  return valNode;

}

function readYaml(){
  const fs = require('fs');
  const yaml = require('js-yaml');

  try {
    let fileContents = fs.readFileSync('./empl.yaml', 'utf8');
    let data = yaml.safeLoad(fileContents);
    return data
  } catch (e) {
    console.log(e);
  }
}








