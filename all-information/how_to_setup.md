# How to Setup
## Download an IDE
- Example: [Visual Studio Code](https://code.visualstudio.com/)

## Clone GitHub Repository
- Open up your IDE (e.g. Visual Studio Code)'s terminal
- Clone repository
    - git clone https://github.com/allison-pham/inkfuse

## Git
- Install [Git](https://git-scm.com/downloads)
    - Download the one based on your operating system (OS)
- Check that you have installed it (run in terminal)
    - git --version
- Configure Git with your username
    - git config --global user.name "Your GitHub username"
    - git config --global user.email "Your email associated with your GitHub username"
- Check that you've configured it
    - git config --list

## Install and Run
- Install [Node.js](https://nodejs.org/en) (LTS version)
- Check that you have it installed (run in terminal)
    - node -v
    - npm -v
- Install dependencies
    - npm install
- Run server
    - npm run dev
- Open up http://localhost:3000

- Refer to Figma file when working on your code