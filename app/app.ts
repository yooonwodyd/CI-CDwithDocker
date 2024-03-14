import express from "express";
import { RedisClientType } from "redis";
export const LIST_KEY = "messages";

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client: RedisClient) => {
  const app = express();

  app.use(express.json());


  function fibonacci(n: number): number {
    if (n <= 1) {
      return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  app.get("/fibonacci/:n", (request, response) => {
    console.log(process.env.pm_id)
    const n = parseInt(request.params.n,10);
    const result = fibonacci(n);
    response.status(200).send("Fibonachi number is " + result + " from process " + process.env.pm_id);
  });

  app.get("/", (request, response) => {
    response.status(200).send("hello from express");
  });

  app.post("/messages", async (request, response) => {
    const { message } = request.body;
    await client.lPush(LIST_KEY, message);
    response.status(200).send("Message added to list");
  });

  app.get("/messages", async (request, response) => {
    const messages = await client.lRange(LIST_KEY, 0, -1);
    response.status(200).send(messages);
  });

  return app;
};
