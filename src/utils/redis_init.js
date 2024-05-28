import { createClient } from "redis";

const client = createClient({
  password: "jB3a8jjsaJXaA1WltAKYHPsqqJ2QjBgB",
  socket: {
    host: "redis-14823.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 14823,
  },
});

client.on("connect", () => {
  console.log("client connected to redis");
});

client.on("ready", () => {
  console.log("client connected, ready to use");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

export default client;
