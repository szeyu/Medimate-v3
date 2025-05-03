#!/bin/bash

# Colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define the port
PORT=8000

echo -e "${YELLOW}Starting MediMate Backend with ngrok...${NC}"

# Check if Python virtual environment exists
if [ -d "venv" ]; then
    echo -e "${BLUE}Activating virtual environment...${NC}"
    source venv/bin/activate
else
    echo -e "${YELLOW}No virtual environment found. Using system Python.${NC}"
fi

# Start the FastAPI server in the background
echo -e "${BLUE}Starting FastAPI server on port $PORT...${NC}"
python main.py &
server_pid=$!

# Give the server some time to start
sleep 2

# Start ngrok to expose the server
echo -e "${BLUE}Starting ngrok tunnel to port $PORT...${NC}"
echo -e "${YELLOW}⚠️  IMPORTANT: Copy the ngrok URL below to use in your Expo app${NC}"
echo -e "${YELLOW}⚠️  Usually in the format https://xxxx-xxx-xxx-xxx-xxx.ngrok-free.app${NC}"
echo -e "${GREEN}==========================================================${NC}"

# Start ngrok and keep it in the foreground
ngrok http $PORT

# When ngrok is closed, also kill the server
echo -e "${BLUE}Shutting down FastAPI server...${NC}"
kill $server_pid

echo -e "${GREEN}Done!${NC}" 