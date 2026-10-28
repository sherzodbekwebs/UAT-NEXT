import API from './axios';
import toast from 'react-hot-toast';

export async function submitAmoLead(payload) {
    const { data } = await API.post('/api/lead', payload, { timeout: 45000 });
    if (data?.success !== true) {
        throw new Error('Ariza amoCRM tomonidan qabul qilinmadi');
    }
    if (data.warning) toast(data.warning);
    return data;
}
