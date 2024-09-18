# 1. Use the official Python base image
FROM python:3.9-slim

# 2. Set environment variables to ensure the Python output is logged immediately
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Set the working directory in the container
WORKDIR /app

# 4. Copy the requirements file to the working directory
COPY ./requirements.txt /app/requirements.txt

# 5. Install the dependencies from requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# 6. Copy the entire app to the working directory
COPY . /app

# 7. Expose the port that FastAPI will run on (default: 8000)
EXPOSE 8000

# 8. Command to run the FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]