from PIL import Image
import os

def resize_image(input_path, output_path, size=(250, 250)):
    try:
        # Otvaranje slike
        with Image.open(input_path) as img:
            # Promjena veličine
            img_resized = img.resize(size, Image.LANCZOS)
            
            # Spremanje slike
            img_resized.save(output_path)
            print(f"Slika uspješno promijenjena u {size} i spremljena kao {output_path}")
    except Exception as e:
        print(f"Greška: {e}")

# Primjer korištenja
input_image = "default.png"  # Zamijeni s pravim putanjama
output_image = "default.png"

resize_image(input_image, output_image)