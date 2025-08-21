# Stage 1: frontend build
FROM node:20 as frontend-build
WORKDIR /frontend
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: backend
FROM python:3.12-slim
WORKDIR /app
COPY server/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend code
COPY server/ /app/

# Copy React build into Django staticfiles
COPY --from=frontend-build /frontend/dist /app/client/dist
RUN mkdir -p /app/staticfiles/assets
RUN cp -r /app/client/dist/assets/* /app/staticfiles/assets/

# Copy index.html to templates
RUN mkdir -p /app/templates && cp /app/client/dist/index.html /app/templates/

# Collect static files
RUN python manage.py collectstatic --noinput