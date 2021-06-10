// data accessor methods

const { getDBReference } = require('../lib/mango')
const { extractValidFields, videoschema } = require('../lib/validation')

// pagation for all videos
async function getVideoPage(page){
    const db = getDBReference();
    const collection = db.collection('videos');

    const count = await collection.countDocuments();
    const pageSize = 10;
    const lastPage = Math.ceil(count/pageSize);

    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;
    const results = await collection.find({})
        .sort({ _id: 1})
        .skip(offset)
        .limit(pageSize)
        .toArray();

    return {
        videos: results,
        page: page,
        totalPages: lastPage,
        count: count
    };

}
exports.getVideoPage = getVideoPage;