# ![logo](https://github.com/Nopass0/netfolders/assets/42220270/82f6350a-302b-4ed5-a297-477a0853281f) NetFolders - File Server and Management System


**NetFolders** is a TypeScript-based Node.js file server and management system designed to provide a secure and efficient way to upload, store, and manage files. This project offers features like user authentication, file upload and download, logging, and more.

## Features ⏫

- **Secure Authentication**: If configured, NetFolders requires an authentication key for certain operations, ensuring that only authorized users can access and manage files.

- **File Upload and Management**: Easily upload files to the server, which are then stored with unique tokens in the database. Uploaded files can be retrieved using the generated tokens.

- **Database Integration**: NetFolders utilizes a JSON-based database system to manage file metadata, including token, file path, and next delete check timestamp.

- **Logging Utility**: The built-in logging utility records essential server activities, such as file uploads, downloads, and other important events, providing a clear record of system actions.

## Getting Started ⭐

1. Clone this repository to your local machine.

2. Install project dependencies by running `npm install`.

3. Configure the `config.json` file to customize settings like the port, secret key, and delete check period.

4. Run the server using `npm run dev` or `npm run dev:watch`.

## Usage 💻

- **Upload Files**: Send POST requests to `/upload/:filename` to upload files. Files are associated with unique tokens generated from their filenames.

- **Download Files**: Retrieve files using GET requests to `/get/:token`. Provide the generated token associated with the desired file.

- **Authentication**: If configured, provide the authentication key in the request headers to access certain operations.

## Examples :accessibility:

### Uploading a File using PowerShell

To upload a `.jpg` file named `example.jpg`, you can use the following PowerShell command:

```powershell
$secretKey = "your_secret_key_here"
$filePath = "C:\path\to\your\file\example.jpg"
$url = "http://localhost:3000/upload/example.jpg"

Invoke-RestMethod -Uri $url -Method Post -Headers @{"Authorization" = $secretKey} -InFile $filePath
```

Replace your_secret_key_here, C:\path\to\your\file\example.jpg, and the URL as needed.

### Downloading a File using PowerShell

To download a .jpg file using its token, you can use the following PowerShell command:
```powershell
$token = "your_token_here"
$secretKey = "your_secret_key_here"
$url = "http://localhost:3000/get/$token"

Invoke-WebRequest -Uri $url -Headers @{"Authorization" = $secretKey} -OutFile "downloaded_image.jpg"

```
### Uploading a File using Node.js

To upload a .jpg file named example.jpg, you can use the following Node.js code:

```js
const axios = require('axios');
const fs = require('fs');

const secretKey = 'your_secret_key_here';
const filePath = 'path/to/your/file/example.jpg';
const url = 'http://localhost:3000/upload/example.jpg';

const headers = { Authorization: secretKey };

const fileStream = fs.createReadStream(filePath);
axios.post(url, fileStream, { headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

```

### Downloading a File using Node.js with Secret Key

To download a `.jpg` file using its token and a secret key, you can use the following Node.js code:

```js
const axios = require('axios');
const fs = require('fs');

const token = 'your_token_here';
const secretKey = 'your_secret_key_here';
const url = `http://localhost:3000/get/${token}`;

axios({
  method: 'get',
  url,
  responseType: 'stream',
  headers: {
    Authorization: secretKey
  }
})
  .then(response => {
    response.data.pipe(fs.createWriteStream('downloaded_image.jpg'));
  })
  .catch(error => {
    console.error(error);
  });
```

Replace your_token_here, your_secret_key_here, and the URL as needed.

**Note**: Ensure that the secretKey matches the one configured on the server-side for authentication.

## Contributing

Contributions to NetFolders are welcome! If you find any bugs, want to add new features, or improve existing ones, please open an issue or submit a pull request.

[![Forkers repo roster for @Nopass0/netfolders](https://reporoster.com/forks/Nopass0/netfolders)](https://github.com/Nopass0/netfolders/network/members)

[![Stargazers repo roster for @Nopass0/netfolders](https://reporoster.com/stars/Nopass0/netfolders)](https://github.com/Nopass0/netfolders/stargazers)

## License

This project is licensed under the [MIT License](LICENSE).
