const fse = require('fs-extra');

function thumbnail(destination, buffer){
    try {
        let thumbnailName = destination.split('.').join('-thumbnail.');
        fse.writeFileSync(thumbnailName, buffer);
        return thumbnailName;
    } catch (error) {
        return error;
    }
}

module.exports = {
    thumbnail
}