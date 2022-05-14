CSCI2720 Project - Weather-api

Group member:
Alvin CHAN,
Chun Yeung CHOW,
Ngou Shan WONG,
Siu Fung CHEUNG,
Wing Lam CHENG,
Yee Han CHENG

Steps to start the project:

Step 1: Have your AWS instance (with public IP Address)

Step 2: Git clone the project Or Download it from the blackboard submission if you are TA

Step 3: install pm2 package globally in the server (the AWS instance)

        npm install pm2 -g
        
Step 4: Redirect port 80 to port 3000 command, also do it in the server (reference link: https://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode)

        sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
        
        
Step 5: in Frontend folder run pm2 command (also do it in the server)

        pm2 start npm -- start
        
Step 6: Backend same as Frontend

        pm2 start server.js

Everything is ok now! check with the public IP address.

P.S can use "pm2 list" to check the what is running

PM2 quick start link: https://pm2.keymetrics.io/docs/usage/quick-start/
