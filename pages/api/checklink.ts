// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from "../../config/nodeMailer";

export const sendForm = async (data: string) =>
    fetch("api/checklink", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
    });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Check for secret to confirm this is a valid request
    // if (req.headers.secret !== process.env.CHECK_LINK_SECRET) {
    //     return res.status(401).json({ message: "Invalid token" });
    // }

    try {
        const youtubeLink = req.body;
        const response = await fetch(youtubeLink);
        if (response.status !== 200) return res.status(500).send("Error");
        const result = await transporter.sendMail({
            ...mailOptions,
            subject: "channel gallery comment",
            text: youtubeLink,
            html: `<h1>Channel Gallery new Suggestion</h1><p>${youtubeLink}</p>`,
        });
        return res.status(200).json(result.response);
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send("Error");
    }
}
