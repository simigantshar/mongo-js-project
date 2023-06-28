const express = require("express");
const { ToyModel, validateToys } = require("../models/toyModel");
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.get("/", async(req,res) => {
    try{
        const perPage = 10;
        const page = (req.query.page - 1) || 0;
        const search = req.query.s || null;
        const category = req.query.cat;
        const searchExp = new RegExp(search, "i");
        const data = await ToyModel.find({$or:[{name:searchExp},{info:searchExp},{category:category}]}).limit(perPage).skip(perPage * page);
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
});

router.get("/prices", async(req,res) => {
    const perPage = 10;
    const page = req.query.page - 1 || 0;
    const min = req.query.min;
    const max = req.query.max;
    try{
        const data = await ToyModel.find({ price: { $lte: max, $gte: min } }).limit(perPage).skip(page * perPage);
        res.json(data)
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.get("/single/:id", async(req,res) => {
    try{
        const id = req.params.id;
        const data = await ToyModel.findOne({_id:id});
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.post("/", auth, async(req,res) => {
    const validateBody = validateToys(req.body);
    if(validateBody.error){
        return res.status(400).json(validateBody.error.details);
    }
    try{
        const toy = new ToyModel(req.body);
        toy.user_id = req.tokenData._id;
        await toy.save();
        res.json(toy);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.put("/:edit", auth, async(req,res) => {
    const validateBody = validateToys(req.body);
    if(validateBody.error){
        res.status(400).json(validateBody.error.details);
    } 
    try{ 
        const id = req.params.edit;
        const data = await ToyModel.findOne({_id:id});
        const updateData = await ToyModel.updateOne({_id:id}, req.body);
        if(data.user_id != req.tokenData._id){
            return res.status(401).json({err:"you can't update other users data!"});
        }
        res.json(updateData);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.delete("/:delete", auth, async(req,res) => {
    try{
        const id = req.params.delete;
        const data = await ToyModel.findOne({_id:id});
        if(data.user_id != req.tokenData._id){
            return res.status(401).json({err:"you can't delete other users data!"});
        }
        const deleteData = await ToyModel.deleteOne({_id:id});
        res.json(deleteData);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

module.exports = router;