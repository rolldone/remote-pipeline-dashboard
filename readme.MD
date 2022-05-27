## Description
remote-pipeline-dashboard. This dashboard remote pipeline web app

## Setup project
For first create your working directory first, we call **remote-pipeline-dashboard**. Then pull this repository.

After you pull this repo. Create docker volume first
```
docker volume create remote_pipeline_dashboard
```
Then create docker-compose.yaml
### docker-compose.yaml
```
services:
  app:
    image: node:14.16.1-buster-slim
    working_dir: '/opt/app'
    command: >
      bash -c  "
        tail -f > /dev/null
      "
    volumes: 
      - "remote_pipeline_dashboard:/opt/app"
    labels:
      generated: by 8gwifi.org
    deploy:
      resources:
        limits:
          cpus: "1"
          #memory: 1G
version: '3'
volumes:
  remote_pipeline_dashboard:
    external: true
```
If you use ngi-sync as working tool, this is configuration for you.

```
ngi-sync init
```

Change the default config to with this 
## .sync_ignore
```
.sync_collections
.sync_ignore
sync-config.yaml
sync-config.yml
.sync_temp
node_modules
**/node_modules
vendor
**/vendor
.git
ngi-sync-*

/*
!/src
#!/dist
!/tsconfig.json
!/package*
!/docker-compose*
!/note
!/node_modules/ractive
!/rollup*
```


## sync-config.yaml
```
reset_cache: true
project_name: remote_pipeline_dashboard
username: root
privateKey: /home/donny/.ssh/openssh_nopassword
host: 192.168.50.4 # Your target ip
port: 2200 # Your target port
localPath: .
remotePath: /root/workspaces/remote_pipeline_dashboard # Your target working dir
devsync:
  os_target: linux
  ignores: []
  downloads:
    - package.json
    - package-lock.json
    - docker-compose.yaml
    - tsconfig.json
  single_sync:
    - dist
    - node_modules
  script:
    local:
      on_ready: null
      on_stop: null
      commands:
        - npm run watch
    remote:
      on_ready: null
      on_stop: null
      commands:
        - docker-compose up --build
        - docker-compose up
        - docker-compose exec app bash -l
  trigger_permission:
    unlink_folder: true
    unlink: true
    change: true
    add: true
direct_access:
  config_file: ""
  ssh_configs:
    - Host: workspaces
      HostName: =host
      User: =username
      Port: =port
      RequestTty: force
      IdentityFile: =privateKey
      StrictHostKeyChecking: no
      RemoteCommand: cd =remotePath && bash -l
      ServerAliveInterval: 300
      ServerAliveCountMax: 2
  ssh_commands:
    - access_name: Enter Server
      command: ssh -v workspaces
    - access_name: Setup for first time
      command: ngi-sync direct  rsync_project_files
    - access_name: Rsync project files
      key: rsync_project_files
      command: ngi-sync sc rsync --mode=soft --action=upload --path=/

```

