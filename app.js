
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// console.log(date());

const app = express();

// const items = ["Start your day smiling"];
// const workItems = [];

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


mongoose.set('strictQuery', true);
// mongoose.connect("mogodb://localhost:27017/userDB",{useNewUrlParser : false});
mongoose.connect("mongodb+srv://admin-prerna:Prerna%402305@cluster0.if7a6h3.mongodb.net/todolistDB", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const itemsSchema = {
  name: String
}

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your Todolist!. "
});

const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){
        // console.log(foundItems);
        if(foundItems.length === 0){
          Item.insertMany(defaultItems, function(err){
            if(err){
              console.log(err);
            } else{
              console.log("Succesfully saved default items to DB.");
            }
          });
          res.redirect("/");
        } else{
            res.render("list", {listTitle: "Today" ,newListItems: foundItems });
        }

     });
});


app.get("/:customListName",function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        // console.log("Doesnt eXist");
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else{
        // console.log("exist");
        res.render("list", {listTitle: foundList.name , newListItems: foundList.items });
      }
    }
  });

});

app.post("/",function(req, res){
  // console.log(req.body);
  const itemName = req.body.newItem;
  const listName = req.body.list;


  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
      item.save();
      res.redirect("/");
  } else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
   const checkedItemId = req.body.checkbox;
   const listName = req.body.listName;

   if(listName === "Today"){
     Item.findByIdAndRemove(checkedItemId, function(err){
       if(!err){
         console.log("Successfully deleted checke item.");
         res.redirect("/");
       }
     });
   } else{
     List.findOneAndUpdate({name: listName}, {$pull:{ items : {_id: checkedItemId}}} ,function(err, foundList){
       if(!err){
         res.redirect("/" + listName);
       }
     });
   }

});


app.get("/about", function(req, res) {
res.render("about");
});

app.listen(3000, function(){
  console.log("Server is now running at port 3000.");
});
