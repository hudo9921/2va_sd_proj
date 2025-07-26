FROM python:3.8-slim-buster

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
# COPY requirements.txt ./

RUN apt-get update && apt-get install -y libpq-dev

# Install any needed packages specified in requirements.txt
RUN pip install Django==4.0 djangorestframework==3.13 psycopg2-binary==2.9.5 djangorestframework-simplejwt django-cors-headers django-filter celery django-celery-beat django-celery-results Redis

COPY . /app

EXPOSE 80

# Make port 80 available to the world outside this container