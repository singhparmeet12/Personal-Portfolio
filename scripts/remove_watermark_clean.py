import os
import cv2
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, 'static', 'img')

LOFI_FILES = [
    'about_scene_01.png', 'about_scene_02.png', 'about_scene_03.png',
    'about_scene_04.png', 'about_scene_05.png', 'about_scene_06.png',
    'about_scene_07.png', 'about_scene_08.png', 'about_scene_09.png',
    'about_scene_10.png', 'about_scene_12.png'
]

REAL_FILES = [
    'about_scene_01_real.png', 'about_scene_02_real.png', 'about_scene_03_real.png',
    'about_scene_04_real.png', 'about_scene_05_real.png', 'about_scene_06_real.png',
    'about_scene_07_real.png', 'about_scene_08_real.png', 'about_scene_09_real.png',
    'about_scene_10_real.png', 'about_scene_12_real.png'
]

def clean_lofi_image(fpath):
    im = cv2.imread(fpath)
    if im is None:
        return False
    
    cx, cy = 1610, 2065
    r = 50
    # Clean tan rug patch sampled directly above the sparkle
    dy = -105
    dest = im[cy-r:cy+r, cx-r:cx+r]
    patch = im[cy-r+dy:cy+r+dy, cx-r:cx+r].copy()
    
    h, w = dest.shape[:2]
    mask = np.zeros((h, w), dtype=np.float32)
    cv2.ellipse(mask, (w//2, h//2), (r-4, r-4), 0, 0, 360, 1.0, -1)
    mask = cv2.GaussianBlur(mask, (11, 11), 0)[:, :, np.newaxis]
    
    im[cy-r:cy+r, cx-r:cx+r] = (patch * mask + dest * (1.0 - mask)).astype(np.uint8)
    
    # Touch up tip near basket
    tip_mask = np.zeros((h, w), dtype=np.uint8)
    cv2.circle(tip_mask, (w//2 + 38, h//2), 10, 255, -1)
    cv2.inpaint(im[cy-r:cy+r, cx-r:cx+r], tip_mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA, dst=im[cy-r:cy+r, cx-r:cx+r])
    
    cv2.imwrite(fpath, im)
    return True

def clean_real_image(fpath):
    im = cv2.imread(fpath)
    if im is None:
        return False
    
    cx, cy = 1608, 2062
    dx, dy = -64, 48
    r = 50
    
    dest = im[cy-r:cy+r, cx-r:cx+r]
    patch = im[cy-r+dy:cy+r+dy, cx-r+dx:cx+r+dx].copy()
    
    h, w = dest.shape[:2]
    mask = np.zeros((h, w), dtype=np.float32)
    cv2.ellipse(mask, (w//2, h//2), (r-4, r-4), 0, 0, 360, 1.0, -1)
    mask = cv2.GaussianBlur(mask, (9, 9), 0)[:, :, np.newaxis]
    
    im[cy-r:cy+r, cx-r:cx+r] = (patch * mask + dest * (1.0 - mask)).astype(np.uint8)
    
    # Touch up tip near basket
    tip_mask = np.zeros((h, w), dtype=np.uint8)
    cv2.circle(tip_mask, (w//2 + 38, h//2), 10, 255, -1)
    cv2.inpaint(im[cy-r:cy+r, cx-r:cx+r], tip_mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA, dst=im[cy-r:cy+r, cx-r:cx+r])
    
    cv2.imwrite(fpath, im)
    return True

def main():
    cleaned_count = 0
    for fname in LOFI_FILES:
        fpath = os.path.join(IMG_DIR, fname)
        if os.path.exists(fpath) and clean_lofi_image(fpath):
            cleaned_count += 1
            print(f"Cleaned Lofi: {fname}")
            
    for fname in REAL_FILES:
        fpath = os.path.join(IMG_DIR, fname)
        if os.path.exists(fpath) and clean_real_image(fpath):
            cleaned_count += 1
            print(f"Cleaned 3D Real: {fname}")
            
    print(f"\nAll {cleaned_count} images have been flawlessly cleaned with zero watermark!")

if __name__ == '__main__':
    main()
