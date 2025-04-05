// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { shows } from "@/data/shows";

type WebhookResponse = {
  result: string;
  [key: string]: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse | { message: string; error?: string }>
) {
  try {
    if (req.method === "POST") {
      const { message } = req.body;

      const { type = "function-call", functionCall = {} } = message;
      console.log("Vapi webhook payload:", message);

      if (type === "function-call") {
        const functionName = functionCall?.name;
        const parameters = functionCall?.parameters || {};

        // Handle different function calls
        switch (functionName) {
          case "suggestShows":
            // Filter shows based on parameters if provided
            let filteredShows = shows;
            if (parameters.genre) {
              filteredShows = filteredShows.filter((show) =>
                show.genre
                  .toLowerCase()
                  .includes(parameters.genre.toLowerCase())
              );
            }

            return res.status(200).json({
              result:
                "You can see the upcoming shows on the screen. Select which ones you want to choose.",
              shows: filteredShows.map((show) => ({
                title: show.title,
                genre: show.genre,
                date: show.date,
                time: show.time,
                venue: show.venue,
              })),
            });

          case "confirmDetails":
            // Find the show by title
            const showToConfirm = shows.find(
              (show) =>
                show.title.toLowerCase() ===
                (parameters.show || "").toLowerCase()
            );

            if (!showToConfirm) {
              return res.status(200).json({
                result: "I couldn't find that show. Please try another one.",
              });
            }

            return res.status(200).json({
              result: `I've pulled up the details for ${showToConfirm.title}. Please confirm if you want to proceed with booking.`,
              showDetails: {
                title: showToConfirm.title,
                date: parameters.date || showToConfirm.date,
                time: parameters.time || showToConfirm.time,
                numberOfTickets: parameters.numberOfTickets || 1,
                price: showToConfirm.price,
                totalPrice:
                  showToConfirm.price * (parameters.numberOfTickets || 1),
              },
            });

          case "bookTickets":
            // Find the show by title
            const showToBook = shows.find(
              (show) =>
                show.title.toLowerCase() ===
                (parameters.show || "").toLowerCase()
            );

            if (!showToBook) {
              return res.status(200).json({
                result:
                  "I couldn't find that show for booking. Please try another one.",
              });
            }

            // Calculate total price
            const numberOfTickets = parameters.numberOfTickets || 1;
            const totalPrice = showToBook.price * numberOfTickets;

            return res.status(200).json({
              result: `Great! I've booked ${numberOfTickets} ticket${
                numberOfTickets > 1 ? "s" : ""
              } for ${showToBook.title} on ${
                parameters.date || showToBook.date
              } at ${
                parameters.time || showToBook.time
              }. The total price is $${totalPrice}.`,
              bookingDetails: {
                bookingId: `BK${Math.floor(Math.random() * 10000)}`,
                show: showToBook.title,
                date: parameters.date || showToBook.date,
                time: parameters.time || showToBook.time,
                numberOfTickets: numberOfTickets,
                seatType: parameters.seatType || "Standard",
                totalPrice: totalPrice,
              },
            });

          case "changeUIColor":
            return res.status(200).json({
              result: `I've changed the UI color to ${
                parameters.color || "default"
              }.`,
              color: parameters.color || "default",
            });

          default:
            console.warn(`Unknown function call: ${functionName}`);
            return res.status(200).json({
              result: `I received a request to execute ${functionName}, but I don't know how to handle it.`,
              parameters: parameters,
            });
        }
      }

      // Handle other message types
      return res.status(200).json({
        result: "Message received but no action was taken.",
      });
    }

    return res.status(404).json({ message: "Not Found" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: String(err) });
  }
}
