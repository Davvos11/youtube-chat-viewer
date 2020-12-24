FROM node

# Create app directory
WORKDIR /usr/src/app/backend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY backend/package*.json ./

# npm install but for production
RUN npm ci --only=production

# Do the same for the React frontend
WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY client .

# Build React
RUN npm run build

# Cd back
WORKDIR /usr/src/app/backend

# Bundle app source
COPY backend .

EXPOSE 8000
CMD [ "npm", "start" ]