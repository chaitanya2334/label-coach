#!/usr/bin/env bash

cd /vagrant/label_coach
source /home/vagrant/anaconda3/etc/profile.d/conda.sh
eval "$(conda shell.bash hook)"
conda activate label-coach
sudo service mongod start
girder serve -H 0.0.0.0 > out.log &

