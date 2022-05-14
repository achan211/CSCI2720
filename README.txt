CSCI2720 Project - WEATHERING WITH ME

Group member:
Alvin CHAN,
Chun Yeung CHOW,
Ngou Shan WONG,
Siu Fung CHEUNG,
Wing Lam CHENG,
Yee Han CHENG

Steps to start the project:

Step 1: Have your AWS instance (with public IP Address) (For now until 14/5/2022 5 p.m, the public IP address is 34.234.73.30)

Step 2: ssh to the server
        example:
        (user)@(IP Address o the instance)
        
        For TA grading:
        The public is changed everytime when the lab session end. If you access our webiste later like after 14/5/2022 5 p.m, the IP address is not 34.234.73.30 anymore. Please generate a new one.

Step 3: Git clone the project Or Download it from the blackboard submission if you are TA

Step 4: install pm2 package globally in the server (the AWS instance)

        npm install pm2 -g
        
Step 5: Redirect port 80 to port 3000 command, also do it in the server (reference link: https://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode)

        sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
        
        
Step 6: in Frontend folder run pm2 command (also do it in the server)

        pm2 start npm -- start
        
Step 7: Backend same as Frontend

        pm2 start server.js

Everything is ok now! check with the public IP address.

P.S can use "pm2 list" to check the what is running

PM2 quick start link: https://pm2.keymetrics.io/docs/usage/quick-start/
