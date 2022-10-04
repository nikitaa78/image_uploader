# Import flask and datetime module for showing date and time
from flask import Flask
import datetime
  
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