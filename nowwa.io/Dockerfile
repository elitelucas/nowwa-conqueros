# Use an official Python runtime as a parent image
FROM node:16.16.0

RUN mkdir -p /app
RUN mkdir -p /app/storage/
RUN mkdir -p /app/storage/home
RUN mkdir -p /app/storage/home/lib

# Set the working directory to /app
WORKDIR /app

COPY "package.json" /app

# Install any needed packages
RUN npm install

COPY . /app

# Make port 9100 available to the world outside this container
EXPOSE 9100
EXPOSE 9100
EXPOSE 9100

# Define environment variable
ENV NAME World

# Run command
# CMD [ "npm", "start" ] 

CMD [ "ls", "-al" ] 