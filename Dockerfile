FROM node:8-stretch
SHELL ["/bin/bash", "-c"]
EXPOSE 8080

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
ENV PATH /opt/conda/bin:$PATH

RUN apt-get update --fix-missing && apt-get install -y wget bzip2 ca-certificates \
    libglib2.0-0 libxext6 libsm6 libxrender1 \
    git mercurial subversion

RUN wget --quiet https://repo.anaconda.com/archive/Anaconda3-5.3.0-Linux-x86_64.sh -O ~/anaconda.sh && \
    /bin/bash ~/anaconda.sh -b -p /opt/conda && \
    rm ~/anaconda.sh && \
    ln -s /opt/conda/etc/profile.d/conda.sh /etc/profile.d/conda.sh && \
    echo ". /opt/conda/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc

RUN source ~/.bashrc

RUN apt-get install -y curl grep sed dpkg && \
    TINI_VERSION=`curl https://github.com/krallin/tini/releases/latest | grep -o "/v.*\"" | sed 's:^..\(.*\).$:\1:'` && \
    curl -L "https://github.com/krallin/tini/releases/download/v${TINI_VERSION}/tini_${TINI_VERSION}.deb" > tini.deb && \
    dpkg -i tini.deb && \
    rm tini.deb && \
    apt-get clean

ENTRYPOINT [ "/usr/bin/tini", "--" ]



WORKDIR ./docker-root
COPY . .
WORKDIR ./label_coach

RUN conda env update -f ../environment.yml
RUN echo "source activate $(head -1 ../environment.yml | cut -d' ' -f2)" > ~/.bashrc
ENV PATH /opt/conda/envs/$(head -1 ../environment.yml | cut -d' ' -f2)/bin:$PATH
RUN conda env list
#RUN conda install python=3.6.5
#RUN pip install girder==2.5.0
RUN npm install
#RUN pwd
RUN source activate label-coach && girder-install plugin -s /docker-root/label_coach
RUN source activate label-coach && girder-install web --all-plugins
#
ENTRYPOINT source activate label-coach && girder serve --host 0.0.0.0 --database mongodb://mongodb:27017/girder

