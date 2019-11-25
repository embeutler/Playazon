
const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  PORT: 8000,
  user: "root",
  password: "*Smile8066",
  database: "bamazon"
});

let items = [];

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as item_id " + connection.threadId + "\n");
    showItems();
});

function showItems(){
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, results) {
    if (err) throw err;
        items = results;
        showAllItems();
        selectItem();
    })
};

function showAllItems() {
    console.log('Available Products: ');
    for (var i = 0; i < items.length; i++) {
        console.log(`ID: ${items[i].item_id} | Product: ${items[i].product_name} | Price: ${items[i].price}`);
    }
}

function selectItem(){
    inquirer
    .prompt({
      name: "selectItem",
      type: "list",
      message: "Please select the item you'd like to purchase",
      choices: generateChoices()
    }).then(function(answer){
        selectCount(answer.selectItem);
    })
};

function generateChoices(){
    const choices = [];
    for(var i = 0; i < items.length; i++){
        itemNames = items[i].product_name;
        choices.push(itemNames);
    }
    return choices;
}

function selectCount(itemName){
    inquirer
    .prompt({
     type: "input",
     name: "purchaseAmount",
     message: "How many would you like to purchase?",
     default: function () {
        return '1';
    }
}).then(function(itemQty){


    const qty = itemQty.purchaseAmount;

    for(var i = 0; i<items.length; i++){
        if(itemName === items[i].product_name){  
            if(qty < items[i].stock_quantity){
                console.log("Purchase Complete");
                items[i].stock_quantity = items[i].stock_quantity  - qty;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{stock_quantity: items[i].stock_quantity},
                    {product_name: itemName}]
                    );
            const totalPurchase = items[i].price * qty;
            console.log("Your total purchase comes to: " + totalPurchase);
            } else {
                console.log("Sorry, not enough inventory, please select a lower quantity");
                selectCount(itemName);
            }
        }
    }
})
};


    