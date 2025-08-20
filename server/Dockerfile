FROM python:3.12-slim  

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copy only requirements first for better Docker cache
COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy server code
COPY server/ /app/

# Copy React build
COPY client/dist /app/client/dist

# Collect static files AFTER copying everything
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "server.wsgi:application", "--bind", "0.0.0.0:8000"]


