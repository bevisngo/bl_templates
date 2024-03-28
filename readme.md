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

#### Check for redundant elements.
<!-- ![plot](./directory_1/directory_2/.../directory_n/plot.png) -->
- **step-by-step**:
  - Copy all of the SVG files exported from the designers into the ```test/assets/input``` directory.
  - Run this command on the root dir**: ```node test/cases/ checking.js```
  - Check the result in the ```test/assets/output``` directory
  - Example result:
  ```
    ➜  template-printing-tool git:(master) node test/cases/ checking.js  

    Converted test/assets/input/01_Back_hor.svg to PDF
    Converted test/assets/input/01_Front.svg to PDF
    Converted test/assets/input/01_Front_or.svg to PDF
    Converted test/assets/input/01_Back.svg to PDF
  ```
