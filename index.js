let $ = require('jquery');

const viewBtn = document.getElementById('View');
const jsonTab = document.getElementById('jsonView');
const yamlTab = document.getElementById('yamlView');
const openFile = document.querySelector("#selectFile");
const readPrivew = document.querySelector("#ReadPreview");
// const {dialog} = require('electron').remote;
const app = require('electron').remote
const dialog = app.dialog
const fs = require('fs')
var inputData = "";

openFile.onclick = () =>{
   console.log ("Button clicked");
   dialog.showOpenDialog(app.getCurrentWindow(), {
    properties: ["openFile", "multiSelections"]
    }).then(result => {
     if (result.canceled === false) {
        console.log("Selected file paths:")
        document.getElementById("fileLocation").setAttribute("value" , result.filePaths[0])
        inputData = readFile(result.filePaths[0]);
    }
  }).catch(err => {
      console.log(err)
  })

}

readPrivew.onclick = () =>{
  const yaml = require('js-yaml'); 
  console.log("Reading from preview panel");
  inputData = yaml.safeLoad(document.querySelector("#editor").value);
}




viewBtn.addEventListener('click', function(event){
  console.log('Inside listner')
 // let yamlData = readYaml();
 // console.log("Input data is:"+ JSON.stringify(yamlData));
 console.log("Input data is:"+ JSON.stringify(inputData));
  let mainDiv = document.getElementById('main-listView');
  let rootListDiv = document.createElement("div");
  rootListDiv.setAttribute("id","rootListDiv");
  
  let expandButton = createButton("&#43;","expand-button","root-expand-button");
  expandButton.addEventListener('click', function(){
    $("#root").toggle('visible');
  });  
  
  mainDiv.append(expandButton);
  mainDiv.appendChild(rootListDiv)
  //rootListDiv.appendChild(createObjNode(yamlData, "root"));
  rootListDiv.appendChild(createObjNode(inputData, "root"));
  $('.yamlList').hide();

})


jsonTab.addEventListener ('click', function(event){
  const yaml = require('js-yaml');  
  let obj = new Object();
    obj['root'] = createJSONObj($("#root").children());
  $('#editor').val(JSON.stringify(obj.root, null, '\t'));
 
})

yamlTab.addEventListener ('click', function(event){
  const yaml = require('js-yaml');  
  let obj = new Object();
    obj['root'] = createJSONObj($("#root").children());
  $('#editor').val(yaml.safeDump(obj.root));
 
})
  function createJSONObj(nodeList){
    if (nodeList){
      let obj = new Object();
      nodeList.each( function (){
        console.log("Priting drop down value")
        let data_type = $(this).children('div').children('select').first().prop('value');
        console.log("Data type is:"+ data_type);
       // if ($(this).children('div').first().prop('class') === 'listItem'){
        if ( data_type === 'String' || data_type === 'Number' || data_type === 'Boolean'){ 
          let strVal = $(this).children('div').children('input').last().prop('value');
          console.log("strVal:"+ strVal);
          let valType = $(this).children('div').children('input').last().attr('type');  
          // console.log("valType:"+ valType);
          console.log("***********"+ strToType(strVal,data_type));
          obj[$(this).children('div').children('input').first().prop('value')] = strToType(strVal,data_type);
        } else{
         // if ($(this).children('div').first().prop('class') === 'ArrayListDiv'){
          if (data_type === 'Array'){ 
            let objArray = new Array();
            $(this).children('ul').first().children().each(function(index){
              let data_type2= $(this).children('div').first().children('select').first().prop("value");
               // if ($(this).children('div').first().children('select').first() === 'listItem'){
                if (data_type2 === 'String' || data_type2 === 'Number' || data_type2 === 'Boolean'){   
                  let strVal = $(this).children('div').children('input').last().prop('value');
                  console.log("strVal:"+ strVal);
                  // let valType = $(this).children('div').children('input').last().attr('type'); 
                  // console.log("valType:"+ valType);
                  console.log("------------"+ strToType(strVal,data_type2));
                  objArray.push(strToType(strVal,data_type2));
                } else {
                objArray.push(createJSONObj($(this).children('ul').first().children()));
                }
            });
            obj[$(this).children('div').children('input').first().prop('value')] = objArray;
          } else {
          obj[$(this).children('div').children('input').first().prop('value')] = createJSONObj($(this).children('ul').first().children());
          }
        }
      })
    return obj;
  }

}


