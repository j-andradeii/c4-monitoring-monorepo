# Use the official Node.js image.
# Use Node 20 since you mentioned you're using Node v20
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to install dependencies
# Assuming the Dockerfile is located in the service folder, this path is incorrect. 
# You should copy these files from the root to the current working directory.

COPY ../../package*.json ./

# Install nodemon globally and project dependencies
RUN npm install -g nodemon 



# Copy the application code
COPY . .


# Install dependencies from the root's package.json
RUN npm install

# Expose the port each microservice will run on (in docker-compose.yml, set the respective ports)
EXPOSE 3000

# # Start the application using npm's start:prod script
# CMD ["npm", "run", "start:gateway"]