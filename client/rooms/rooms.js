Router.route('/', function() {
  this.layout("app");
  this.render('rooms');
});

Template.rooms.onCreated(function() {
  this.subscribe("prs", Router.current().params._id);
});
Template.rooms.helpers({
  "room": function() {
    return PR.find({});
  }
});
Template.rooms.events({
  "click .addRoom": function() {
    $('#addRoomModal').openModal();
  }
});

Template.addRoomModal.events({
  "click .btn": function() {
    var name = $("#roomName").val();
    PR.insert({
      "name": name
    }, function() {
      $('#addRoomModal').closeModal();
    });
  }
});
