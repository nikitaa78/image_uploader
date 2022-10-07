from urllib.request import urlretrieve
from flask import Flask, jsonify, request
import datetime
from PIL import Image
import base64
from io import BytesIO
import requests
import io
  
x = datetime.datetime.now()
  
# Initializing flask app
app = Flask(__name__)
  
@app.route("/send-image", methods=['POST'])
def send_image():
    '''
    Route: /send-image
    Description: API route to send image to disk from frontend -
    sends over 90 degree rotated image url and black and white filtered image url in response
    '''
    body = request.get_json()
    url = body['url']

    #File naming process for nameless base64 data.
    #We are using the timestamp as a file_name.
    from datetime import datetime
    dateTimeObj = datetime.now()
    file_name_for_base64_data = dateTimeObj.strftime("%d-%b-%Y--(%H-%M-%S)")
    
    #File naming process for directory form <file_name.jpg> data.
    #We are taken the last 8 characters from the url string.
    file_name_for_regular_data = url[-10:-4]
    
    try:
        file_url = None
        filtered_file_url = None
        file_name = None
        # Base64 DATA
        if "data:image/jpeg;base64," in url:
            base_string = url.replace("data:image/jpeg;base64,", "")
            decoded_img = base64.b64decode(base_string)
            img = Image.open(BytesIO(decoded_img))
            
            # rotate and filter image
            file_url, filtered_file_url = rotate_and_filter_urls(img, 'jpeg')

            file_name = file_name_for_base64_data + ".jpg"
            img.save(file_name, "jpeg")

        # Base64 DATA
        elif "data:image/png;base64," in url:
            base_string = url.replace("data:image/png;base64,", "")
            decoded_img = base64.b64decode(base_string)
            img = Image.open(BytesIO(decoded_img))

            # rotate and filter image
            file_url, filtered_file_url = rotate_and_filter_urls(img, 'png')

            file_name = file_name_for_base64_data + ".png"
            img.save(file_name, "png")

        # Regular URL Form DATA
        else:
            response = requests.get(url)
            img = Image.open(BytesIO(response.content)).convert("RGB")

            # rotate and filter image
            file_url, filtered_file_url = rotate_and_filter_urls(img, 'jpeg')

            file_name = file_name_for_regular_data + ".jpg"
            img.save(file_name, "jpeg")
        
        return jsonify({'status': 200, 'file_name': file_name, 'file_url': file_url, 'filtered_file_url': filtered_file_url}), 200
    except Exception as e:
        status = "Error! = " + str(e)
        print(status)

    return jsonify({'status': 400}), 400

# rotated and filtered image url
def rotate_and_filter_urls(image, format):
    #rotate image
    rotated_img, encoded_img = rotate_image(image, format)
    str_encoding = str(encoded_img, 'utf-8')
    file_url = "data:image/" + format + ";base64," + str_encoding

    # filter image
    filtered_img, filtered_encoded_img = filter_image(rotated_img, format)
    filtered_str_encoding = str(filtered_encoded_img, 'utf-8')
    filtered_file_url = "data:image/" + format + ";base64," + filtered_str_encoding

    return file_url, filtered_file_url

# returns encoded rotated image
def rotate_image(image, format):
    rotated_img = image.rotate(90)
    rotated_img_bytes = image_to_byte_array(rotated_img, format)
    encoded_img = base64.encodebytes(rotated_img_bytes)
    return rotated_img, encoded_img

# returns encoded filtered image
def filter_image(image, format):
    filtered_img = image.convert("L")
    filtered_img_bytes = image_to_byte_array(filtered_img, format)
    filtered_encoded_img = base64.encodebytes(filtered_img_bytes)
    return filtered_img, filtered_encoded_img

# helper function to convert image to bytes
def image_to_byte_array(image: Image, format) -> bytes:
  imgByteArr = io.BytesIO()
  image.save(imgByteArr, format)
  imgByteArr = imgByteArr.getvalue()
  return imgByteArr