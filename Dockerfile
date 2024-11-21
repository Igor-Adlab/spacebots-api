FROM docker.io/node:22

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN groupadd --system spacebots-api && \
    useradd --system --gid spacebots-api --home-dir /app --shell /bin/bash spacebots-api

COPY dist/spacebots-api /app/
COPY prisma /app/prisma/
RUN chown -R spacebots-api:spacebots-api .

RUN apt-get update && apt-get install -y ffmpeg curl

RUN yarn add prisma --dev

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN yarn

CMD [ "node", "main.js" ]
