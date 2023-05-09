import app from "./index";
import { logger } from "./helper/logger";
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});