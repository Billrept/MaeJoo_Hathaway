# downsampling.py
import numpy as np

def downsample(Y, Cb, Cr, downsample_constant=3):
    # Downsample the chroma channels (Cb and Cr)
    Cb_downsampled = Cb[::downsample_constant, ::downsample_constant]
    Cr_downsampled = Cr[::downsample_constant, ::downsample_constant]

    # Return Y unchanged, and the downsampled Cb and Cr
    return Y, Cb_downsampled, Cr_downsampled
