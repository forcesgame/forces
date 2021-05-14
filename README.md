# forces

Deployed at https://forcesgame.com.

This repo contains the project developed by [Jesus
Fuentes](https://github.com/jefuentesnava), [Ben
Lee](https://github.com/benjamin0821), and [Patrick
Silvestre](https://github.com/pjsilvestre) for CMPE 195B at San Jose State
University during the Spring 2021 semester.

## Demo Video

[![demo-video](https://img.youtube.com/vi/l-R6Tlvkdhw/0.jpg)](https://www.youtube.com/watch?v=l-R6Tlvkdhw)

## Running in Development Mode

[Node](https://nodejs.org/en/) required.

Forces consists of two apps: an API server and a client app. Code relevant
to the API server can be found in the root directory and `server`, and
code relevant to the client app can be found in `react-ui`.

Before running either app, you must have two `.env` files, one placed in the
root directory and one placed in the `client` directory. These files are
available on request by [mailing the lead
maintainer](mailto:patrickjohnsilvestre@gmail.com).

### Starting the API server

```bash
npm install
npm run devStart
```

### Starting the client

```bash
cd react-ui
npm install
npm run start
```
