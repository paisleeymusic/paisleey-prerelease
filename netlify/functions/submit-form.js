const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        const data = JSON.parse(event.body);

        // 1. Validate environment variable
        if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
            throw new Error("Missing GOOGLE_SERVICE_ACCOUNT environment variable");
        }

        // 2. Parse service account credentials
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

        // 3. Initialize auth
        const auth = new JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // 4. Connect to spreadsheet
        const doc = new GoogleSpreadsheet('11-21atPg668ulULZN-nFSFJpIYcmDXngYUCzaZVEBw4', auth);
        await doc.loadInfo();

        const sheet = doc.sheetsByTitle['Landing Page'];
        if (!sheet) {
            throw new Error("Sheet tab 'Landing Page' not found");
        }

        // 5. Append data to sheet
        // Headers: Timestamp, Name, Email, Phone, Platforms_Selected, Source, Status
        await sheet.addRow({
            Timestamp: data.timestamp,
            Name: data.name,
            Email: data.email,
            Phone: data.phone || '',
            Platforms_Selected: (data.platforms_selected || []).join(', '),
            Source: data.referrer || 'Direct',
            Status: 'New'
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Allow local testing
            },
            body: JSON.stringify({ status: "success" }),
        };
    } catch (err) {
        console.error('Submission Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                status: "error",
                message: err.message
            }),
        };
    }
};
