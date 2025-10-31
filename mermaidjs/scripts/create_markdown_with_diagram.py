#!/usr/bin/env python3
"""
Create a markdown file with an embedded Mermaid diagram.
Optionally renders the diagram to SVG and embeds it in the markdown.
"""

import argparse
import sys
import subprocess
from pathlib import Path


def create_markdown(
    diagram_code,
    output_file,
    title=None,
    description=None,
    render_svg=False,
    theme="default",
    background=None
):
    """
    Create a markdown file with a Mermaid diagram.

    Args:
        diagram_code: The Mermaid diagram code
        output_file: Path to output markdown file
        title: Optional title for the document
        description: Optional description text
        render_svg: If True, render diagram to SVG and embed it
        theme: Theme for SVG rendering
        background: Background color for SVG rendering

    Returns:
        True if successful, False otherwise
    """
    output_path = Path(output_file)

    # Build markdown content
    lines = []

    if title:
        lines.append(f"# {title}\n")

    if description:
        lines.append(f"{description}\n")

    # Add the Mermaid code block
    lines.append("```mermaid")
    lines.append(diagram_code.strip())
    lines.append("```\n")

    # If rendering to SVG, create the SVG and embed it
    if render_svg:
        try:
            # Create temporary .mmd file
            temp_mmd = output_path.parent / f"{output_path.stem}_temp.mmd"
            temp_svg = output_path.parent / f"{output_path.stem}.svg"

            # Write diagram code to temp file
            temp_mmd.write_text(diagram_code)

            # Render to SVG using mmdc
            cmd = [
                "mmdc",
                "--input", str(temp_mmd),
                "--output", str(temp_svg),
                "--theme", theme
            ]

            if background:
                cmd.extend(["--backgroundColor", background])

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=False
            )

            # Clean up temp file
            temp_mmd.unlink()

            if result.returncode == 0:
                lines.append(f"## Rendered Diagram\n")
                lines.append(f"![{title or 'Diagram'}]({temp_svg.name})\n")
                print(f"✓ SVG rendered to: {temp_svg}")
            else:
                print(f"⚠ Warning: Could not render SVG: {result.stderr}", file=sys.stderr)

        except Exception as e:
            print(f"⚠ Warning: Error rendering SVG: {e}", file=sys.stderr)

    # Write markdown file
    try:
        output_path.write_text("\n".join(lines))
        print(f"✓ Markdown file created: {output_file}")
        return True
    except Exception as e:
        print(f"✗ Error writing markdown file: {e}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Create a markdown file with an embedded Mermaid diagram",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Create markdown with inline Mermaid code
  %(prog)s -i diagram.mmd -o diagram.md --title "My Diagram"

  # Create markdown with rendered SVG
  %(prog)s -i diagram.mmd -o diagram.md --render --theme dark

  # Create from stdin
  echo "graph TD; A-->B" | %(prog)s -o diagram.md --render
        """
    )

    parser.add_argument(
        "-i", "--input",
        help="Input Mermaid diagram file (.mmd) or '-' for stdin (default: stdin)"
    )

    parser.add_argument(
        "-o", "--output",
        required=True,
        help="Output markdown file path (.md)"
    )

    parser.add_argument(
        "--title",
        help="Document title"
    )

    parser.add_argument(
        "--description",
        help="Document description"
    )

    parser.add_argument(
        "--render",
        action="store_true",
        help="Render diagram to SVG and embed in markdown"
    )

    parser.add_argument(
        "--theme",
        choices=["default", "dark", "forest", "neutral"],
        default="default",
        help="Theme for SVG rendering (default: default)"
    )

    parser.add_argument(
        "--background",
        help="Background color for SVG (e.g., 'transparent', 'white')"
    )

    args = parser.parse_args()

    # Read diagram code
    if args.input and args.input != "-":
        try:
            diagram_code = Path(args.input).read_text()
        except Exception as e:
            print(f"✗ Error reading input file: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        # Read from stdin
        diagram_code = sys.stdin.read()

    if not diagram_code.strip():
        print("✗ Error: No diagram code provided", file=sys.stderr)
        sys.exit(1)

    # Create markdown
    success = create_markdown(
        diagram_code=diagram_code,
        output_file=args.output,
        title=args.title,
        description=args.description,
        render_svg=args.render,
        theme=args.theme,
        background=args.background
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
