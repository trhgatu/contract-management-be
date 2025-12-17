// using native fetch

async function verify() {
    try {
        const response = await fetch('http://localhost:5000/api/master-data/personnel', {
            headers: {
                // Assuming no auth needed for dev or I need to login.
                // Using a known endpoint that might generate 401 if auth is needed.
            }
        });

        console.log('Status:', response.status);
        if(response.status === 200) {
            const data = await response.json();
            console.log('Data:', JSON.stringify(data, null, 2));
        } else {
            const text = await response.text();
            console.log('Error Body:', text);
        }
    } catch(error) {
        console.error('Error:', error);
    }
}

verify();
