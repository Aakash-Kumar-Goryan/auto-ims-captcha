from flask import Flask, flash,request, redirect, url_for, jsonify
import os
from werkzeug.utils import secure_filename
import os
import time
import cv2
import numpy as np
import pickle

#################
# Load Model    #
#################
list_unpickle = open("model", 'rb')
# load the unpickle object into a variable
clf = pickle.load(list_unpickle)

UPLOAD_FOLDER = os.getcwd()  +  '/uploads'
print(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def predictImage(filepath):

    img = cv2.imread(filepath)   
    debug = not True
    kernel = np.ones((2,2),np.uint8)
    bordersize = 10
    kernel2 = np.ones((12,12),np.float32)/225
    

    # Basic Processing
    resize = cv2.resize(img, (400,200))
    border = cv2.copyMakeBorder(
    resize,
    top=bordersize,
    bottom=bordersize,
    left=bordersize,
    right=bordersize,
    borderType=cv2.BORDER_CONSTANT,
    value=[255, 255,255]
    )
    gray = cv2.cvtColor(border,cv2.COLOR_BGR2GRAY)
    smoothed = cv2.filter2D(gray,-1,kernel2)
    retval,thresh = cv2.threshold(smoothed, 30, 255, cv2.THRESH_BINARY)
    erode = cv2.erode(thresh,kernel,iterations = 2)
#     dialate = cv2.dilate(erode,kernel,iterations = 1)
    
    if debug:
#         cv2.imshow("Original", img)
#         cv2.waitKey(0)
#         cv2.imshow("Resized", resize)
#         cv2.waitKey(0)
#         cv2.imshow("Bordered", border)
#         cv2.waitKey(0)
        cv2.imshow("Gray", gray)
        cv2.waitKey(0)
        cv2.imshow("Smooth", smoothed)
        cv2.waitKey(0)
        cv2.imshow("Thresholding", thresh)
        cv2.waitKey(0)
#         cv2.imshow("Erode", erode)
#         cv2.waitKey(0)
        cv2.imshow("Dilate", dialate)
        cv2.waitKey(0)
    
    final = erode
    
    
    # Find Contours
    contourImg = np.copy(final)
#     contourImg = cv2.cvtColor(contourImg, cv2.COLOR_GRAY2BGR)
    _, contours, hie = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
    
    hie = hie[0]
#     print(hie)
    
    goodContours = []

    ind = 0
    for c in contours:
        testimg = np.copy(contourImg)
        rect = cv2.boundingRect(c)
        area = cv2.contourArea(c)
        x,y,w,h = rect
        cv2.rectangle(testimg,(x,y),(x+w,y+h),(0,255,0),2)
#         cv2.imshow("test", testimg)
        cv2.waitKey(1)
        parent = hie[ind][3]
#         print(area, parent)
#         time.sleep(3)

        ind+=1
        if(parent == 0):
            goodContours.append(c)
#         if(area < 1800 or area > 7000): 
#             continue
        
        
#     print("GoodContours: ", len(goodContours))
    cv2.destroyAllWindows()

    rects = []

    for c in goodContours:
        rect = cv2.boundingRect(c)
        area = cv2.contourArea(c)
        x,y,w,h = rect
#         print(w,h)
        if(w > 150):
            x2 = x + int(w/3)
            x3 = x2 + int(w/3)
            rects.append((x2,y,int(w/3),h))
            rects.append((x3,y,int(w/3),h))
            rects.append((x,y,int(w/3),h))
            cv2.rectangle(contourImg,(x2,y),(x2+int(w/3),y+h),(0,255,0),2)
            cv2.rectangle(contourImg,(x3,y),(x3+int(w/3),y+h),(0,255,0),2)
            cv2.rectangle(contourImg,(x,y),(x+int(w/3),y+h),(0,255,0),2)
        elif (w > 65):
            x2 = x + int(w/2)
            rects.append((x2,y,int(w/2),h))
            rects.append((x,y,int(w/2),h))
            cv2.rectangle(contourImg,(x2,y),(x2+int(w/2),y+h),(0,255,0),2)
            cv2.rectangle(contourImg,(x,y),(x+int(w/2),y+h),(0,255,0),2)
        else:
            rects.append((x,y,w,h))
            cv2.rectangle(contourImg,(x,y),(x+w,y+h),(0,255,0),2)
            
#     cv2.imshow("contour", contourImg)
#     cv2.waitKey(1)
#     time.sleep(1)

#     print(rects)
    rects = sorted(rects)

#     print("Contours:", len(rects))
    if (len(rects) != 5):
        return
        
#     print(dic)

    predictions = []

    i = 0
    for (x,y,w,h) in rects:
#         print(digit)
#         Draw rectangle around contours found
    #     cv2.rectangle(contourImg,(x,y),(x+w,y+h),(0,255,0),2)

    #     Draw the contours on image
    #     cv2.drawContours(contourImg, c, -1, (0, 255, 0), 1)

    #     Region of Interest
        roi = contourImg[y:y+h,x:x+w]
        display = cv2.resize(roi, (120,120))
        roi = cv2.resize(roi, (20,20))
        print(roi.shape) 
        pred = clf.predict(np.reshape(roi,(1,400)))
        predictions.append(pred[0])
#         print(pred)
    #     print(roi)
#         cv2.imshow("roi", display)
#         if digit == '9' and dic[digit] > 24:
#             cv2.waitKey(1000)
#             print(filename)
#         else:
#             cv2.waitKey(1)
#         clf.predict([roi])
        cv2.waitKey(1)
        cv2.destroyAllWindows()
    #     cv2.imshow("roid", roid)
        
#         time.sleep(0.4)
        
    cv2.destroyAllWindows()
    
    return predictions


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
            predictions = predictImage(filepath)
            captcha = ''.join(predictions)
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



if __name__ == "__main__":
    app.run(debug = True)