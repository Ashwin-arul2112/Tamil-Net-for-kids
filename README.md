**TamilNet-for Kids**

A child-friendly platform that helps kids learn Tamil alphabets and numbers through interactive handwriting recognition 🎨✍️. The system uses a Convolutional Neural Network (CNN) to recognize handwritten Tamil characters with ~90% accuracy. It also includes a Parent Tracker for monitoring a child’s learning progress.

Dataset credits: HP Labs India
[training](http://shiftleft.com/mirrors/www.hpl.hp.com/india/research/penhw-resources/tamil-iwfhr06-train.html) and [test](http://shiftleft.com/mirrors/www.hpl.hp.com/india/research/penhw-resources/tamil-iwfhr06-test.html) datasets. This system uses a convolutional neural network (CNN), which is widely used across optical character recognition tasks..

**Introduction :**

TamilNet-for Kids is an educational web application designed to make Tamil learning engaging and effective for children.
Kids can draw Tamil letters and numbers on a digital canvas and instantly see the system recognize them, offering an exciting, game-like learning experience.

Parents can also track their child’s learning performance through the integrated parent tracker dashboard.

**Key Features :**

- 🧒 Child-Friendly Interface: Simple, colorful UI with canvas drawing support.
- 🧠 CNN-Based Recognition: Detects handwritten Tamil characters and numbers with ~90% accuracy.
- 🔢 Tamil Numbers Learning: Includes number recognition and learning activities.
- 👨‍👩‍👧 Parent Tracker: Monitors learning progress, accuracy rate, and time spent practicing.
- 📊 Real-Time Feedback: Displays recognized characters and confidence levels.
- 🌐 Web-Based Application: Built using Flask, HTML, CSS, JavaScript, and Bootstrap for responsive design.

**Dataset Setup :**

To run this project properly, you’ll need to download the official Tamil handwritten dataset from HP Labs India.

**Steps to Set Up the Dataset :**

Create a folder named data in your project root directory.

Download the following datasets from** HP Labs** India:

- Training Dataset
- Test Dataset

Run the preprocessing script to prepare the dataset for training (optional if using pretrained weights).

**Architecture :**

The CNN model processes input images (64x64 pixels) through multiple convolutional layers followed by batch normalization, ReLU activation, and fully connected layers.

**Model Flow :**

- Input (1x64x64) → Conv → Conv → Pool → Conv → Conv → Pool → Conv → Conv → Pool → FC(1024) → FC(512) → FC(156)
- Each layer is optimized for speed and accuracy, making the model lightweight enough for web deployment.

**Installation & Usage**

1️⃣ Prerequisites

- Python 3.8+
- Flask
- PyTorch
- NumPy
- OpenCV
- Bootstrap (CDN)

2️⃣ Run the Application
# Clone the repository
git clone https://github.com/your-username/TamilNet-for-Kids.git
cd TamilNet-for-Kids

# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py

3️⃣ Access in Browser

Open your browser and go to 👉
http://127.0.0.1:5000/

**How It Works :**

- The child draws a Tamil letter or number on the canvas.
- The system captures the image and preprocesses it (resizing, normalization, centering).
- The CNN model predicts the character and displays it with a confidence percentage.
- Parent Tracker logs accuracy and practice time for performance insights.


**Training & Testing :**

Training was performed on Google Colab (GPU) with:

- Optimizer: Adam
- Learning Rate: 0.001
- Regularization: L2 (0.003)
- Initialization: Kaiming
- Test Accuracy: ~90.7%
- Validation Accuracy: ~92%

**Future Enhancements :**

- 🔊 Add Tamil letter pronunciation using audio feedback.
- 🧩 Extend recognition to full Tamil words and sentences.
- 🎮 Include gamified quizzes and rewards for learning motivation.
- 📈 Advanced parent dashboards with progress analytics.
- ❤️ Acknowledgements

HP Labs India for the dataset.

CS231n Notes by Andrej Karpathy for CNN and optimization guidance.

Inspiration from Tamil OCR research papers by Prashanth Vijayaraghavan & B.R. Kavitha.

**Output of Frontend :**

Login:
<img width="1826" height="887" alt="Screenshot 2025-10-22 110601" src="https://github.com/user-attachments/assets/b91447e8-7fc8-4eec-b159-165b4e19f15f" />
Signup:
<img width="1815" height="882" alt="Screenshot 2025-10-22 110614" src="https://github.com/user-attachments/assets/0f0dca50-e38f-4b6a-9162-6bc4f811920f" />
Practice:
<img width="1843" height="848" alt="Screenshot 2025-10-22 110655" src="https://github.com/user-attachments/assets/57ea2dea-4178-42be-9712-95eb8e9c2ad8" />
Tamil numbers:
<img width="1884" height="907" alt="Screenshot 2025-10-22 110753" src="https://github.com/user-attachments/assets/38e571a0-9505-4832-90b8-5090475e0c31" />
<img width="1223" height="772" alt="Screenshot 2025-10-22 110811" src="https://github.com/user-attachments/assets/0993893b-f2b9-43bc-945a-e409170e3a3d" />
Parent tracker:
<img width="1896" height="903" alt="Screenshot 2025-10-22 110847" src="https://github.com/user-attachments/assets/46436b57-848e-4b61-a600-040caad2f751" />


