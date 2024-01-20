# Use the official Node.js image as the base image
FROM node:21.6.0-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY ./src ./src
COPY ./tsconfig.json ./

# Build the TypeScript code
RUN npm run build --omit=dev

# Start the application
CMD [ "npm", "start" ]