function createObjNode(jsonObj, divId){
  if (jsonObj === null)
  return;
  let objList = createList(divId);
  for (var i in jsonObj) {
    console.log("value of i is:" + i);
    console.log("value of obj[i] is:" + jsonObj[i]);
    console.log ("type of value:" + typeof jsonObj[i])
    let listDiv = createListItem(i,jsonObj[i]);
      objList.appendChild(listDiv);
      if (jsonObj[i] !== null && typeof(jsonObj[i])=="object" ){
        let list;
        if (jsonObj[i] instanceof Array){
          list = createObjNode(jsonObj[i], "array-list-"+i); 
        }else{
          list = createObjNode(jsonObj[i], "list-"+i);  
        }
        listDiv.appendChild(list); 
      }
    }
  return objList;
}

function createList(divId) {
  let list = document.createElement("ul");
  list.setAttribute("class", "yamlList");
  list.setAttribute("id",divId )
  return list;

}

function createListItem(yamlKey, yamlVal){
  let listItem = document.createElement('li');
  let listDiv = document.createElement("div");
  let typeDropDown = createTypeDropDown();
  listDiv.setAttribute("id", yamlKey+'_div');
  listDiv.appendChild(createKeyItem(yamlKey));
  listDiv.appendChild(createSeparatorItem());
  
  if (typeof(yamlVal)!== "object") {
    listDiv.setAttribute("class", 'listItem');
    let valItem = createValueItem(yamlVal);
    listDiv.appendChild(valItem);
    typeDropDown.value = getType(yamlVal);
    
  } else{
      if(yamlVal instanceof Array){
        listDiv.setAttribute("class", 'ArrayListDiv');
        typeDropDown.value = "Array"
      }else{
        if (yamlVal === null){
          listDiv.setAttribute("class", 'listItem');
          listDiv.appendChild(createValueItem(yamlVal));
          typeDropDown.value = "null"
        } else {
        listDiv.setAttribute("class", 'listDiv');
        typeDropDown.value = "Object"
        }
      }
    let expandButton = createButton("&#43;","expand-button",yamlKey+"-expand-button");
    listDiv.appendChild(expandButton);
    expandButton.addEventListener('click', function(){
      if (yamlVal instanceof Array){
        $(this).parent('div').next("#array-list-"+yamlKey).toggle('visible')
      }else{
        $(this).parent('div').next("#list-"+yamlKey).toggle('visible')
      }
    })
  }
  // let addChildBtn = createButton("&#8618;", "addChildBtn", "addChild"+yamlKey);
  // let deleteBtn = createButton("&#128465;", "deleteBtn", "del"+yamlKey);
  // let addSibBtn = createButton("&#8680;", "addSibBtn", "addSib"+yamlKey);

  // addEventListenerDel(deleteBtn);
  // addEventListenerChd(addChildBtn);
  // addEventListenerSib(addSibBtn);

  // listDiv.appendChild(addChildBtn);
  // listDiv.appendChild(addSibBtn);
  // listDiv.appendChild(deleteBtn);

  // listDiv.appendChild(typeDropDown);
  listItem.appendChild(listDiv);
  return listItem;
}

function createKeyItem(yamlKey){
  // let keyNode = document.createElement('input');
  // keyNode.setAttribute("id", yamlKey);
  // keyNode.setAttribute("class", "keyInput");
  // keyNode.setAttribute("type", getType(yamlKey));
  // keyNode.setAttribute("value", yamlKey);
  // return keyNode;

  let keyNode = document.createElement('span');
  keyNode.setAttribute("id", yamlKey);
  keyNode.setAttribute("class", "keyInput");
  keyNode.setAttribute("type", getType(yamlKey));
  keyNode.innerHTML = yamlKey;
  return keyNode;

}

function createSeparatorItem(){
  let separatorNode = document.createElement("span");
  separatorNode.setAttribute("class", "separator")
  separatorNode.textContent = ":";
  return separatorNode;
}

function createValueItem(yamlval){
  // let valNode = document.createElement('input');
  // valNode.setAttribute("id", yamlval)
  // valNode.setAttribute("class", "valInput")
  // valNode.setAttribute("type", getType(yamlval));
  // valNode.setAttribute("value", yamlval);
  // return valNode;

  let valNode = document.createElement('span');
  valNode.setAttribute("id", yamlval)
  valNode.setAttribute("class", "valInput")
  valNode.setAttribute("type", getType(yamlval));
  valNode.innerHTML =  yamlval;
  return valNode;

}

