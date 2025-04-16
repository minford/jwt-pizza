# AWS Services and their Connections

### Compute 
EC2 – Virtual machines (you control everything)

Lambda – Serverless functions (no servers to manage)

ECS / EKS – Container orchestration for Docker apps

### Storage
S3 – Object storage for files, images, backups

EBS – Disk storage for EC2 instances

EFS – Shared file system for multiple EC2 instances

### Databases
RDS – Managed SQL databases (PostgreSQL, MySQL, etc.)

DynamoDB – NoSQL database

Aurora – High-performance, cloud-native SQL DB

### Networking
VPC (Virtual Private Cloud) – Your private network in the cloud

Subnets – Public and private sections of your VPC

Route Tables, NAT Gateways – Control traffic flow

Load Balancers (ELB) – Distribute traffic to multiple instances

### Deployment Tools
#### CI/CD & Automation
CodeCommit – Git repo

CodeBuild – Build and test code

CodePipeline – Automate build/test/deploy pipelines

CodeDeploy – Deploy code to EC2 or Lambda

#### Infrastructure as Code
CloudFormation – Write YAML/JSON to spin up AWS resources

CDK (Cloud Development Kit) – Use code (TypeScript/Python/etc.) to define infrastructure

-------

### Serverless functions
Run code without having to manage servers

Write function, deploy, and runs when triggered

Can scale automatically

### Continuous Integration and Continous Delivery (CI/CD) 
Source (get code)

Build (compile/test code)
- steps:
    - checkout code
    - install dependencies
    - run linter
    - compile (if needed)

Test:
- steps:
    - run unit tests
    - run integration tests
    - generate coverage reports


Deploy (release to servers or environments)
- steps:
    - deploy to staging server or Lambda
    - run smoke tests

Release:
- steps:
    - manual approval
    - deploy to production
    - notify team (e.g., Slack, email)


