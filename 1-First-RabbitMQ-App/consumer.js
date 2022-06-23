import amqp from "amqplib";

export default async function tasksConsumer() {
    try {

        const conn = await amqp.connect("amqp://localhost");
        const channel = await conn.createChannel();

        const queue = "tasks";
        await channel.assertQueue(queue);

        console.log("Starting Consuming");
        await channel.consume(queue, (msg) => {
            if(msg !== null) {
                console.log("Recieved:", msg.content.toString());
                channel.ack(msg);
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