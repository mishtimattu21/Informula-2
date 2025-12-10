import argparse
import uvicorn


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Informula FastAPI server locally")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    print("Starting Informula API server...")
    # Entrypoint points to FastAPI instance defined in server.py
    uvicorn.run("server:app", host=args.host, port=args.port, reload=True)


if __name__ == "__main__":
    main()
