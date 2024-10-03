# dequantize.py
import numpy as np
import cv2

def dequantize_blocks(quantized_blocks, quant_matrix):
    dequantized_blocks = []
    for block in quantized_blocks:
        dequantized_block = block * quant_matrix
        dequantized_blocks.append(dequantized_block)
    return np.array(dequantized_blocks)

# Function to apply inverse DCT to 8x8 blocks
def apply_idct_to_blocks(dct_blocks):
    idct_blocks = []
    for block in dct_blocks:
        idct_block = cv2.idct(block) + 128  # Shift back by 128
        idct_blocks.append(np.clip(idct_block, 0, 255))  # Clip values to be in [0, 255]
    return np.array(idct_blocks)

# Function to reconstruct the Y, Cb, Cr channels from blocks
def reconstruct_from_blocks(blocks, original_shape):
    # Calculate the dimensions of the blocks
    block_size = blocks.shape[1]
    h = original_shape[0]
    w = original_shape[1]

    # Create an empty array for the reconstructed image
    reconstructed = np.zeros(original_shape)

    # Iterate through the blocks and place them in the reconstructed image
    block_index = 0
    for i in range(0, h, block_size):
        for j in range(0, w, block_size):
            reconstructed[i:i + block_size, j:j + block_size] = blocks[block_index]
            block_index += 1

    return reconstructed
