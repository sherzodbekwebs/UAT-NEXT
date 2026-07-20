export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Error' });

    const { name, phone, message } = req.body;
    const SUBDOMAIN = 'uzautotrailer';
    const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijg2MWIwZDMxYzk1NDY2MWY4ZGNjMGEzMDJmMGU3ZTQ1Y2FlN2RhMmU4NDhmZWJiMjJhZWY3MzMyMTdiZTJkMzQzMjliZjMzZGRhNTM4NDNjIn0.eyJhdWQiOiI4MjY3ZTNiMS1jMmIxLTQzYmYtYTc1OC05OTVjZjE4MGEyYTciLCJqdGkiOiI4NjFiMGQzMWM5NTQ2NjFmOGRjYzBhMzAyZjBlN2U0NWNhZTdkYTJlODQ4ZmViYjIyYWVmNzMzMjE3YmUyZDM0MzI5YmYzM2RkYTUzODQzYyIsImlhdCI6MTc3Nzk4NTM0NiwibmJmIjoxNzc3OTg1MzQ2LCJleHAiOjE5MDUwMzM2MDAsInN1YiI6IjExMjc1ODM0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxODQ5NzMwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiODY1Y2UwNDgtNWZjMC00NjU2LWIwZjMtMjViYzBkODU3NWUwIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.hEXvq_yKfq6_xkIzrnmaXrC3KpXoQzSGAsSpQ735OMIR39rFxSVtXPQpNPO3LLwImWOc-4IR4k-Lb3uWdNfAkURbdcDkdoZog6p7mhuYfafEs43SCISIAVxiaTEU6ntXdQPLrVDsALJo-Ikcbrq-vws8f4Z4MFavviyOrURDIB5_4LpLCY8q1gm9ku_1NT2UmR4bn5Cwj8XHO-_nPE29_xPj4dcOh9puPxHz7xPWslknUdJDSpEl_0WPUs2-UnlOP3O_EqLimbDVFyvSMlK7Xh11I4cjy3COh1HAL0JpTE6GP8nV-jbBOc8sH3ASB3zfziO9rfH0POwuApxB9xxBUQ'; // O'sha uzun tokenni shu yerga qo'ying

    try {
        const response = await fetch(`https://${SUBDOMAIN}.amocrm.ru/api/v4/leads/complex`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                name: `Xabar: ${name}`,
                pipeline_id: 10887794, // Yangi "UZAUTO TRAILER SAYT" voronkasi
                status_id: 85654686,   // Siz hozirgina topgan "ПЕРВИЧНЫЙ КОНТАКТ" ustuni
                _embedded: {
                    contacts: [{
                        first_name: name,
                        custom_fields_values: [
                            { field_code: "PHONE", values: [{ value: phone, enum_code: "WORK" }] }
                        ]
                    }]
                },
                custom_fields_values: [
                    {
                        field_id: 1047683, // Xabar maydoni ID-si
                        values: [{ value: message }]
                    }
                ]
            }])
        });

        const data = await response.json();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}