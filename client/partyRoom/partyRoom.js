Router.route('/room/:_id', function() {
  this.layout("app");
  this.render('partyRoom');
});

Template.partyRoom.onCreated(function() {
  this.subscribe("pr", Router.current().params._id);
});
once = new ReactiveVar(false);
Template.partyRoom.onRendered(function() {
  this.autorun(function() {
    if (once.get() === true) {
      return false;
    }
    if (Template.instance().subscriptionsReady()) {
      once.set(true);
      track = PR.findOne({
        _id: Router.current().params._id
      }).playlist[0];
      if (track === undefined) {
        return false;
      }
      var stateMan = new StateMan(track);
    }
  });
});

Template.partyRoom.helpers({
  name: function() {
    if (Template.instance().subscriptionsReady()) {
      return PR.findOne({
        _id: Router.current().params._id
      }).name;
    }
  },
  "playlist": function() {
    if (Template.instance().subscriptionsReady()) {
      return PR.findOne({
        _id: Router.current().params._id
      }).playlist;
    }
  },
  "playlistIsEmpty": function() {
    if (Template.instance().subscriptionsReady()) {
      var pr = PR.findOne({
        _id: Router.current().params._id
      });
      if (pr.playlist === undefined) {
        return true;
      }
      if (pr.playlist.length <= 0) {
        return true;
      }
      return false;
    }
  },
  "searchedTracks": function() {
    return Session.get("searchedTracks");
  },
  "loadingSong": function() {
    return Session.get("loadingSong");
  },
  trackTitle: function() {
    return PR.findOne({
      _id: Router.current().params._id
    }).playlist[0].title;
  },
  trackName: function() {
    return PR.findOne({
      _id: Router.current().params._id
    }).playlist[0].name;
  }
});

Template.partyRoom.events({
  "keyup #searchSong": function(e, t) {
    var querry = $("#searchSong").val();
    if ($("#searchSong").val().length > 3) {
      SC.get('/tracks', {
        q: querry,
        limit: 10
      }, function(tracks) {
        if (tracks.length > 0) {
          Session.set("searchedTracks", tracks);
        }
      });
    }
  }
});

Template.playlistItem.events({
  "click .removeItem": function() {
    stopItem = false;
    var prId = PR.findOne({
      _id: Router.current().params._id
    }).playlist[0].id;
    if (prId === this.id) {
      stopItem = true;
    }
    PR.update({
      _id: Router.current().params._id
    }, {
      $pull: {
        'playlist': {
          id: this.id
        }
      }
    }, function() {
      if (stopItem) {
        SC.streamStopAll();
        Session.set("playingSong", false);
      }
      once.set(false);
    });
    // var pr = PR.findOne({
    //   _id: Router.current().params._id
    // });
    // for (var i = 0; i < pr.playlist.length; i++) {
    //   if (pr.playlist[i].id  === this.id) {
    //     console.log(i)
    //   }
    // }
  }
});


Template.searchedItem.events({
  "click .song": function() {
    PR.update({
      _id: Router.current().params._id
    }, {
      $push: {
        "playlist": {
          name: this.user.username,
          title: this.title,
          id: this.id
        }
      }
    }, function() {
      once.set(false);
    });
  }
});
