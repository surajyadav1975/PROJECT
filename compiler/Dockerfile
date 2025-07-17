FROM --platform=linux/amd64 node:24-alpine

# Create a non-root user and group
RUN addgroup -S securegroup && adduser -S secureuser -G securegroup

WORKDIR /app

# Install required packages
RUN apk update && apk add --no-cache \
    g++ \
    openjdk17 \
    python3 \
    py3-pip \
    bash \
    libc6-compat \
    libstdc++ \
    libgcc \
    linux-headers \
    busybox-extras \
    shadow # For usermod if needed

# Show compiler/interpreter versions
RUN g++ --version && \
    javac -version && \
    java -version && \
    python3 --version

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Set file permissions (optional but good for safety)
RUN chown -R secureuser:securegroup /app

# Switch to non-root user
USER secureuser

# Expose port
EXPOSE 8752

# Start the server
CMD [ "node", "index.js" ]