function readFile(filePath){
  const fs = require('fs');
  const yaml = require('js-yaml');

  try {
    let fileContents = fs.readFileSync(filePath, 'utf8');
    console.log("File contents are:"+ fileContents);
    //let fileContents = fs.readFileSync('./espn-app-android-app.yaml', 'utf8');
    let fileType = "";
    //let data = yaml.safeLoad(fileContents);
    // fileTypeElements = document.getElementsByName('optFileType')
    // for (let i = 0; i < fileTypeElements.length; i++){
    //   if (fileTypeElements[i].checked === true){
    //     fileType = fileTypeElements[i].labels[0].innerText
    //     console.log("File type is:"+ fileType);
    //     break;
    //   }
    // }
    return readData(fileContents, fileType);
    // switch(fileType) {
    //   case "JSON":
    //       console.log("File contents are:"+ fileContents);
    //       inputData = JSON.parse(fileContents);
    //       break;
    //     case "YAML":
    //       inputData = yaml.safeLoad(fileContents);
    //       break;

    //     default:
    //       console.log("Unknown file format")
    //       inputData = ""
    // }
    // return inputData;
  } catch (e) {
    console.log(e);
  }
}

function getDataType(){
  let DataTypeElements = document.getElementsByName('optFileType');
  let DataType = ""
  for (let i = 0; i < DataTypeElements.length; i++){
    if (DataTypeElements[i].checked === true){
      DataType = fileTypeElements[i].labels[0].innerText
      console.log("File type is:"+ fileType);
      break;
    }
    return DataType 
 }
}

function readData(content, contentType){
  let inputData
  switch(contentType) {
    case "JSON":
        console.log("File contents are:"+ fileContents);
        inputData = JSON.parse(content);
        break;
      case "YAML":
        inputData = yaml.safeLoad(content);
        break;

      default:
        console.log("Unknown file or Data type")
        inputData = ""
  }
  return inputData;


}

function getType(value){
    let val_type
    switch (typeof value){
  
      case 'number':
        val_type = 'Number';   
        break;  
      case 'string':
          val_type = 'String';   
          break;
      case 'boolean':
          val_type = 'Boolean';   
          break;
      // for null item the type is returned as object
      case 'object':
        val_type = 'null';
        break;
      // add exception for invalid value type
      default:
        val_type ='';    
    }
    return val_type;
  }

function strToType(strvalue, valType){
  let returnValue;
  switch (valType){

    case 'Number':
      returnValue = Number(strvalue);
      break;
    case 'String':
       returnValue = strvalue;
      break;
    case 'Boolean':
        returnValue = Boolean(strvalue);
        break;
    case 'null':
    returnValue = null;
    // add exception for invalid value type
    default:
      returnValue = null;    
  }
  return returnValue;
}

function createTypeDropDown(){

  let typeDropDown = document.createElement("select");
  
  typeDropDown.setAttribute("class", "typeDropDown");
  typeDropDown.options.add(new Option("String"));
  typeDropDown.options.add(new Option("Number"));
  typeDropDown.options.add(new Option("Boolean"));
  typeDropDown.options.add(new Option("Array"));
  typeDropDown.options.add(new Option("Object"));
  typeDropDown.options.add(new Option("null"));

  return typeDropDown;

}

function createButton(btnLabel, btnClass, btnId){
  let btn = document.createElement("button");
    btn.innerHTML=btnLabel
    btn.setAttribute("class", btnClass);
    btn.setAttribute("id", btnId);
    return btn;
}

function addEventListenerDel(button){
  button.addEventListener('click', function(){
      $(button).closest('li')[0].remove();
    });  
} 

function addEventListenerSib(button){
  console.log("Adding listners for Sibling");
    button.addEventListener('click', function(){
      console.log("Inside listners for add Child");
        $(createListItem("","")).insertAfter(($(button).closest('li')[0]));
    });  
}



function addEventListenerChd(button){ 
    console.log("Adding listners for add child");
    button.addEventListener('click', function(){
      let divId= $(button).siblings('input').first().prop("value")+ "_div";
      let objList = createList(divId)
      let listItem = createListItem("","");
      objList.appendChild(listItem);
      $(button).closest('li')[0].appendChild(objList); 
  });
  }

