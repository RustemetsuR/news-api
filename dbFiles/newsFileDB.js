const fs = require("fs");
const { nanoid } = require("nanoid");

const fileName = "./dbJSONs/newsDB.json";
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
        const dataCopy = [];
        data.map(d => {

            if (d.image) {
                dataCopy.push({
                    id: d.id,
                    title: d.title,
                    dateTime: d.dateTime,
                    image: d.image,
                });
            } else {
                dataCopy.push({
                    id: d.id,
                    title: d.title,
                    dateTime: d.dateTime,
                })
            }

        });
        return dataCopy;
    },
    getItem(id) {
        return data.find(elem => elem.id === id);
    },
    save() {
        fs.writeFileSync(fileName, JSON.stringify(data));
    },
    addItem(item) {
        item.id = nanoid();
        item.dateTime = (new Date()).toISOString();
        if (item.title === '' || item.news === '') {
            return { error: 'It seems that Title Or News are Empty' }
        } else {
            data.push(item);
            this.save();
            return item;
        }
    },
    deleteItem(id) {
        const index = data.findIndex(d => d.id === id);
        data.splice(index, 1);
        this.save();
        return 'The News was Successfully Deleted!';
    }
};