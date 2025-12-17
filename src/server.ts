import { Server } from "http"
import app from "./app"
import { logger } from '@helpers/logger';
import config from "@config/index";


const main = async () => {
    const server: Server = app.listen(config?.port, () => {
        logger.info(`Server is up and running on ${config?.port}`);
    })
}

main()