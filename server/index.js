const express = require('express');
const socket = require('socket.io');

const app = express();
const port = 8000;
const server = app.listen(port, () => console.log("Listening on port: " + port));

//location of static files (html)
app.use(express.static('public'));

const io = socket(server);

//socket has connected to server
io.on('connection', (socket) =>
{
    console.log('Socket: ' + socket.id + ' is now connected!');

    socket.on('disconnect', (reason) =>
    {
        console.log('Socket: ' + socket.id + ' is now disconnected! Reason: ' + reason);
    });

    socket.on('error', (error) =>
    {
        console.log('Error with socket: ' + socket.id + ' ' + error);
    });
});

const callGenerator = generateCalls();

//This is the main loop generating the data
async function beginCalls()
{
    while (true)
    {
        const { calls, timeout } = callGenerator.next().value;
        for (var i = calls.length - 1; i >= 0; --i)
        {
            const call = calls[i];
            io.emit('phone', { ID: call, duration: call.substr(call.indexOf('_') + 1) });
        }
        console.log('sleeping for: ' + timeout);
        await sleep(timeout);
    }
}

//generator function to indefinitely generate calls
function* generateCalls()
{
    let callNumber = 1;
    let timeout = 1;
    while (true)
    {
        yield { calls: ['call_' + callNumber, 'call_' + (callNumber + 1)], timeout: timeout * 1000 };
        callNumber += 2;
        timeout *= 2;
    }
}

//helper function to simulate pausing the thread
async function sleep(timeout)
{
    return new Promise(resolve => setTimeout(resolve, timeout));
}

//begin the phone calls!
beginCalls();