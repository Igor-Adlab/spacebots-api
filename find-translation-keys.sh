#!/bin/bash

# Usage function
usage() {
    echo "Usage: $0 -d <directory> -o <output_file>"
    exit 1
}

# Parse command-line arguments
while getopts ":d:o:" opt; do
    case $opt in
        d) DIR="$OPTARG" ;;
        o) OUTPUT_FILE="$OPTARG" ;;
        *) usage ;;
    esac
done

# Check if directory and output file are provided
if [ -z "$DIR" ] || [ -z "$OUTPUT_FILE" ]; then
    usage
fi

# Find and extract keys
> "$OUTPUT_FILE" # Clear the output file
find "$DIR" -type f -name "*.ts" -exec sed -n "s/.*ctx\.t('\([^']*\)'.*/\1/p" {} + | sort -u > "$OUTPUT_FILE"

echo "Translation keys saved to $OUTPUT_FILE"
