# ![logo](https://github.com/Nopass0/netfolders/assets/42220270/82f6350a-302b-4ed5-a297-477a0853281f) NetFolders - File Server and Management System


**NetFolders** is a TypeScript-based Node.js file server and management system designed to provide a secure and efficient way to upload, store, and manage files. This project offers features like user authentication, file upload and download, logging, and more.

## Features ⏫

- **Secure Authentication**: If configured, NetFolders requires an authentication key for certain operations, ensuring that only authorized users can access and manage files.

- **File Upload and Management**: Easily upload files to the server, which are then stored with unique tokens in the database. Uploaded files can be retrieved using the generated tokens.

- **Database Integration**: NetFolders utilizes a JSON-based database system to manage file metadata, including token, file path, and next delete check timestamp.

- **Logging Utility**: The built-in logging utility records essential server activities, such as file uploads, downloads, and other important events, providing a clear record of system actions.

- **ASCII Art Logo**: Upon server start, NetFolders displays an ASCII art logo along with the project version, author information, and contact email for a visually appealing introduction.

## Getting Started ⭐

1. Clone this repository to your local machine.

2. Install project dependencies by running `npm install`.

3. Configure the `config.json` file to customize settings like the port, secret key, and delete check period.

4. Run the server using `npm run dev` or `npm run dev:watch`.

## Usage 💻

- **Upload Files**: Send POST requests to `/upload/:filename` to upload files. Files are associated with unique tokens generated from their filenames.

- **Download Files**: Retrieve files using GET requests to `/get/:token`. Provide the generated token associated with the desired file.

- **Authentication**: If configured, provide the authentication key in the request headers to access certain operations.

## Contributing

Contributions to NetFolders are welcome! If you find any bugs, want to add new features, or improve existing ones, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
