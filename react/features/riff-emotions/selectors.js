
export const pickEmotionsDataById = (state, id) => {
    let uid = id;

    if (uid === 'local') {
        uid = state['features/base/participants'][0].id; // set local id
    }

    const riffEmotions = state['features/riff-emotions'];
    let emotionsData = riffEmotions?.emotionsData[uid] || {};

    // if no data for user ID, then use default userId
    // for testing purposes, delete soon
    if (!emotionsData['face:0']) {
        emotionsData = riffEmotions?.emotionsData?.default;
    }

    return emotionsData;
};
