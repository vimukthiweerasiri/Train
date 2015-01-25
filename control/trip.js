var db = require("../model/mongoDBhandler");
var Firebase = require("firebase");
var firebaseRef = new Firebase("https://testhj.firebaseio.com/");


var Trip = function (_tripId) {
    this.tripId = _tripId;
    this.times=0;
    this.ready=false;
    this.stationReachingTimes = [];
    this.data=[];
};

Trip.prototype.loadData=function(){
    var that=this;
    load(this.tripId,function(){
        that.times++;
//        console.log(' finished in '+that.tripId+' times '+that.times);
        if(that.times==2){
            that.ready=true;
//            console.log('ready');
        }
    });

    function load(_tripId,callback){
        db.getStationTimes(_tripId,function(collection){
            collection.toArray(function(err, items) {
                that.stationReachingTimes=items;
                callback();
            });
        });
        db.getData(_tripId,function(collection){
            collection.toArray(function(err, items) {
                that.data=items;
                callback();
            });
        });
    }
};

Trip.prototype.cal=function(obj){
    var that=this;
    if(this.ready){
//        console.log('data ready');
//        console.log(that.data);
//        console.log(that.stationReachingTimes);
        var min=1000000;
        var correction=0;
        that.data.forEach(function(val,index){
            var temp=(val.lat-obj.latitude)*(val.lat-obj.latitude)+(val.lon-obj.longitude)*(val.lon-obj.longitude);
            if(min>temp) {
                min=temp;
                correction=index;
            }
        })
        console.log('corrected',that.data[correction]);
        console.log(obj);
        obj.corrected_latitude=that.data[correction].lat;
        obj.corrected_longitude=that.data[correction].lon;
        console.log(that.stationReachingTimes[0].times);


        that.stationReachingTimes[0].times.forEach(function(val,index){
//            console.log(convert('10:00:23','10:00:23','10:00:23'));
//            console.log('take this one',val.reachtime,obj.sent.getHours()+':'+obj.sent.getMinutes()+':'+obj.sent.getSeconds());
            //console.log(convert(val.reachtime,obj.sent.getHours()+':'+obj.sent.getMinutes()+':'+obj.sent.getSeconds()));
            //firebaseRef.child(val.station).child(that.tripId).set({'start': that.stationReachingTimes[0].start, 'end':that.stationReachingTimes[0].end,'nowprev':that.data[correction].prev,'nownext':that.data[correction].next,'time':val.reachtime});
            console.log({'station':val.station ,'start': that.stationReachingTimes[0].start, 'end':that.stationReachingTimes[0].end,'nowprev':that.data[correction].prev,'nownext':that.data[correction].next,'time': convert(val.reachtime,obj.sent.getHours()+':'+obj.sent.getMinutes()+':'+obj.sent.getSeconds(),that.data[correction].time)});

        })


    }
    else{
        console.log('data has not finished fetching to trip: ' + that.tripId);
    }
};

function convert(x,y,z){
    var a=x.split(":");
    var b=y.split(":");
    var c=z.split(":");
    var seconds = (((+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]))+((+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]))-((+c[0]) * 60 * 60 + (+c[1]) * 60 + (+c[2])));
    return (Math.floor(seconds/3600)+':'+Math.floor((seconds%3600)/60)+':'+seconds%60);
}


module.exports = Trip;