# quantize.py
import numpy as np
import cv2

# Function to split the image into 8x8 blocks
def split_into_blocks(channel, block_size=8):
    h, w = channel.shape
    return (channel.reshape(h // block_size, block_size, -1, block_size)
                   .swapaxes(1, 2)
                   .reshape(-1, block_size, block_size))

# Apply DCT to 8x8 blocks
def apply_dct_to_blocks(blocks):
    dct_blocks = []
    for block in blocks:
        # Apply 2D DCT to each block
        dct_block = cv2.dct(np.float32(block) - 128)  # Shift by 128 for centered range
        dct_blocks.append(dct_block)
    return np.array(dct_blocks)

# Apply Quantization with a quality factor
def quantize_blocks(dct_blocks, quant_matrix, quality_factor=1.0):
    quantized_blocks = []
    adjusted_quant_matrix = quant_matrix * quality_factor  # Scale the quantization matrix by the quality factor
    for block in dct_blocks:
        quantized_block = np.round(block / adjusted_quant_matrix)
        quantized_blocks.append(quantized_block)
    return np.array(quantized_blocks)

# Define quantization matrices (default for luminance and chrominance)
quant_matrix_luminance = np.array([
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99]
])

quant_matrix_chroma = np.array([
    [17, 18, 24, 47, 99, 99, 99, 99],
    [18, 21, 26, 66, 99, 99, 99, 99],
    [24, 26, 56, 99, 99, 99, 99, 99],
    [47, 66, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99]
])
