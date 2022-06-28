import amqp from "amqplib";
import random from "random";

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// async function on_msg_received(msg) {}

export default async function tasksConsumer() {
    try {

        const conn = await amqp.connect("amqp://localhost");
        const channel = await conn.createChannel();

        const queue = "tasks";
        await channel.assertQueue(queue);
        await channel.prefetch(1);

        console.log("Starting Consuming");
        await channel.consume(queue, async (msg) => {
            if(msg !== null) {
                console.log(msg);
                const processing_time = random.int(1, 6);
                console.log(`Received: "${msg.content.toString()}", will take ${processing_time}s to process`);
                await sleep(processing_time * 1000);
                channel.ack(msg);
                console.log(`finished processing and acknowledged message: ${msg.content.toString()}`);
            } else {
                console.log("Consumer cancelled by server");
            }
        });
        // not closing because we want it to continously consume msg from the queue

    } catch(error) {
        console.log(error);
        throw error;
    }
}

tasksConsumer();