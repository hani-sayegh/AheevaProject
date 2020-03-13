const connectBtn = document.getElementById('connect');
const clientDisplay = document.getElementById('clientContainer');

connectBtn.onclick = onConnect;

async function onConnect()
{
    //set btn properties
    connectBtn.disabled = true;
    connectBtn.innerHTML = 'Connected';
    connectBtn.style.color = 'red';

    socket = io.connect('http://localhost:8000');

    //received a phone call
    socket.on('phone', (call) =>
    {
        clientDisplay.innerHTML += '<b>Received: </b>' + call.ID + ' <b>Time: </b>' + new Date().toLocaleTimeString() + '<br>';
    });

    let id = -1;
    socket.on('connect', () =>
    {
        id = socket.id;
        clientDisplay.innerHTML = '<h1>Socket ID: ' + id + ' </h1>';

        connectBtn.innerHTML = 'Connected';
    });

    socket.on('disconnect', (reason) =>
    {
        clientDisplay.innerHTML = '<h1 style="color:red;"> ' + id + ' has been disconnected</h1>';
        clientDisplay.innerHTML += '<h2> Reason: ' + reason + '</h2>';

        connectBtn.innerHTML = 'Disconnected';
    });

    socket.on('error', (error) =>
    {
        clientDisplay.innerHTML = '<h1 style="color:red;">Error with socket ID: ' + id + '</h1>';
        clientDisplay.innerHTML += '<h2> Error Message: ' + error + '</h2>';

        connectBtn.innerHTML = 'ERROR';
    });
}