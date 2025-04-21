const amqp = require('amqplib');

const rabbitMqUrl = 'amqp://FH42shKghNShCtIL:4wlycWD6uq8Mi01WGUvVsm6B3YoSZImn@maglev.proxy.rlwy.net:13038?frameMax=8192';
const testQueue = 'test-queue'; // A temporary queue for testing

async function testRabbitMQConnection() {
  let connection;
  console.log(`Attempting to connect to RabbitMQ at ${rabbitMqUrl}...`);
  try {
    // 1. Connect to RabbitMQ server
    // Explicitly set frameMax to meet server requirements (e.g., Railway's default minimum)
    connection = await amqp.connect(rabbitMqUrl);
    console.log('Successfully connected to RabbitMQ!');

    // 2. Create a channel
    const channel = await connection.createChannel();
    console.log('Successfully created a channel.');

    // 3. Assert a test queue (creates if it doesn't exist, idempotent)
    await channel.assertQueue(testQueue, { durable: false });
    console.log(`Successfully asserted queue: ${testQueue}`);

    // 4. Send a test message
    const message = 'Hello RabbitMQ!';
    channel.sendToQueue(testQueue, Buffer.from(message));
    console.log(`Sent message: "${message}" to queue: ${testQueue}`);

    // 5. Consume the message
    console.log(`Waiting for message from queue: ${testQueue}...`);
    await channel.consume(testQueue, (msg) => {
      if (msg !== null) {
        console.log(`Received message: "${msg.content.toString()}"`);
        channel.ack(msg); // Acknowledge the message
        console.log('Message acknowledged.');
        // Close connection after receiving and acknowledging the message
        setTimeout(() => {
            channel.close();
            connection.close();
            console.log('Channel and connection closed.');
        }, 500); // Delay closing slightly
      }
    });

  } catch (error) {
    console.error('Failed to connect or interact with RabbitMQ:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused. Ensure the RabbitMQ server is running and accessible.');
    } else if (error.message.includes('ACCESS_REFUSED')) {
        console.error('Authentication failed. Check your username and password.');
    }
    // Attempt to close connection if it was partially opened
    if (connection) {
      await connection.close().catch(closeErr => console.error('Error closing connection:', closeErr));
    }
    process.exit(1); // Exit with error code
  }
}

testRabbitMQConnection();