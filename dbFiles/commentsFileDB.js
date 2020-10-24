const fs = require("fs");
const { nanoid } = require("nanoid");
const { deleteItem } = require("./newsFileDB");

const fileName = "./dbJSONs/commentsDB.json";
const newsFileName = "./dbJSONs/newsDB.json";
let data = [];

module.exports = {
    init() {
        try {
            data = JSON.parse(fs.readFileSync(fileName));
        } catch (e) {
            data = [];
        }
    },
    getItems() {
        return data;
    },
    getItemsByNews(id) {
        let newsData = JSON.parse(fs.readFileSync(newsFileName));
        const dataCopy = [];
        if (newsData.find(elem => elem.id === id)) {
            for (let i = 0; i < data.length; i++) {
                if (id === data[i].news_id) {
                    dataCopy.push(data[i]);
                };
            };
            return dataCopy;
        } else {
            return { error: 'Invalid News ID' };
        };
    },
    save() {
        fs.writeFileSync(fileName, JSON.stringify(data));
    },
    addItem(item) {
        let newsData = JSON.parse(fs.readFileSync(newsFileName));
        item.id = nanoid();
        if(item.author === ""){
            item.author = 'Anonymous';
        };
        if (item.news_id === '' || item.comment === '') {
            return { error: 'It seems that News ID Or Comments are Empty' }
        } else {
            if (newsData.find(elem => elem.id === item.news_id)) {
                data.push(item);
                this.save();
                return item;
            }else{
                return {error : 'Invalid News ID'};
            };
        }
    },
    deleteItem(id) {
        const index = data.findIndex(d => d.id === id);
        data.splice(index, 1);
        this.save();
        return 'The Comment Was Successfully Deleted!';
    },
    deleteItemsByNewsID(newsID){
        for(let i = 0; i < data.length; i++){
            if(data[i].news_id === newsID){
                data.splice(i, 1);
                i--;
                this.save()
            };
        }
    }
};