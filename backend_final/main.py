"""
Backend entrypoint.
Running this file will start the API server that the frontend calls.
PowerShell:
  python backend_final/main.py --host 0.0.0.0 --port 8000
"""

import argparse
import uvicorn


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    print("Starting Informula API server...")
    # When running from the backend_final folder, reference the module directly
    uvicorn.run("server:app", host=args.host, port=args.port, reload=True)


if __name__ == "__main__":
    main()
