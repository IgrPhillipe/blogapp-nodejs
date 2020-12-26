const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Post = require("../models/Post");
const {isAdmin} = require("../helpers/isAdmin");

router.get("/", isAdmin, (req, res) => {
    res.render("admin/index")
});

//Posts
    router.get("/posts", isAdmin, (req, res) => {
        Post.find().lean().populate("category").sort({date: "desc"}).then((posts) => {
            res.render("./admin/posts", {posts: posts});
        }).catch((err) => {
            req.flash("errorMessage", "Erro ao listar posts");
            res.redirect("/admin");
        });
    });

    router.get("/posts/add", isAdmin, (req, res) => {
        Category.find().lean().then((categories) => {
            res.render("./admin/add-posts", {categories: categories});
        }).catch((err) => {
            req.flash("errorMessage", "Houve um erro ao carregar o formulário. Tente novamente.");
            res.redirect("/admin");
        });
    });

    router.post("/posts/new", isAdmin, (req, res) => {
        var errors = [];

        if(req.body.category == ""){
            errors.push({text: "Categoria inválida. Registre uma categoria."});
        }

        if(errors.length > 0){
            res.render("/admin/posts/add", {errors: errors});
        }else{
            const newPost = {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                content: req.body.content,
                category: req.body.category
            }

            new Post(newPost).save().then(() => {
                req.flash("successMessage", "Post criado com sucesso.");
                res.redirect("/admin/posts");
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro ao criar o post. Tente novamente.");
                res.redirect("/admin/posts/add");
            });
        }
    });

    router.get("/posts/edit/:id", isAdmin, (req, res) => {
        Post.findOne({_id: req.params.id}).lean().then((post) => {
            Category.find().lean().then((categories) => {
                res.render("admin/edit-posts", {categories: categories, post: post});
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro ao listar as categorias. Tente novamente.");
                res.redirect("/admin/posts");
            });
        }).catch((err) => {
            req.flash("errorMessage", "Este post não existe.");
            res.redirect("/admin/posts");
        });
    });

    router.post("/posts/edit", isAdmin, (req, res) => {
        Post.findOne({_id: req.body.id}).then((post) => {
            post.title = req.body.title;
            post.slug = req.body.slug;
            post.description = req.body.description;
            post.content = req.body.content;
            post.category = req.body.category;

            post.save().then(() => {
                req.flash("successMessage", "Post editado com sucesso.");
                res.redirect("/admin/posts");
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro ao salvar o post. Tente novamente.");
                res.redirect("/admin/posts");
            });
            
        }).catch((err) => {
            req.flash("errorMessage", "Houve um erro ao tentar editar o post. Tente novamente.");
            res.redirect("/admin/posts");
        });
    });

    router.post("/posts/delete/:id", isAdmin, (req, res) => {
        Post.findOneAndDelete({_id: req.params.id}).then(() => {
            req.flash("successMessage", "Post deletado com sucesso.");
            res.redirect("/admin/posts");
        }).catch((err) => {
            req.flash("errorMessage", "Houve um erro ao deletar o post. Tente novamente.");
            res.redirect("/admin/post");
        });
    });

//Categories
    router.get("/categories", isAdmin, (req, res) => {
        Category.find().lean().sort({date: "desc"}).then((categories) => {
            res.render("./admin/categories", {categories: categories});
        }).catch((err) => {
            req.flash("errorMessage", "Erro ao listar categorias");
            res.redirect("/admin");
        });
    });

    router.get("/categories/add", isAdmin, (req, res) => {
        res.render("./admin/add-categories");
    });

    router.post("/categories/new", isAdmin, (req, res) => {
        var errors = [];

        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
            errors.push({text: "Nome: Campo vazio"});
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            errors.push({text: "Slug: Campo vazio"});
        }

        if(errors.length > 0){
            res.render("./admin/add-categories", {errors: errors});
        }else{
            const newCategory = {
                name: req.body.name,
                slug: req.body.slug
            }
        
            new Category(newCategory).save().then(() => {
                req.flash("successMessage", "Categoria criada com sucesso.")
                res.redirect("/admin/categories");
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro ao criar a categoria. Tente novamente.")
                res.redirect("/admin");
            });
        }
    });

    router.get("/categories/edit/:id", isAdmin, (req, res) => {
        Category.findOne({_id: req.params.id}).lean().then((category) => {
            res.render("./admin/edit-categories", {category: category});
        }).catch((err) => {
            req.flash("errorMessage", "Esta categoria não existe.");
            res.redirect("/admin/categories");
        });
        
    });

    router.post("/categories/edit", isAdmin, (req, res) => {
        Category.findOne({_id: req.body.id}).then((category) => {
            category.name = req.body.name;
            category.slug = req.body.slug;

            category.save().then(() => {
                req.flash("successMessage", "Categoria editada com sucesso.");
                res.redirect("/admin/categories");
            }).catch((err) => {
                req.flash("errorMessage", "Houve um erro ao salvar a categoria. Tente novamente.");
                res.redirect("/admin/categories");
            });
            
        }).catch((err) => {
            req.flash("errorMessage", "Houve um erro ao tentar editar a categoria. Tente novamente.");
            res.redirect("/admin/categories");
        });
    });

    router.post("/categories/delete/:id", isAdmin, (req, res) => {
        Category.findOneAndDelete({_id: req.params.id}).then(() => {
            req.flash("successMessage", "Categoria deletada com sucesso.");
            res.redirect("/admin/categories");
        }).catch((err) => {
            req.flash("errorMessage", "Houve um erro ao deletar a categoria. Tente novamente.");
            res.redirect("/admin/categories");
        });
    });

module.exports = router;