const db = require("../config/dbConfig");

const query = async (sql, params) => {
    try {
        const [results] = await db.query(sql, params);
        return results;
    } catch (err) {
        throw err;
    }
};

module.exports = { query };
