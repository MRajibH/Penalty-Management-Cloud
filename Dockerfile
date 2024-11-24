# Stage 1: Build the app
FROM node:14 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies (to leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Stage 2: Create a lightweight image for running the app
FROM node:14-slim

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

# Expose the port
EXPOSE 3000

# Run the app
CMD ["node", "app.js"]

