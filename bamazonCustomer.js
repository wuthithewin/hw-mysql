var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("connected database")
    start();
});

function start() {
    connection.query(
        "select * from products", function (err, res) {
            console.table(res)
            inquirer
                .prompt([
                    {
                        name: "input_id",
                        type: "rawlist",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < res.length; i++) {
                                choiceArray.push(res[i].item_id);
                            }
                            return choiceArray;
                        },
                        message: "What item would you like to purchase?"
                    },
                    {
                        name: "input_quantity",
                        type: "input",
                        message: "How many units would you like to buy",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    }
                ])


                .then(function (answer) {
                    var inputId = parseInt(answer.input_id);
                    var inputQuan = parseInt(answer.input_quantity);

                    connection.query(
                        "select * from products where item_id =(?)",[inputId], function (err, result) {
                          console.log(" Total Price is " + inputQuan * result[0].price )
                        })
                    //var total = parseInt(res.price * answer.input_quantity)
                    //console.log(res.price)
                    // get the information of the chosen item
                    var chosenItem;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].item_id === answer.input_id) {
                            chosenItem = res[i];
                            console.log("This is chosen Item", chosenItem)
                        }
                    }
                     
                        // chosenitem.stockquantity if >= inputquantity then we can proceed
                        // chosenitem.stockquantity - inputquantity = newstockquantity
                        // updata databse 
                        // if there's not enough quantity, ask to enter new amount
                        // tell the customer the total items and costs
                    console.log(answer)
                })
        }
    )
}

