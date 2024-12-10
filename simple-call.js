<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smartsheet Search</title>
</head>
<body>
    <h1>Smartsheet Search</h1>
    <label for="searchValue">Search Value:</label>
    <input type="text" id="searchValue" placeholder="Enter a value">
    <button onclick="searchSheet()">Search</button>
    <div id="results"></div>

    <script>
        const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your Smartsheet API access token
        const sheetId = 'YOUR_SHEET_ID'; // Replace with your Smartsheet sheet ID
        const targetColumnId = 'YOUR_COLUMN_ID'; // Replace with the ID of the column you want to search

        async function searchSheet() {
            const searchValue = document.getElementById('searchValue').value.trim();

            if (!searchValue) {
                alert('Please enter a search value.');
                return;
            }

            // Display loading message
            document.getElementById('results').textContent = 'Searching...';

            try {
                // Fetch the entire sheet data
                const response = await fetch(`https://api.smartsheet.com/2.0/sheets/${sheetId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                const rows = data.rows;

                // Filter rows that match the search value in the target column
                const results = rows.filter(row => {
                    const cell = row.cells.find(c => c.columnId === targetColumnId);
                    return cell && cell.value && cell.value.toString().toLowerCase().includes(searchValue.toLowerCase());
                });

                // Display results
                if (results.length > 0) {
                    const resultHtml = results.map(row => `<p>Row ID: ${row.id} - Value: ${row.cells.find(c => c.columnId === targetColumnId).value}</p>`).join('');
                    document.getElementById('results').innerHTML = resultHtml;
                } else {
                    document.getElementById('results').textContent = 'No matching rows found.';
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                document.getElementById('results').textContent = 'Error fetching data. Check console for details.';
            }
        }
    </script>
</body>
</html>
