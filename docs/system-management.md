# Systemn Management

## Storage

Backend with index db and local storage, with a fallback to local storage if index db is not available.

## Endpoints

Mock Service Worker will be used to simulate the backend API. It will internally fetch the index db or local storage to get the data.

## Import and export

To allow for mutliple devices, the user will be able to import and export the data. The data will be stored in a JSON format.