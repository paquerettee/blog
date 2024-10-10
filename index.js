import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

// defining constants and variables
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const postsFile = "./data/posts.json";
let blogPosts = [];

// seeting up middelware, reading posts from a data file
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
getBlogPosts();

// request handlers - get
// render home page
app.get("/", (req, res) => {
  console.log("get home");
  res.render("main.ejs", { page: "home", blogList: getBlogTitles() });
});

// render about page
app.get("/about", (req, res) => {
  console.log("get about");
  res.render("main.ejs", { page: "about", blogList: getBlogTitles() });
});

// render contact page
app.get("/contact", (req, res) => {
  console.log("get contact");
  res.render("main.ejs", { page: "contact", blogList: getBlogTitles() });
});

// render post add form
app.get("/add", (req, res) => {
  console.log("get add");
  res.render("main.ejs", { page: "add", blogList: getBlogTitles() });
});

// render "post deleted" page
app.get("/delete", (req, res) => {
  console.log("get delete");
  // console.log(req.query);
  blogPosts.splice(req.query.post_id, 1);
  saveBlogPosts();
  res.render("main.ejs", { page: "deleted", blogList: getBlogTitles() });
});

// rander chosen post
app.get("/post:post_id", (req, res) => {
  console.log("get single post");
  // console.log(req.params);
  res.render("main.ejs", {
    page: "post",
    postIndex: req.params.post_id,
    blogPost: blogPosts[req.params.post_id],
    blogList: getBlogTitles(),
  });
});

// request handlers - post
// save newly added post, render "post added" page
app.post("/submit", (req, res) => {
  console.log("post submit");
  // console.log(req.body);
  blogPosts.push({ title: req.body["title"], content: req.body["content"] });
  saveBlogPosts();
  res.render("main.ejs", { page: "post_added", blogList: getBlogTitles() });
});

// listening
app.listen(port, () => {
  console.log("Server up and running");
});

// --- helper functions ---

// returning list of available posts titles
function getBlogTitles() {
  let blogTitles = [];
  for (let i = 0; i < blogPosts.length; i++) {
    blogTitles[i] = blogPosts[i]["title"];
  }
  return blogTitles;
}

// read blog posts from json file and place them into blogPosts list
function getBlogPosts() {
  fs.readFile(postsFile, "utf8", function (err, data) {
    if (err) throw err;
    let json = JSON.parse(data);
    for (let key in json) {
      blogPosts[key] = json[key];
    }
  });
}

// save all posts from blogPosts list to json file
function saveBlogPosts() {
  console.log("Saving posts...");
  let data = {};
  for (let i = 0; i < blogPosts.length; i++) {
    data[i] = blogPosts[i];
  }
  fs.writeFile(postsFile, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log("Posts saved!");
  });
}
