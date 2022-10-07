# Image Uploader

This webapp uses Python Flask (backend) and React, Material UI (frontend). 

Users are able to upload an image, see a 90 degree rotated image, and click on the image to black and white filter and unfilter an image.

[Local Installation](https://github.com/nikitaa78/image_uploader/blob/master/README.md#local-installation)

https://user-images.githubusercontent.com/20808557/194671994-1faf702c-c7cc-4048-9630-bb33262a1e16.mp4


<img width="1792" alt="Screen Shot 2022-10-07 at 3 28 26 PM" src="https://user-images.githubusercontent.com/20808557/194671241-45d1a32c-eb5c-428f-8e81-43b8266aa11e.png"><img width="1792" alt="Screen Shot 2022-10-07 at 3 28 35 PM" src="https://user-images.githubusercontent.com/20808557/194671242-236cc88a-4ed2-4e90-a5fa-d5829deae808.png">

<img width="1792" alt="Screen Shot 2022-10-07 at 3 28 56 PM" src="https://user-images.githubusercontent.com/20808557/194671245-8fa6034d-f37e-4f1b-af43-e9c0ef98a684.png"><img width="1792" alt="Screen Shot 2022-10-07 at 3 29 08 PM" src="https://user-images.githubusercontent.com/20808557/194671246-5a8d3826-82f6-4366-a970-522546fe9923.png">

<img width="1792" alt="Screen Shot 2022-10-07 at 3 48 59 PM" src="https://user-images.githubusercontent.com/20808557/194672600-70f8f10b-53b5-4eab-bbb6-ff00ea274db6.png">

## Local Installation

To install and run this webapp locally follow these steps separately for backend and frontend deployment, each in their own terminal window.

### Backend
Starting from the image-uploader directory:

`pip install -r requirements.txt`

`cd backend`

`python3 -m venv env`

`source env/bin/activate`

`cd ..`

`npm run start-backend`


### Frontend

Starting from the image-uploader directory:

`npm i`

`npm start`

Now you should see a window running localhost with the project loaded and ready to use!
