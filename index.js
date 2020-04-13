console.log ("From the from Renderer -2");

const newFieldBtn = document.getElementById('CreateBtn');

newFieldBtn.addEventListener('click', function(event){
  console.log('Inside listner')
  let yamlData = readYaml();
  // traverse(yamlData, process, 0)
  let mainDiv = document.createElement("div");
  mainDiv.setAttribute("id", "main-container");
  document.body.appendChild(mainDiv);
  document.body.appendChild(createObjNode(yamlData));
  let node = document.getElementById('header')  
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
        //objList
        //objList.appendChild(list);
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
  //parentList.appendChild(listDiv)
  if (typeof(yamlVal)!== "object") {
    listDiv.appendChild(createValueItem(yamlVal));
  }
 // parentList.appendChild(listDiv);
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
  let separatorNode = document.createElement('span');
  separatorNode.setAttribute("class", "separator")
  separatorNode.setAttribute("value", ":");
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

//called with every property and its value
function process(key,value, spacing) {
  let space = ""
  for (i=0; i<spacing; i++){
    space = space + "  "
  }
  if (value!== null && typeof(value)=="object"){ 
    console.log(space+ key + " : ");
    }else { 
    console.log(space + key + " : "+value); 
  }
}

function traverse(o,func, spacing) {
  // let spacing = spacing;
  for (var i in o) {
      func.apply(null,[i,o[i],spacing]);  
      if (o[i] !== null && typeof(o[i])=="object") {
          //going one step down in the object tree!!
          spacing += 1;
          traverse(o[i],func, spacing);
          spacing -= 1;
      }
  }
}

function representYaml(jsonObj){
if (jsonObj === null)
  return;
let tbl = createTable();
for (var i in jsonObj) {
  console.log("value of i is:" + i);
  console.log("value of obj[i] is:" + jsonObj[i]);
    addRow(tbl,i,jsonObj[i]);
    if (jsonObj[i] !== null && typeof(jsonObj[i])=="object" ){
        let row = tbl.insertRow()
        row.insertCell();
        row.insertCell().appendChild(representYaml(jsonObj[i]));     
    }
  }
return tbl;
}


function createTable(){
  var body = document.body,
  tbl  = document.createElement('table');
  tbl.setAttribute("class", 'yamlTable')
  // tbl.style.width  = '100px';
  return tbl;
}

function addRow(tbl,key,value){
  var tr = tbl.insertRow();
  var td1 = tr.insertCell();
  keyNode = document.createElement("INPUT");
  keyNode.setAttribute("type", "text");
  keyNode.setAttribute("name", key);
  keyNode.setAttribute("id", key);
  keyNode.setAttribute("class", 'key');
  keyNode.setAttribute("value", key+':');
  keyNode.style.width = key.length + "ch";
  td1.appendChild(keyNode);
  // td1.appendChild(document.createTextNode(key+ ':'));
  if (typeof(value)!== "object") {
    var td2 = tr.insertCell();
    valueNode = document.createElement("INPUT");
    valueNode.setAttribute("type", "text");
    valueNode.setAttribute("name", value);
    valueNode.setAttribute("id", value);
    valueNode.setAttribute("value", value);
    td2.appendChild(valueNode);
  }
}


