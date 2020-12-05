## Devops final project

The project has three versions to be run for different purposes. They are production, development and Continuous Integration mode. 


### 1. Production Mode
This is the default version of the project. It consists of a docker compose file named `docker-compose.yml`, which contains images of rabbitmq, IMED, ORIG, OBSE and HTTPENV. When the compose is started, it installs and runs rabbitmq. The other images depend on the health status of the rabbitmq container and are set to wait for a certain amount of time before being executed. 

To start, simply run the following docker command at folder root.
```bash
docker-compose up --build
```

After about 30 seconds, HTTPENV container is available at [localhost:8081](http://localhost:8081). The main page is the Swagger documentation of available API gateways. 


### 2. Development Mode
This mode is mostly identical to Production Mode and only different in hot reloading 
IMED, ORIG, OBESE and HTTPENV containers for easy development. Moreover, it contains images of gitlab-ce and gitlab-runner for self-hosting gitlab locally and testing CI pipeline.  
To run this mode, simply run docker compose command and explicitly specify `docker-compose.dev.yml` file.  
```bash
docker-compose -f docker-compose.dev.yml up --build
```
As it is similar to Production Mode, HTTPENV can be tested at [localhost:8081](http://localhost:8081) after 30 seconds and the gitlab container can be accessed at [localhost:8080](http://localhost:8080). It can take more than 5 minutes to have the local ready if it is the brand new created gitlab image.

### 3. Continuous Integration Mode

This is the dedicated mode for the gitlab pipeline test stage. The mode runs tests and eslint of the HTTPENV container, and can also be manually triggered by a docker compose command:  
```bash
docker-compose -f docker-compose.test.yml up --build
```

### GitLab CI Pipeline

The pipeline consists of three stages:
- Build  
This stage simply runs the following command
```bash
docker-compose build
```
It will try to create containers from HTTPENV, OBSE, ORIG and IMED images and install node module dependencies to verify.
- Test  
This is the second stage of the pipeline. The stage will run the command:
```bash
docker-compose -f docker-compose.test.yml up --build
```
It will install all node modules dependency and run `eslint` and `jest` in HTTPENV container. `eslint` uses airbnb and recommended config. 
- Deploy  
The stage is not yet implemented due to lack of environment for testing. 
