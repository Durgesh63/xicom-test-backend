const { Router } = require('express');
const { register } = require('../controller/candidate.controllers');
const Upload = require('../middleware/multer.middleware');

const candidaterouter = Router()

// candidaterouter.route("/register").post(Upload.fields([{
//     name: "documents"
// }]), register)
candidaterouter.route("/is-live").get((req, res) => {
    res.send("active")
})

candidaterouter.route("/register").post(Upload.any(), register)


module.exports = candidaterouter