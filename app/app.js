const router = require("express").Router();
const newsDB = require("../dbFiles/newsFileDB");
const commentsDB = require('../dbFiles/commentsFileDB');
const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");
const config = require("../config");
const newsFileDB = require("../dbFiles/newsFileDB");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const error = {
    error: 'Error',
};

router.get("/:resources", (req, res) => {
    let data;
    switch (req.params.resources) {
        case 'news':
            data = newsDB.getItems();
            break;
        case 'comments':
            if (req.query.news_id) {
                data = commentsDB.getItemsByNews(req.query.news_id);
            } else {
                data = commentsDB.getItems();
            };
            break;
        default:
            data = error;
    };
    res.send(data);
});

router.get("/news/:id", (req, res) => {
    let data = newsDB.getItem(req.params.id);
    res.send(data);
});


router.post("/comments/", (req, res) => {
    const data = commentsDB.addItem(req.body);
    res.send(data);
});

router.post("/news/", upload.single("image"), (req, res) => {
    const dataCopy = req.body;
    if (req.file) {
        dataCopy.image = req.file.filename;
    }
    const response = newsFileDB.addItem(dataCopy);
    res.send(response);
})

router.delete('/:resources/:id', (req, res) => {
    let data;
    switch (req.params.resources) {
        case 'news':
            commentsDB.deleteItemsByNewsID(req.params.id);
            data = newsDB.deleteItem(req.params.id);
            break;
        case 'comments':
            data = commentsDB.deleteItem(req.params.id);
            break;
        default:
            data = error;
    };
    res.send(data);
});

module.exports = router;


