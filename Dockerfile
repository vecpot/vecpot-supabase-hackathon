FROM python:3.9

WORKDIR /workspace

COPY . .

WORKDIR /workspace/app

RUN pip install -r requirements.txt
EXPOSE 8000

ENTRYPOINT ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0"]