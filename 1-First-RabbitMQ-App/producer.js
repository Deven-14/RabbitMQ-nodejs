import amqp from "amqplib";

export default async function tasksProducer() {

    var conn = null;
    try {

        conn = await amqp.connect("amqp://localhost");
        const channel = await conn.createChannel();

        const queue = "tasks";
        await channel.assertQueue(queue);

        const message = "Hello this is my first message";
        // channel.sendToQueue(queue, Buffer.from(message));
        channel.publish("", queue, Buffer.from(message));
        console.log("message sent");
        await channel.close();

    } catch(error) {
        console.log(error);
        throw error;
    } finally {
        await conn.close();
    }
}

tasksProducer();