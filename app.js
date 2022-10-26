const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const date = require(`${__dirname}/date.js`);

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));


const newWorkTodos = [];

app.get('/', async (req, res) => {


    const list = await getTodosAsync(date.getDate()).catch(err => console.log(err));
    const newTodos = [];
    console.log(list);
    // for(const todo of list.items){
    //     newTodos.push(todo);
    // }
    res.render('list', {title: date.getDate(), items:newTodos});
});

app.post('/', async (req, res) => {

const newTodo = req.body.newTodo;
const title = req.body.save;

if(title === date.getDate()){
    await saveTodoAsync(newTodo, date.getDate()).catch(err => console.log(err));
    //newTodos.push(newTodo);
    //console.log(req.body);
    res.redirect('/');
}
else{
    //console.log(title);
    await saveTodoAsync(newTodo, title).catch(err => console.log(err));
    res.redirect(`/${title}`)
}

});

app.post('/delete', async (req, res) => {
    const todoId = req.body.todoId;
    await deleteTodoAsync(todoId);
    res.redirect('/');
} );

app.get('/:routeParam', async (req, res) => {
    const route = req.params.routeParam;
   const list =  await setListAsync(_.lowerCase(route));
res.render('list', {title:_.capitalize(list.name), items: list.items})
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

const connect = async () => {
await mongoose.connect('mongodb://localhost:27017/todoDB');
};

const disconnect = async () => {
    await mongoose.connection.close();
}





 const todoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "name is a required parameter"]
    },
    date: String
 });

 const listSchema = new mongoose.Schema({
    name: String,
    items: [todoSchema]
 });

const Todo = mongoose.model('Todo', todoSchema);
const List = mongoose.model('List', listSchema);


const saveTodoAsync = async (todoParam, title) => {
 await connect();
 const todo = new Todo({
    name: todoParam
 })

 let list = await List.findOne({name: title});
 if(!list){
    await disconnect();
    await setListAsync(title);
    await connect();
    list = await List.findOne({name: title});
} 
await todo.save()
 list.items.push(todo);
 //console.log(list);
 await list.save();
 await disconnect();
}


const deleteTodoAsync = async (todoId) => {
    await connect();
    //console.log(todoId);
    await Todo.deleteOne({_id: todoId});
    await disconnect();
}

const getTodosAsync = async (title) => {
 await connect();
    const list = await List.find({name: title }).select('name items').exec();
    
    console.log(items);
    //console.log(list);
 await disconnect();
    return list;
}

const setListAsync = async (listName) => {
    await connect();
    let existingList = await List.findOne({name: listName}).select('name items').exec();
    const items = await existingList.items.find({});
    console.log(items);
    if(existingList){
      await disconnect();
      return existingList;
    }
    const list = new List({
        name: listName,
        items: []
    });
    await list.save();
    existingList = await List.findOne({name: listName}).select('name items').exec();
    await disconnect();
    return existingList;

}
