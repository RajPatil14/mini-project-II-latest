import cv2
import numpy as np
from ultralytics import YOLO
import sys
import os

# YOLOv8m is more accurate in busy scenes than the smaller YOLOv8s model.
# It uses more memory and takes longer, but crowd counts are more reliable.
model_path = os.path.join(os.path.dirname(__file__), 'yolov8m.pt')
model = YOLO(model_path)

def count_persons(img):
    """Count person (cls=0) in image using YOLO"""
    if img is None:
        return 0
    # Higher image size helps retain small/partially occluded people. Restricting
    # inference to COCO class 0 prevents non-person objects from being counted.
    results = model(img, classes=[0], conf=0.30, iou=0.50, imgsz=960, verbose=False)
    boxes = results[0].boxes if results else None
    return len(boxes) if boxes is not None else 0

def main():
    if len(sys.argv) != 5:
        print(0)
        return
    
    image_paths = sys.argv[1:5]
    print(f"Processing files: {len([p for p in image_paths if os.path.exists(p)])}", file=sys.stderr)
    
    max_count = 0
    
    for img_path in image_paths:
        if not os.path.exists(img_path):
            print(f"Missing: {img_path}", file=sys.stderr)
            continue
        
        with open(img_path, 'rb') as f:
            img_bytes = f.read()
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            print(f"Decode failed: {img_path}", file=sys.stderr)
            continue
        
        count = count_persons(img)
        print(f"Detected in {os.path.basename(img_path)}: {count}", file=sys.stderr)
        max_count = max(max_count, count)
    
    print(f"MAX COUNT: {max_count}", file=sys.stderr)
    print(max_count)  # stdout for Node parse

if __name__ == '__main__':
    main()
