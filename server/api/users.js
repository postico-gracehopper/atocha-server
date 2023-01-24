const router = require('express').Router();
const { models: { User } } = require('../db');

router.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;
    const usersWithName = await User.findAll({where: {name: name}})
    res.status(200).send(usersWithName)
  } catch(err){
    next(err)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const { id }= req.params;
    if (id.match(/\d+/)) {
      let userQueried = await User.findOne({where: {id: id}})
      if (userQueried) {
        userQueried.destroy();
        res.status(204).send("user deleted")
      } else {
        res.status(404).send('user does not exist')
      }
    } else {
      res.status(400).send("the id must be a number!")
    }
  }
  catch(err) {next(err)}
})

router.put("/:id", async (req, res, next) => {
  try {
    const { id }= req.params;
    const userParams = req.body;
    let userQueried = await User.findOne({where: {id: id}})
    if (userQueried) {
      const user = await userQueried.update(userParams)
      res.status(200).send(user)
    }
    else {
      res.status(404).send("user does not exist")
    }
  }
  catch(err){
    next(err)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const userParams = req.body
    const [user, created] = await User.findOrCreate({
      where: {
        name: userParams.name,
      }
    })
    if (created) {
      res.status(201).send(user)
    } else {
      res.status(409).send(user)
    }
  }
  catch(err){
    next(err)
  }
})

router.use((err, req, res, next) => {
  res.status(500).send('Error in the users API')
})


module.exports = router;