//Modules load
    require('dotenv/config');
    const express = require("express");
    const handlebars = require("express-handlebars");
    const app = express();
    const admin = require("./routes/Admin");
    const users = require("./routes/User");
    const path = require("path");
    const mongoose = require("mongoose");
    const session = require("express-session");
    const flash = require("connect-flash");
    const Post = require("./models/Post");
    const Category = require("./models/Category");
    const passport = require("passport");
    require("./config/auth")(passport);

//Configurations
    //Session Configuration
        app.use(session({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: true
        }));

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
    
    //Middleware
        app.use((req, res, next) => {
            res.locals.successMessage = req.flash("successMessage");
            res.locals.errorMessage = req.flash("errorMessage");
            res.locals.error = req.flash("error");
            res.locals.user = req.user || null;
            next();
        });

    //BodyParser
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());

    //Handlebars
        app.engine("handlebars", handlebars({defaultLayout: "main"}));
        app.set("view engine", "handlebars");
    
    //Mongoose
        mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log("Connected with MongoDB!");
        }).catch((err => {
            console.log("Erro: " + err);
        }));

    //Public
        app.use(express.static(path.join(__dirname, "public")));
        
        app.use((req, res, next) => {
            console.log("Worked");
            next();
        });
    
    //Routes
        app.get("/", (req, res) => {
            Post.find().lean().populate("category").sort({date: "desc"}).then((posts) => {
                res.render("index", {posts: posts});
            }).catch((err) => {
                req.flash("erroMessage", "Erro ao listar posts. Tente novamente.")
                res.redirect("/404")
            });
        });

        app.get("/post/:slug", (req, res) => {
            Post.findOne({slug: req.params.slug}).lean().populate("category").then((post) => {
                if(post){
                    res.render("post/index", {post: post});
                }else{
                    req.flash("errorMessage", "Esse post não existe.");
                    res.redirect("/");
                }
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro interno. Tente novamente.");
                res.redirect("/");
            }); 
        });

        app.get("/categories", (req, res) => {
            Category.find().lean().then((categories) => {
                res.render("categories/index", {categories: categories});
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro ao listar as categorias. Tente novamente.");
                res.redirect("/");
            });
        });

        app.get("/categories/:slug", (req, res) => {
            Category.findOne({slug: req.params.slug}).lean().then((category) => {
                if(category){
                    Post.find({category: category._id}).lean().then((posts) => {
                        res.render("categories/posts", {posts: posts, category: category});
                    }).catch((err) => {
                        req.flash("errorMessage", "Houve um erro ao listar posts. Tente novamente.");
                        res.redirect("/categories");
                    });
                }else{
                    req.flash("errorMessage", "Esta categoria não existe.");
                    res.redirect("/categories");
                }
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro ao acessar a categoria. Tente novamente");
                res.redirect("/categories");
            });
        });

        app.get("/404", (req, res) => {
            res.send("Erro 404");
        });

        app.use("/admin", admin);
        app.use("/users", users);

    //Others
        app.listen(process.env.PORT, () => {
            console.log("Server is working...");
        });