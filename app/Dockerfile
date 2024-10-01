# Use Node.js as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Expose the port the app will run on
EXPOSE 4173

# Command to run the application
CMD ["npm", "run", "preview", "--", "--host"]