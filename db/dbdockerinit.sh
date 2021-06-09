docker network create businesses
docker run -d --name rabbitmq-server     \
-p "5672:5672"                           \
-p "15672:15672"                         \
--network businesses rabbitmq:3-management
docker run -d --name mongo-server    \
--network businesses                 \
-p "27017:27017"                     \
-v assign4-vol:/data/db              \
-e "MONGO_INITDB_ROOT_USERNAME=root" \
-e "MONGO_INITDB_ROOT_PASSWORD=hunter2" mongo:latest
  