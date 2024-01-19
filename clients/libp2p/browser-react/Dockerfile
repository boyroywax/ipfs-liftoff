# Use an official Node.js runtime as the base image
FROM node:21.6.0-alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Set the command to start the app
CMD ["serve", "-s", "build"]
