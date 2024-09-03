import pm2 from "pm2";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startPM2() {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    import(`${__dirname}/ecosystem.config.mjs`)
      .then((ecosystemConfig) => {
        pm2.start(ecosystemConfig.default, (err) => {
          if (err) {
            console.error(err);
            process.exit(2);
          }

          console.log("PM2 started successfully");
        });
      })
      .catch((err) => {
        console.error("Error loading ecosystem.config.mjs:", err);
        process.exit(2);
      });
  });
}

startPM2();
