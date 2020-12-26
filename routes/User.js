const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", (req, res) => {
    var errors = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: "Nome inválido."});
    }
    if(!req.body.lastName || typeof req.body.lastName == undefined || req.body.lastName == null){
        errors.push({text: "Sobrenome inválido."});
    }
    if(!req.body.username || typeof req.body.username == undefined || req.body.username == null){
        errors.push({text: "Nome de suário inválido."});
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: "Email inválido."});
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({text: "Senha inválida."});
    }
    if(req.body.password.length < 4){
        errors.push({text: "Senha muito curta."});
    }
    if(req.body.password != req.body.passwordVerify){
        errors.push({text: "As senhas estão diferentes. Tente novamente."});
    }

    if(errors.length > 0){
        res.render("users/register", {errors: errors});
    }else{
        User.findOne({email: req.body.email}).lean().then((user) => {
            if(user){
                req.flash("errorMessage", "Já existe uma conta cadastrada com este e-mail.");
                res.redirect("/users/register");
            }else{
                const newUser = new User({
                    name: req.body.name,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    level: req.body.level,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err){
                            req.flash("errorMessage", "Erro interno. Tente novamente.");
                            res.redirect("/");
                        }else{
                            newUser.password = hash;
                            newUser.save().then(() => {
                                req.flash("successMessage", "Usuário cadastrado com sucesso.");
                                res.redirect("/");
                            }).catch((err) => {
                                req.flash("errorMessage", "Erro ao criar usuário. Tente novamente.");
                                res.redirect("/users/register");
                            });
                        }
                    });
                });

            }
        }).catch((err) => {
            req.flash("Houve um erro interno. Tente novamente.");
            res.redirect("/");
        });
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("successMessage", "Deslogado com sucesso.");
    res.redirect("/");
});

module.exports = router;