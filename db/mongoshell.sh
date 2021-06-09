docker run --rm -it                     \
--network businesses mongo:latest mongo \
--host mongo-server                     \
--username root                         \
--password hunter2                      \
--authenticationDatabase admin