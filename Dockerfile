FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json ./
#  yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nest.js application
RUN yarn build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start:dev"]
