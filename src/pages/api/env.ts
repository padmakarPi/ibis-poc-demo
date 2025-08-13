import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import Cors from "cors";
import runMiddleware from "./corsMiddleware";

const cors = Cors({
	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
	origin: "*",
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	await runMiddleware(req, res, cors);
	try {
		const filePath = path.join(process.cwd(), "public", "env.json");
		const fileContents = fs.readFileSync(filePath, "utf8");
		const json = JSON.parse(fileContents);
		res.setHeader("Content-Type", "application/json");
		res.status(200).json(json);
	} catch (error) {
		res.status(500).json({ error: "Unable to load env.json" });
	}
}
