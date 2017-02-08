function openDestination(fileName) {
  // Opens specified file for update
  if (typeof fileName == 'string'){
    var files = DriveApp.getFilesByName(fileName);
    var spreadsheet = (!files.hasNext()) ? SpreadsheetApp.create(fileName) : SpreadsheetApp.open(files.next());
    var sheet = spreadsheet.getSheets()[0];
    return sheet;
  }
}

// some global mapping of sheet headers and Item attributes

function getIDs(sheet) {
  // look for required field in the first column)
  var values = sheet.getSheetValues(1, 1, 1, 6);
  Logger.log(values);
  var res = []
  if (values[0].indexOf('ID') < 0) {

    return res;
  };
  Logger.log('ID is at ' + values[0].indexOf('ID'));
  values = sheet.getSheetValues(2, values[0].indexOf('ID') + 1, sheet.getLastRow() - 1, 1);
  // convert values to string?
  //

  for (var i in values) {
    if ( i < 25) {
      Logger.log(values[i][0] + ' id in sheet as ' + (typeof values[i][0])) ;
    }
    res.push(values[i][0].toString());
  }
  return res;
}

// function to open feed and return Document
function openFeed(url, charSet) {
  //var url = 'http://example.com.ua/FeedForHL333XML777.xml';
  var xml = UrlFetchApp.fetch(url).getContentText(charSet); 
  var document = XmlService.parse(xml);
  var root = document.getRootElement();
  return root;
}


// funtion to return array of Items
function getItemsFromFeed(root) {
  return root.getChild('items').getChildren('item');
}

function getField(xmlEntry, childName, decorateText) {
  // extracts specific value from 'item' node childs
  // decorateText is expected to modify value
  if(childName == null) {
    Logger.log("childName null");
    return null;
  }
  if(xmlEntry == null) {
    Logger.log("xmlEntry is null " + childName);
    return null;
  }
    
    
  if(typeof decorateText === 'function') {
    // do something
    var checkNotNull = xmlEntry.getChild(childName);
    var targetText = (checkNotNull) ? checkNotNull.getText() : 'failed item';
    return decorateText(targetText);
//  return decorateText(xmlEntry.getChild(childName).getText());    
  }
  else {
    
    var field = xmlEntry.getChild(childName);
    return (field != null ? field.getText() : '');
  }
}
//   myList.sheetNames = ["ID",'Item title','Final URL','Image URL','Price', 'Action'];
//   myList.feedIDs = ['id', 'name', 'url', 'image','priceRUAH'];
var tableValue = {
  // mapping !!! XML values to Sheet value
    'id':' ID',
    'name': 'Item title',
    'url': 'Final URL',
    'image': 'Image URL',
    'priceRUAH':'Price'
}


// get IDs from feed to check for deleted items
function getIDsFromFeed(root) {
  var items = root.getChild('items').getChildren('item');
  var IDs =[];
  for (var i in items) {
    IDs.push(items[i].getChildText('id'))
  }
  return IDs
}

// function to get Sheet row by ID



function parseFeed(sheetName, feedURL, charSet, options) {
  var options = options || {};
  var plain = options.plain || false;
  var targetSheet = openDestination(sheetName); // Open Sheet
  
  var targetFeed = openFeed(feedURL, charSet);   // Open Feeds from 
  var feedIDs = getIDsFromFeed(targetFeed); // populate feed IDS
  var sheetIDs = (plain) ? [] : getIDs(targetSheet);
  var titleLimit = (plain) ? 5 :6;
  var products = getItemsFromFeed(targetFeed);
  var tableValues = [];
  
  
  for (var i in products) {
    // looping through the products
    var newRow = [];
    newRow.push(getField(products[i], 'id'));
    newRow.push(getField(products[i], 'name'));
    newRow.push(getField(products[i], 'url'));
    newRow.push(getField(products[i], 'image'));
    newRow.push(getField(products[i], 'priceRUAH', function(content) {
      var re = /\d+\.?\d{1,2}/ig;
      content = re.exec(content);
      return content + ' UAH';
       }));

    // if item gettext ID in IDs Then Update
    // if item IDs not in IDs Then Add
    if (!plain) {
      newRow.push(sheetIDs.indexOf(products[i].getChildText('id')) >= 0 ? 'Set' : 'Add');
    }
    
    // generate new Row, add it to the array of newRows
    tableValues.push(newRow);
  }
  for (var j = 0; j <15; j++) {
    Logger.log(feedIDs[j] + ' in sheet  ' + feedIDs.indexOf(sheetIDs[j]))
  }
  // populating values from sheet
  for (var k in sheetIDs) {
    // in not in feedIDs then delete
    if (feedIDs.indexOf(sheetIDs[k]) < 0) {
      // find index
      
      var badRow = targetSheet.getSheetValues((Number(k) + 2), 1, 1, titleLimit)[0];//[0]; // WHY^!^!!^^^!&&??
      badRow[badRow.length - 1] = 'Delete';
      Logger.log(badRow);
      tableValues.push(badRow);
       
    }
  }
  
  // add title row and all that new values
  
  targetSheet.clear();
  var titleRow = ["ID",'Item title','Final URL','Image URL','Price'];
  // var titleLimit = 6
  if (!plain) {
    titleRow.push('Action');
   // titleLimit = 5;
  }
  targetSheet.appendRow(titleRow);
  targetSheet.getRange(2, 1, tableValues.length, titleLimit).setValues(tableValues);
  
}

function parseSitePlainFeed() {
  parseFeed('Sheet Name', 'http://example.com/Feed_in_hootline_format.xml', "UTF-8", {plain:true});
}


