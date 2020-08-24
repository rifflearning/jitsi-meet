
export const pickEmotionsDataById = (state, id) => {
    let uid = id;

    if (uid === 'local') {
        uid = state['features/base/participants'][0].id; // set local id
    }

    const riffEmotions = state['features/riff-emotions'];
    const emotionsData = riffEmotions?.emotionsData[uid] || {};

    return emotionsData;
};
