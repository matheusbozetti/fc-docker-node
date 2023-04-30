FROM node:18

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN chmod +x ./wait-for-it.sh

EXPOSE 3000

ENTRYPOINT [ "/bin/bash", "-c" ]

CMD ["./wait-for-it.sh -h db -p 3306 --timeout=60 -- node index.js"]