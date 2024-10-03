import numpy as np

def huffman_coding (quantized_Y_blocks, quantized_Cb_blocks, quantized_Cr_blocks) :
    # Flatten the quantized blocks for Y, Cb, and Cr
    flattened_Y = quantized_Y_blocks.flatten()
    flattened_Cb = quantized_Cb_blocks.flatten()
    flattened_Cr = quantized_Cr_blocks.flatten()

    # Combine all the flattened arrays (Y, Cb, Cr) for Huffman encoding
    combined_quantized_data = np.concatenate([flattened_Y, flattened_Cb, flattened_Cr])