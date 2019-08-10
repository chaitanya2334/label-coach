# Setup Vagrant

### Install vagrant and virtualbox

Download and install vagrant that best matches your operating system and architecture

https://www.vagrantup.com/downloads.html

Download and install virtual box 6+

https://www.virtualbox.org/

### Navigate to label-coach folder

```
$ cd /path/to/label-coach
```

### Download and save .box from drive link into label-coach directory


### Init .box using vagrant

```
$ vagrant box add --name label-coach-box /path/to/the/label-coach-vm.box
$ vagrant init label-coach-vm
$ vagrant up
```
### done!

Head to http://localhost:8080 to start using the tool.

