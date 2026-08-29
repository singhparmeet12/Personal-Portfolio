import os
import shutil
import cv2
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, 'static', 'img')
BACKUP_DIR = os.path.join(IMG_DIR, 'backup_with_watermark')

SCENE_FILES = [
    'about_scene_01.png', 'about_scene_02.png', 'about_scene_03.png',
    'about_scene_04.png', 'about_scene_05.png', 'about_scene_06.png',
    'about_scene_07.png', 'about_scene_08.png', 'about_scene_09.png',
    'about_scene_10.png', 'about_scene_12.png',
    'about_scene_01_real.png', 'about_scene_02_real.png', 'about_scene_03_real.png',
    'about_scene_04_real.png', 'about_scene_05_real.png', 'about_scene_06_real.png',
    'about_scene_07_real.png', 'about_scene_08_real.png', 'about_scene_09_real.png',
    'about_scene_10_real.png', 'about_scene_12_real.png'
]

def find_exact_watermark_bbox(img):
    """
    Finds the watermark in the bottom-right corner [H-180:H, W-180:W].
    The Gemini watermark is a 4-pointed star.
    """
    h, w = img.shape[:2]
    corner = img[h-180:h, w-180:w]
    gray = cv2.cvtColor(corner, cv2.COLOR_BGR2GRAY)
    
    # Adaptive threshold to isolate bright star shape
    blur = cv2.GaussianBlur(gray, (11, 11), 0)
    diff = cv2.subtract(gray, blur)
    _, thresh = cv2.threshold(diff, 18, 255, cv2.THRESH_BINARY)
    
    # Also check high brightness
    _, bright = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    combined = cv2.bitwise_or(thresh, bright)
    
    # Find contours
    contours, _ = cv2.findContours(combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    found = False
    
    for c in contours:
        x, y, cw, ch = cv2.boundingRect(c)
        area = cv2.contourArea(c)
        # The star is typically 20x20 to 70x70 px
        if 15 <= cw <= 90 and 15 <= ch <= 90 and area > 60:
            # Map back to full image coordinates
            full_x = (w - 180) + x
            full_y = (h - 180) + y
            # Expand bounding box slightly for clean blending
            pad = 8
            cv2.rectangle(mask, (max(0, full_x - pad), max(0, full_y - pad)),
                                (min(w, full_x + cw + pad), min(h, full_y + ch + pad)), 255, -1)
            found = True

    # Fallback to standard Gemini Imagen 3 bottom-right location if contour was subtle
    if not found:
        cv2.circle(mask, (w - 65, h - 65), 45, 255, -1)
        
    return mask

def clean_all_watermarks():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    count = 0

    for fname in SCENE_FILES:
        fpath = os.path.join(IMG_DIR, fname)
        if not os.path.exists(fpath):
            continue

        # Backup original
        bpath = os.path.join(BACKUP_DIR, fname)
        if not os.path.exists(bpath):
            shutil.copy2(fpath, bpath)

        img = cv2.imread(fpath)
        if img is None:
            continue

        mask = find_exact_watermark_bbox(img)
        
        # Telea inpainting blends surrounding textures (wood floor, basket, rug)
        cleaned = cv2.inpaint(img, mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
        
        cv2.imwrite(fpath, cleaned)
        count += 1
        print(f"Cleaned {fname} ({count}/{len(SCENE_FILES)})")

    print(f"Successfully cleaned {count} images.")

if __name__ == '__main__':
    clean_all_watermarks()
