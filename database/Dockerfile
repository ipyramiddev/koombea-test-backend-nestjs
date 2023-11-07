# Use the official MySQL 8.0 image from Docker Hub
FROM mysql:8.0

# Set environment variables for MySQL
ENV MYSQL_DATABASE my_api
ENV MYSQL_USER your_username
ENV MYSQL_PASSWORD your_password
ENV MYSQL_ROOT_PASSWORD your_root_password

# Copy the SQL creation script to the Docker container
COPY 01_create_tables.sql /docker-entrypoint-initdb.d/

# Grant necessary permissions to the user on the database
#RUN echo "GRANT ALL PRIVILEGES ON my_api.* TO 'your_username'@'%' WITH GRANT OPTION;" > /docker-entrypoint-initdb.d/02_grant_permissions.sql

# Expose the default MySQL port
EXPOSE 3306