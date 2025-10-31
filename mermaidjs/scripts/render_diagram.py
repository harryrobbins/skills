#!/usr/bin/env python3
"""
Render Mermaid diagrams to various output formats using mermaid-cli.

This script provides a convenient interface for converting Mermaid diagram
definitions to SVG, PNG, or PDF formats with various styling options.
"""

import argparse
import subprocess
import sys
from pathlib import Path


def check_mmdc_installed():
    """Check if mermaid-cli (mmdc) is installed."""
    try:
        result = subprocess.run(
            ["mmdc", "--version"],
            capture_output=True,
            text=True,
            check=False
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def install_instructions():
    """Return installation instructions for mermaid-cli."""
    return """
Mermaid CLI (mmdc) is not installed. Install it using one of these methods:

Global installation (recommended):
  npm install -g @mermaid-js/mermaid-cli

Using npx (no installation):
  npx -p @mermaid-js/mermaid-cli mmdc -i input.mmd -o output.svg

Using Docker:
  docker pull minlag/mermaid-cli
  docker run --rm -v $(pwd):/data minlag/mermaid-cli -i /data/input.mmd -o /data/output.svg
"""


def render_mermaid(
    input_file,
    output_file=None,
    format=None,
    theme="default",
    background=None,
    width=None,
    height=None,
    css_file=None,
    config_file=None,
    quiet=False
):
    """
    Render a Mermaid diagram using mermaid-cli.

    Args:
        input_file: Path to input .mmd file (or '-' for stdin)
        output_file: Path to output file (format inferred from extension)
        format: Output format override (svg, png, pdf)
        theme: Theme to use (default, dark, forest, neutral)
        background: Background color (e.g., 'white', 'transparent', '#f0f0f0')
        width: Output width in pixels
        height: Output height in pixels
        css_file: Path to custom CSS file
        config_file: Path to Mermaid config JSON file
        quiet: Suppress output messages

    Returns:
        True if successful, False otherwise
    """
    # Build command
    cmd = ["mmdc", "--input", input_file]

    # Determine output file and format
    if output_file:
        cmd.extend(["--output", output_file])
        if not format and output_file != "-":
            # Infer format from extension
            ext = Path(output_file).suffix.lower()
            format_map = {".svg": "svg", ".png": "png", ".pdf": "pdf"}
            format = format_map.get(ext)

    if format:
        cmd.extend(["--outputFormat", format])

    # Add optional parameters
    if theme and theme != "default":
        cmd.extend(["--theme", theme])

    if background:
        cmd.extend(["--backgroundColor", background])

    if width:
        cmd.extend(["--width", str(width)])

    if height:
        cmd.extend(["--height", str(height)])

    if css_file:
        cmd.extend(["--cssFile", css_file])

    if config_file:
        cmd.extend(["--configFile", config_file])

    # Execute command
    if not quiet:
        print(f"Rendering: {' '.join(cmd)}")

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )

        if result.returncode == 0:
            if not quiet:
                if output_file and output_file != "-":
                    print(f"✓ Successfully rendered to: {output_file}")
                else:
                    print("✓ Successfully rendered")
            return True
        else:
            print(f"✗ Error rendering diagram:", file=sys.stderr)
            print(result.stderr, file=sys.stderr)
            return False

    except Exception as e:
        print(f"✗ Error executing mmdc: {e}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Render Mermaid diagrams to various formats",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Render to SVG (default)
  %(prog)s diagram.mmd -o diagram.svg

  # Render to PNG with dark theme
  %(prog)s diagram.mmd -o diagram.png --theme dark

  # Render with transparent background
  %(prog)s diagram.mmd -o diagram.png --background transparent

  # Render with custom dimensions
  %(prog)s diagram.mmd -o diagram.png --width 1920 --height 1080

  # Render from stdin
  cat diagram.mmd | %(prog)s - -o output.svg

Supported formats: svg (default), png, pdf
Supported themes: default, dark, forest, neutral
        """
    )

    parser.add_argument(
        "input",
        help="Input Mermaid diagram file (.mmd) or '-' for stdin"
    )

    parser.add_argument(
        "-o", "--output",
        help="Output file path (format inferred from extension)"
    )

    parser.add_argument(
        "-f", "--format",
        choices=["svg", "png", "pdf"],
        help="Output format (overrides file extension)"
    )

    parser.add_argument(
        "-t", "--theme",
        choices=["default", "dark", "forest", "neutral"],
        default="default",
        help="Mermaid theme (default: default)"
    )

    parser.add_argument(
        "-b", "--background",
        help="Background color (e.g., 'white', 'transparent', '#f0f0f0')"
    )

    parser.add_argument(
        "-W", "--width",
        type=int,
        help="Output width in pixels"
    )

    parser.add_argument(
        "-H", "--height",
        type=int,
        help="Output height in pixels"
    )

    parser.add_argument(
        "--css",
        dest="css_file",
        help="Path to custom CSS file"
    )

    parser.add_argument(
        "--config",
        dest="config_file",
        help="Path to Mermaid config JSON file"
    )

    parser.add_argument(
        "-q", "--quiet",
        action="store_true",
        help="Suppress output messages"
    )

    args = parser.parse_args()

    # Check if mmdc is installed
    if not check_mmdc_installed():
        print("✗ Mermaid CLI (mmdc) not found", file=sys.stderr)
        print(install_instructions(), file=sys.stderr)
        sys.exit(1)

    # Validate input file
    if args.input != "-" and not Path(args.input).exists():
        print(f"✗ Error: Input file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    # Render the diagram
    success = render_mermaid(
        input_file=args.input,
        output_file=args.output,
        format=args.format,
        theme=args.theme,
        background=args.background,
        width=args.width,
        height=args.height,
        css_file=args.css_file,
        config_file=args.config_file,
        quiet=args.quiet
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
