exports.userBoard = (req, res) => {
    res.status(200).send("User content");
}

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content");
}