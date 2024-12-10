// Your Smartsheet Access Token
const accessToken = 'YOUR_API_ACCESS_TOKEN';
// Your Smartsheet Sheet ID
const sheetId = 'YOUR_SHEET_ID';
// CORS Proxy (for development purposes)
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

// Function to search the Smartsheet sheet
async function searchSheet() {
    const searchValue = document.getElementById('searchValue').value.trim();
    
    if (!searchValue) {
        alert('Please enter a search value.');
        return;
    }

    // Show loading message while fetching data
    document.getElementById('results').innerHTML = 'Loading...';

    try {
        // Fetch sheet data via Smartsheet API
        const response = await fetch(`${corsProxy}https://api.smartsheet.com/2.0/sheets/${sheetId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        // Parse the response
        const data = await response.json();
        const rows = data.rows;
        
        // Filter rows where the cell value matches the searchValue
        let resultsHtml = '<h2>Search Results:</h2>';
        let foundResults = false;

        rows.forEach(row => {
            row.cells.forEach(cell => {
                // Check if the cell contains the search value (replace 'YOUR_COLUMN_ID' with the actual column ID)
                if (cell.value && cell.value.toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    foundResults = true;
                    resultsHtml += `<p>Row ID: ${row.id}</p>`;
                    resultsHtml += `<p>Row Data: ${JSON.stringify(row.cells)}</p>`;
                    resultsHtml += '<hr>';
                }
            });
        });

        // Display results or a message if no results were found
        if (!foundResults) {
            resultsHtml = '<p>No matching rows found.</p>';
        }
        document.getElementById('results').innerHTML = resultsHtml;

    } catch (error) {
        console.error('Error fetching data from Smartsheet:', error);
        document.getElementById('results').innerHTML = 'Error fetching data from Smartsheet. Please try again later.';
    }
}
