# This is the database for our project:
>1. initializing the database.
>2. creating your user.
>3. logging on to the db.
>4. initializing the db.
>5. the database and you.
### Initializing the database:
The first thing that you need to do is initialize a docker container
for the database. You can do this using the provided file:

>`dbdockerinit.sh`

When you run this it will create a new docker container for: the mongodb
a rabbitmq server, as well as a network to connect them together.
The rabbitmq server is not necessary for this project, but it is there
anyways.
### Creating your user;
After creating the database docker contianer, you now need to create a user
to log onto the db with. By using the provided file:

>`mongoshell.sh`

You can connect to the mongo db shell. This allwos you to create your user.
The file:

>`pasteThisInMongoShell.txt`

contains a sample of what is needed to enter into the shell.
The first line:

>`use mango`

creates a new authentication db called mango which we will use to create our user.
The next few lines are to create the actual user:

>`user:"yourUserNameHere",`

put your desired username in the quotes 

>`pwd:"yourPasswordHere",`

put your desired password in the quotes

>`db:"mango"`

make sure this is the same db as the one you created above.
You may now exit the mongoshell and continue.
### Logging on to the db:
The provided file:

>`tomato.sh`

Is all that is needed to start the server with the appropriate environment
variables. Be sure to change the `MONGO_USER` and `MONGO_PASSWORD` lines
to the user and pwd you used when creating the user in mongoshell.
### Initializing the db:
To initialize the db all that is needed is for you to run the provided file:

>`dbinit.sh`

This file sets the appropriate environment variables and starts `dbinit.js`
which will load the json data from `data/db.json` into the database.
ONLY RUN THIS ONCE! If this is ran multiple times, there will be duplicate
database entries, and you will have to delete the docker container and volume,
and then restart this process from step 1.
# The database and you:
There are several mongodb functions that you can use to interact with the database.

this section is incomplete

** If any functions are needed contact me over discord and I will put them in. **