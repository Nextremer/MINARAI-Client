var navigator = navigator;
function BaseInfo(options) {
    var setLocation = false;
    var longitude = 0.0;
    var latitude = 0.0;
    var id = null;
    var Dummy = {
        id: options.id,
        name: options.name,
    };
    console.log("aaaa");
    console.log(options);
    this.userId = options.id;
    var onGeoLocation = null;
    this.update = function () {
        var t = false;
        if (t !== setLocation) {
            setLocation = t;
            console.log('use setLocation: ' + setLocation);
        }
        startGeolocation();
        return this.get();
    };
    this.get = function () {
        var now = new Date();
        var date = "" + now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        var time = "" + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        return {
            //"user": $('#base-setting [name=name]').val(),
            //"id": $('#base-setting [name=id]').val(),
            "user": Dummy.name,
            "id": Dummy.id,
            "local-date": date,
            "local-time": time,
            "place": [longitude, latitude],
        };
    };
    this.getUserId = function () {
        //var res = $('#base-setting [name=id]').val();
        var res = Dummy.id;
        if (res) {
            return res;
        }
        return 'anonymous';
    };
    this.setOnGelocation = function (func) {
        onGeoLocation = func;
        if (onGeoLocation) {
            startGeolocation();
        }
    };
    function startGeolocation() {
        stopGeolocation();
        if (navigator && navigator.geolocation && !setLocation) {
            id = navigator.geolocation.getCurrentPosition(function (pos) {
                console.log("getCurrentPosition: success");
                console.log(pos);
                if (!setLocation && pos && pos.coords
                    && pos.coords.longitude && pos.coords.latitude) {
                    var validGeolocation = true;
                    console.log("validGeolocation: true");
                    longitude = pos.coords.longitude;
                    latitude = pos.coords.latitude;
                    console.log("onGeoLocation@@@@@@@@@@@" + latitude + " " + longitude);
                    if (onGeoLocation) {
                        onGeoLocation(latitude, longitude);
                    }
                }
            }, function (error) {
                console.log("getCurrentPosition: error");
                console.log(error);
            }, {
                enableHighAccuracy: true
            });
        }
        else {
            if (onGeoLocation) {
                onGeoLocation(latitude, longitude);
            }
        }
    }
    function stopGeolocation() {
        if (navigator && navigator.geolocation && id) {
            navigator.geolocation.clearWatch(id);
            id = null;
        }
    }
    startGeolocation();
    this.update();
}
module.exports = BaseInfo;
