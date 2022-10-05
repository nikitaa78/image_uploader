# Import flask and datetime module for showing date and time
from urllib.request import urlretrieve
from flask import Flask, jsonify, request
import datetime
from PIL import Image
import base64
from io import BytesIO
from jinja2 import Undefined
import requests
import io
  
x = datetime.datetime.now()
  
# Initializing flask app
app = Flask(__name__)
  
  
# Route for seeing a data
@app.route('/data')
def get_time():
    # Returning an api for showing in  reactjs
    return {
        'Name':"nikita",
        "Age":"22",
        "Date":x, 
        "programming":"python"
    }

@app.route("/send-image", methods=['POST'])
def send_image():
    '''
    Route: /send-image
    Description: API route to send to disk from frontend
    '''
    body = request.get_json()
    url = body['url']
    # ----- SECTION 1 -----  
    #File naming process for nameless base64 data.
    #We are using the timestamp as a file_name.
    from datetime import datetime
    dateTimeObj = datetime.now()
    file_name_for_base64_data = dateTimeObj.strftime("%d-%b-%Y--(%H-%M-%S)")
    
    #File naming process for directory form <file_name.jpg> data.
    #We are taken the last 8 characters from the url string.
    file_name_for_regular_data = url[-10:-4]
    
    # ----- SECTION 2 -----
    try:
        file_url = None
        # Base64 DATA
        if "data:image/jpeg;base64," in url:
            base_string = url.replace("data:image/jpeg;base64,", "")
            decoded_img = base64.b64decode(base_string)
            img = Image.open(BytesIO(decoded_img))
            rotated_img = img.rotate(90)
            rotated_img_bytes = image_to_byte_array(rotated_img, 'jpeg')
            encoded_img = base64.encodebytes(rotated_img_bytes)
            str_encoding = str(encoded_img, 'utf-8')
            file_url = "data:image/jpeg;base64," + str_encoding
            file_name = file_name_for_base64_data + ".jpg"
            img.save(file_name, "jpeg")

        # Base64 DATA
        elif "data:image/png;base64," in url:
            base_string = url.replace("data:image/png;base64,", "")
            decoded_img = base64.b64decode(base_string)
            img = Image.open(BytesIO(decoded_img))
            rotated_img = img.rotate(90)
            rotated_img_bytes = image_to_byte_array(rotated_img, 'png')
            encoded_img = base64.encodebytes(rotated_img_bytes)
            str_encoding = str(encoded_img, 'utf-8')
            file_url = "data:image/png;base64," + str_encoding
            file_name = file_name_for_base64_data + ".png"
            img.save(file_name, "png")

        # Regular URL Form DATA
        else:
            response = requests.get(url)
            img = Image.open(BytesIO(response.content)).convert("RGB")
            rotated_img = img.rotate(90)
            rotated_img_bytes = image_to_byte_array(rotated_img, 'jpeg')
            encoded_img = base64.encodebytes(rotated_img_bytes)
            str_encoding = str(encoded_img, 'utf-8')
            file_url = "data:image/jpeg;base64," + str_encoding
            file_name = file_name_for_regular_data + ".jpg"
            img.save(file_name, "jpeg")
        
    # ----- SECTION 3 -----    
        return jsonify({'status': 200, 'file_name': file_name, 'file_url': file_url}), 200
    except Exception as e:
        status = "Error! = " + str(e)
        print(status)


    return jsonify({'status': 400}), 400

def image_to_byte_array(image: Image, format) -> bytes:
  # BytesIO is a fake file stored in memory
  imgByteArr = io.BytesIO()
  # image.save expects a file as a argument, passing a bytes io ins
  image.save(imgByteArr, format)
  # Turn the BytesIO object back into a bytes object
  imgByteArr = imgByteArr.getvalue()
  return imgByteArr