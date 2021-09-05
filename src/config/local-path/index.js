const path = require('path');

module.exports = {
    gallery: path.join(__dirname+'../../../../../Gallery').replace(/\\/g,"/"),
    icon: path.join(__dirname,'../../assets/icon/svg').replace(/\\/g,"/")
}