// Simple wrapper for MongoDB Atlas Data API
export const getMongoClient = (env) => {
    const url = `https://data.mongodb-api.com/app/${env.MONGODB_APP_ID}/endpoint/data/v1/action`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': env.MONGODB_API_KEY,
    };

    const basePayload = {
        dataSource: env.MONGODB_CLUSTER,
        database: 'portfolio',
    };

    const execute = async (action, collection, additionalPayload = {}) => {
        const response = await fetch(`${url}/${action}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                ...basePayload,
                collection,
                ...additionalPayload
            })
        });

        if (!response.ok) {
            throw new Error(`MongoDB API Error: ${response.statusText}`);
        }

        return await response.json();
    };

    return {
        find: (collection, filter = {}, sort = null, limit = null) =>
            execute('find', collection, { filter, ...(sort && { sort }), ...(limit && { limit }) }),
        findOne: (collection, filter = {}) =>
            execute('findOne', collection, { filter }),
        insertOne: (collection, document) =>
            execute('insertOne', collection, { document }),
        updateOne: (collection, filter, update) =>
            execute('updateOne', collection, { filter, update }),
        deleteOne: (collection, filter) =>
            execute('deleteOne', collection, { filter })
    };
};
