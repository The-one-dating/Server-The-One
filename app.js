const express = require("express");
const bodyparser = require('body-parser')
const { auth } = require('express-openid-connect');
const app = express();
const server = app.listen(3000, () => {
	console.log('listening on *:3000');
})
const io = require('socket.io')(server);
const login = require("./src/Routers/login");
const profiles = require("./src/Routers/profiles");
const posts = require("./src/Routers/posts");
const conversion = require("./src/Routers/conversion");
const hash = require("./src/Routers/hash");

const https = require('https')

var options = {
	hostname: 'www.howsmyssl.com',
	port: 443,
	path: '/a/check',
	method: 'GET',
	secureProtocol: "TLSv1_2_method"
}

https.request(options, res => {
	let body = ''
	res.on('data', d => body += d)
	res.on('end', () => {
		data = JSON.parse(body)
		console.log('SSL Version: ' + data.tls_version)
	})
}).on('error', err => {
	// This gets called if a connection cannot be established.
	console.warn(err)
}).end()

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

const mongoose = require('mongoose')

mongoose.set('strictQuery', true);

mongoose.connect('mongodb+srv://barak:-Gcce8qTDJ.DQ4b@cluster0.xzzw7il.mongodb.net/test').then(() => console.log("db connected")).catch((err => console.log(err)))

const { v4: uuidv4 } = require('uuid');

app.use(
	auth({
		issuerBaseURL: 'https://dev-8mxg4wjifqipa4jd.us.auth0.com',
		baseURL: 'https://localhost:3000',
		clientID: 'FvfmF4iT9SOC58fpKkAZYdKgZKj6b8wO',
		secret: uuidv4(),
		authRequired: false,
		auth0Logout: true,
	}),
);

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.oidc.isAuthenticated();
	next();
});

app.use("/login", login);
app.use("/profiles", profiles)
app.use("/posts", posts)
app.use("/conversion", conversion)
app.use("/hash", hash)

app.get('/', (req, res) => {
	res.send('hello world 2');
});

io.on('connection', function (clientSocket) {
	clientSocket.on('join room', function (room) {
		clientSocket.join(room);
	});

	clientSocket.on('typing', function (data) {
		io.sockets.in(data.room).emit('typing', data.id);
	});

	clientSocket.on('stop typing', function (data) {
		io.sockets.in(data.room).emit('stop typing', data.id);
	});

	clientSocket.on('new message', function (data) {
		io.sockets.in(data.room).emit('new message', data.id);
		io.sockets.in(data.token).emit('show circle', data.fromToken);
	});

	clientSocket.on('like message', function (data) {
		io.sockets.in(data.room).emit('like message', data);
		// io.sockets.in(data.token).emit('show circle');
	});

	clientSocket.on('date?', function (data) {
		setDate(data.room, data.token)
		io.sockets.in(data.room).emit('date?', data.token);
		// io.sockets.in(data.token).emit('show circle');
	});

	clientSocket.on('date approved', function (data) {
		setDate(data.room, "approved")
		io.sockets.in(data.room).emit('date approved', data.token);
		// io.sockets.in(data.token).emit('show circle');
	});

	clientSocket.on('no date', function (data) {
		setDate(data.room, "no")
		io.sockets.in(data.room).emit('no date', data.token);
		// io.sockets.in(data.token).emit('show circle');
	});

	clientSocket.on('location suggested', function (data) {
		setDateLocation(data.room, data.token, data.location)
		io.sockets.in(data.room).emit('location suggested', { token: data.token, location: data.location });
		// io.sockets.in(data.token).emit('show circle');
	});

	clientSocket.on('location approved', function (data) {
		setDateLocation(data.room, "approved", data.location)
		io.sockets.in(data.room).emit('location approved', { token: data.token, location: data.location });
		// io.sockets.in(data.token).emit('show circle');
	});

	clientSocket.on('cancel match', function (data) {
		io.sockets.in(data.id).emit('cancel match', data.token);
	});

	clientSocket.on('new match', function (data) {
		io.sockets.in(data.toID).emit('new match', data.id);
	});

	clientSocket.on('chatTimer', function (data) {
		io.sockets.in(data.room).emit('chatTimer');
	});
});

async function setDate(room, state) {
	let m = await Messages.findOne({ room: room })
	if (m == undefined) {
		m = Messages({
			room: room,
			date: {
				state: state
			}
		})
	}
	else {
		m.date.state = state
	}
	m.save()
}

async function setDateLocation(room, status, location) {
	const m = await Messages.findOne({ room: room })
	m.date.location = {
		value: location,
		status: status
	}
	m.save()
}