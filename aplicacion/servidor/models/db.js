import db from "../config/dbConfig.js";

export const query = async (sql, params) => {
    const [results] = await db.query(sql, params);
    return results;
};
