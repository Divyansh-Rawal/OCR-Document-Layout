import os
import json
from PIL import Image
import pytesseract
from doclayout_yolo import YOLO
import re


# --------------------
# CONFIG
# --------------------

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

LANGUAGE_FOLDERS = {
    r"D:\OCR\Input OCR\Input_hin": {"lang": "hin", "output": "OCR_hin.json"},
    # Add more folders if needed for hin, mar, guj, kan, tel, tam
}

YOLO_MODEL_PATH = r"D:\OCR\Pipeline\yolov12l-doclaynet.pt"

# --------------------
# CLEANING DICTIONARIES
# --------------------

COMMON_FIXES = {
    "ben": {
        "শুখাচ্জী": "মুখার্জী",
        "ভরট": "ভরাট",
        "ভর্জরত": "জর্জরিত",
        "$": "্",
    },
    "hin": {
        "भाा": "भारत",
        "िकए": "किए",
        "हैै": "है",
    },
    "mar": {
        "शहरर": "शहर",
        "सररकार": "सरकार",
    },
    "guj": {
        "ભારर": "ભારત",
        "સरકારર": "સરકાર",
    },
    "kan": {
        "ಕರರ": "ಕರ",
        "ಭಾರತತ": "ಭಾರತ",
    },
    "tel": {
        "భారతత": "భారత",
        "ప్రభుతవవ": "ప్రభుత్వ",
    },
    "tam": {
        "இந்தத": "இந்த",
        "சரरकार": "சரਕਾਰ",
    }
}

def clean_ocr_text(text, lang):
    """Apply regex + dictionary-based corrections per language."""
    if not text:
        return text

    fixes = COMMON_FIXES.get(lang, {})
    for wrong, correct in fixes.items():
        text = re.sub(wrong, correct, text)

    # generic cleanups
    text = re.sub(r"[“”]", '"', text)
    text = re.sub(r"[’‘]", "'", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

# --------------------
# YOLO HELPERS
# --------------------

def perform_prediction(image, model, conf=0.5, iou_thresh=0.45, device="cpu"):
    return model.predict(image, imgsz=1024, conf=conf, iou=iou_thresh, device=device, verbose=False)

def extract_bboxes(det_res_list):
    boxes_info = []
    for result in det_res_list:
        names = result.names
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            label_idx = int(box.cls.item())
            confidence = float(box.conf.item())
            label_name = names.get(label_idx, f"Class_{label_idx}")
            boxes_info.append({
                "bbox": [x1, y1, x2, y2],
                "yolo_class": label_name,
                "confidence": confidence
            })
    return boxes_info

# --------------------
# OCR HELPERS
# --------------------

def crop_and_ocr(image, boxes, lang=None, pad=10, min_text_len=2):
    results = []
    for b in boxes:
        x1, y1, x2, y2 = b["bbox"]
        x1 = max(0, x1 - pad)
        y1 = max(0, y1 - pad)
        x2 = min(image.width, x2 + pad)
        y2 = min(image.height, y2 + pad)

        crop = image.crop((x1, y1, x2, y2))
        ocr_text = pytesseract.image_to_string(crop, lang=lang, config="--psm 6 --oem 1").strip()

        # 🔹 Apply cleaning
        ocr_text = clean_ocr_text(ocr_text, lang)

        block_type = b["yolo_class"]
        if block_type.lower() in ["picture", "figure", "image"] and len(ocr_text) > min_text_len:
            block_type = "Text"

        results.append({
            "block_type": block_type,
            "bbox": [x1, y1, x2, y2],
            "ocr_text": ocr_text,
            "yolo_confidence": b["confidence"]
        })
    return results

# --------------------
# MAIN PIPELINE
# --------------------

def process_folder(model, folder, lang):
    folder_results = {}
    for file in os.listdir(folder):
        if not file.lower().endswith(('.png', '.jpg', '.jpeg', '.tif')):
            continue

        img_path = os.path.join(folder, file)
        pil_img = Image.open(img_path).convert("RGB")

        raw_results = perform_prediction(pil_img, model)
        boxes = extract_bboxes(raw_results)

        ocr_results = crop_and_ocr(pil_img, boxes, lang)

        folder_results[file] = {
            "language": lang,
            "original_size": [pil_img.width, pil_img.height],
            "blocks": ocr_results
        }

    return folder_results

def main():
    model = YOLO(YOLO_MODEL_PATH)

    for folder, lang_info in LANGUAGE_FOLDERS.items():
        lang = lang_info["lang"]
        output_file = lang_info["output"]

        if not os.path.exists(folder):
            print(f"Folder {folder} not found, skipping.")
            continue

        print(f"🔹 Processing {folder} (lang={lang})")
        folder_results = process_folder(model, folder, lang)

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(folder_results, f, ensure_ascii=False, indent=2)

        print(f"Results saved to {output_file}")

if __name__ == "__main__":
    main()


