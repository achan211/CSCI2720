# CSCI2720 Project (21-22 T2) - Weathering with Me

## Group Members

## Instructions
To open this web app, do the following steps: 

Step 1: Pull ALL files  
Step 2: Go to frontend and backend respectively and execute `npm install` respectively (just in case)  
Step 3: Execute `npm run build` in frontend  
Step 4: Execute `npm start` in backend  
Step 5: Go to `localhost:4000` and check!  


# Deploy in AWS instance with port 80

Step 1: Have your AWS instance

Step 2: Git clone the project

Step 3: install pm2 package globally

        npm install pm2 -g
        
Step 4: Redirect port 80 to port 3000 command (reference link: https://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode)

        sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
        
        
Step 5: in Frontend folder run pm2 command 

        pm2 start npm -- start
        
Step 6: Backend same as Frontend

        pm2 start server.js

Everything is ok now! check with your public IP address.
        
