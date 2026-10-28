import API from './axios';

export async function submitAmoLead(payload) {
    const { data } = await API.post('/api/lead', payload, { timeout: 45000 });
    if (data?.success !== true) {
        throw new Error('Ariza amoCRM tomonidan qabul qilinmadi');
    }
    return data;
}
