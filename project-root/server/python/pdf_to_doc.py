import sys
from pathlib import Path
from pdf2docx import Converter


def main():
    # Expect exactly 2 arguments:
    # 1) input PDF path
    # 2) output DOCX path
    if len(sys.argv) != 3:
        print("ERROR: Invalid arguments")
        print("Usage: python pdf_to_doc.py <input.pdf> <output.docx>")
        sys.exit(1)

    input_pdf = Path(sys.argv[1])
    output_docx = Path(sys.argv[2])

    # Validate input file
    if not input_pdf.exists():
        print("ERROR: Input PDF file does not exist")
        sys.exit(1)

    try:
        converter = Converter(str(input_pdf))
        converter.convert(str(output_docx))
        converter.close()
        print("SUCCESS")
        sys.exit(0)

    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
