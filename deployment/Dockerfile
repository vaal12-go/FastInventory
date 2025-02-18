FROM python:3.13.2-alpine3.20@sha256:e885b40c1ed9f3134030e99a27bd61e98e376bf6d6709cccfb3c0aa6e856f56a

LABEL version="0.0_18Feb2025"
LABEL description="Image for fastapi deployment"

RUN /usr/local/bin/pip install --upgrade pip
RUN /usr/local/bin/pip install pipenv


RUN mkdir /project_dir
WORKDIR /project_dir

COPY . /project_dir
RUN pipenv install

VOLUME ["/deployment_temp"]

# CMD ["sh"]
CMD pipenv run fastapi run --port 8080 main.py