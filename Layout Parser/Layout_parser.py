import layoutparser as lp
import cv2
import matplotlib.pyplot as plt

# Load the image
image_path = "D:\OCR session\pic 16.jpg" # Replace with your image path
image = cv2.imread(image_path)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Load a pre-trained Detectron2 model from LayoutParser
model = lp.Detectron2LayoutModel(
    config_path= r"D:\OCR\Pipeline\Layout Parser\configs\config.yaml",
    model_path= r"D:\OCR\model_final.pth",
    label_map={0: "Text", 1: "Title", 2: "List", 3: "Table", 4: "Figure"},
    extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.7],  # Confidence threshold
)

# Run layout detection
layout = model.detect(image)

# Draw bounding boxes with labels
viz = lp.draw_box(image, layout, box_width=3, show_element_type=True)

# Display the result
plt.figure(figsize=(12, 16))
plt.imshow(viz)
plt.axis("off")
plt.title("Detected Layout Elements")
plt.show()