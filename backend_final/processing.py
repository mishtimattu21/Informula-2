# ✅ Import libraries
import requests
import time
# from IPython.display import Image
from dotenv import load_dotenv
import os
# ✅ Upload your image
# from google.colab import files
# uploaded = files.upload()       

# Load environment variables
load_dotenv()

# Debug prints
print("ENDPOINT:", os.getenv("ENDPOINT"))
print("AZURE_API_KEY:", os.getenv("AZURE_API_KEY"))

# ✅ Use uploaded file name (e.g., 'image1.jpg')
# local_image_path = next(iter(uploaded))
local_image_path="Informula\public\ trial.jpg"
# ✅ Display the image
if not os.path.exists(local_image_path):
    raise FileNotFoundError(f"Image file '{local_image_path}' not found.")

# ✅ Read the image bytes
with open(local_image_path, "rb") as f:
    image_data = f.read()

# ✅ Azure Read API endpoint
endpoint = os.getenv("ENDPOINT")
if not endpoint:
    raise ValueError("ENDPOINT environment variable is not set. Please check your .env file.")

ocr_url = f"{endpoint}/vision/v3.2/read/analyze"

api_key = os.getenv("AZURE_API_KEY")
if not api_key:
    raise ValueError("AZURE_API_KEY environment variable is not set. Please check your .env file.")

headers = {
    "Ocp-Apim-Subscription-Key": api_key,
    "Content-Type": "application/octet-stream"
}

# ✅ Step 1: Send image to Azure
print("Submitting image to Azure OCR API...")
print("URL:", ocr_url)  # Debug print
response = requests.post(ocr_url, headers=headers, data=image_data)
if response.status_code != 202:
    print("❌ Error:", response.status_code)
    print(response.text)
    raise Exception("Azure OCR request failed.")

# ✅ Step 2: Poll for result
operation_url = response.headers["Operation-Location"]
print("Waiting for OCR results...")

while True:
    result_response = requests.get(operation_url, headers=headers)
    result_json = result_response.json()
    status = result_json["status"]

    if status == "succeeded":
        break
    elif status == "failed":
        raise Exception("OCR failed.")
    time.sleep(1)

# ✅ Step 3: Extract and store text
extracted_text = []
for result in result_json["analyzeResult"]["readResults"]:
    for line in result["lines"]:
        extracted_text.append(line["text"])

# Store the extracted text in a variable that can be imported
INGREDIENTS_TEXT = "\n".join(extracted_text)

# Print the extracted text if this file is run directly
if __name__ == "__main__":
    print("\n📝 Extracted Text:")
    print(INGREDIENTS_TEXT)