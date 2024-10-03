from PIL import Image
import numpy as np
from utils.downsampling import downsample
from utils.quantize import split_into_blocks, apply_dct_to_blocks, quantize_blocks, quant_matrix_luminance, quant_matrix_chroma
from utils.dequantize import dequantize_blocks, apply_idct_to_blocks, reconstruct_from_blocks
from utils.huffman import huffman_coding

def main():
    downscale_constant = 3
    quantization_factor = 1.0  # Adjust this value to increase or decrease quality (1.0 is default quality)

    # Open image as array
    image = Image.open("./images/input.jpg").convert("YCbCr")
    ycbcr_array = np.array(image)

    # Separate layer into Y, Cb, Cr
    Y, Cb, Cr = ycbcr_array[:, :, 0], ycbcr_array[:, :, 1], ycbcr_array[:, :, 2]

    # Downsample each layer
    Y, Cb_downsampled, Cr_downsampled = downsample(Y, Cb, Cr, downscale_constant)

    # Split Y (luminance) into 8x8 blocks and apply DCT
    Y_blocks = split_into_blocks(Y)
    dct_Y_blocks = apply_dct_to_blocks(Y_blocks)
    quantized_Y_blocks = quantize_blocks(dct_Y_blocks, quant_matrix_luminance, quantization_factor)

    # Process Cb and Cr channels
    Cb_blocks = split_into_blocks(Cb_downsampled)
    dct_Cb_blocks = apply_dct_to_blocks(Cb_blocks)
    quantized_Cb_blocks = quantize_blocks(dct_Cb_blocks, quant_matrix_chroma, quantization_factor)

    Cr_blocks = split_into_blocks(Cr_downsampled)
    dct_Cr_blocks = apply_dct_to_blocks(Cr_blocks)
    quantized_Cr_blocks = quantize_blocks(dct_Cr_blocks, quant_matrix_chroma, quantization_factor)

    huffman_coding(quantized_Y_blocks, quantized_Cb_blocks, quantized_Cr_blocks)

    # Dequantize blocks
    dequantized_Y_blocks = dequantize_blocks(quantized_Y_blocks, quant_matrix_luminance)
    dequantized_Cb_blocks = dequantize_blocks(quantized_Cb_blocks, quant_matrix_chroma)
    dequantized_Cr_blocks = dequantize_blocks(quantized_Cr_blocks, quant_matrix_chroma)

    # Apply inverse DCT to recover blocks
    idct_Y_blocks = apply_idct_to_blocks(dequantized_Y_blocks)
    idct_Cb_blocks = apply_idct_to_blocks(dequantized_Cb_blocks)
    idct_Cr_blocks = apply_idct_to_blocks(dequantized_Cr_blocks)

    # Reconstruct Y, Cb, Cr channels
    Y_reconstructed = reconstruct_from_blocks(idct_Y_blocks, Y.shape)
    Cb_reconstructed = reconstruct_from_blocks(idct_Cb_blocks, Cb_downsampled.shape)
    Cr_reconstructed = reconstruct_from_blocks(idct_Cr_blocks, Cr_downsampled.shape)

    # Upsample Cb and Cr channels
    Cb_reconstructed_upsampled = np.repeat(np.repeat(Cb_reconstructed, downscale_constant, axis=0), downscale_constant, axis=1)
    Cr_reconstructed_upsampled = np.repeat(np.repeat(Cr_reconstructed, downscale_constant, axis=0), downscale_constant, axis=1)

    # Clip values to ensure they fall within [0, 255]
    Y_reconstructed = np.clip(Y_reconstructed, 0, 255)
    Cb_reconstructed_upsampled = np.clip(Cb_reconstructed_upsampled, 0, 255)
    Cr_reconstructed_upsampled = np.clip(Cr_reconstructed_upsampled, 0, 255)

    # Stack channels and save the reconstructed image
    image_reconstructed = np.stack([Y_reconstructed, Cb_reconstructed_upsampled, Cr_reconstructed_upsampled], axis=2)
    image_output = Image.fromarray(image_reconstructed.astype('uint8'), 'YCbCr').convert('RGB')
    image_output.save('D:/image_compression/images/output_reconstructed.jpg')

if __name__ == "__main__":
    main()
