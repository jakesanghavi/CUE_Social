from flask import Flask, request, jsonify
import cv2
import pytesseract
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)  # Allow requests from any origin

# Configure Tesseract path if needed
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

def image_to_text(img_path):
    # Load the image
    image = cv2.imread(img_path)

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply a binary threshold to get a binary image
    _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)

    # Invert the binary image to get white text on black background
    inverted_binary = cv2.bitwise_not(binary)

    # Perform OCR on the inverted binary image with bounding boxes
    data = pytesseract.image_to_data(inverted_binary, config='--psm 6', output_type=pytesseract.Output.DICT)

    # Set the minimum distance threshold
    min_distance = 50

    lines = []
    current_line = []
    prev_right = 0

    for i in range(len(data['text'])):
        word = data['text'][i]
        if word.strip():
            x = data['left'][i]
            y = data['top'][i]
            w = data['width'][i]
            h = data['height'][i]
            right = x + w

            if current_line and (x - prev_right) > min_distance:
                lines.append(" ".join(current_line))
                current_line = []

            current_line.append(word)
            prev_right = right

    if current_line:
        lines.append(" ".join(current_line))

    cards = []
    deck_code = ""

    accept_chars = ['(', ' ', ')', '{', '}']
    for line in lines:
        if "DECK CODE:" in line:
            codes = line.split(":")
            code = codes[-1]
            deck_code = code.strip()

        line = line.split()
        i = 0
        flag = False

        while not flag and i < len(line):
            if line[i].isupper():
                flag = True
            else:
                i += 1

        line = line[i:]
        line = " ".join(line)

        index_of_first_capital = None

        for index, char in enumerate(line):
            if char.isupper():
                index_of_first_capital = index
                break

        leading_line = []
        if index_of_first_capital is not None:
            leading_line = line[index_of_first_capital:]

        trailing_line = []
        found_lower = False
        for char in leading_line:
            if char.islower() or (char not in accept_chars and not char.isupper()):
                found_lower = True
                break
            if not found_lower:
                trailing_line.append(char)

        trailing_line = ''.join(trailing_line)

        capital_letters = ''.join([char for char in trailing_line if char.isupper() or char in accept_chars]).strip()

        # Remove single-character words unless they are 'A' or 'I'
        processed_line_words = []
        for word in capital_letters.split():
            if len(word) > 1 or word in ['A', 'I']:
                processed_line_words.append(word)

        processed_line = " ".join(processed_line_words).strip()
        if len(processed_line) > 0:
            cards.append(processed_line)

    return cards, deck_code

@app.route('/upload', methods=['POST'])
# @cross_origin()
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    image_file = request.files['image']

    # Save the image temporarily
    temp_image_path = '/tmp/uploaded_image.png'
    image_file.save(temp_image_path)

    # Process the image and get results
    cards, deck_code = image_to_text(temp_image_path)

    response = jsonify({'cards': cards, 'deck_code': deck_code})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")
    return response

@app.route('/')
def hello_world():
    return 'Hello from Flask!'
