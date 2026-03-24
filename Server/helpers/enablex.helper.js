const { enablexAxios } = require('../configs/enablex');

const createRoom = async (name) => {
    try {
        const payload = {
            name: name || 'MateAndMentors Call Room',
            owner_ref: 'admin',
            settings: {
                description: 'Room for 1-to-1 Call',
                mode: 'group',
                scheduled: false,
                duration: 60, // 60 minutes
                participants: 2,
                auto_recording: false,
                quality: 'SD',
            },
        };

        const response = await enablexAxios.post('/rooms', payload);
        if (response.data && response.data.room) {
            return response.data;
        }
        throw new Error('Failed to create room in EnableX');
    } catch (error) {
        console.error('EnableX createRoom error:', error?.response?.data || error.message);
        throw error;
    }
};

const createToken = async (roomId, userRef, role = 'participant') => {
    try {
        const payload = {
            name: userRef,
            role: role,
            user_ref: userRef,
        };

        const response = await enablexAxios.post(`/rooms/${roomId}/tokens`, payload);
        if (response.data && response.data.token) {
            return response.data.token;
        }
        throw new Error('Failed to create token in EnableX');
    } catch (error) {
        console.error('EnableX createToken error:', error?.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    createRoom,
    createToken,
};
