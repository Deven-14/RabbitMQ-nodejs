import amqp from "amqplib";
import random from "random";

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default async function tasksProducer() {

    try {

        const conn = await amqp.connect("amqp://localhost");
        const channel = await conn.createChannel();

        const queue = "tasks";
        await channel.assertQueue(queue);

        var messageId = 1;

        while(true) {
            const message = `Sending message Id: ${messageId}`;
            channel.publish("", queue, Buffer.from(message));
            console.log("Sent message:", message);
            await sleep(random.int(1, 4) * 1000);
            messageId += 1
        }

    } catch(error) {
        console.log(error);
        throw error;
    } 
    // finally {
    //     await channel.close();
    //     await conn.close();
    // }
}

tasksProducer();