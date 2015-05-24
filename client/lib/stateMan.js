Session.set("loadingSong", true)
StateMan = function(track) {
  this.track = track;
  var that = this;
  SC.stream("/tracks/" + track.id, {
      onfinish: function() {
        this.stop();
        PR.update({
          _id: Router.current().params._id
        }, {
          $pop: {
            playlist: -1
          }
        }, function() {
          once.set(false);
          Session.set("playingSong", false);
        });
      },
      onconnect: function() {
        console.log(this)
        console.log('track connect');
      },
      onfailure: function() {
        console.log("fail")
      },
      ondataerror: function() {
        console.log("error")
      },
      onload: function() {
        console.log("onload");
      },
      onplay: function() {
        // console.log(this)
        Session.set("loadingSong", false);
        Session.set("playingSong", true);
      },
      whileloading: function() {
        // console.log("whileloading")
      },
      whileplaying: function() {
        // console.log("whileplaying")
      },
    },
    function(sound) {
      this.track = sound;
      if (Session.get("playingSong") === true) {
        return false;
      }
      this.track.play();
      // this.track.mute();
    }
  );

  this.state = "stop";
  this.play = function() {
    if (this.state == "play") return;
    this.state = "play";
    this.track.play();
    // Session.set("currentTrack", stateMan);
  };
  this.stop = function() {
    if (this.state == "stop") return;
    this.state = "stop";
    this.track.stop();
  };
  this.pause = function() {
    if (this.state == "pause") return;
    this.state = "pause";
    this.track.pause();
  };
  // console.log(this.play())
};
