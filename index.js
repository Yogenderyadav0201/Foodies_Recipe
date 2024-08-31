const express = require("express");
const app = express();
const path = require("path");
const port = 7000;
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const multer = require('multer');
const { url } = require("inspector");
app.use(express.static(path.join(__dirname, "public")));
const mysql = require("mysql2");

// Set up multer for file uploads   
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// let connection =  mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'foodiesrecipe',
//     password: 'Monuyadav1@'
//   });

// let query = "SHOW TABLES";
// try{
//     connection.query(query, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//     });
// }catch(err){
//     console.log(err);
// }

// connection.end();


let posts = [
    {
        id: uuidv4(),
        username: "Chicken Makhani",
        image: "/uploads/1.png",
        content: "Butter chicken is mouth-watering, tender chicken, cooked in a spiced tomato sauce. It’s traditionally cooked in a tandoor (a cylindrical clay or metal oven), but may be grilled, roasted or pan-fried in less authentic preparations.Always make the gravy by first cooking fresh tomato, garlic, and cardamom down into a bright red pulp. This pulp is then pureed after cooling. Then, the chef adds butter, various spices, and Khoa (dried whole milk). ",
    },
    {
        id: uuidv4(),
        username: "Samosas (Deep-Fried Potato/Veggie Dumpling)",
        image: "/uploads/2.png",
        content: "Samosas are a very popular traditional Indian Dish. Probably because samosas are a tasty, fried, or baked pastry with savory fillings.Spiced potatoes, onions, peas, and lentils fill traditional samosas. But sometimes, they are made with ground lamb, ground beef or ground chicken.Good news for all of you Indian food lovers and solely plant-based eaters. Indian samosas are usually vegan! That means the pastry is free of eggs and dairy products.",
    },
    {
        id: uuidv4(),
        username: "Aloo Gobi (Potato and Cauliflower)",
        image: "/uploads/3.png",
        content: "Aloo Gobi is a dry, vegan Indian dish, made with potatoes (aloo), cauliflower (gobi), and Indian spices. It has a warm, yellow-orange color, because it uses a staple in Indian dishes: turmeric.Aloo Gobi occasionally contains kalonji and curry leaves as well. Other common ingredients include garlic, ginger, onion, coriander stalks, tomato, peas, and cumin. Throw it all together to roast in the oven and you’ve got one of the most popular dishes ordered in Indian restaurants. ",
    },
    {
        id: uuidv4(),
        username: "Naan (Flatbread)",
        image: "/uploads/4.png",
        content: "If you’ve never experienced good naan bread, your life has been much less delicious than it could be. Naan is a leavened, oven-baked flatbread. You normally serve Naan with all meals.This bread is the perfect combination of chewy and crispy, buttery and garlicky. It’s exactly what every Indian dish needs to complement the otherwise bright and intense flavors.",
    }
];


app.get("/posts", upload.single('image'),(req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", upload.single('image'), (req, res) => {
    const { username, content } = req.body;
    const image = req.file ? `./uploads/${req.file.filename}` : getDefaultImage(id);
    const id = uuidv4();
    posts.push({ id, username, image ,content });
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => id === p.id);
    console.log(post)
    res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const newContent = req.body.content;
    const post = posts.find((p) => id === p.id);
    post.content = newContent;
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => id === p.id);
    console.log(post)
    res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
