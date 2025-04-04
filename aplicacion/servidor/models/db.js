import db from "../config/dbConfig.js";

export const query = async (sql, params) => {
    try {
        const [results] = await db.query(sql, params);
        return results;
    } catch (err) {
        throw err;
    }
};
