// js入口文件
// console.log(123);//测试代码
/* 
	websocket通信流程：
	websocket是一种全双工通信，客户端和服务端都有收发消息的相关方法
	服务端：
	1.安装第依赖包ws或者nodejs-websocket,当然还有其他方法。本案例使用ws包
	2.require引入包，实例化对象WebSocket,该对象的Server（）方法，创建服务对象server
	3.server对象API方法 server.on('open',function open(){})  server.on('close',function close(){}) 
	server.on('connection',function connection(ws,req){})
	客户端：
	1.实例化一个socket对象，socket = new WebSocket("ws://localhost:8080/ws");
	2.使用socket的API socket.onmessage=function(event){} socket.onopn socket.close,
	其中event.data中可以拿到服务端返回的数据
 */
const WebSocket = require('ws');

const server = new WebSocket.Server({
	port: 8080
});

server.on('open', function open() {
	console.log('connected');
});

server.on('close', function close() {
	console.log('disconnected');
});

server.on('connection', function connection(ws, req) {
	const ip = req.connection.remoteAddress;
	const port = req.connection.remotePort;
	const clientName = ip + port;

	console.log('%s is connected', clientName); //%s 参数表列的写法，类似C语言

	// 发送欢迎信息给客户端
	ws.send("欢迎" + clientName);
	// 接收客户端发来的消息
	ws.on('message', function incoming(message) {
		console.log('received: %s from %s', message, clientName);

		// 广播消息给所有客户端页面--如果是两个页面上开始显示同样的内容了
		server.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(clientName + " -> " + message);
			}
		});

	});

});
