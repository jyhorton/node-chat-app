var socket = io();

function scrollToBottom() {
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();
	
	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
};

socket.on('connect', function () {
	console.log('Connected to the server');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});		
		
socket.on('newMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	
	jQuery('#messages').append(html);
	scrollToBottom();
	
/* 	var formattedTime = moment(message.createdAt).format('h:mm a');
	console.log('newMessage', message);
	var li = jQuery('<li></li>');
	li.text(`${message.from} ${formattedTime} : ${message.text}`);
	jQuery('#messages').append(li); */
	
});	


socket.on('newlocationMessage', function (message) {
	
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	
	jQuery('#messages').append(html);
	scrollToBottom();
	
	
	/* var formattedTime = moment(message.createdAt).format('h:mm a');
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');
	li.text(`${message.from} ${formattedTime} : `);
	a.attr('href', message.url);
	li.append(a);
	jQuery('#messages').append(li);	 */
});	



/* socket.emit('createMessage', {
	from: "Andy",
	text: "That works for me"
}, function (data) {
	console.log('Got it.', data);
}); */

jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();
	
	socket.emit('createMessage', {
		from: "User",
		text: jQuery('[name=message]').val()
	}, function () {
		jQuery('[name=message]').val('');
	});

});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}
	
	locationButton.attr('disabled','disabled').text('Sending location...');
	
	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch the location');
	});
	
	
});












