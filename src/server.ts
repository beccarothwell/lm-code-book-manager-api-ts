import { app } from "./app";
import { populateDummyData } from "./database/database_seed";
import { CONFIG } from "./config";

console.log(`🌍 Running in ${CONFIG.nodeEnv} environment`);

app.listen(CONFIG.port, () => {
	console.log(`🚂 Express started on port ${CONFIG.port}`);

	// Seed the database with some data
	if (CONFIG.nodeEnv === "test") {
		populateDummyData();
	}
});
