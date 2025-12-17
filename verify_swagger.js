
async function verify() {
    try {
        const response = await fetch('http://localhost:5000/api-docs/');
        console.log('Status:', response.status);
        if(response.status === 200) {
            console.log('Swagger UI is up.');
        } else {
            console.log('Swagger UI returned status:', response.status);
        }
    } catch(error) {
        console.error('Error:', error);
    }
}

verify();
