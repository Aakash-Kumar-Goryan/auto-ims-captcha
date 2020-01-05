from flask import Flask, flash,request, redirect, url_for, jsonify
import os
from werkzeug.utils import secure_filename
import os
import time
import cv2
import numpy as np
import pickle
from predictions import predictCaptcha
import urllib 
from flask_cors import CORS

#################
# Load Model    #
#################
list_unpickle = open("model", 'rb')
# load the unpickle object into a variable
clf = pickle.load(list_unpickle)

UPLOAD_FOLDER = os.getcwd()  +  '/uploads'
# print(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def downloadImage(url):
    imageName = url.split("/")[6]
    urllib.request.urlretrieve(url, "uploads/" + imageName)
    print(imageName)
    return imageName


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            captcha = predictCaptcha(cv2.imread(filepath))
            print("captcha:", captcha)
            print(jsonify(captcha))
            # return redirect(url_for('upload_file', filename=filename))
            return jsonify(captcha = captcha)
            
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/solveCaptcha', methods=['GET'])
def solveCaptcha():
    if request.method == 'GET':
        link = request.args.get('link')
        print(link)
        imageName = downloadImage(link)
        captcha = predictCaptcha(cv2.imread(os.path.join("uploads", imageName)))

        return jsonify(captcha = captcha)




if __name__ == "__main__":
    app.run(debug = True)