FROM continuumio/anaconda

ENV PYTHONUNBUFFERED True
ENV APP_HOME /app
WORKDIR $APP_HOME

COPY app.py optimize.py env.yml shops.json ./
COPY static ./static
RUN conda env create -n SCMIP -f env.yml
RUN conda init bash
SHELL ["conda", "run", "-n", "SCMIP", "/bin/bash", "-c"]
RUN python -c "import flask"

ENTRYPOINT ["conda", "run", "-n", "SCMIP", "gunicorn", "--bind", ":$PORT", "--workers", "1", "--threads", "8", "--timeout", "0", "app:app"]