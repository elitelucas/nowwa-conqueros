# Use an official Python runtime as a parent image
FROM node:16.16.0

RUN mkdir -p /contents

# Set the working directory to /contents
WORKDIR /contents

COPY "package.json" /contents

# Install any needed packages
RUN npm install

COPY . /contents

# Make port 9000 available to the world outside this container
EXPOSE 9000

# Run command
CMD [ "npm", "start" ] 