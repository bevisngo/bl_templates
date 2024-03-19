## Generate & Convert information from payload to PDF (base on SVG) files

### Installation
- Clone this repository to your local directory
- Run: ```yarn install``` or ```npm install```
- Run: ```yarn start``` or ```npm start```
  - PORT: 3000

### Usage (For each template)
#### Template 1
<!-- ![plot](./directory_1/directory_2/.../directory_n/plot.png) -->
- **Endpoint**: ```/api/tempate1```
- **Payload**: List of information of the users
  - Example:
  ```json
    {
        "data": [
            {
                "forcegroundPayload": {
                    "avatar": "https://png.pngtree.com/png-clipart/20200819/ourlarge/pngtree-female-profile-avatar-elements-png-image_2326125.jpg",
                    "fullname": "LIM HONG TONG",
                    "englishName": "TONG",
                    "jobTitle": "Business Developments",
                    "phone": "(+855) 12676171",
                    "email": "tong@libertytechnology.com"
                },
                "backgroundPayload": {
                    "qrCode": "https://www.npmjs.com/package/qrcode",
                    "idNumber": "1"
                }
            },
            {
                "forcegroundPayload": {
                    "avatar": "https://png.pngtree.com/png-clipart/20200819/ourlarge/pngtree-female-profile-avatar-elements-png-image_2326125.jpg",
                    "fullname": "NGUYEN VU",
                    "englishName": "TREYY",
                    "jobTitle": "Business Development",
                    "phone": "(+855) 12676171",
                    "email": "tong@libertytechnology.com"
                },
                "backgroundPayload": {
                    "qrCode": "https://www.npmjs.com/package/qrcode",
                    "idNumber": "1"
                }
            },
        ]
    }
  ```