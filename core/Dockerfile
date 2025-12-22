FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml ./

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -e .

# Copy application code
COPY rubrica/ ./rubrica/

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "rubrica.main:app", "--host", "0.0.0.0", "--port", "8000"]
