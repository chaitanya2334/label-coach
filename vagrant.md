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
$ vagrant box add --name label-coach /path/to/the/label-coach-vm.box
$ vagrant up
```
### done!

Head to http://localhost:8080 to start using the tool.

## Appendix: Box

### Create Box

To package a box containing all local software and configurations present in the current vagrant setup.

```
$ vagrant package --output label-coach-vm.box
```
### Add New

If you are adding the box for the first time

```
$ vagrant box add --name label-coach /path/to/the/label-coach-vm.box
$ vagrant up
```

### Update 

To remove and replace existing box with a new box

```
$ vagrant destroy
$ vagrant remove label-coach
$ vagrant box add ---name label-coach /path/to/the/new-label-coach-vm.box
$ vagrant up
```
