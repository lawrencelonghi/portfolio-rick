FROM python:3.12-slim  

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install backend deps
COPY server/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Build frontend
FROM node:20 AS frontend-build
WORKDIR /frontend
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Final backend image
FROM python:3.12-slim
WORKDIR /app

# Backend deps
COPY server/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend code
COPY server/ /app/

# Copy frontend build into Django
COPY --from=frontend-build /frontend/dist /app/client/dist
RUN mkdir -p /app/templates && cp /app/client/dist/index.html /app/templates/

# Collect static
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
