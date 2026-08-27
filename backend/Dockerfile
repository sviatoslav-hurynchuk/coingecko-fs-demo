# Slim Python base image minimizes final image attack surface and deployment footprint.
FROM python:3.13-slim

# Ensuring immediate stdout/stderr flushing prevents log buffering in Docker log drivers.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    HOST=0.0.0.0

WORKDIR /app

# Copying requirements separately leverages Docker layer caching to avoid reinstalling dependencies on source code changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend package ensuring root module resolution works cleanly with Python import paths.
COPY . /app/backend

EXPOSE 8000

# Executing uvicorn directly from python module ensures signals (SIGTERM/SIGINT) reach the server for graceful shutdown.
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
