from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    # Create image with indigo background
    img = Image.new('RGBA', (size, size), (99, 102, 241, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded rectangle
    corner_radius = size * 24 // 192  # Scale corner radius
    draw.rounded_rectangle(
        [(0, 0), (size - 1, size - 1)],
        radius=corner_radius,
        fill=(99, 102, 241, 255)
    )
    
    # Draw "M" text
    try:
        font_size = int(size * 0.43)
        font = ImageFont.truetype("arial.ttf", font_size)
    except IOError:
        try:
            font = ImageFont.truetype("segoeui.ttf", font_size)
        except IOError:
            font = ImageFont.load_default()
    
    # Calculate text position (center)
    bbox = draw.textbbox((0, 0), "M", font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), "M", fill=(255, 255, 255, 255), font=font)
    
    # Save as PNG
    img.save(output_path, 'PNG')
    print(f"Created: {output_path} ({size}x{size})")

# Output directory
output_dir = os.path.dirname(os.path.abspath(__file__))

# Create icons
create_icon(192, os.path.join(output_dir, "icon-192x192.png"))
create_icon(512, os.path.join(output_dir, "icon-512x512.png"))

print("Done!")
