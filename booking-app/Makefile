run:
	docker run --env-file .env --name booking -p 4001:4001 booking:latest

build:
	docker build -t booking:latest .

rm:
	docker rm -f booking
