import numpy as np
from collections import Counter
import heapq

class HuffmanNode:
    def __init__(self, symbol, frequency):
        self.symbol = symbol
        self.frequency = frequency
        self.left = None
        self.right = None
    
    def __lt__(self, other):
        return self.frequency < other.frequency

def run_length_encoding(data):
    """Apply run-length encoding to a sequence of data."""
    rle = []
    prev_value = data[0]
    count = 1

    for value in data[1:]:
        if value == prev_value:
            count += 1
        else:
            rle.append((prev_value, count))
            prev_value = value
            count = 1

    # Append the last value
    rle.append((prev_value, count))
    return rle

def zigzag_scan(block):
    """Converts an 8x8 block into a 1D array using zigzag order."""
    zigzag_order = np.array([
        0, 1, 5, 6, 14, 15, 27, 28,
        2, 4, 7, 13, 16, 26, 29, 42,
        3, 8, 12, 17, 25, 30, 41, 43,
        9, 11, 18, 24, 31, 40, 44, 53,
        10, 19, 23, 32, 39, 45, 52, 54,
        20, 22, 33, 38, 46, 51, 55, 60,
        21, 34, 37, 47, 50, 56, 59, 61,
        35, 36, 48, 49, 57, 58, 62, 63
    ])
    return block.flatten()[zigzag_order]

def process_quantized_blocks(quantized_blocks):
    """Processes all blocks and converts them to integers after zigzag scanning."""
    # Combine all blocks after applying zigzag scan and rounding to integers
    return np.hstack([zigzag_scan(block).astype(int) for block in quantized_blocks])

def build_huffman_tree(frequency_table):
    """Builds a Huffman Tree based on the frequency table."""
    priority_queue = [HuffmanNode(symbol, freq) for symbol, freq in frequency_table.items()]
    heapq.heapify(priority_queue)
    
    while len(priority_queue) > 1:
        node1 = heapq.heappop(priority_queue)
        node2 = heapq.heappop(priority_queue)
        merged = HuffmanNode(None, node1.frequency + node2.frequency)
        merged.left = node1
        merged.right = node2
        heapq.heappush(priority_queue, merged)
    
    return heapq.heappop(priority_queue)

def generate_huffman_codes(root, current_code="", codebook=None):
    """Generates Huffman codes from the Huffman tree."""
    if codebook is None:
        codebook = {}
    
    if root.symbol is not None:
        codebook[root.symbol] = current_code
        return codebook

    if root.left:
        generate_huffman_codes(root.left, current_code + "0", codebook)
    if root.right:
        generate_huffman_codes(root.right, current_code + "1", codebook)

    return codebook

def huffman_coding(quantized_Y_blocks, quantized_Cb_blocks, quantized_Cr_blocks):
    """Main function to handle the entire Huffman coding process."""
    # Step 1: Zigzag scan the quantized Y, Cb, and Cr blocks and convert to integers
    zigzagged_Y = process_quantized_blocks(quantized_Y_blocks)
    zigzagged_Cb = process_quantized_blocks(quantized_Cb_blocks)
    zigzagged_Cr = process_quantized_blocks(quantized_Cr_blocks)

    # Step 2: Combine all the zigzagged data for RLE and Huffman encoding
    combined_zigzagged_data = np.hstack([zigzagged_Y, zigzagged_Cb, zigzagged_Cr])

    # Step 3: Apply Run Length Encoding (RLE) to the zigzagged data
    rle_encoded_data = run_length_encoding(combined_zigzagged_data)
    
    # Step 4: Flatten the RLE-encoded data into a list of symbols
    flattened_rle = np.hstack([item for sublist in rle_encoded_data for item in sublist])

    # Step 5: Create a frequency table of the flattened RLE-encoded data
    frequency_table = Counter(flattened_rle)

    # Step 6: Build the Huffman tree
    huffman_tree_root = build_huffman_tree(frequency_table)

    # Step 7: Generate the Huffman codebook
    huffman_codebook = generate_huffman_codes(huffman_tree_root)

    # Step 8: Encode the RLE data using Huffman codes
    encoded_data = ''.join(huffman_codebook[value] for value in flattened_rle)

    # Step 9: Print the compressed data length
    print(f"Compressed Data Length (in bits): {len(encoded_data)}")
