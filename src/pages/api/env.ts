import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const filePath = path.join(process.cwd(), "public", "env.json");
	try {
		const fileContents = fs.readFileSync(filePath, "utf8");
		const json = JSON.parse(fileContents);
		res.status(200).json(json);
	} catch (error) {
		res.status(500).json({ error: "Unable to load env.json" });
	}
}
