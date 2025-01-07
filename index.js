const express = require("express");
const app = express();
const port = 3000;
const path = require("path")
const { v4: uuidv4 } = require("uuid"); // to generate the id
var methodOverride = require('method-override') // to change post req into patch
const multer = require("multer"); // use for file/image upload

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // for method override
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// for file upload saving in location
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img'); // Save files in the 'public/img' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`); // Unique filename
    }
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "public")));
let posts = [{
        id: uuidv4(),
        username: "marniePreston",
        content: "Exciting news! I recently got selected for a fantastic internship opportunity that aligns perfectly with my career goals. I'm looking forward to learning new skills and gaining hands-on experience in the industry!",
        img: "/img/Certificate.jpeg"
    },
    {
        id: uuidv4(),
        username: "rahulPatil",
        content: "Thrilled to share that I just bought a brand new Kia Seltos! It's been a dream car for me, and I can't wait to take it on road trips and explore new places. Loving the comfort and features it offers!",
        img: "/img/Kia Seltos.jpeg"
    },
    {
        id: uuidv4(),
        username: "suderPichai",
        content: "It's an honor to continue serving as the CEO of Google. Leading such a talented team and being part of this innovative journey is truly inspiring. Looking forward to what we can achieve together in the coming years!",
        img: "/img/google.jpeg"
    },
    {
        id: uuidv4(),
        username: "ananyaSharma",
        content: "I just completed my first half-marathon! It was a challenging yet rewarding experience that taught me the importance of discipline and perseverance. This is just the beginning of my fitness journey!",
        img: "/img/marathon.jpeg"
    },
    {
        id: uuidv4(),
        username: "nehaKumar",
        content: "Happy to announce that I have launched my own blog to share my thoughts on technology, lifestyle, and everything in between. Can't wait to connect with readers and share valuable content!",
        img: "/img/Technology.jpeg"
    }
];


app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts })
})

// create new post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs")
})

// when form of new post fill then send request to post
app.post("/posts", upload.single("image"), (req, res) => {
    let { username, content } = req.body; // extract value of username and content from that form
    let img = null;

    if (req.file) {
        img = `/img/${req.file.filename}`; // Get uploaded file path
    }

    let id = uuidv4(); // create new id 
    posts.push({ id, username, content, img }) // push value of username and content to the array
    res.redirect("/posts"); //redirect the page of allpost
});


// get record using id
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    console.log(post);
    res.render("show.ejs", { post })

})


// to update the post
app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id); // find the post 
    post.content = newContent;
    console.log(post);
    res.redirect("/posts")
})

// for update take the data from the user
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params // find the id value
    let post = posts.find((p) => id === p.id); // find the post 
    res.render("edit.ejs", { post })
})


//delete post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params // find the id value
    posts = posts.filter((p) => id !== p.id); // find the post 
    res.redirect("/posts")
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);

})